const express = require('express');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const { requireRoles } = require('../../middleware/rbac/requireRoles');
const { requirePermission } = require('../../middleware/rbac/requirePermission');

const { Roles } = require('../../constants/roles');

const { dashboardController, validators } = require('../../modules/dashboard');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     DashboardStatistics:
 *       type: object
 *       properties:
 *         users:
 *           type: object
 *           properties:
 *             total: { type: integer }
 *             active: { type: integer }
 *             blocked: { type: integer }
 *         blog:
 *           type: object
 *           properties:
 *             total: { type: integer }
 *             published: { type: integer }
 *             draft: { type: integer }
 *         cms:
 *           type: object
 *           properties:
 *             totalSections: { type: integer }
 *         markets:
 *           type: object
 *           properties:
 *             total: { type: integer }
 *         platforms:
 *           type: object
 *           properties:
 *             total: { type: integer }
 *         contact:
 *           type: object
 *           properties:
 *             total: { type: integer }
 *             new: { type: integer }
 *             replied: { type: integer }
 *             closed: { type: integer }
 *         newsletter:
 *           type: object
 *           properties:
 *             total: { type: integer }
 *             active: { type: integer }
 *             unsubscribed: { type: integer }
 *         careers:
 *           type: object
 *           properties:
 *             totalJobs: { type: integer }
 *             activeJobs: { type: integer }
 *             closedJobs: { type: integer }
 *             totalApplications: { type: integer }
 *         partners:
 *           type: object
 *           properties:
 *             total: { type: integer }
 *             pending: { type: integer }
 *             approved: { type: integer }
 *             rejected: { type: integer }
 *         referrals:
 *           type: object
 *           properties:
 *             total: { type: integer }
 *         uploads:
 *           type: object
 *           properties:
 *             total: { type: integer }
 *             images: { type: integer }
 *             documents: { type: integer }
 *     SystemHealth:
 *       type: object
 *       properties:
 *         status: { type: string }
 *         apiStatus: { type: string }
 *         serverStatus: { type: string }
 *         uptime: { type: integer }
 *         uptimeFormatted: { type: string }
 *         totalModules: { type: integer }
 *         modules: { type: array, items: { type: string } }
 *         registeredRoutes: { type: array, items: { type: string } }
 *         totalRoutes: { type: integer }
 *         version: { type: string }
 *         environment: { type: string }
 *         nodeVersion: { type: string }
 *         platform: { type: string }
 *         memoryUsage: { type: object }
 *         startedAt: { type: string }
 *     DashboardCard:
 *       type: object
 *       properties:
 *         growthSummary: { type: object }
 *         pendingTasks: { type: object }
 *         activeModules: { type: object }
 *         systemHealth: { type: object }
 *         totalRecords: { type: integer }
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean }
 *         message: { type: string }
 *         data:
 *           type: object
 *           properties:
 *             statistics:
 *               $ref: '#/components/schemas/DashboardStatistics'
 *             dashboardCards:
 *               $ref: '#/components/schemas/DashboardCard'
 *             recentActivity: { type: array, items: { type: object } }
 */

function dashboardRoutes() {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/dashboard:
   *   get:
   *     summary: Get full dashboard data
   *     description: Returns aggregated statistics, dashboard cards, and recent activity. Admin only.
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 10 }
   *         description: Limit for recent activity items
   *     responses:
   *       200:
   *         description: Dashboard data fetched
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DashboardResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.get(
    '/',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('dashboard:read'),
    validators.dashboardQueryValidator(),
    asyncWrapper(dashboardController.getDashboard),
  );

  /**
   * @swagger
   * /api/v1/dashboard/statistics:
   *   get:
   *     summary: Get aggregated statistics from all modules
   *     description: Returns counts for users, blog, CMS, markets, platforms, contact, newsletter, careers, partners, uploads. Admin only.
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Statistics fetched
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean }
   *                 message: { type: string }
   *                 data:
   *                   $ref: '#/components/schemas/DashboardStatistics'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.get(
    '/statistics',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('dashboard:read'),
    asyncWrapper(dashboardController.getStatistics),
  );

  /**
   * @swagger
   * /api/v1/dashboard/recent:
   *   get:
   *     summary: Get recent items by type
   *     description: Returns recent items filtered by type (users, blog, contacts, applications, partners, uploads) or all types if not specified. Admin only.
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: type
   *         schema: { type: string, enum: [users, blog, contacts, applications, partners, uploads] }
   *         description: Type of recent items to fetch
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 10 }
   *         description: Number of items to return
   *     responses:
   *       200:
   *         description: Recent items fetched
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.get(
    '/recent',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('dashboard:read'),
    validators.recentQueryValidator(),
    asyncWrapper(dashboardController.getRecent),
  );

  /**
   * @swagger
   * /api/v1/dashboard/system:
   *   get:
   *     summary: Get system health information
   *     description: Returns API status, server status, uptime, modules, routes, version, environment, memory usage. Admin only.
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: System health fetched
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean }
   *                 message: { type: string }
   *                 data:
   *                   $ref: '#/components/schemas/SystemHealth'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.get(
    '/system',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('dashboard:read'),
    asyncWrapper(dashboardController.getSystemHealth),
  );

  /**
   * @swagger
   * /api/v1/dashboard/activity:
   *   get:
   *     summary: Get aggregated activity feed
   *     description: Returns a sorted feed of recent activities across users, blog, contacts, applications, partners, and uploads. Admin only.
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 20 }
   *         description: Number of activity items to return (max 100)
   *     responses:
   *       200:
   *         description: Activity feed fetched
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.get(
    '/activity',
    jwtAuth,
    requireRoles(Roles.Admin),
    requirePermission('dashboard:read'),
    validators.activityQueryValidator(),
    asyncWrapper(dashboardController.getActivity),
  );

  return router;
}

module.exports = { dashboardRoutes };

