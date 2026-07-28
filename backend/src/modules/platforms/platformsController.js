const { success } = require('../../utils/response');
const platformsService = require('./platformsService');

async function getPlatforms(req, res, next) {
  try {
    const data = await platformsService.publicList({
      ...req.query,
      active: req.query.active === undefined ? undefined : req.query.active,
    });
    return success(res, { message: 'Platforms fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getPlatformById(req, res, next) {
  try {
    const data = await platformsService.publicGetById(req.params.id);
    return success(res, { message: 'Platform fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getPlatformBySlug(req, res, next) {
  try {
    const data = await platformsService.publicGetBySlug(req.params.slug);
    return success(res, { message: 'Platform fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function createPlatform(req, res, next) {
  try {
    const data = await platformsService.adminCreate(req.body);
    return success(res, { message: 'Platform created', data });
  } catch (err) {
    return next(err);
  }
}

async function updatePlatform(req, res, next) {
  try {
    const data = await platformsService.adminUpdate(req.params.id, req.body, { mode: 'put' });
    return success(res, { message: 'Platform updated', data });
  } catch (err) {
    return next(err);
  }
}

async function patchPlatform(req, res, next) {
  try {
    const data = await platformsService.adminPatch(req.params.id, req.body);
    return success(res, { message: 'Platform patched', data });
  } catch (err) {
    return next(err);
  }
}

async function deletePlatform(req, res, next) {
  try {
    const data = await platformsService.adminDelete(req.params.id);
    return success(res, { message: 'Platform deleted', data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getPlatforms,
  getPlatformById,
  getPlatformBySlug,
  createPlatform,
  updatePlatform,
  patchPlatform,
  deletePlatform,
};

