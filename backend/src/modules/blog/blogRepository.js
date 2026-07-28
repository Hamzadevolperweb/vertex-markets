const { store } = require('../../infrastructure/store');

const BLOGS = 'blog_posts';
const CATEGORIES = 'blog_categories';
const TAGS = 'blog_tags';

function blogsCollection() {
  return store.collection(BLOGS);
}
function categoriesCollection() {
  return store.collection(CATEGORIES);
}
function tagsCollection() {
  return store.collection(TAGS);
}

function normalizeSlug(input) {
  if (input === undefined || input === null) return '';
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

function safeArrayIds(v) {
  if (v === undefined || v === null) return [];
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [];
}

function blogKey(id) {
  return `id::${id}`;
}
function categoryKey(id) {
  return `id::${id}`;
}
function tagKey(id) {
  return `id::${id}`;
}

async function getBlogById(id) {
  const col = blogsCollection();
  return col.get(blogKey(id)) || null;
}
async function getCategoryById(id) {
  const col = categoriesCollection();
  return col.get(categoryKey(id)) || null;
}
async function getTagById(id) {
  const col = tagsCollection();
  return col.get(tagKey(id)) || null;
}

async function getBlogBySlugPublic(slug) {
  const s = normalizeSlug(slug);
  const col = blogsCollection();
  return [...col.values()].find((b) => b.slug === s && b.status === 'published' && b.active === true) || null;
}

async function getBlogBySlugAdmin(slug) {
  const s = normalizeSlug(slug);
  const col = blogsCollection();
  return [...col.values()].find((b) => b.slug === s) || null;
}

async function isBlogSlugInUse({ slug, excludeId = null }) {
  const existing = await getBlogBySlugAdmin(slug);
  if (!existing) return false;
  if (excludeId && String(existing.id) === String(excludeId)) return false;
  return true;
}

async function isCategorySlugInUse({ slug, excludeId = null }) {
  const s = normalizeSlug(slug);
  const col = categoriesCollection();
  const existing = [...col.values()].find((c) => c.slug === s);
  if (!existing) return false;
  if (excludeId && String(existing.id) === String(excludeId)) return false;
  return true;
}

async function isTagSlugInUse({ slug, excludeId = null }) {
  const s = normalizeSlug(slug);
  const col = tagsCollection();
  const existing = [...col.values()].find((t) => t.slug === s);
  if (!existing) return false;
  if (excludeId && String(existing.id) === String(excludeId)) return false;
  return true;
}

async function createBlog(payload) {
  const col = blogsCollection();
  const now = new Date().toISOString();
  const id = payload.id || store.newId('blog');
  const resolvedSlug = normalizeSlug(payload.slug || payload.title);

  const entity = {
    id,
    title: payload.title,
    slug: resolvedSlug,
    excerpt: payload.excerpt || '',
    content: payload.content || '',
    featuredImage: payload.featuredImage || '',
    categoryId: payload.categoryId ? String(payload.categoryId) : null,
    tagIds: safeArrayIds(payload.tagIds),
    author: payload.author || '',
    seo: payload.seo || {},
    status: payload.status || 'draft',
    featured: Boolean(payload.featured),
    active: payload.active === undefined ? true : Boolean(payload.active),
    publishedAt: payload.publishedAt || null,
    createdAt: now,
    updatedAt: now,
  };

  col.set(blogKey(id), entity);
  return entity;
}

async function updateBlogById(id, patch) {
  const col = blogsCollection();
  const existing = await getBlogById(id);
  if (!existing) return null;

  const resolved = {
    ...existing,
    ...patch,
    id: existing.id,
    tagIds: patch.tagIds !== undefined ? safeArrayIds(patch.tagIds) : existing.tagIds,
    categoryId: patch.categoryId !== undefined ? (patch.categoryId ? String(patch.categoryId) : null) : existing.categoryId,
    slug: patch.slug !== undefined ? normalizeSlug(patch.slug) : existing.slug,
    title: patch.title !== undefined ? patch.title : existing.title,
    updatedAt: new Date().toISOString(),
  };

  // If title changed but slug not provided, keep slug aligned (derived style like other modules)
  if (patch.title !== undefined && patch.slug === undefined) {
    resolved.slug = normalizeSlug(resolved.slug || patch.title);
  }

  col.set(blogKey(id), resolved);
  return resolved;
}

async function deleteBlogById(id) {
  const col = blogsCollection();
  const existing = await getBlogById(id);
  if (!existing) return null;
  col.delete(blogKey(id));
  return existing;
}

async function listCategoriesPublic({ page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', q = null } = {}) {
  let items = [...categoriesCollection().values()].filter((c) => c.active === true);

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((c) => (c.name || '').toLowerCase().includes(qq) || (c.slug || '').toLowerCase().includes(qq));
  }

  const dir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;
  items.sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av === undefined && bv === undefined) return 0;
    if (av === undefined) return 1;
    if (bv === undefined) return -1;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  const total = items.length;
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));
  const start = (p - 1) * l;

  return {
    items,
    data: items.slice(start, start + l),
    total,
    page: p,
    limit: l,
  };
}

async function listTagsPublic({ page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', q = null } = {}) {
  let items = [...tagsCollection().values()].filter((t) => t.active === true);

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((t) => (t.name || '').toLowerCase().includes(qq) || (t.slug || '').toLowerCase().includes(qq));
  }

  const dir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;
  items.sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av === undefined && bv === undefined) return 0;
    if (av === undefined) return 1;
    if (bv === undefined) return -1;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  const total = items.length;
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));
  const start = (p - 1) * l;

  return {
    items,
    data: items.slice(start, start + l),
    total,
    page: p,
    limit: l,
  };
}

