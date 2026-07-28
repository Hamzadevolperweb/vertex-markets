const searchRepository = require('./searchRepository');

// ─── Supported Modules ───────────────────────────────────────────────────

const SUPPORTED_MODULES = [
  'users',
  'cms',
  'markets',
  'platforms',
  'blog',
  'contact',
  'newsletter',
  'careers',
  'partners',
  'uploads',
];

// ─── Global Search ───────────────────────────────────────────────────────

/**
 * Perform a global search across all supported modules.
 *
 * @param {Object} options
 * @param {string} options.query - Search query string.
 * @param {Object} options.filters - Common filters.
 * @param {string} options.sortBy
 * @param {string} options.sortOrder
 * @param {number} options.page
 * @param {number} options.limit
 * @param {boolean} options.isAdmin - If true, return all records; else only active.
 * @returns {Promise<Object>} Search results grouped by module.
 */
async function globalSearch({
  query,
  filters = {},
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 20,
  isAdmin = false,
}) {
  const startTime = Date.now();
  const results = {};

  for (const moduleName of SUPPORTED_MODULES) {
    const collectionName = searchRepository.resolveCollection(moduleName);
    if (!collectionName) continue;

    const paginated = searchRepository.searchModule({
      collectionName,
      query,
      filters,
      sortBy,
      sortOrder,
      page,
      limit,
      publicOnly: !isAdmin,
      includeDeleted: isAdmin,
    });

    results[moduleName] = paginated;
  }

  const executionTime = Date.now() - startTime;

  return {
    query: query || '',
    module: 'all',
    filters,
    pagination: { page, limit },
    sorting: { sortBy, sortOrder },
    results,
    total: Object.values(results).reduce((sum, r) => sum + r.totalRecords, 0),
    executionTime,
  };
}

// ─── Module-specific Search ──────────────────────────────────────────────

/**
 * Search within a specific module.
 *
 * @param {string} moduleName - One of SUPPORTED_MODULES.
 * @param {Object} options
 * @returns {Promise<Object>}
 */
async function moduleSearch(moduleName, {
  query,
  filters = {},
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 20,
  isAdmin = false,
}) {
  const startTime = Date.now();

  if (!SUPPORTED_MODULES.includes(moduleName)) {
    const error = new Error(`Unsupported search module: ${moduleName}`);
    error.statusCode = 400;
    throw error;
  }

  const collectionName = searchRepository.resolveCollection(moduleName);
  if (!collectionName) {
    const error = new Error(`Collection not found for module: ${moduleName}`);
    error.statusCode = 500;
    throw error;
  }

  const paginated = searchRepository.searchModule({
    collectionName,
    query,
    filters,
    sortBy,
    sortOrder,
    page,
    limit,
    publicOnly: !isAdmin,
    includeDeleted: isAdmin,
  });

  const executionTime = Date.now() - startTime;

  return {
    query: query || '',
    module: moduleName,
    filters,
    pagination: {
      currentPage: paginated.currentPage,
      totalPages: paginated.totalPages,
      totalRecords: paginated.totalRecords,
      pageSize: paginated.pageSize,
      hasNextPage: paginated.hasNextPage,
      hasPreviousPage: paginated.hasPreviousPage,
    },
    sorting: { sortBy, sortOrder },
    results: paginated.data,
    total: paginated.totalRecords,
    executionTime,
  };
}

// ─── Module name validation ──────────────────────────────────────────────

function isValidModule(name) {
  return SUPPORTED_MODULES.includes(name);
}

function getSupportedModules() {
  return [...SUPPORTED_MODULES];
}

module.exports = {
  SUPPORTED_MODULES,
  globalSearch,
  moduleSearch,
  isValidModule,
  getSupportedModules,
};

