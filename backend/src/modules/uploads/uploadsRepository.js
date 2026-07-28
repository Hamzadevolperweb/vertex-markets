const { store } = require('../../infrastructure/store');

const UPLOADS = 'uploads';

// ─── Category → Directory mapping ─────────────────────────────────────────

const CATEGORY_DIRS = {
  avatar: 'uploads/avatars/',
  blog: 'uploads/blog/',
  cms: 'uploads/cms/',
  platform: 'uploads/platforms/',
  market: 'uploads/markets/',
  partner: 'uploads/partners/',
  resume: 'uploads/resumes/',
  document: 'uploads/documents/',
};

const CATEGORIES = Object.keys(CATEGORY_DIRS);

// ─── Allowed MIME Types per broad type ────────────────────────────────────

const IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

const DOCUMENT_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ARCHIVE_MIMES = [
  'application/zip',
];

const ALLOWED_MIMES = [
  ...IMAGE_MIMES,
  ...DOCUMENT_MIMES,
  ...ARCHIVE_MIMES,
];

const CATEGORY_ALLOWED_MIMES = {
  avatar: IMAGE_MIMES,
  blog: IMAGE_MIMES,
  cms: IMAGE_MIMES,
  platform: IMAGE_MIMES,
  market: IMAGE_MIMES,
  partner: [...DOCUMENT_MIMES, ...IMAGE_MIMES, ...ARCHIVE_MIMES],
  resume: [...DOCUMENT_MIMES],
  document: [...DOCUMENT_MIMES, ...ARCHIVE_MIMES, ...IMAGE_MIMES],
};

// ─── Size limits (bytes) ──────────────────────────────────────────────────

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_ARCHIVE_SIZE = 30 * 1024 * 1024; // 30 MB

const CATEGORY_MAX_SIZE = {
  avatar: MAX_IMAGE_SIZE,
  blog: MAX_IMAGE_SIZE,
  cms: MAX_IMAGE_SIZE,
  platform: MAX_IMAGE_SIZE,
  market: MAX_IMAGE_SIZE,
  partner: MAX_DOCUMENT_SIZE,
  resume: MAX_DOCUMENT_SIZE,
  document: MAX_DOCUMENT_SIZE,
};

// ─── Helpers ──────────────────────────────────────────────────────────────

function nowIso() {
  return new Date().toISOString();
}

function collection() {
  return store.collection(UPLOADS);
}

function uploadKey(id) {
  return `id::${id}`;
}

function normalizeBool(v, fallback = true) {
  if (v === undefined) return fallback;
  return Boolean(v);
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

// ─── CRUD ─────────────────────────────────────────────────────────────────

async function create(payload) {
  const col = collection();
  const now = nowIso();
  const id = payload.id || store.newId('upload');

  const entity = {
    id,
    originalName: String(payload.originalName || ''),
    fileName: String(payload.fileName || ''),
    mimeType: String(payload.mimeType || ''),
    extension: String(payload.extension || ''),
    fileSize: Number(payload.fileSize) || 0,
    category: String(payload.category || ''),
    uploadedBy: payload.uploadedBy || null,
    filePath: String(payload.filePath || ''),
    publicUrl: String(payload.publicUrl || ''),
    active: true,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  col.set(uploadKey(id), entity);
  return entity;
}

async function getById(id, { includeDeleted = false } = {}) {
  const col = collection();
  const item = col.get(uploadKey(id));
  if (!item) return null;
  if (!includeDeleted && item.deletedAt) return null;
  return item;
}

async function getByFileName(fileName) {
  const col = collection();
  return [...col.values()].find(
    (u) => u.fileName === fileName && !u.deletedAt,
  ) || null;
}

async function updateById(id, patch) {
  const col = collection();
  const existing = await getById(id, { includeDeleted: true });
  if (!existing) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    originalName: patch.originalName !== undefined ? String(patch.originalName) : existing.originalName,
    fileName: patch.fileName !== undefined ? String(patch.fileName) : existing.fileName,
    mimeType: patch.mimeType !== undefined ? String(patch.mimeType) : existing.mimeType,
    extension: patch.extension !== undefined ? String(patch.extension) : existing.extension,
    fileSize: patch.fileSize !== undefined ? Number(patch.fileSize) : existing.fileSize,
    category: patch.category !== undefined ? String(patch.category) : existing.category,
    uploadedBy: patch.uploadedBy !== undefined ? patch.uploadedBy : existing.uploadedBy,
    filePath: patch.filePath !== undefined ? String(patch.filePath) : existing.filePath,
    publicUrl: patch.publicUrl !== undefined ? String(patch.publicUrl) : existing.publicUrl,
    active: patch.active !== undefined ? normalizeBool(patch.active, true) : existing.active,
    updatedAt: now,
  };

  col.set(uploadKey(id), updated);
  return updated;
}

async function softDelete(id) {
  const col = collection();
  const existing = await getById(id, { includeDeleted: true });
  if (!existing || existing.deletedAt) return null;

  const now = nowIso();
  const updated = {
    ...existing,
    deletedAt: now,
    updatedAt: now,
    active: false,
  };
  col.set(uploadKey(id), updated);
  return updated;
}

async function list({
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  category,
  mimeType,
  active,
  q,
  includeDeleted = false,
} = {}) {
  const col = collection();
  let items = [...col.values()];

  if (!includeDeleted) items = items.filter((u) => !u.deletedAt);
  if (active !== undefined) items = items.filter((u) => u.active === Boolean(active));
  if (category) items = items.filter((u) => u.category === category);
  if (mimeType) items = items.filter((u) => u.mimeType === mimeType);

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((u) => {
      const hay = [
        u.originalName,
        u.fileName,
        u.mimeType,
        u.category,
        u.extension,
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
  CATEGORY_DIRS,
  CATEGORIES,
  ALLOWED_MIMES,
  IMAGE_MIMES,
  DOCUMENT_MIMES,
  ARCHIVE_MIMES,
  CATEGORY_ALLOWED_MIMES,
  MAX_IMAGE_SIZE,
  MAX_DOCUMENT_SIZE,
  MAX_ARCHIVE_SIZE,
  CATEGORY_MAX_SIZE,

  create,
  getById,
  getByFileName,
  updateById,
  softDelete,
  list,
};

