const { store } = require('../../infrastructure/store');

const NEWSLETTERS = 'newsletters';

const STATUS = {
  SUBSCRIBED: 'subscribed',
  UNSUBSCRIBED: 'unsubscribed',
};

function newslettersCollection() {
  return store.collection(NEWSLETTERS);
}

function newsletterKey(id) {
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

function normalizeTags(v) {
  if (v === undefined || v === null) return [];
  if (Array.isArray(v)) return v.map((x) => normalizeString(String(x))).filter(Boolean);
  if (typeof v === 'string') return v.split(',').map((x) => normalizeString(x)).filter(Boolean);
  return [];
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

async function findByEmail(email) {
  const col = newslettersCollection();
  const normalized = normalizeEmail(email);
  return [...col.values()].find((s) => s.email === normalized) || null;
}

async function create(payload) {
  const col = newslettersCollection();
  const now = nowIso();
  const id = store.newId('nwsltr');

  const normalizedEmail = normalizeEmail(payload.email);

  // Duplicate prevention: active subscriber with same email
  const existing = await findByEmail(normalizedEmail);
  if (existing && existing.active && existing.status === STATUS.SUBSCRIBED && !existing.deletedAt) {
    return existing;
  }

  const entity = {
    id,
    email: normalizedEmail,
    fullName: normalizeString(payload.fullName || ''),
    source: normalizeString(payload.source || 'direct'),
    tags: normalizeTags(payload.tags),
    status: STATUS.SUBSCRIBED,
    subscribedAt: now,
    unsubscribedAt: null,
    active: normalizeActive(payload.active),
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  col.set(newsletterKey(id), entity);
  return entity;
}

async function getById(id, { includeDeleted = false } = {}) {
  const col = newslettersCollection();
  const item = col.get(newsletterKey(id));
  if (!item) return null;
  if (!includeDeleted && item.deletedAt) return null;
  return item;
}

async function unsubscribe(id) {
  const col = newslettersCollection();
  const existing = await getById(id, { includeDeleted: false });
  if (!existing) return null;
  if (existing.status === STATUS.UNSUBSCRIBED) return existing;

  const now = nowIso();
  const updated = {
    ...existing,
    status: STATUS.UNSUBSCRIBED,
    active: false,
    unsubscribedAt: now,
    updatedAt: now,
  };

  col.set(newsletterKey(id), updated);
  return updated;
}

async function unsubscribeByEmail(email) {
  const normalized = normalizeEmail(email);
  const existing = await findByEmail(normalized);
  if (!existing) return null;
  return unsubscribe(existing.id);
}

async function list({
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  status,
  active,
  source,
  subscribedFrom,
  subscribedTo,
  q,
  includeDeleted = false,
} = {}) {
  const col = newslettersCollection();
  let items = [...col.values()];

  if (!includeDeleted) items = items.filter((s) => !s.deletedAt);
  if (active !== undefined) items = items.filter((s) => s.active === Boolean(active));
  if (status) items = items.filter((s) => s.status === status);
  if (source) items = items.filter((s) => s.source === source);

  if (subscribedFrom) {
    const from = new Date(subscribedFrom).getTime();
    if (!isNaN(from)) items = items.filter((s) => new Date(s.subscribedAt).getTime() >= from);
  }

  if (subscribedTo) {
    const to = new Date(subscribedTo).getTime();
    if (!isNaN(to)) items = items.filter((s) => new Date(s.subscribedAt).getTime() <= to);
  }

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((s) => {
      const hay = [s.email, s.fullName, s.source, s.status, ...(s.tags || [])]
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

async function updateById(id, patch) {
  const col = newslettersCollection();
  const existing = await getById(id, { includeDeleted: true });
  if (!existing) return null;

  const updated = {
    ...existing,
    fullName: patch.fullName !== undefined ? normalizeString(patch.fullName) : existing.fullName,
    email: patch.email !== undefined ? normalizeEmail(patch.email) : existing.email,
    source: patch.source !== undefined ? normalizeString(patch.source) : existing.source,
    tags: patch.tags !== undefined ? normalizeTags(patch.tags) : existing.tags,
    active: patch.active !== undefined ? normalizeActive(patch.active) : existing.active,
    updatedAt: nowIso(),
  };

  col.set(newsletterKey(id), updated);
  return updated;
}

async function softDelete(id) {
  const col = newslettersCollection();
  const existing = await getById(id, { includeDeleted: true });
  if (!existing || existing.deletedAt) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    deletedAt: now,
    updatedAt: now,
    active: false,
    status: STATUS.UNSUBSCRIBED,
    unsubscribedAt: existing.unsubscribedAt || now,
  };
  col.set(newsletterKey(id), updated);
  return updated;
}

async function setStatus(id, status) {
  const s = getStatusEnum(status);
  if (!s) return null;
  const col = newslettersCollection();
  const existing = await getById(id, { includeDeleted: false });
  if (!existing) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    status: s,
    active: s === STATUS.SUBSCRIBED,
    updatedAt: now,
    ...(s === STATUS.UNSUBSCRIBED ? { unsubscribedAt: now } : {}),
    ...(s === STATUS.SUBSCRIBED ? { subscribedAt: existing.subscribedAt || now } : {}),
  };

  col.set(newsletterKey(id), updated);
  return updated;
}

module.exports = {
  STATUS,
  findByEmail,
  create,
  getById,
  unsubscribe,
  unsubscribeByEmail,
  list,
  updateById,
  softDelete,
  setStatus,
};

