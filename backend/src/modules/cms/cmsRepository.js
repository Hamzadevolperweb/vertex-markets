const { store } = require('../../infrastructure/store');

const CMS = 'cms';

const sections = {
  hero: 'hero',
  about: 'about',
  features: 'features',
  statistics: 'statistics',
  tradingPlatforms: 'tradingPlatforms',
  markets: 'markets',
  partners: 'partners',
  testimonials: 'testimonials',
  faq: 'faq',
  footer: 'footer',
  seo: 'seo',
};

function cmsCollection() {
  return store.collection(CMS);
}

function keyFor(section) {
  if (!sections[section]) throw new Error(`Unknown CMS section: ${section}`);
  return sections[section];
}

async function listActive(section) {
  const col = cmsCollection();
  const key = keyFor(section);
  const item = col.get(key) || null;
  if (!item) return null;
  if (item.active !== true) return null;
  return item.content ?? null;
}

async function getById(section, id) {
  const col = cmsCollection();
  const key = keyFor(section);
  const item = col.get(key) || null;
  if (!item) return null;
  if (String(item.id) !== String(id)) return null;
  return item;
}

async function upsert(section, { id, content, active = true }) {
  const col = cmsCollection();
  const key = keyFor(section);

  const now = new Date().toISOString();
  const existing = col.get(key);

  const resolvedId = id ? String(id) : (existing?.id ?? store.newId('cms'));

  const item = {
    id: resolvedId,
    content: content ?? existing?.content ?? {},
    active: Boolean(active),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  col.set(key, item);
  return item;
}

async function remove(section) {
  const col = cmsCollection();
  const key = keyFor(section);
  const existing = col.get(key);
  if (!existing) return null;
  col.delete(key);
  return existing;
}

async function setActive(section, active) {
  const col = cmsCollection();
  const key = keyFor(section);
  const existing = col.get(key) || null;
  if (!existing) return null;
  const now = new Date().toISOString();
  const updated = { ...existing, active: Boolean(active), updatedAt: now };
  col.set(key, updated);
  return updated;
}

module.exports = {
  sections,
  listActive,
  getById,
  upsert,
  remove,
  setActive,
};

