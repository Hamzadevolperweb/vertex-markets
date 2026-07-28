const { store } = require('../../infrastructure/store');
const { paginate } = require('../../utils/pagination');
const { applySort } = require('../../utils/sorting');
const { applyFilters } = require('../../utils/filtering');
const { searchItems } = require('../../utils/search');

// ─── Collection Names ─────────────────────────────────────────────────────

const COLLECTIONS = {
  users: 'users',
  cms: 'cms',
  markets: 'markets',
  platforms: 'platforms',
  blog: 'blog_posts',
  blogCategories: 'blog_categories',
  blogTags: 'blog_tags',
  contact: 'contacts',
  newsletter: 'newsletters',
  careers: 'career_jobs',
  careerApplications: 'career_applications',
  partners: 'partners',
  partnerReferrals: 'partner_referrals',
  uploads: 'uploads',
};

// ─── Field Mappings (fields to search per module) ─────────────────────────

const SEARCH_FIELDS = {
  users: [
    'email',
    'profile.firstName',
    'profile.lastName',
    'profile.phone',
    'role',
  ],
  cms: ['id', 'section'],
  markets: ['title', 'slug', 'description', 'type'],
  platforms: ['title', 'slug', 'shortDescription', 'description'],
  blog: ['title', 'slug', 'excerpt', 'content', 'author'],
  blogCategories: ['name', 'slug', 'description'],
  blogTags: ['name', 'slug'],
  contact: ['fullName', 'email', 'phone', 'country', 'subject', 'message', 'department'],
  newsletter: ['email', 'fullName', 'source'],
  careers: ['title', 'slug', 'department', 'location', 'description'],
  careerApplications: ['fullName', 'email', 'phone'],
  partners: ['fullName', 'companyName', 'email', 'phone', 'country', 'partnerType'],
  partnerReferrals: ['clientName', 'clientEmail', 'clientPhone', 'country'],
  uploads: ['originalName', 'fileName', 'mimeType', 'category', 'extension'],
};

// ─── Helper: get raw items from a collection ─────────────────────────────

function getCollection(name) {
  const col = store.collection(name);
  return [...col.values()];
}

// ─── Core search function (used by all modules) ──────────────────────────

function searchModule({
  collectionName,
  query,
  filters = {},
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 20,
  searchFields,
  publicOnly = false,
  includeDeleted = false,
}) {
  let items = getCollection(collectionName);

  // Filter out deleted items unless explicitly included
  if (!includeDeleted) {
    items = items.filter((item) => !item.deletedAt);
  }

  // For public searches, only return active records
  if (publicOnly) {
    items = items.filter((item) => item.active !== false);
    // For blog posts, also restrict to published status
    if (collectionName === COLLECTIONS.blog) {
      items = items.filter((item) => item.status === 'published');
    }
    // For careers, restrict to open status
    if (collectionName === COLLECTIONS.careers) {
      items = items.filter((item) => item.status === 'open');
    }
    // For partners, restrict to approved status
    if (collectionName === COLLECTIONS.partners) {
      items = items.filter((item) => item.status === 'approved');
    }
  }

  // Apply search query
  if (query && query.trim() !== '') {
    const fields = searchFields || SEARCH_FIELDS[collectionName] || [];
    items = searchItems(items, query, fields);
  }

  // Apply filters
  items = applyFilters(items, filters);

  // Apply sorting
  applySort(items, { sortBy, sortOrder });

  // Paginate
  const paginated = paginate(items, { page, limit });

  return paginated;
}

// ─── Collection name alias helper ────────────────────────────────────────

function resolveCollection(moduleName) {
  return COLLECTIONS[moduleName] || null;
}

module.exports = {
  COLLECTIONS,
  SEARCH_FIELDS,
  searchModule,
  resolveCollection,
  getCollection,
};

