const { success } = require('../../utils/response');
const marketsService = require('./marketsService');

function parseType(req) {
  // type comes from query for public + body for admin
  return req.params.type || req.query.type || req.body.type;
}

async function getMarkets(req, res, next) {
  try {
    const data = await marketsService.publicList({
      ...req.query,
      active: req.query.active === undefined ? true : req.query.active === 'true' || req.query.active === true,
    });
    return success(res, { message: 'Markets fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getMarketById(req, res, next) {
  try {
    // Support /markets/:id where id is composite formatted by type, but prefer query.type.
    // If req.query.type missing, treat req.params.id as {type}::{id}
    let type = req.query.type;
    let id = req.params.id;
    if (!type && String(id).includes('::')) {
      const [t, rest] = String(id).split('::');
      type = t;
      id = rest;
    }

    const data = await marketsService.publicGetById(type, id);
    return success(res, { message: 'Market fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getMarketBySlug(req, res, next) {
  try {
    let type = req.query.type;
    const slug = req.params.slug;

    if (!type && String(slug).includes('::')) {
      const [t, s] = String(slug).split('::');
      type = t;
      return success(res, { message: 'Market fetched', data: await marketsService.publicGetBySlug(type, s) });
    }

    const data = await marketsService.publicGetBySlug(type, slug);
    return success(res, { message: 'Market fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function createMarket(req, res, next) {
  try {
    const data = await marketsService.adminCreate(req.body);
    return success(res, { message: 'Market created', data });
  } catch (err) {
    return next(err);
  }
}

async function updateMarket(req, res, next) {
  try {
    const data = await marketsService.adminUpdate(req.params.id, req.body);
    return success(res, { message: 'Market updated', data });
  } catch (err) {
    return next(err);
  }
}

async function patchMarket(req, res, next) {
  try {
    const data = await marketsService.adminPatch(req.params.id, req.body);
    return success(res, { message: 'Market patched', data });
  } catch (err) {
    return next(err);
  }
}

async function deleteMarket(req, res, next) {
  try {
    const data = await marketsService.adminDelete(req.params.id, req.body);
    return success(res, { message: 'Market deleted', data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getMarkets,
  getMarketById,
  getMarketBySlug,
  createMarket,
  updateMarket,
  patchMarket,
  deleteMarket,
};

