const { store } = require('../../infrastructure/store');

const CONTACTS = 'contacts';

const STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  REPLIED: 'replied',
  CLOSED: 'closed',
};

function contactsCollection() {
  return store.collection(CONTACTS);
}

function contactKey(id) {
  return `id::${id}`;
}

function normalizeString(v) {
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

function normalizeEmail(v) {
  const s = normalizeString(v);
  return s.toLowerCase();
}

function normalizePhone(v) {
  return normalizeString(v).replace(/\s+/g, '');
}

function normalizeCountry(v) {
  return normalizeString(v);
}

function normalizeDepartment(v) {
  return normalizeString(v);
}

function normalizeActive(v) {
  return v === undefined ? true : Boolean(v);
}

function nowIso() {
  return new Date().toISOString();
}

function paginate(items, { page = 1, limit = 20 } = {}) {
  const total = items.length;
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));
  const start = (p - 1) * l;
  return {
    total,
    page: p,
    limit: l,
    pages: Math.max(1, Math.ceil(total / l)),
    items: items.slice(start, start + l),
  };
}

function applySort(items, { sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
  const dir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;
  const sb = sortBy || 'createdAt';
  items.sort((a, b) => {
    const av = a[sb];
    const bv = b[sb];
    if (av === undefined && bv === undefined) return 0;
    if (av === undefined) return 1;
    if (bv === undefined) return -1;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
  return items;
}

function getStatusEnum(status) {
  const s = normalizeString(status);
  const allowed = Object.values(STATUS);
  if (!allowed.includes(s)) return null;
  return s;
}

function normalizeContactPayload(payload) {
  return {
    fullName: normalizeString(payload.fullName),
    email: normalizeEmail(payload.email),
    phone: normalizePhone(payload.phone),
    country: normalizeCountry(payload.country),
    subject: normalizeString(payload.subject),
    message: normalizeString(payload.message),
    department: normalizeDepartment(payload.department),
    status: getStatusEnum(payload.status) || STATUS.NEW,
    assignedTo: payload.assignedTo ? normalizeString(payload.assignedTo) : null,
    replyMessage: payload.replyMessage ? normalizeString(payload.replyMessage) : null,
    active: normalizeActive(payload.active),
  };
}

function nowTs() {
  return nowIso();
}

async function createPublic(payload) {
  const col = contactsCollection();
  const id = store.newId('contact');
  const now = nowTs();

  const normalized = normalizeContactPayload(payload);

  // Duplicate protection: identical (email+phone+subject+message) active contact.
  const all = [...col.values()].filter((c) => c.active !== false && !c.deletedAt);
  const existing = all.find(
    (c) => c.email === normalized.email && c.phone === normalized.phone && c.subject === normalized.subject && c.message === normalized.message,
  );

  if (existing) return existing;

  const contact = {
    id,
    fullName: normalized.fullName,
    email: normalized.email,
    phone: normalized.phone,
    country: normalized.country,
    subject: normalized.subject,
    message: normalized.message,
    department: normalized.department,

    status: STATUS.NEW,
    assignedTo: null,
    replyMessage: null,
    replyHistory: [],
    repliedAt: null,

    active: normalized.active,

    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  col.set(contactKey(id), contact);
  return contact;
}

async function getById(id, { includeDeleted = false } = {}) {
  const col = contactsCollection();
  const item = col.get(contactKey(id));
  if (!item) return null;
  if (!includeDeleted && item.deletedAt) return null;
  return item;
}

async function listAdmin({
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  status,
  assignedTo,
  active,
  q,
  includeDeleted = false,
} = {}) {
  const col = contactsCollection();
  let items = [...col.values()];

  if (!includeDeleted) items = items.filter((c) => !c.deletedAt);
  if (active !== undefined) items = items.filter((c) => c.active === Boolean(active));
  if (status) items = items.filter((c) => c.status === status);
  if (assignedTo) items = items.filter((c) => String(c.assignedTo || '') === String(assignedTo));

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((c) => {
      const hay = [
        c.fullName,
        c.email,
        c.phone,
        c.country,
        c.subject,
        c.message,
        c.department,
        c.status,
        c.assignedTo,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(qq);
    });
  }

  applySort(items, { sortBy, sortOrder });
  const paged = paginate(items, { page, limit });
  return paged;
}

async function updateAdmin(id, patch) {
  const col = contactsCollection();
  const existing = await getById(id, { includeDeleted: true });
  if (!existing) return null;

  const normalized = normalizeContactPayload(patch);

  const updated = {
    ...existing,
    fullName: patch.fullName !== undefined ? normalized.fullName : existing.fullName,
    email: patch.email !== undefined ? normalized.email : existing.email,
    phone: patch.phone !== undefined ? normalized.phone : existing.phone,
    country: patch.country !== undefined ? normalized.country : existing.country,
    subject: patch.subject !== undefined ? normalized.subject : existing.subject,
    message: patch.message !== undefined ? normalized.message : existing.message,
    department: patch.department !== undefined ? normalized.department : existing.department,

    status: patch.status !== undefined ? getStatusEnum(patch.status) || existing.status : existing.status,
    assignedTo: patch.assignedTo !== undefined ? (patch.assignedTo ? normalized.assignedTo : null) : existing.assignedTo,
    replyMessage: patch.replyMessage !== undefined ? (patch.replyMessage ? normalized.replyMessage : null) : existing.replyMessage,
    active: patch.active !== undefined ? normalized.active : existing.active,

    updatedAt: nowTs(),
  };

  col.set(contactKey(id), updated);
  return updated;
}

async function softDelete(id) {
  const col = contactsCollection();
  const existing = await getById(id, { includeDeleted: true });
  if (!existing || existing.deletedAt) return null;

  const now = nowTs();
  const updated = { ...existing, deletedAt: now, updatedAt: now, active: false };
  col.set(contactKey(id), updated);
  return updated;
}

async function setStatus(id, status) {
  const s = getStatusEnum(status);
  if (!s) return null;
  const col = contactsCollection();
  const existing = await getById(id, { includeDeleted: false });
  if (!existing) return null;

  const now = nowTs();
  let updated = { ...existing, status: s, updatedAt: now };

  if (s === STATUS.REPLIED && !updated.repliedAt) updated.repliedAt = now;
  if (s === STATUS.CLOSED) updated.active = false;

  col.set(contactKey(id), updated);
  return updated;
}

async function assignTo(id, assignedTo) {
  const col = contactsCollection();
  const existing = await getById(id, { includeDeleted: false });
  if (!existing) return null;

  const now = nowTs();
  const updated = {
    ...existing,
    assignedTo: assignedTo ? normalizeString(assignedTo) : null,
    status: existing.status === STATUS.NEW ? STATUS.IN_PROGRESS : existing.status,
    updatedAt: now,
  };

  col.set(contactKey(id), updated);
  return updated;
}

async function addReply(id, reply) {
  const col = contactsCollection();
  const existing = await getById(id, { includeDeleted: false });
  if (!existing) return null;

  const now = nowTs();
  const normalized = {
    replyMessage: normalizeString(reply.replyMessage),
    assignedTo: reply.assignedTo ? normalizeString(reply.assignedTo) : existing.assignedTo,
    fromEmail: reply.fromEmail ? normalizeEmail(reply.fromEmail) : null,
  };

  const entry = {
    id: store.newId('reply'),
    replyMessage: normalized.replyMessage,
    fromEmail: normalized.fromEmail,
    repliedAt: now,
  };

  const updated = {
    ...existing,
    replyMessage: normalized.replyMessage,
    replyHistory: [...(existing.replyHistory || []), entry],
    repliedAt: existing.repliedAt || now,
    status: STATUS.REPLIED,
    assignedTo: normalized.assignedTo || null,
    updatedAt: now,
  };

  col.set(contactKey(id), updated);
  return updated;
}

module.exports = {
  STATUS,
  createPublic,
  getById,
  listAdmin,
  updateAdmin,
  softDelete,
  setStatus,
  assignTo,
  addReply,
};

