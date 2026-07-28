const { BadRequestError, NotFoundError, ConflictError } = require('../../middleware/error/customErrors');
const marketsRepository = require('./marketsRepository');

function normalizeSlug(input) {
  if (input === undefined || input === null) return '';
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

function validateType(type) {
  const typeEnum = ['Forex', 'Crypto', 'Stocks', 'Commodities', 'Indices'];
  if (!typeEnum.includes(type)) throw new BadRequestError('Invalid market type');
}

async function publicList(query) {
  const {
    type = null,
    active = true,
    q = null,
    sortBy = 'order',
    sortOrder = 'asc',
    page = 1,
    limit = 20,
  } = query || {};

  if (type) validateType(type);

  const result = await marketsRepository.listPublic({
    type,
    active,
    q,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  return {
    items: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

async function publicGetById(type, id) {
  validateType(type);
  const item = await marketsRepository.getById(type, id);
  if (!item || item.deletedAt) return null;
  if (item.active !== true) return null;
  return item;
}

async function publicGetBySlug(type, slug) {
  validateType(type);
  const item = await marketsRepository.getBySlug(type, slug);
  if (!item || item.deletedAt) return null;
  if (item.active !== true) return null;
  return item;
}

async function adminCreate(payload) {
  const {
    type,
    title,
    slug,
    icon,
    description,
    order = 0,
    active = true,
    seo,
  } = payload;

  validateType(type);
  if (!title) throw new BadRequestError('title is required');

  const resolvedSlug = slug ? normalizeSlug(slug) : normalizeSlug(title);

  try {
    return await marketsRepository.create({
      type,
      title,
      slug: resolvedSlug,
      icon,
      description,
      order,
      active,
      seo,
    });
  } catch (err) {
    if (err.code === 'SLUG_IN_USE') throw new ConflictError('Slug already in use');
    throw err;
  }
}

async function adminUpdate(id, payload) {
  const {
    type,
    title,
    slug,
    icon,
    description,
    order,
    active,
    seo,
  } = payload;

  validateType(type);
  const existing = await marketsRepository.getById(type, id);
  if (!existing || existing.deletedAt) throw new NotFoundError('Market not found');

  const patch = {};
  if (title !== undefined) patch.title = title;
  if (slug !== undefined) patch.slug = normalizeSlug(slug);
  if (icon !== undefined) patch.icon = icon;
  if (description !== undefined) patch.description = description;
  if (order !== undefined) patch.order = order;
  if (active !== undefined) patch.active = Boolean(active);
  if (seo !== undefined) patch.seo = seo;

  // Keep slug/title alignment if slug missing but title updated
  if (patch.title !== undefined && patch.slug === undefined) {
    patch.slug = normalizeSlug(patch.title);
  }

  try {
    const updated = await marketsRepository.upsert(type, id, patch);
    if (!updated) throw new NotFoundError('Market not found');
    return updated;
  } catch (err) {
    if (err.code === 'SLUG_IN_USE') throw new ConflictError('Slug already in use');
    throw err;
  }
}

async function adminPatch(id, payload) {
  return adminUpdate(id, payload);
}

async function adminDelete(id, payload) {
  const { type } = payload;
  validateType(type);
  const removed = await marketsRepository.remove(type, id);
  if (!removed) throw new NotFoundError('Market not found');
  return removed;
}

async function adminSetActive(id, type, active) {
  validateType(type);
  const existing = await marketsRepository.getById(type, id);
  if (!existing || existing.deletedAt) throw new NotFoundError('Market not found');
  const updated = await marketsRepository.patch(type, id, { active: Boolean(active) });
  return updated;
}

module.exports = {
  publicList,
  publicGetById,
  publicGetBySlug,
  adminCreate,
  adminUpdate,
  adminPatch,
  adminDelete,
  adminSetActive,
};

