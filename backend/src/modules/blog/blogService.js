const {
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require('../../middleware/error/customErrors');

const blogRepository = require('./blogRepository');

const STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

function normalizeBool(v, fallback = false) {
  if (v === undefined) return fallback;
  return Boolean(v);
}

function slugify(input) {
  return blogRepository.normalizeSlug(input);
}

function ensurePublishedAt(status, publishedAt) {
  if (status === STATUS.PUBLISHED) {
    if (publishedAt) return publishedAt;
    return new Date().toISOString();
  }
  return publishedAt || null;
}

async function validateActiveCategoryAndTags({ categoryId, tagIds }) {
  if (categoryId) {
    const cat = await blogRepository.getCategoryById(categoryId);
    if (!cat) throw new NotFoundError('Category not found');
    if (cat.active !== true) throw new BadRequestError('Category must be active');
  }

  if (tagIds && tagIds.length) {
    const ids = tagIds.map(String);
    for (const id of ids) {
      const tag = await blogRepository.getTagById(id);
      if (!tag) throw new NotFoundError('Tag not found');
      if (tag.active !== true) throw new BadRequestError('Tags must be active');
    }
  }
}

function sanitizeBlogPayload(payload, { mode }) {
  // mode: 'create' | 'put' | 'patch'
  const p = payload || {};
  const isCreate = mode === 'create';

  const blog = {
    title: isCreate ? p.title : p.title !== undefined ? p.title : undefined,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    featuredImage: p.featuredImage,
    categoryId: p.categoryId,
    tagIds: p.tagIds,
    author: p.author,
    seo: p.seo,
    status: p.status,
    featured: p.featured,
    active: p.active,
    publishedAt: p.publishedAt,
  };

  return blog;
}

async function publicList(reqQuery) {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    q,
    featured,
    categoryId,
    tagId,
  } = reqQuery || {};

  const result = await blogRepository.listBlogsPublic({
    page,
    limit,
    sortBy,
    sortOrder,
    q,
    featured: featured !== undefined ? Boolean(featured === 'true' || featured === true) : undefined,
    categoryId,
    tagId,
  });

  return {
    items: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

async function publicGetById(id) {
  const blog = await blogRepository.getBlogById(id);
  if (!blog) return null;
  if (blog.status !== STATUS.PUBLISHED) return null;
  if (blog.active !== true) return null;
  return blog;
}

async function publicGetBySlug(slug) {
  return blogRepository.getBlogBySlugPublic(slug);
}

async function publicListCategories(query) {
  const result = await blogRepository.listCategoriesPublic(query);
  return {
    items: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

async function publicGetCategoryById(id) {
  const cat = await blogRepository.getCategoryById(id);
  if (!cat) return null;
  if (cat.active !== true) return null;
  return cat;
}

async function publicListTags(query) {
  const result = await blogRepository.listTagsPublic(query);
  return {
    items: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

async function publicGetTagById(id) {
  const tag = await blogRepository.getTagById(id);
  if (!tag) return null;
  if (tag.active !== true) return null;
  return tag;
}

async function adminCreateBlog(payload) {
  const p = payload || {};
  if (!p.title) throw new BadRequestError('title is required');

  const status = p.status || STATUS.DRAFT;
  if (![STATUS.DRAFT, STATUS.PUBLISHED].includes(status)) throw new BadRequestError('Invalid status');

  const resolvedSlug = slugify(p.slug || p.title);
  if (await blogRepository.isBlogSlugInUse({ slug: resolvedSlug })) {
    throw new ConflictError('Slug already in use');
  }

  if (status === STATUS.PUBLISHED) {
    await validateActiveCategoryAndTags({ categoryId: p.categoryId, tagIds: p.tagIds || [] });
  }

  const created = await blogRepository.createBlog({
    ...p,
    title: p.title,
    slug: resolvedSlug,
    status,
    publishedAt: ensurePublishedAt(status, p.publishedAt),
    featured: normalizeBool(p.featured, false),
    active: p.active === undefined ? true : normalizeBool(p.active, true),
  });

  return created;
}

async function adminUpdateBlog(id, payload, { mode }) {
  const p = payload || {};
  const existing = await blogRepository.getBlogById(id);
  if (!existing) throw new NotFoundError('Blog not found');

  const status = p.status !== undefined ? p.status : existing.status;
  if (![STATUS.DRAFT, STATUS.PUBLISHED].includes(status)) throw new BadRequestError('Invalid status');

  const nextSlug = p.slug !== undefined ? slugify(p.slug) : existing.slug;
  const nextTitle = p.title !== undefined ? p.title : existing.title;

  // If title changes and slug not explicitly provided, derive slug
  const derivedSlug = p.slug === undefined && p.title !== undefined ? slugify(nextTitle) : nextSlug;

  if (p.slug !== undefined || p.title !== undefined) {
    if (await blogRepository.isBlogSlugInUse({ slug: derivedSlug, excludeId: id })) {
      throw new ConflictError('Slug already in use');
    }
  }

  if (mode === 'put') {
    if (p.title === undefined) throw new BadRequestError('title is required');
    if (p.content === undefined) throw new BadRequestError('content is required');
    if (p.excerpt === undefined) throw new BadRequestError('excerpt is required');
    if (p.categoryId === undefined) throw new BadRequestError('categoryId is required');
    if (p.tagIds === undefined) throw new BadRequestError('tagIds is required');
  }

  if (status === STATUS.PUBLISHED) {
    await validateActiveCategoryAndTags({
      categoryId: p.categoryId !== undefined ? p.categoryId : existing.categoryId,
      tagIds: p.tagIds !== undefined ? p.tagIds : existing.tagIds,
    });
  }

  const patch = {
    ...(p.title !== undefined ? { title: p.title } : {}),
    ...(p.content !== undefined ? { content: p.content } : {}),
    ...(p.excerpt !== undefined ? { excerpt: p.excerpt } : {}),
    ...(p.featuredImage !== undefined ? { featuredImage: p.featuredImage } : {}),
    ...(p.categoryId !== undefined ? { categoryId: p.categoryId } : {}),
    ...(p.tagIds !== undefined ? { tagIds: p.tagIds } : {}),
    ...(p.author !== undefined ? { author: p.author } : {}),
    ...(p.seo !== undefined ? { seo: p.seo } : {}),
    ...(p.featured !== undefined ? { featured: normalizeBool(p.featured, false) } : {}),
    ...(p.active !== undefined ? { active: normalizeBool(p.active, true) } : {}),
    ...(p.status !== undefined ? { status } : {}),
    ...(p.publishedAt !== undefined ? { publishedAt: ensurePublishedAt(status, p.publishedAt) } : { publishedAt: status === STATUS.PUBLISHED ? (existing.publishedAt || new Date().toISOString()) : null }),
  };

  // Handle slug alignment
  if (p.slug !== undefined) patch.slug = derivedSlug;
  if (p.slug === undefined && p.title !== undefined) patch.slug = derivedSlug;

  const updated = await blogRepository.updateBlogById(id, patch);
  if (!updated) throw new NotFoundError('Blog not found');
  return updated;
}

async function adminPatchBlog(id, payload) {
  return adminUpdateBlog(id, payload, { mode: 'patch' });
}

async function adminPutBlog(id, payload) {
  return adminUpdateBlog(id, payload, { mode: 'put' });
}

async function adminDeleteBlog(id) {
  const removed = await blogRepository.deleteBlogById(id);
  if (!removed) throw new NotFoundError('Blog not found');
  return removed;
}

async function adminCreateCategory(payload) {
  const p = payload || {};
  if (!p.name) throw new BadRequestError('name is required');

  const statusSlug = slugify(p.slug || p.name);
  if (await blogRepository.isCategorySlugInUse({ slug: statusSlug })) throw new ConflictError('Slug already in use');

  return blogRepository.createCategory({
    ...p,
    name: p.name,
    slug: statusSlug,
    active: p.active === undefined ? true : normalizeBool(p.active, true),
  });
}

async function adminUpdateCategory(id, payload, { mode }) {
  const existing = await blogRepository.getCategoryById(id);
  if (!existing) throw new NotFoundError('Category not found');

  if (mode === 'put') {
    if (payload.name === undefined) throw new BadRequestError('name is required');
    if (payload.description === undefined) throw new BadRequestError('description is required');
    if (payload.active === undefined) throw new BadRequestError('active is required');
  }

  const nextName = payload.name !== undefined ? payload.name : existing.name;
  const nextSlug = payload.slug !== undefined ? slugify(payload.slug) : payload.name !== undefined ? slugify(nextName) : existing.slug;

  if (payload.slug !== undefined || payload.name !== undefined) {
    if (await blogRepository.isCategorySlugInUse({ slug: nextSlug, excludeId: id })) {
      throw new ConflictError('Slug already in use');
    }
  }

  const patch = {
    ...(payload.name !== undefined ? { name: payload.name } : {}),
    ...(payload.description !== undefined ? { description: payload.description } : {}),
    ...(payload.active !== undefined ? { active: normalizeBool(payload.active, true) } : {}),
    ...(payload.slug !== undefined ? { slug: nextSlug } : {}),
  };

  if (payload.slug === undefined && payload.name !== undefined) patch.slug = nextSlug;

  const updated = await blogRepository.updateCategoryById(id, patch);
  if (!updated) throw new NotFoundError('Category not found');
  return updated;
}

async function adminPatchCategory(id, payload) {
  return adminUpdateCategory(id, payload, { mode: 'patch' });
}

async function adminPutCategory(id, payload) {
  return adminUpdateCategory(id, payload, { mode: 'put' });
}

async function adminDeleteCategory(id) {
  const removed = await blogRepository.deleteCategoryById(id);
  if (!removed) throw new NotFoundError('Category not found');
  return removed;
}

async function adminCreateTag(payload) {
  const p = payload || {};
  if (!p.name) throw new BadRequestError('name is required');

  const slug = slugify(p.slug || p.name);
  if (await blogRepository.isTagSlugInUse({ slug })) throw new ConflictError('Slug already in use');

  return blogRepository.createTag({
    ...p,
    name: p.name,
    slug,
    active: p.active === undefined ? true : normalizeBool(p.active, true),
  });
}

async function adminUpdateTag(id, payload, { mode }) {
  const existing = await blogRepository.getTagById(id);
  if (!existing) throw new NotFoundError('Tag not found');

  if (mode === 'put') {
    if (payload.name === undefined) throw new BadRequestError('name is required');
    if (payload.active === undefined) throw new BadRequestError('active is required');
  }

  const nextName = payload.name !== undefined ? payload.name : existing.name;
  const nextSlug = payload.slug !== undefined ? slugify(payload.slug) : payload.name !== undefined ? slugify(nextName) : existing.slug;

  if (payload.slug !== undefined || payload.name !== undefined) {
    if (await blogRepository.isTagSlugInUse({ slug: nextSlug, excludeId: id })) throw new ConflictError('Slug already in use');
  }

  const patch = {
    ...(payload.name !== undefined ? { name: payload.name } : {}),
    ...(payload.active !== undefined ? { active: normalizeBool(payload.active, true) } : {}),
    ...(payload.slug !== undefined ? { slug: nextSlug } : {}),
  };

  if (payload.slug === undefined && payload.name !== undefined) patch.slug = nextSlug;

  const updated = await blogRepository.updateTagById(id, patch);
  if (!updated) throw new NotFoundError('Tag not found');
  return updated;
}

async function adminPatchTag(id, payload) {
  return adminUpdateTag(id, payload, { mode: 'patch' });
}

async function adminPutTag(id, payload) {
  return adminUpdateTag(id, payload, { mode: 'put' });
}

async function adminDeleteTag(id) {
  const removed = await blogRepository.deleteTagById(id);
  if (!removed) throw new NotFoundError('Tag not found');
  return removed;
}

module.exports = {
  // public blogs
  publicList,
  publicGetById,
  publicGetBySlug,

  // public categories/tags
  publicListCategories,
  publicGetCategoryById,
  publicListTags,
  publicGetTagById,

  // admin blogs
  adminCreateBlog,
  adminPutBlog,
  adminPatchBlog,
  adminDeleteBlog,

  // admin categories
  adminCreateCategory,
  adminPutCategory,
  adminPatchCategory,
  adminDeleteCategory,

  // admin tags
  adminCreateTag,
  adminPutTag,
  adminPatchTag,
  adminDeleteTag,

  STATUS,
};

