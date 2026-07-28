const { store } = require('../../infrastructure/store');

const PLATFORMS = 'platforms';

function platformsCollection() {
  return store.collection(PLATFORMS);
}

function normalizeSlug(slug) {
  if (slug === undefined || slug === null) return '';
  return String(slug)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

function getPlatformKeyById(id) {
  return String(id);
}

function nowIso() {
  return new Date().toISOString();
}

async function list({ includeDeleted = false } = {}) {
  const col = platformsCollection();
  return [...col.values()].filter((p) => (includeDeleted ? true : !p.deletedAt));
}

async function getById(id) {
  const col = platformsCollection();
  return col.get(getPlatformKeyById(id)) || null;
}

async function getBySlug(slug) {
  const target = normalizeSlug(slug);
  if (!target) return null;
  const col = platformsCollection();
  // small dataset in memory: scan
  return (
    [...col.values()].find((p) => !p.deletedAt && p.slug === target) || null
  );
}

async function create(payload) {
  const {
    id,
    title,
    slug,
    shortDescription,
    description,
    icon,
    image,
    features,
    supportedMarkets,
    downloadLinks,
    version,
    order,
    active,
    seo,
  } = payload;

  const col = platformsCollection();
  const resolvedSlug = normalizeSlug(slug || title);

  if (!resolvedSlug) {
    const err = new Error('Slug is required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  const existing = await getBySlug(resolvedSlug);
  if (existing) {
    const err = new Error('Slug already in use');
    err.code = 'SLUG_IN_USE';
    throw err;
  }

  const now = nowIso();
  const platform = {
    id,
    title: title || '',
    slug: resolvedSlug,
    shortDescription: shortDescription || '',
    description: description || '',
    icon: icon || '',
    image: image || '',
    features: Array.isArray(features) ? features : [],
    supportedMarkets: Array.isArray(supportedMarkets) ? supportedMarkets : [],
    downloadLinks: downloadLinks || {},
    version: version || '',
    order: Number(order || 0),
    active: Boolean(active),
    seo: seo || {},
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  col.set(getPlatformKeyById(id), platform);
  return platform;
}

async function update(id, patch, { mode = 'update' } = {}) {
  const col = platformsCollection();
  const existing = await getById(id);
  if (!existing || existing.deletedAt) return null;

  const nextSlug = patch.slug !== undefined ? normalizeSlug(patch.slug) : undefined;

  if (nextSlug && nextSlug !== existing.slug) {
    const other = await getBySlug(nextSlug);
    if (other && other.id !== id) {
      const err = new Error('Slug already in use');
      err.code = 'SLUG_IN_USE';
      throw err;
    }
  }

  // In PUT, allow replacing fields even if undefined was passed explicitly by service.
  const resolved = {
    ...existing,
    ...patch,
    ...(nextSlug !== undefined ? { slug: nextSlug } : {}),
    updatedAt: nowIso(),
  };

  col.set(getPlatformKeyById(id), resolved);
  return resolved;
}

async function remove(id) {
  const col = platformsCollection();
  const existing = await getById(id);
  if (!existing || existing.deletedAt) return null;

  const now = nowIso();
  const updated = { ...existing, deletedAt: now, updatedAt: now };
  col.set(getPlatformKeyById(id), updated);
  return updated;
}

module.exports = {
  list,
  getById,
  getBySlug,
  create,
  update,
  remove,
};

