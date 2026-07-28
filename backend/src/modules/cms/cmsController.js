const { success } = require('../../utils/response');
const cmsService = require('./cmsService');

async function getHero(req, res, next) {
  try {
    const data = await cmsService.getPublic('hero');
    return success(res, { message: 'Hero fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getHeroById(req, res, next) {
  try {
    const data = await cmsService.getPublicById('hero', req.params.id);
    return success(res, { message: 'Hero fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function upsertHero(req, res, next) {
  try {
    const data = await cmsService.adminUpsert('hero', req.params.id, { content: req.body.content });
    return success(res, { message: 'Hero updated', data });
  } catch (err) {
    return next(err);
  }
}

async function createHero(req, res, next) {
  try {
    const data = await cmsService.adminCreate('hero', { content: req.body.content });
    return success(res, { message: 'Hero created', data });
  } catch (err) {
    return next(err);
  }
}

async function patchHero(req, res, next) {
  try {
    const data = await cmsService.adminPatch('hero', req.params.id, { content: req.body.content });
    return success(res, { message: 'Hero patched', data });
  } catch (err) {
    return next(err);
  }
}

async function deleteHero(req, res, next) {
  try {
    const data = await cmsService.adminDelete('hero');
    return success(res, { message: 'Hero deleted', data });
  } catch (err) {
    return next(err);
  }
}

// Generic section handlers (implemented per-section in routes via mapping)
module.exports = {
  getHero,
  getHeroById,
  createHero,
  upsertHero,
  patchHero,
  deleteHero,
};

