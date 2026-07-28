const dashboardRepository = require('./dashboardRepository');

/**
 * Get full dashboard data: statistics + dashboard cards + recent activity
 */
async function getFullDashboard() {
  const [statistics, dashboardCards, recentActivity] = await Promise.all([
    dashboardRepository.getStatistics(),
    dashboardRepository.getDashboardCards(),
    dashboardRepository.getActivityFeed(10),
  ]);

  return {
    statistics,
    dashboardCards,
    recentActivity,
  };
}

/**
 * Get aggregated statistics from all modules
 */
async function getStatistics() {
  return dashboardRepository.getStatistics();
}

/**
 * Get recent items by type
 */
async function getRecent(type, query = {}) {
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

  switch (type) {
    case 'users':
      return dashboardRepository.getRecentUsers(limit);
    case 'blog':
      return dashboardRepository.getRecentBlogPosts(limit);
    case 'contacts':
      return dashboardRepository.getRecentContacts(limit);
    case 'applications':
      return dashboardRepository.getRecentApplications(limit);
    case 'partners':
      return dashboardRepository.getRecentPartners(limit);
    case 'uploads':
      return dashboardRepository.getRecentUploads(limit);
    default:
      // Return all recent types aggregated
      const [users, blog, contacts, applications, partners, uploads] = await Promise.all([
        dashboardRepository.getRecentUsers(5),
        dashboardRepository.getRecentBlogPosts(5),
        dashboardRepository.getRecentContacts(5),
        dashboardRepository.getRecentApplications(5),
        dashboardRepository.getRecentPartners(5),
        dashboardRepository.getRecentUploads(5),
      ]);

      return {
        users,
        blog,
        contacts,
        applications,
        partners,
        uploads,
      };
  }
}

/**
 * Get system health information
 */
async function getSystemHealth() {
  return dashboardRepository.getSystemHealth();
}

/**
 * Get aggregated activity feed
 */
async function getActivity(query = {}) {
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  return dashboardRepository.getActivityFeed(limit);
}

/**
 * Get dashboard cards (summary)
 */
async function getDashboardCards() {
  return dashboardRepository.getDashboardCards();
}

module.exports = {
  getFullDashboard,
  getStatistics,
  getRecent,
  getSystemHealth,
  getActivity,
  getDashboardCards,
};

