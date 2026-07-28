/**
 * Reusable search helper.
 *
 * Performs case-insensitive full-text / keyword / partial / exact matching
 * across specified fields of each item.
 *
 * @param {Array} items - Array of objects to search.
 * @param {string} query - The search query string.
 * @param {string|string[]} fields - Single field name or array of field names to search in.
 * @param {Object} [options]
 * @param {boolean} [options.exact=false] - If true, perform exact match (not partial).
 * @returns {Array} Filtered array of items matching the query.
 */
function searchItems(items, query, fields, { exact = false } = {}) {
  if (!query || (typeof query === 'string' && query.trim() === '')) return items;

  const q = String(query).trim().toLowerCase();
  const fieldList = Array.isArray(fields) ? fields : [fields];

  return items.filter((item) => {
    return fieldList.some((field) => {
      const value = getNestedValue(item, field);
      if (value === undefined || value === null) return false;

      const strValue = String(value).toLowerCase();

      if (exact) {
        return strValue === q;
      }

      // Partial / keyword / full-text match
      return strValue.includes(q);
    });
  });
}

/**
 * Safely retrieve a nested property from an object using dot notation.
 * e.g. getNestedValue(obj, 'profile.firstName')
 *
 * @param {Object} obj
 * @param {string} path - Dot-separated path.
 * @returns {*} The resolved value, or undefined.
 */
function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    current = current[key];
  }
  return current;
}

module.exports = { searchItems, getNestedValue };

