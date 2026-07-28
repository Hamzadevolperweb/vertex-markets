const { store } = require('../../infrastructure/store');

const PARTNERS = 'partners';
const REFERRALS = 'partner_referrals';
const EMAIL_LOG = 'partner_email_log';

const PARTNER_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const PARTNER_TYPES = [
  'Introducing Broker (IB)',
  'Affiliate Partner',
  'Regional Partner',
  'Business Partner',
  'Institutional Partner',
];

const REFERRAL_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  CLOSED: 'closed',
};

function partnersCollection() {
  return store.collection(PARTNERS);
}

function referralsCollection() {
  return store.collection(REFERRALS);
}

function emailLogCollection() {
  return store.collection(EMAIL_LOG);
}

function partnerKey(id) {
  return `id::${id}`;
}

function referralKey(id) {
  return `id::${id}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function normalizeString(v) {
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

function normalizeEmail(v) {
  return normalizeString(v).toLowerCase();
}

function normalizePhone(v) {
  return normalizeString(v).replace(/\s+/g, '');
}

function normalizeBool(v, fallback = true) {
  if (v === undefined) return fallback;
  return Boolean(v);
}

function normalizeActive(v) {
  return normalizeBool(v, true);
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

function isValidPartnerType(type) {
  return PARTNER_TYPES.includes(type);
}

function isValidPartnerStatus(status) {
  return Object.values(PARTNER_STATUS).includes(status);
}

function isValidReferralStatus(status) {
  return Object.values(REFERRAL_STATUS).includes(status);
}

// ─── Email Simulation ──────────────────────────────────────────────────────

function logEmail(payload) {
  const col = emailLogCollection();
  const entry = {
    id: store.newId('email'),
    ...payload,
    sentAt: nowIso(),
  };
  col.set(entry.id, entry);
  // eslint-disable-next-line no-console
  console.log('[PartnersModule] Simulated email:', JSON.stringify(entry, null, 2));
  return entry;
}

function getEmailHistory() {
  return [...emailLogCollection().values()].sort((a, b) => {
    if (a.sentAt < b.sentAt) return 1;
    if (a.sentAt > b.sentAt) return -1;
    return 0;
  });
}

// ─── Partner CRUD ──────────────────────────────────────────────────────────

async function createPartner(payload) {
  const col = partnersCollection();
  const now = nowIso();
  const id = payload.id || store.newId('partner');

  const entity = {
    id,
    fullName: normalizeString(payload.fullName),
    companyName: normalizeString(payload.companyName),
    email: normalizeEmail(payload.email),
    phone: normalizePhone(payload.phone),
    country: normalizeString(payload.country),
    city: normalizeString(payload.city),
    website: normalizeString(payload.website),
    partnerType: payload.partnerType,
    experience: normalizeString(payload.experience),
    monthlyClients: payload.monthlyClients || '',
    businessDescription: normalizeString(payload.businessDescription),
    referralSource: normalizeString(payload.referralSource),
    status: PARTNER_STATUS.PENDING,
    assignedTo: null,
    notes: '',
    active: true,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  col.set(partnerKey(id), entity);

  // Simulate email: registration confirmation
  logEmail({
    to: entity.email,
    subject: 'Partner Registration Received',
    body: `Dear ${entity.fullName}, thank you for registering as a ${entity.partnerType}. Your application is under review.`,
    type: 'partner_registration',
    partnerId: id,
  });

  return entity;
}

async function getPartnerById(id, { includeDeleted = false } = {}) {
  const col = partnersCollection();
  const item = col.get(partnerKey(id));
  if (!item) return null;
  if (!includeDeleted && item.deletedAt) return null;
  return item;
}

async function getPartnerByEmail(email) {
  const col = partnersCollection();
  const normalized = normalizeEmail(email);
  return [...col.values()].find(
    (p) => p.email === normalized && !p.deletedAt,
  ) || null;
}

async function updatePartnerById(id, patch) {
  const col = partnersCollection();
  const existing = await getPartnerById(id, { includeDeleted: true });
  if (!existing) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    fullName: patch.fullName !== undefined ? normalizeString(patch.fullName) : existing.fullName,
    companyName: patch.companyName !== undefined ? normalizeString(patch.companyName) : existing.companyName,
    email: patch.email !== undefined ? normalizeEmail(patch.email) : existing.email,
    phone: patch.phone !== undefined ? normalizePhone(patch.phone) : existing.phone,
    country: patch.country !== undefined ? normalizeString(patch.country) : existing.country,
    city: patch.city !== undefined ? normalizeString(patch.city) : existing.city,
    website: patch.website !== undefined ? normalizeString(patch.website) : existing.website,
    partnerType: patch.partnerType !== undefined ? patch.partnerType : existing.partnerType,
    experience: patch.experience !== undefined ? normalizeString(patch.experience) : existing.experience,
    monthlyClients: patch.monthlyClients !== undefined ? patch.monthlyClients : existing.monthlyClients,
    businessDescription: patch.businessDescription !== undefined ? normalizeString(patch.businessDescription) : existing.businessDescription,
    referralSource: patch.referralSource !== undefined ? normalizeString(patch.referralSource) : existing.referralSource,
    status: patch.status !== undefined ? patch.status : existing.status,
    assignedTo: patch.assignedTo !== undefined ? (patch.assignedTo ? normalizeString(patch.assignedTo) : null) : existing.assignedTo,
    notes: patch.notes !== undefined ? normalizeString(patch.notes) : existing.notes,
    active: patch.active !== undefined ? normalizeBool(patch.active, true) : existing.active,
    updatedAt: now,
  };

  col.set(partnerKey(id), updated);
  return updated;
}

async function softDeletePartner(id) {
  const col = partnersCollection();
  const existing = await getPartnerById(id, { includeDeleted: true });
  if (!existing || existing.deletedAt) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    deletedAt: now,
    updatedAt: now,
    active: false,
  };
  col.set(partnerKey(id), updated);

  logEmail({
    to: existing.email,
    subject: 'Partner Account Deactivated',
    body: `Dear ${existing.fullName}, your partner account has been deactivated.`,
    type: 'partner_deleted',
    partnerId: id,
  });

  return updated;
}

async function setPartnerStatus(id, status) {
  if (!isValidPartnerStatus(status)) return null;
  const col = partnersCollection();
  const existing = await getPartnerById(id);
  if (!existing) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    status,
    updatedAt: now,
  };

  if (status === PARTNER_STATUS.APPROVED || status === PARTNER_STATUS.REJECTED) {
    updated.active = status === PARTNER_STATUS.APPROVED;
  }

  col.set(partnerKey(id), updated);

  // Simulate email notification on status change
  logEmail({
    to: existing.email,
    subject: `Partner Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    body: `Dear ${existing.fullName}, your partner application status has been updated to: ${status}.`,
    type: 'partner_status_change',
    partnerId: id,
    status,
  });

  return updated;
}

