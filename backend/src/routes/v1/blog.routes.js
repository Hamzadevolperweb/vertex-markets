const express = require('express');

const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');

const { Roles } = require('../../constants/roles');
const { blogController, validators } = require('../../modules/blog');

function blogRoutes() {
  const router = express.Router();

  // ---------------- Public APIs ----------------
  /**
   * @openapi
   * /api/v1/blog:
   *   get:
   *     summary: List published blogs
   *     tags: [Blog]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema: { type: integer, minimum: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, minimum: 1, maximum: 100 }
   *       - in: query
   *         name: sortBy
   *         schema: { type: string }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string, enum: [asc, desc, ASC, DESC, Asc, Desc] }
   *       - in: query
   *         name: q
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/', validators.listBlogsPublicQuery(), asyncWrapper(blogController.getBlogs));

  /**
   * @openapi
   * /api/v1/blog/{id}:
   *   get:
   *     summary: Get published blog by id
   *     tags: [Blog]
   */
  router.get('/:id', validators.idParam(), asyncWrapper(blogController.getBlogById));

  /**
   * @openapi
   * /api/v1/blog/slug/{slug}:
   *   get:
   *     summary: Get published blog by slug
   *     tags: [Blog]
   */
  router.get('/slug/:slug', validators.slugParam(), asyncWrapper(blogController.getBlogBySlug));

  // Categories
  router.get('/categories', validators.listCategoriesPublicQuery(), asyncWrapper(blogController.getCategories));
  router.get('/categories/:id', validators.idParam(), asyncWrapper(blogController.getCategoryById));

  // Tags
  router.get('/tags', validators.listTagsPublicQuery(), asyncWrapper(blogController.getTags));
  router.get('/tags/:id', validators.idParam(), asyncWrapper(blogController.getTagById));

  // ---------------- Admin APIs ----------------
  // Blogs
  router.post(
    '/',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.blogCreateBody(),
    asyncWrapper(blogController.createBlog),
  );

  router.put(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    validators.blogPutBody(),
    asyncWrapper(blogController.putBlog),
  );

  router.patch(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    validators.blogPatchBody(),
    asyncWrapper(blogController.patchBlog),
  );

  router.delete(
    '/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    asyncWrapper(blogController.deleteBlog),
  );

  // Categories
  router.post(
    '/categories',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.categoryCreateBody(),
    asyncWrapper(blogController.createCategory),
  );

  router.put(
    '/categories/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    validators.categoryPutBody(),
    asyncWrapper(blogController.putCategory),
  );

  router.patch(
    '/categories/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    validators.categoryPatchBody(),
    asyncWrapper(blogController.patchCategory),
  );

  router.delete(
    '/categories/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    asyncWrapper(blogController.deleteCategory),
  );

  // Tags
  router.post(
    '/tags',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.tagCreateBody(),
    asyncWrapper(blogController.createTag),
  );

  router.put(
    '/tags/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    validators.tagPutBody(),
    asyncWrapper(blogController.putTag),
  );

  router.patch(
    '/tags/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    validators.tagPatchBody(),
    asyncWrapper(blogController.patchTag),
  );

  router.delete(
    '/tags/:id',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('cms:write'),
    validators.idParam(),
    asyncWrapper(blogController.deleteTag),
  );

  return router;
}

module.exports = { blogRoutes };


