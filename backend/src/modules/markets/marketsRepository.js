const { store } = require('../../infrastructure/store');
const { nanoid } = require('nanoid');

const MARKETS = 'markets';
const slugIndexKey = (marketType) => `markets_slug:${marketType || 'all'}`;

function marketsCollection() {
  return store.collection(MARKETS);
}

function getMarketKeyByTypeAndId(type, id) {
  return `${type}::${id}`;
}

function parseType(marketTypeOrNull) {
  return marketTypeOrNull ? String(marketTypeOrNull) : null;
}

async function list({ includeDeleted = false } = {}) {
  // single in-memory collection with typed keys
  const col = marketsCollection();
  return [...col.values()].filter((m) => (includeDeleted ? true : !m.deletedAt));
}

async function listByType(type) {
  const col = marketsCollection();
  const t = parseType(type);
  return [...col.values()].filter((m) => m.type === t && !m.deletedAt);
}

async function getById(type, id) {
  const col = marketsCollection();
  const key = getMarketKeyByTypeAndId(type, id);
  return col.get(key) || null;
}

async function getBySlug(type, slug) {
  if (!type) return null;
  const col = marketsCollection();
  // We don't maintain a separate index; scan typed items (small dataset). 
  const target = String(slug).trim().toLowerCase();
  return [...col.values()].find((m) => m.type === type && !m.deletedAt && m.slug === target) || null;
}

async function create({ type, title, slug, icon, description, order = 0, active = true, seo }) {
  const col = marketsCollection();
  const now = new Date().toISOString();
  const marketId = store.newId('market');

  const resolvedSlug = String(slug || title).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');

  // Duplicate slug prevention per type
  const existing = await getBySlug(type, resolvedSlug);
  if (existing) {
    const err = new Error('Slug already in use');
    err.code = 'SLUG_IN_USE';
    throw err;
  }

  const key = getMarketKeyByTypeAndId(type, marketId);
  const market = {
    id: marketId,
    type,
    title,
    slug: resolvedSlug,
    icon: icon || '',
    description: description || '',
    order: Number(order || 0),
    active: Boolean(active),
    seo: seo || {},
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  col.set(key, market);
  return market;
}

async function upsert(type, id, patch, { mode = 'update' } = {}) {
  const col = marketsCollection();
  const existing = await getById(type, id);
  if (!existing) return null;

  if (patch.slug && patch.slug !== existing.slug) {
    const dup = await getBySlug(type, patch.slug);
    if (dup && dup.id !== id) {
      const err = new Error('Slug already in use');
      err.code = 'SLUG_IN_USE';
      throw err;
    }
  }

  const resolved = {
    ...existing,
    ...patch,
    slug: patch.slug !== undefined ? patch.slug : existing.slug,
    title: patch.title !== undefined ? patch.title : existing.title,
    updatedAt: new Date().toISOString(),
  };

  // Update key-derived fields
  const key = getMarketKeyByTypeAndId(type, id);
  col.set(key, resolved);
  return resolved;
}

async function remove(type, id) {
  const existing = await getById(type, id);
  if (!existing) return null;
  const now = new Date().toISOString();
  const col = marketsCollection();
  const key = getMarketKeyByTypeAndId(type, id);
  const updated = { ...existing, deletedAt: now, updatedAt: now };
  col.set(key, updated);
  return updated;
}

async function patch(type, id, patch) {
  return upsert(type, id, patch, { mode: 'patch' });
}

async function listPublic({
  type = null,
  active = true,
  q = null,
  sortBy = 'order',
  sortOrder = 'asc',
  page = 1,
  limit = 20,
} = {}) {
  let items = await list({ includeDeleted: false });
  if (type) items = items.filter((m) => m.type === type);
  if (active !== undefined) items = items.filter((m) => m.active === Boolean(active));

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((m) =>
      (m.title || '').toLowerCase().includes(qq) || (m.slug || '').toLowerCase().includes(qq) || (m.description || '').toLowerCase().includes(qq),
    );
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
    total,
    page: p,
    limit: l,
    data: paged,
  };
}

module.exports = {
  list,
  listByType,
  listPublic,
  getById,
  getBySlug,
  create,
  upsert,
  patch,
  remove,
};