async function assignPartner(id, assignedTo) {
  const col = partnersCollection();
  const existing = await getPartnerById(id);
  if (!existing) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    assignedTo: assignedTo ? normalizeString(assignedTo) : null,
    status: existing.status === PARTNER_STATUS.PENDING ? PARTNER_STATUS.UNDER_REVIEW : existing.status,
    updatedAt: now,
  };
  col.set(partnerKey(id), updated);
  return updated;
}

async function updatePartnerNotes(id, notes) {
  const col = partnersCollection();
  const existing = await getPartnerById(id);
  if (!existing) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    notes: normalizeString(notes),
    updatedAt: now,
  };
  col.set(partnerKey(id), updated);
  return updated;
}

// ─── Partner Listing ───────────────────────────────────────────────────────

async function listPartners({
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  status,
  partnerType,
  assignedTo,
  active,
  q,
  includeDeleted = false,
} = {}) {
  const col = partnersCollection();
  let items = [...col.values()];

  if (!includeDeleted) items = items.filter((p) => !p.deletedAt);
  if (active !== undefined) items = items.filter((p) => p.active === Boolean(active));
  if (status) items = items.filter((p) => p.status === status);
  if (partnerType) items = items.filter((p) => p.partnerType === partnerType);
  if (assignedTo) items = items.filter((p) => String(p.assignedTo || '') === String(assignedTo));

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((p) => {
      const hay = [
        p.fullName,
        p.companyName,
        p.email,
        p.phone,
        p.country,
        p.city,
        p.partnerType,
        p.status,
        p.businessDescription,
        p.referralSource,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(qq);
    });
  }

  applySort(items, { sortBy, sortOrder });
  return paginate(items, { page, limit });
}

// ─── Referral CRUD ─────────────────────────────────────────────────────────

