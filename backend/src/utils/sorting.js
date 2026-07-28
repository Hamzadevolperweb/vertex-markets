/**
 * Reusable sorting helper.
 *
 * Sorts an array of items by a given field and direction.
 *
 * @param {Array} items - The array to sort (mutated in place).
 * @param {Object} [options]
 * @param {string} [options.sortBy='createdAt'] - Field name to sort by.
 * @param {string} [options.sortOrder='desc'] - 'asc' or 'desc'.
 * @returns {Array} The sorted array (same reference).
 */
function applySort(items, { sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
  const dir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;
  const sb = sortBy || 'createdAt';

  items.sort((a, b) => {
    const av = a[sb];
    const bv = b[sb];

    if (av === undefined && bv === undefined) return 0;
    if (av === undefined) return 1;
    if (bv === undefined) return -1;

    // String comparison for case-insensitive ordering
    if (typeof av === 'string' && typeof bv === 'string') {
      const cmp = av.localeCompare(bv, undefined, { sensitivity: 'base' });
      return cmp * dir;
    }

    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  return items;
}

module.exports = { applySort };

