const { success } = require('../../utils/response');
const dashboardService = require('./dashboardService');

/**
 * GET /dashboard
 * Returns full dashboard: statistics + cards + recent activity
 */
async function getDashboard(req, res, next) {
  try {
    const data = await dashboardService.getFullDashboard();
    return success(res, { message: 'Dashboard data fetched', data });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /dashboard/statistics
 * Returns aggregated statistics from all modules
 */
async function getStatistics(req, res, next) {
  try {
    const data = await dashboardService.getStatistics();
    return success(res, { message: 'Statistics fetched', data });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /dashboard/recent
 * Returns recent items by type or all types
 * Query: type (users|blog|contacts|applications|partners|uploads), limit
 */
async function getRecent(req, res, next) {
  try {
    const { type, ...query } = req.query;
    const data = await dashboardService.getRecent(type, query);
    return success(res, { message: 'Recent items fetched', data });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /dashboard/system
 * Returns system health information
 */
async function getSystemHealth(req, res, next) {
  try {
    const data = await dashboardService.getSystemHealth();
    return success(res, { message: 'System health fetched', data });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /dashboard/activity
 * Returns aggregated activity feed
 */
async function getActivity(req, res, next) {
  try {
    const data = await dashboardService.getActivity(req.query);
    return success(res, { message: 'Activity feed fetched', data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getDashboard,
  getStatistics,
  getRecent,
  getSystemHealth,
  getActivity,
};

