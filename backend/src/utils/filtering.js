/**
 * Reusable filtering helper.
 *
 * Applies a set of common filters to an array of items.
 * Filters are AND-combined (all must pass).
 *
 * Supported filter keys:
 *   active        - boolean
 *   status        - exact match (supports comma-separated multiple)
 *   category      - exact match
 *   type          - exact match (used by markets, platforms)
 *   country       - exact match (case-insensitive)
 *   department    - exact match (case-insensitive)
 *   partnerType   - exact match
 *   market        - exact match (e.g. platform.supportedMarkets)
 *   platform      - exact match
 *   dateFrom      - ISO date string (createdAt >= dateFrom)
 *   dateTo        - ISO date string (createdAt <= dateTo)
 *
 * @param {Array} items - The array of items to filter.
 * @param {Object} filters - Key/value pairs of filter conditions.
 * @returns {Array} Filtered array.
 */
function applyFilters(items, filters = {}) {
  if (!filters || Object.keys(filters).length === 0) return items;

  let filtered = [...items];

  // Active / inactive
  if (filters.active !== undefined && filters.active !== null && filters.active !== '') {
    const active = String(filters.active).toLowerCase() === 'true';
    filtered = filtered.filter((item) => Boolean(item.active) === active);
  }

  // Status (supports comma-separated multiple values)
  if (filters.status && filters.status !== '') {
    const statuses = String(filters.status)
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (statuses.length > 0) {
      filtered = filtered.filter((item) => {
        const itemStatus = String(item.status || '').toLowerCase();
        return statuses.some((s) => itemStatus === s);
      });
    }
  }

  // Category
  if (filters.category && filters.category !== '') {
    const cat = String(filters.category).toLowerCase();
    filtered = filtered.filter((item) => String(item.category || '').toLowerCase() === cat);
  }

  // Type
  if (filters.type && filters.type !== '') {
    const type = String(filters.type).toLowerCase();
    filtered = filtered.filter((item) => String(item.type || '').toLowerCase() === type);
  }

  // Country (case-insensitive)
  if (filters.country && filters.country !== '') {
    const country = String(filters.country).toLowerCase();
    filtered = filtered.filter((item) => String(item.country || '').toLowerCase() === country);
  }

  // Department (case-insensitive)
  if (filters.department && filters.department !== '') {
    const dept = String(filters.department).toLowerCase();
    filtered = filtered.filter((item) => String(item.department || '').toLowerCase() === dept);
  }

  // Partner Type
  if (filters.partnerType && filters.partnerType !== '') {
    const pt = String(filters.partnerType).toLowerCase();
    filtered = filtered.filter(
      (item) => String(item.partnerType || '').toLowerCase() === pt,
    );
  }

  // Market (checks supportedMarkets array or market field)
  if (filters.market && filters.market !== '') {
    const market = String(filters.market).toLowerCase();
    filtered = filtered.filter((item) => {
      if (Array.isArray(item.supportedMarkets)) {
        return item.supportedMarkets.some(
          (m) => String(m).toLowerCase() === market,
        );
      }
      return String(item.market || '').toLowerCase() === market;
    });
  }

  // Platform (checks platform field)
  if (filters.platform && filters.platform !== '') {
    const plat = String(filters.platform).toLowerCase();
    filtered = filtered.filter(
      (item) => String(item.platform || '').toLowerCase() === plat,
    );
  }

  // Date range: createdAt >= dateFrom
  if (filters.dateFrom && filters.dateFrom !== '') {
    const from = new Date(filters.dateFrom).getTime();
    if (!isNaN(from)) {
      filtered = filtered.filter((item) => {
        const ts = new Date(item.createdAt).getTime();
        return ts >= from;
      });
    }
  }

  // Date range: createdAt <= dateTo
  if (filters.dateTo && filters.dateTo !== '') {
    const to = new Date(filters.dateTo).getTime();
    if (!isNaN(to)) {
      filtered = filtered.filter((item) => {
        const ts = new Date(item.createdAt).getTime();
        return ts <= to;
      });
    }
  }

  return filtered;
}

module.exports = { applyFilters };

