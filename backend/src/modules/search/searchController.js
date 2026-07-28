const searchService = require('./searchService');
const { success } = require('../../utils/response');

/**
 * GET /search
 * Global search across all modules.
 */
async function globalSearch(req, res) {
  const {
    q,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    active,
    status,
    category,
    type,
    country,
    department,
    partnerType,
    market,
    platform,
    dateFrom,
    dateTo,
  } = req.query;

  const isAdmin = !!(req.auth && req.auth.role === 'Admin');

  const filters = buildFilters({
    active, status, category, type, country, department,
    partnerType, market, platform, dateFrom, dateTo,
  });

  const result = await searchService.globalSearch({
    query: q,
    filters,
    sortBy,
    sortOrder,
    page,
    limit,
    isAdmin,
  });

  return success(res, {
    status: 200,
    message: 'Global search completed',
    data: result,
  });
}

/**
 * GET /search/:module
 * Module-specific search.
 */
async function moduleSearch(req, res) {
  const { module: moduleName } = req.params;

  const {
    q,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    active,
    status,
    category,
    type,
    country,
    department,
    partnerType,
    market,
    platform,
    dateFrom,
    dateTo,
  } = req.query;

  const isAdmin = !!(req.auth && req.auth.role === 'Admin');

  const filters = buildFilters({
    active, status, category, type, country, department,
    partnerType, market, platform, dateFrom, dateTo,
  });

  const result = await searchService.moduleSearch(moduleName, {
    query: q,
    filters,
    sortBy,
    sortOrder,
    page,
    limit,
    isAdmin,
  });

  return success(res, {
    status: 200,
    message: `Search in ${moduleName} completed`,
    data: result,
  });
}

// ─── Filter Builder ──────────────────────────────────────────────────────

function buildFilters({
  active,
  status,
  category,
  type,
  country,
  department,
  partnerType,
  market,
  platform,
  dateFrom,
  dateTo,
} = {}) {
  const filters = {};

  if (active !== undefined && active !== null && active !== '') {
    filters.active = active;
  }
  if (status !== undefined && status !== null && status !== '') {
    filters.status = status;
  }
  if (category !== undefined && category !== null && category !== '') {
    filters.category = category;
  }
  if (type !== undefined && type !== null && type !== '') {
    filters.type = type;
  }
  if (country !== undefined && country !== null && country !== '') {
    filters.country = country;
  }
  if (department !== undefined && department !== null && department !== '') {
    filters.department = department;
  }
  if (partnerType !== undefined && partnerType !== null && partnerType !== '') {
    filters.partnerType = partnerType;
  }
  if (market !== undefined && market !== null && market !== '') {
    filters.market = market;
  }
  if (platform !== undefined && platform !== null && platform !== '') {
    filters.platform = platform;
  }
  if (dateFrom !== undefined && dateFrom !== null && dateFrom !== '') {
    filters.dateFrom = dateFrom;
  }
  if (dateTo !== undefined && dateTo !== null && dateTo !== '') {
    filters.dateTo = dateTo;
  }

  return filters;
}

module.exports = {
  globalSearch,
  moduleSearch,
};