async function listBlogsPublic({
  page = 1,
  limit = 20,
  sortBy = 'publishedAt',
  sortOrder = 'desc',
  q = null,
  featured = undefined,
  categoryId = undefined,
  tagId = undefined,
} = {}) {
  let items = [...blogsCollection().values()].filter((b) => b.status === 'published' && b.active === true);

  if (featured !== undefined) {
    items = items.filter((b) => Boolean(b.featured) === Boolean(featured));
  }

  if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
    items = items.filter((b) => String(b.categoryId) === String(categoryId));
  }

  if (tagId !== undefined && tagId !== null && tagId !== '') {
    const t = String(tagId);
    items = items.filter((b) => (b.tagIds || []).map(String).includes(t));
  }

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((b) =>
      (b.title || '').toLowerCase().includes(qq) ||
      (b.slug || '').toLowerCase().includes(qq) ||
      (b.excerpt || '').toLowerCase().includes(qq),
    );
  }

  const dir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;
  items.sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av === undefined && bv === undefined) return 0;
    if (av === undefined) return 1;
    if (bv === undefined) return -1;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  const total = items.length;
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));
  const start = (p - 1) * l;

  return {
    items,
    data: items.slice(start, start + l),
    total,
    page: p,
    limit: l,
  };
}

async function listBlogsAdmin({
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  q = null,
  status = undefined,
  active = undefined,
} = {}) {
  let items = [...blogsCollection().values()];

  if (status !== undefined && status !== null && status !== '') {
    items = items.filter((b) => b.status === status);
  }
  if (active !== undefined && active !== null && active !== '') {
    items = items.filter((b) => Boolean(b.active) === Boolean(active));
  }

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((b) =>
      (b.title || '').toLowerCase().includes(qq) ||
      (b.slug || '').toLowerCase().includes(qq) ||
      (b.excerpt || '').toLowerCase().includes(qq),
    );
  }

  const dir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;
  items.sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av === undefined && bv === undefined) return 0;
    if (av === undefined) return 1;
    if (bv === undefined) return -1;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  const total = items.length;
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));
  const start = (p - 1) * l;

  return {
    items,
    data: items.slice(start, start + l),
    total,
    page: p,
    limit: l,
  };
}

async function createCategory(payload) {
  const col = categoriesCollection();
  const now = new Date().toISOString();
  const id = payload.id || store.newId('category');
  const resolvedSlug = normalizeSlug(payload.slug || payload.name);

  const entity = {
    id,
    name: payload.name,
    slug: resolvedSlug,
    description: payload.description || '',
    active: payload.active === undefined ? true : Boolean(payload.active),
    createdAt: now,
    updatedAt: now,
  };

  col.set(categoryKey(id), entity);
  return entity;
}

async function updateCategoryById(id, patch) {
  const col = categoriesCollection();
  const existing = await getCategoryById(id);
  if (!existing) return null;

  const resolved = {
    ...existing,
    ...patch,
    id: existing.id,
    slug: patch.slug !== undefined ? normalizeSlug(patch.slug) : existing.slug,
    name: patch.name !== undefined ? patch.name : existing.name,
    updatedAt: new Date().toISOString(),
  };

  if (patch.name !== undefined && patch.slug === undefined) {
    resolved.slug = normalizeSlug(resolved.slug || patch.name);
  }

  col.set(categoryKey(id), resolved);
  return resolved;
}

async function deleteCategoryById(id) {
  const col = categoriesCollection();
  const existing = await getCategoryById(id);
  if (!existing) return null;
  col.delete(categoryKey(id));
  return existing;
}

async function createTag(payload) {
  const col = tagsCollection();
  const now = new Date().toISOString();
  const id = payload.id || store.newId('tag');
  const resolvedSlug = normalizeSlug(payload.slug || payload.name);

  const entity = {
    id,
    name: payload.name,
    slug: resolvedSlug,
    active: payload.active === undefined ? true : Boolean(payload.active),
    createdAt: now,
    updatedAt: now,
  };

  col.set(tagKey(id), entity);
  return entity;
}

async function updateTagById(id, patch) {
  const col = tagsCollection();
  const existing = await getTagById(id);
  if (!existing) return null;

  const resolved = {
    ...existing,
    ...patch,
    id: existing.id,
    slug: patch.slug !== undefined ? normalizeSlug(patch.slug) : existing.slug,
    name: patch.name !== undefined ? patch.name : existing.name,
    updatedAt: new Date().toISOString(),
  };

  if (patch.name !== undefined && patch.slug === undefined) {
    resolved.slug = normalizeSlug(resolved.slug || patch.name);
  }

  col.set(tagKey(id), resolved);
  return resolved;
}

async function deleteTagById(id) {
  const col = tagsCollection();
  const existing = await getTagById(id);
  if (!existing) return null;
  col.delete(tagKey(id));
  return existing;
}

module.exports = {
  // slug/dup helpers
  normalizeSlug,
  isBlogSlugInUse,
  isCategorySlugInUse,
  isTagSlugInUse,

  // blog ops
  getBlogById,
  getBlogBySlugPublic,
  listBlogsPublic,
  listBlogsAdmin,
  getBlogBySlugAdmin,
  createBlog,
  updateBlogById,
  deleteBlogById,

  // category ops
  getCategoryById,
  listCategoriesPublic,
  createCategory,
  updateCategoryById,
  deleteCategoryById,

  // tag ops
  getTagById,
  listTagsPublic,
  createTag,
  updateTagById,
  deleteTagById,
};

