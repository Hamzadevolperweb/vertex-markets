/**
 * Reusable pagination helper.
 *
 * @param {Array} items - The full array of items to paginate.
 * @param {Object} [options]
 * @param {number} [options.page=1] - Current page number (1-indexed).
 * @param {number} [options.limit=20] - Items per page (max 100).
 * @returns {{ currentPage: number, totalPages: number, totalRecords: number, pageSize: number, hasNextPage: boolean, hasPreviousPage: boolean, data: Array }}
 */
function paginate(items, { page = 1, limit = 20 } = {}) {
  const totalRecords = items.length;
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const start = (currentPage - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return {
    currentPage,
    totalPages,
    totalRecords,
    pageSize,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    data,
  };
}

module.exports = { paginate };

