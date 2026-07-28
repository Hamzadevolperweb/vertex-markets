const {
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require('../../middleware/error/customErrors');

const { store } = require('../../infrastructure/store');
const platformsRepository = require('./platformsRepository');

function normalizeSlug(input) {
  if (input === undefined || input === null) return '';
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

function validateFeaturesList(features) {
  if (features === undefined) return [];
  if (!Array.isArray(features)) throw new BadRequestError('features must be an array');
  return features.map((f) => String(f));
}

function validateSupportedMarkets(list) {
  if (list === undefined) return [];
  if (!Array.isArray(list)) throw new BadRequestError('supportedMarkets must be an array');
  return list.map((m) => String(m));
}

function validateDownloadLinks(links) {
  if (links === undefined) return {};
  if (links === null) return {};
  if (typeof links !== 'object' || Array.isArray(links)) {
    throw new BadRequestError('downloadLinks must be an object');
  }
  return links;
}

async function publicList(query) {
  const {
    page = 1,
    limit = 20,
    sortBy = 'order',
    sortOrder = 'asc',
    active,
    q,
  } = query || {};

  let items = await platformsRepository.list({ includeDeleted: false });

  if (active !== undefined) {
    items = items.filter((p) => p.active === Boolean(active === true || active === 'true'));
  }

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((p) => {
      const blob = [
        p.title,
        p.slug,
        p.shortDescription,
        p.description,
        ...(p.features || []),
        ...(p.supportedMarkets || []),
      ]
        .join(' ')
        .toLowerCase();
      return blob.includes(qq);
    });
  }

  const dir = String(sortOrder).toLowerCase() === 'desc' ? -1 : 1;
  const sb = sortBy || 'order';

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

  const total = items.length;
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));
  const start = (p - 1) * l;
  const paged = items.slice(start, start + l);

  return {
    items,
    data: paged,
    total,
    page: p,
    limit: l,
  };
}

async function publicGetById(id) {
  const item = await platformsRepository.getById(id);
  if (!item || item.deletedAt) return null;
  if (item.active !== true) return null;
  return item;
}

async function publicGetBySlug(slug) {
  const item = await platformsRepository.getBySlug(slug);
  if (!item || item.deletedAt) return null;
  if (item.active !== true) return null;
  return item;
}

async function adminCreate(payload) {
  const {
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
    order = 0,
    active = true,
    seo,
  } = payload;

  if (!title) throw new BadRequestError('title is required');

  const resolvedSlug = slug !== undefined && slug !== null ? normalizeSlug(slug) : normalizeSlug(title);
  if (!resolvedSlug) throw new BadRequestError('slug is required');

  const id = store.newId('platform');

  try {
    return await platformsRepository.create({
      id,
      title,
      slug: resolvedSlug,
      shortDescription,
      description,
      icon,
      image,
      features: validateFeaturesList(features),
      supportedMarkets: validateSupportedMarkets(supportedMarkets),
      downloadLinks: validateDownloadLinks(downloadLinks),
      version,
      order,
      active,
      seo,
    });
  } catch (err) {
    if (err.code === 'SLUG_IN_USE') throw new ConflictError('Slug already in use');
    throw err;
  }
}

async function adminUpdate(id, payload, { mode = 'put' } = {}) {
  const existing = await platformsRepository.getById(id);
  if (!existing || existing.deletedAt) throw new NotFoundError('Platform not found');

  // PUT: fields may be omitted by client; service will keep existing values.
  // PATCH: service will only include provided fields.
  const patch = {};

  const applyIfDefined = (key, val) => {
    if (val !== undefined) patch[key] = val;
  };

  applyIfDefined('title', payload.title);
  applyIfDefined('slug', payload.slug);
  applyIfDefined('shortDescription', payload.shortDescription);
  applyIfDefined('description', payload.description);
  applyIfDefined('icon', payload.icon);
  applyIfDefined('image', payload.image);
  applyIfDefined('version', payload.version);
  applyIfDefined('order', payload.order);
  applyIfDefined('active', payload.active);
  applyIfDefined('seo', payload.seo);

  if (payload.features !== undefined) patch.features = validateFeaturesList(payload.features);
  if (payload.supportedMarkets !== undefined) patch.supportedMarkets = validateSupportedMarkets(payload.supportedMarkets);
  if (payload.downloadLinks !== undefined) patch.downloadLinks = validateDownloadLinks(payload.downloadLinks);

  if (patch.title !== undefined && patch.slug === undefined) {
    // Keep slug aligned if slug missing but title updated
    patch.slug = normalizeSlug(patch.title);
  }

  // normalize slug if present
  if (patch.slug !== undefined) patch.slug = normalizeSlug(patch.slug);

  try {
    const updated = await platformsRepository.update(id, patch, { mode });
    if (!updated) throw new NotFoundError('Platform not found');
    return updated;
  } catch (err) {
    if (err.code === 'SLUG_IN_USE') throw new ConflictError('Slug already in use');
    throw err;
  }
}

async function adminPatch(id, payload) {
  // PATCH only applies provided fields (validators will ensure types)
  return adminUpdate(id, payload, { mode: 'patch' });
}

async function adminDelete(id) {
  const removed = await platformsRepository.remove(id);
  if (!removed) throw new NotFoundError('Platform not found');
  return removed;
}

module.exports = {
  publicList,
  publicGetById,
  publicGetBySlug,
  adminCreate,
  adminUpdate,
  adminPatch,
  adminDelete,
};

