const express = require('express');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');
const { Roles } = require('../../constants/roles');

const { searchController, validators } = require('../../modules/search');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     SearchPagination:
 *       type: object
 *       properties:
 *         currentPage: { type: integer }
 *         totalPages: { type: integer }
 *         totalRecords: { type: integer }
 *         pageSize: { type: integer }
 *         hasNextPage: { type: boolean }
 *         hasPreviousPage: { type: boolean }
 *     SearchSorting:
 *       type: object
 *       properties:
 *         sortBy: { type: string }
 *         sortOrder: { type: string, enum: [asc, desc] }
 *     ModuleSearchResults:
 *       type: object
 *       properties:
 *         currentPage: { type: integer }
 *         totalPages: { type: integer }
 *         totalRecords: { type: integer }
 *         pageSize: { type: integer }
 *         hasNextPage: { type: boolean }
 *         hasPreviousPage: { type: boolean }
 *         data: { type: array, items: { type: object } }
 *     GlobalSearchResults:
 *       type: object
 *       properties:
 *         query: { type: string }
 *         module: { type: string }
 *         filters: { type: object }
 *         pagination: { type: object }
 *         sorting: { type: object }
 *         results:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/ModuleSearchResults'
 *         total: { type: integer }
 *         executionTime: { type: integer }
 *     SearchResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean }
 *         message: { type: string }
 *         data:
 *           $ref: '#/components/schemas/GlobalSearchResults'
 *     ModuleSearchResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean }
 *         message: { type: string }
 *         data:
 *           type: object
 *           properties:
 *             query: { type: string }
 *             module: { type: string }
 *             filters: { type: object }
 *             pagination:
 *               $ref: '#/components/schemas/SearchPagination'
 *             sorting:
 *               $ref: '#/components/schemas/SearchSorting'
 *             results: { type: array, items: { type: object } }
 *             total: { type: integer }
 *             executionTime: { type: integer }
 */

function searchRoutes() {
  const router = express.Router();

  // ─── Global Search ───────────────────────────────────────────────────

  /**
   * @swagger
   * /search:
   *   get:
   *     summary: Global search across all modules
   *     description: |
   *       Search across all supported modules (users, cms, markets, platforms, blog, contact, newsletter, careers, partners, uploads).
   *       Public searches only return active records. Admin searches (authenticated) may return all records.
   *     tags: [Search]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: q
   *         schema: { type: string }
   *         description: Search query for full-text / keyword / partial / exact matching
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *         description: Page number (1-indexed)
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 20 }
   *         description: Items per page (max 100)
   *       - in: query
   *         name: sortBy
   *         schema: { type: string, default: createdAt }
   *         description: Field to sort by (createdAt, updatedAt, title, name, etc.)
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string, enum: [asc, desc], default: desc }
   *       - in: query
   *         name: active
   *         schema: { type: string, enum: [true, false] }
   *         description: Filter by active/inactive status
   *       - in: query
   *         name: status
   *         schema: { type: string }
   *         description: Filter by status (supports comma-separated multiple values)
   *       - in: query
   *         name: category
   *         schema: { type: string }
   *       - in: query
   *         name: type
   *         schema: { type: string }
   *       - in: query
   *         name: country
   *         schema: { type: string }
   *       - in: query
   *         name: department
   *         schema: { type: string }
   *       - in: query
   *         name: partnerType
   *         schema: { type: string }
   *       - in: query
   *         name: market
   *         schema: { type: string }
   *       - in: query
   *         name: platform
   *         schema: { type: string }
   *       - in: query
   *         name: dateFrom
   *         schema: { type: string, format: date-time }
   *         description: Filter records created on or after this ISO 8601 date
   *       - in: query
   *         name: dateTo
   *         schema: { type: string, format: date-time }
   *         description: Filter records created on or before this ISO 8601 date
   *     responses:
   *       200:
   *         description: Global search results grouped by module
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SearchResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  router.get(
    '/search',
    (req, res, next) => {
      // Optional auth: public users can search, admins get more results
      if (req.headers.authorization) {
        return jwtAuth(req, res, (err) => {
          if (err) {
            // If token invalid, still proceed as public
            return next();
          }
          return next();
        });
      }
      return next();
    },
    validators.globalSearchValidator(),
    asyncWrapper(searchController.globalSearch),
  );

  // ─── Module-specific Search ─────────────────────────────────────────

  const adminOnlyModules = ['contact', 'newsletter', 'partners', 'uploads'];

  /**
   * @swagger
   * /search/{module}:
   *   get:
   *     summary: Search within a specific module
   *     description: |
   *       Search within one supported module (users, cms, markets, platforms, blog, contact, newsletter, careers, partners, uploads).
   *       Admin modules (contact, newsletter, partners, uploads) require authentication.
   *       Public modules only return active/published/open/approved records.
   *     tags: [Search]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: module
   *         required: true
   *         schema: { type: string, enum: [users, cms, markets, platforms, blog, contact, newsletter, careers, partners, uploads] }
   *         description: Module to search within
   *       - in: query
   *         name: q
   *         schema: { type: string }
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 20 }
   *       - in: query
   *         name: sortBy
   *         schema: { type: string, default: createdAt }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string, enum: [asc, desc], default: desc }
   *       - in: query
   *         name: active
   *         schema: { type: string, enum: [true, false] }
   *       - in: query
   *         name: status
   *         schema: { type: string }
   *       - in: query
   *         name: category
   *         schema: { type: string }
   *       - in: query
   *         name: type
   *         schema: { type: string }
   *       - in: query
   *         name: country
   *         schema: { type: string }
   *       - in: query
   *         name: department
   *         schema: { type: string }
   *       - in: query
   *         name: partnerType
   *         schema: { type: string }
   *       - in: query
   *         name: market
   *         schema: { type: string }
   *       - in: query
   *         name: platform
   *         schema: { type: string }
   *       - in: query
   *         name: dateFrom
   *         schema: { type: string, format: date-time }
   *       - in: query
   *         name: dateTo
   *         schema: { type: string, format: date-time }
   *     responses:
   *       200:
   *         description: Module search results
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ModuleSearchResponse'
   *       400:
   *         description: Validation error or unsupported module
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden (admin module requires admin role)
   */
  router.get(
    '/search/:module',
    (req, res, next) => {
      const { module: mod } = req.params;

      // Admin-only modules require authentication
      if (adminOnlyModules.includes(mod)) {
        return jwtAuth(req, res, (err) => {
          if (err) return next(err);
          if (req.auth && req.auth.role !== Roles.Admin) {
            const { ForbiddenError } = require('../../middleware/error/customErrors');
            return next(new ForbiddenError('Admin access required for this module'));
          }
          return next();
        });
      }

      // Optional auth for public modules
      if (req.headers.authorization) {
        return jwtAuth(req, res, (err) => {
          if (err) return next();
          return next();
        });
      }
      return next();
    },
    validators.moduleSearchValidator(),
    asyncWrapper(searchController.moduleSearch),
  );

  return router;
}

module.exports = { searchRoutes };

