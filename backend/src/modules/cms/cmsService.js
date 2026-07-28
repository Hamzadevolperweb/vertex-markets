const { BadRequestError, NotFoundError } = require('../../middleware/error/customErrors');
const { sections, listActive, getById, upsert, remove } = require('./cmsRepository');

function assertSection(section) {
  if (!sections[section]) throw new BadRequestError('Invalid CMS section');
}

async function getPublic(section) {
  assertSection(section);
  const data = await listActive(section);
  if (data == null) return null;
  return data;
}

async function getPublicById(section, id) {
  assertSection(section);
  if (!id) throw new BadRequestError('id is required');
  const item = await getById(section, id);
  if (!item || item.active !== true) return null;
  return item.content ?? null;
}

async function adminCreate(section, payload) {
  assertSection(section);
  if (!payload?.content) throw new BadRequestError('content is required');
  const item = await upsert(section, { id: payload.id, content: payload.content, active: true });
  return item;
}

async function adminUpsert(section, id, payload) {
  assertSection(section);
  if (!id) throw new BadRequestError('id is required');
  if (!payload?.content) throw new BadRequestError('content is required');
  const item = await upsert(section, { id, content: payload.content, active: true });
  return item;
}

async function adminPatch(section, id, payload) {
  assertSection(section);
  if (!id) throw new BadRequestError('id is required');
  const existing = await getById(section, id);
  if (!existing) throw new NotFoundError('CMS item not found');
  const merged = {
    ...(existing.content || {}),
    ...(payload?.content || {}),
  };
  const updated = await upsert(section, { id, content: merged, active: true });
  return updated;
}

async function adminDelete(section) {
  assertSection(section);
  const removed = await remove(section);
  if (!removed) throw new NotFoundError('CMS item not found');
  return removed;
}

module.exports = {
  getPublic,
  getPublicById,
  adminCreate,
  adminUpsert,
  adminPatch,
  adminDelete,
};