async function createReferral(payload) {
  const col = referralsCollection();
  const now = nowIso();
  const id = payload.id || store.newId('ref');

  const entity = {
    id,
    clientName: normalizeString(payload.clientName),
    clientEmail: normalizeEmail(payload.clientEmail),
    clientPhone: normalizePhone(payload.clientPhone),
    country: normalizeString(payload.country),
    tradingExperience: normalizeString(payload.tradingExperience),
    estimatedDeposit: payload.estimatedDeposit || '',
    message: normalizeString(payload.message),
    referredBy: normalizeString(payload.referredBy),
    status: REFERRAL_STATUS.NEW,
    active: true,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  col.set(referralKey(id), entity);

  // Simulate email: referral received
  logEmail({
    to: entity.clientEmail,
    subject: 'Referral Received',
    body: `Dear ${entity.clientName}, your referral has been received. Our team will review it shortly.`,
    type: 'referral_received',
    referralId: id,
  });

  return entity;
}

async function getReferralById(id, { includeDeleted = false } = {}) {
  const col = referralsCollection();
  const item = col.get(referralKey(id));
  if (!item) return null;
  if (!includeDeleted && item.deletedAt) return null;
  return item;
}

async function updateReferralById(id, patch) {
  const col = referralsCollection();
  const existing = await getReferralById(id, { includeDeleted: true });
  if (!existing) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    clientName: patch.clientName !== undefined ? normalizeString(patch.clientName) : existing.clientName,
    clientEmail: patch.clientEmail !== undefined ? normalizeEmail(patch.clientEmail) : existing.clientEmail,
    clientPhone: patch.clientPhone !== undefined ? normalizePhone(patch.clientPhone) : existing.clientPhone,
    country: patch.country !== undefined ? normalizeString(patch.country) : existing.country,
    tradingExperience: patch.tradingExperience !== undefined ? normalizeString(patch.tradingExperience) : existing.tradingExperience,
    estimatedDeposit: patch.estimatedDeposit !== undefined ? patch.estimatedDeposit : existing.estimatedDeposit,
    message: patch.message !== undefined ? normalizeString(patch.message) : existing.message,
    referredBy: patch.referredBy !== undefined ? normalizeString(patch.referredBy) : existing.referredBy,
    status: patch.status !== undefined ? patch.status : existing.status,
    active: patch.active !== undefined ? normalizeBool(patch.active, true) : existing.active,
    updatedAt: now,
  };

  col.set(referralKey(id), updated);
  return updated;
}

async function softDeleteReferral(id) {
  const col = referralsCollection();
  const existing = await getReferralById(id, { includeDeleted: true });
  if (!existing || existing.deletedAt) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    deletedAt: now,
    updatedAt: now,
    active: false,
  };
  col.set(referralKey(id), updated);
  return updated;
}

async function setReferralStatus(id, status) {
  if (!isValidReferralStatus(status)) return null;
  const col = referralsCollection();
  const existing = await getReferralById(id);
  if (!existing) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    status,
    updatedAt: now,
  };
  col.set(referralKey(id), updated);

  logEmail({
    to: existing.clientEmail,
    subject: `Referral Status Updated: ${status}`,
    body: `Dear ${existing.clientName}, your referral status has been updated to: ${status}.`,
    type: 'referral_status_change',
    referralId: id,
    status,
  });

  return updated;
}

async function listReferrals({
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  status,
  referredBy,
  q,
  includeDeleted = false,
} = {}) {
  const col = referralsCollection();
  let items = [...col.values()];

  if (!includeDeleted) items = items.filter((r) => !r.deletedAt);
  if (status) items = items.filter((r) => r.status === status);
  if (referredBy) items = items.filter((r) => r.referredBy === referredBy);

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((r) => {
      const hay = [
        r.clientName,
        r.clientEmail,
        r.clientPhone,
        r.country,
        r.message,
        r.referredBy,
        r.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(qq);
    });
  }

  applySort(items, { sortBy, sortOrder });
  return paginate(items, { page, limit });
}

module.exports = {
  PARTNER_STATUS,
  PARTNER_TYPES,
  REFERRAL_STATUS,

  // Partner
  createPartner,
  getPartnerById,
  getPartnerByEmail,
  updatePartnerById,
  softDeletePartner,
  setPartnerStatus,
  assignPartner,
  updatePartnerNotes,
  listPartners,

  // Referral
  createReferral,
  getReferralById,
  updateReferralById,
  softDeleteReferral,
  setReferralStatus,
  listReferrals,

  // Email
  logEmail,
  getEmailHistory,

  // Helpers
  isValidPartnerType,
  isValidPartnerStatus,
  isValidReferralStatus,
};

