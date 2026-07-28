const { store } = require('../../infrastructure/store');

// ─── Collection Names ─────────────────────────────────────────────────────

const USERS = 'users';
const BLOGS = 'blog_posts';
const CMS = 'cms';
const MARKETS = 'markets';
const PLATFORMS = 'platforms';
const CONTACTS = 'contacts';
const NEWSLETTERS = 'newsletters';
const CAREER_JOBS = 'career_jobs';
const CAREER_APPLICATIONS = 'career_applications';
const PARTNERS = 'partners';
const PARTNER_REFERRALS = 'partner_referrals';
const UPLOADS = 'uploads';

// ─── Helpers ──────────────────────────────────────────────────────────────

function col(name) {
  const c = store.collection(name);
  return [...c.values()];
}

function nowIso() {
  return new Date().toISOString();
}

// ─── Statistics ───────────────────────────────────────────────────────────

async function getStatistics() {
  // Users
  const allUsers = col(USERS);
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter((u) => !u.deletedAt && u.blocked !== true).length;
  const blockedUsers = allUsers.filter((u) => u.blocked === true && !u.deletedAt).length;

  // Blog Posts
  const allBlogs = col(BLOGS);
  const totalBlogs = allBlogs.filter((b) => !b.deletedAt).length;
  const publishedPosts = allBlogs.filter((b) => b.status === 'published' && !b.deletedAt).length;
  const draftPosts = allBlogs.filter((b) => b.status === 'draft' && !b.deletedAt).length;

  // CMS Sections
  const allCms = col(CMS);
  const totalCmsSections = allCms.length;

  // Markets
  const allMarkets = col(MARKETS);
  const totalMarkets = allMarkets.filter((m) => !m.deletedAt).length;

  // Trading Platforms
  const allPlatforms = col(PLATFORMS);
  const totalPlatforms = allPlatforms.filter((p) => !p.deletedAt).length;

  // Contact Requests
  const allContacts = col(CONTACTS);
  const totalContacts = allContacts.filter((c) => !c.deletedAt).length;
  const newRequests = allContacts.filter((c) => c.status === 'new' && !c.deletedAt).length;
  const repliedRequests = allContacts.filter((c) => c.status === 'replied' && !c.deletedAt).length;
  const closedRequests = allContacts.filter((c) => c.status === 'closed' && !c.deletedAt).length;

  // Newsletter Subscribers
  const allNewsletters = col(NEWSLETTERS);
  const totalSubscribers = allNewsletters.filter((n) => !n.deletedAt).length;
  const activeSubscribers = allNewsletters.filter(
    (n) => n.status === 'subscribed' && !n.deletedAt,
  ).length;
  const unsubscribedUsers = allNewsletters.filter(
    (n) => n.status === 'unsubscribed' && !n.deletedAt,
  ).length;

  // Careers - Jobs
  const allJobs = col(CAREER_JOBS);
  const totalJobs = allJobs.filter((j) => !j.deletedAt).length;
  const activeJobs = allJobs.filter((j) => j.status === 'open' && j.active === true && !j.deletedAt).length;
  const closedJobs = allJobs.filter((j) => j.status === 'closed' && !j.deletedAt).length;

  // Careers - Applications
  const allApplications = col(CAREER_APPLICATIONS);
  const totalApplications = allApplications.filter((a) => !a.deletedAt).length;

  // Partners
  const allPartners = col(PARTNERS);
  const totalPartners = allPartners.filter((p) => !p.deletedAt).length;
  const pendingPartners = allPartners.filter((p) => p.status === 'pending' && !p.deletedAt).length;
  const approvedPartners = allPartners.filter((p) => p.status === 'approved' && !p.deletedAt).length;
  const rejectedPartners = allPartners.filter((p) => p.status === 'rejected' && !p.deletedAt).length;

  // Partner Referrals
  const allReferrals = col(PARTNER_REFERRALS);
  const totalReferrals = allReferrals.filter((r) => !r.deletedAt).length;

  // Uploads
  const allUploads = col(UPLOADS);
  const totalUploadedFiles = allUploads.filter((u) => !u.deletedAt).length;
  const imageMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
  ];
  const documentMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const totalImages = allUploads.filter(
    (u) => imageMimes.includes(u.mimeType) && !u.deletedAt,
  ).length;
  const totalDocuments = allUploads.filter(
    (u) => documentMimes.includes(u.mimeType) && !u.deletedAt,
  ).length;

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      blocked: blockedUsers,
    },
    blog: {
      total: totalBlogs,
      published: publishedPosts,
      draft: draftPosts,
    },
    cms: {
      totalSections: totalCmsSections,
    },
    markets: {
      total: totalMarkets,
    },
    platforms: {
      total: totalPlatforms,
    },
    contact: {
      total: totalContacts,
      new: newRequests,
      replied: repliedRequests,
      closed: closedRequests,
    },
    newsletter: {
      total: totalSubscribers,
      active: activeSubscribers,
      unsubscribed: unsubscribedUsers,
    },
    careers: {
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
    },
    partners: {
      total: totalPartners,
      pending: pendingPartners,
      approved: approvedPartners,
      rejected: rejectedPartners,
    },
    referrals: {
      total: totalReferrals,
    },
    uploads: {
      total: totalUploadedFiles,
      images: totalImages,
      documents: totalDocuments,
    },
  };
}

// ─── Recent Activity ──────────────────────────────────────────────────────

async function getRecentUsers(limit = 5) {
  const items = col(USERS)
    .filter((u) => !u.deletedAt)
    .sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    })
    .slice(0, limit);

  return items.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    firstName: u.profile?.firstName || '',
    lastName: u.profile?.lastName || '',
    blocked: u.blocked,
    avatar: u.profile?.avatar || null,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));
}

async function getRecentBlogPosts(limit = 5) {
  return col(BLOGS)
    .filter((b) => !b.deletedAt)
    .sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    })
    .slice(0, limit)
    .map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      status: b.status,
      featured: b.featured,
      author: b.author,
      publishedAt: b.publishedAt,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));
}

async function getRecentContacts(limit = 5) {
  return col(CONTACTS)
    .filter((c) => !c.deletedAt)
    .sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    })
    .slice(0, limit)
    .map((c) => ({
      id: c.id,
      fullName: c.fullName,
      email: c.email,
      subject: c.subject,
      status: c.status,
      department: c.department,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
}

async function getRecentApplications(limit = 5) {
  return col(CAREER_APPLICATIONS)
    .filter((a) => !a.deletedAt)
    .sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    })
    .slice(0, limit)
    .map((a) => ({
      id: a.id,
      jobId: a.jobId,
      fullName: a.fullName,
      email: a.email,
      status: a.status,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
}

async function getRecentPartners(limit = 5) {
  return col(PARTNERS)
    .filter((p) => !p.deletedAt)
    .sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    })
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      fullName: p.fullName,
      companyName: p.companyName,
      email: p.email,
      partnerType: p.partnerType,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
}

async function getRecentUploads(limit = 5) {
  return col(UPLOADS)
    .filter((u) => !u.deletedAt)
    .sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    })
    .slice(0, limit)
    .map((u) => ({
      id: u.id,
      originalName: u.originalName,
      fileName: u.fileName,
      mimeType: u.mimeType,
      category: u.category,
      fileSize: u.fileSize,
      publicUrl: u.publicUrl,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
}

// ─── System Health ────────────────────────────────────────────────────────

async function getSystemHealth() {
  const modules = [
    'Auth',
    'Users',
    'CMS',
    'Markets',
    'Trading Platforms',
    'Blog',
    'Contact',
    'Newsletter',
    'Careers',
    'Partners',
    'Uploads',
  ];

  const routes = [
    'GET /health',
    'GET /api/v1/docs',
    'GET /api/v1/docs.json',
    'POST /api/v1/auth/register',
    'POST /api/v1/auth/login',
    'POST /api/v1/auth/logout',
    'POST /api/v1/auth/refresh',
    'POST /api/v1/auth/forgot-password',
    'POST /api/v1/auth/reset-password',
    'GET /api/v1/auth/me',
    'GET /api/v1/users',
    'GET /api/v1/users/:id',
    'PUT /api/v1/users/:id',
    'DELETE /api/v1/users/:id',
    'POST /api/v1/users/:id/block',
    'POST /api/v1/users/:id/unblock',
    'PATCH /api/v1/users/:id/role',
    'POST /api/v1/users/:id/restore',
    'GET /api/v1/cms/:section',
    'POST /api/v1/cms/:section',
    'PUT /api/v1/cms/:section/:id',
    'PATCH /api/v1/cms/:section/:id',
    'DELETE /api/v1/cms/:section',
    'GET /api/v1/markets',
    'POST /api/v1/markets',
    'PUT /api/v1/markets/:id',
    'PATCH /api/v1/markets/:id',
    'DELETE /api/v1/markets/:id',
    'GET /api/v1/platforms',
    'POST /api/v1/platforms',
    'PUT /api/v1/platforms/:id',
    'PATCH /api/v1/platforms/:id',
    'DELETE /api/v1/platforms/:id',
    'GET /api/v1/blog',
    'POST /api/v1/blog',
    'PUT /api/v1/blog/:id',
    'DELETE /api/v1/blog/:id',
    'POST /api/v1/contact',
    'GET /api/v1/newsletter',
    'POST /api/v1/newsletter/subscribe',
    'POST /api/v1/newsletter/unsubscribe',
    'GET /api/v1/careers',
    'POST /api/v1/careers',
    'POST /api/v1/careers/:jobId/apply',
    'GET /api/v1/partners',
    'POST /api/v1/partners/register',
    'POST /api/v1/partners/refer',
    'GET /api/v1/uploads',
    'POST /api/v1/uploads',
    'GET /api/v1/search',
    'GET /api/v1/dashboard',
    'GET /api/v1/dashboard/statistics',
    'GET /api/v1/dashboard/recent',
    'GET /api/v1/dashboard/system',
    'GET /api/v1/dashboard/activity',
  ];

  const startTime = global.__appStartTime || new Date().toISOString();
  const uptime = Math.floor(process.uptime());

  return {
    status: 'healthy',
    apiStatus: 'operational',
    serverStatus: 'running',
    uptime,
    uptimeFormatted: formatUptime(uptime),
    totalModules: modules.length,
    modules,
    registeredRoutes: routes,
    totalRoutes: routes.length,
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage(),
    startedAt: startTime,
  };
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

// ─── Aggregated Activity Feed ─────────────────────────────────────────────

async function getActivityFeed(limit = 20) {
  const activities = [];

  // Recent users (new registrations)
  const recentUsers = await getRecentUsers(limit);
  recentUsers.forEach((u) => {
    activities.push({
      type: 'user',
      action: 'registered',
      entityId: u.id,
      label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      email: u.email,
      timestamp: u.createdAt,
    });
  });

  // Recent blog posts
  const recentBlogs = await getRecentBlogPosts(limit);
  recentBlogs.forEach((b) => {
    activities.push({
      type: 'blog',
      action: b.status === 'published' ? 'published' : 'created',
      entityId: b.id,
      label: b.title,
      slug: b.slug,
      status: b.status,
      timestamp: b.createdAt,
    });
  });

  // Recent contacts
  const recentContacts = await getRecentContacts(limit);
  recentContacts.forEach((c) => {
    activities.push({
      type: 'contact',
      action: 'submitted',
      entityId: c.id,
      label: c.subject || 'No Subject',
      email: c.email,
      name: c.fullName,
      status: c.status,
      timestamp: c.createdAt,
    });
  });

  // Recent applications
  const recentApplications = await getRecentApplications(limit);
  recentApplications.forEach((a) => {
    activities.push({
      type: 'application',
      action: 'submitted',
      entityId: a.id,
      label: a.fullName,
      email: a.email,
      jobId: a.jobId,
      status: a.status,
      timestamp: a.createdAt,
    });
  });

  // Recent partners
  const recentPartners = await getRecentPartners(limit);
  recentPartners.forEach((p) => {
    activities.push({
      type: 'partner',
      action: 'registered',
      entityId: p.id,
      label: `${p.fullName}${p.companyName ? ` (${p.companyName})` : ''}`,
      email: p.email,
      partnerType: p.partnerType,
      status: p.status,
      timestamp: p.createdAt,
    });
  });

  // Recent uploads
  const recentUploads = await getRecentUploads(limit);
  recentUploads.forEach((u) => {
    activities.push({
      type: 'upload',
      action: 'uploaded',
      entityId: u.id,
      label: u.originalName,
      category: u.category,
      mimeType: u.mimeType,
      fileSize: u.fileSize,
      timestamp: u.createdAt,
    });
  });

  // Sort all activities by timestamp descending
  activities.sort((a, b) => {
    if (a.timestamp > b.timestamp) return -1;
    if (a.timestamp < b.timestamp) return 1;
    return 0;
  });

  return activities.slice(0, limit);
}

// ─── Dashboard Cards / Summary ───────────────────────────────────────────

async function getDashboardCards() {
  const stats = await getStatistics();

  // Compute totals
  const totalRecords =
    stats.users.total +
    stats.blog.total +
    stats.cms.totalSections +
    stats.markets.total +
    stats.platforms.total +
    stats.contact.total +
    stats.newsletter.total +
    stats.careers.totalJobs +
    stats.partners.total +
    stats.uploads.total;

  // Pending tasks
  const pendingTasks = {
    pendingPartners: stats.partners.pending,
    unreadContacts: stats.contact.new,
    draftPosts: stats.blog.draft,
    unsubscribedUsers: stats.newsletter.unsubscribed,
  };

  // Active modules (modules with data)
  const moduleActivity = [
    { name: 'Users', active: stats.users.total > 0, total: stats.users.total },
    { name: 'Blog', active: stats.blog.total > 0, total: stats.blog.total },
    { name: 'CMS', active: stats.cms.totalSections > 0, total: stats.cms.totalSections },
    { name: 'Markets', active: stats.markets.total > 0, total: stats.markets.total },
    { name: 'Platforms', active: stats.platforms.total > 0, total: stats.platforms.total },
    { name: 'Contact', active: stats.contact.total > 0, total: stats.contact.total },
    { name: 'Newsletter', active: stats.newsletter.total > 0, total: stats.newsletter.total },
    { name: 'Careers', active: stats.careers.totalJobs > 0, total: stats.careers.totalJobs },
    { name: 'Partners', active: stats.partners.total > 0, total: stats.partners.total },
    { name: 'Uploads', active: stats.uploads.total > 0, total: stats.uploads.total },
  ];

  const activeModules = moduleActivity.filter((m) => m.active).length;

  // Growth summary (simple: active counts vs blocked/unsubscribed)
  const growthSummary = {
    totalUsers: stats.users.total,
    activeUsers: stats.users.active,
    blockedUsers: stats.users.blocked,
    publishedPosts: stats.blog.published,
    activeSubscribers: stats.newsletter.active,
    totalApplications: stats.careers.totalApplications,
    approvedPartners: stats.partners.approved,
  };

  return {
    growthSummary,
    pendingTasks,
    activeModules: {
      count: activeModules,
      total: moduleActivity.length,
      modules: moduleActivity,
    },
    systemHealth: {
      status: 'healthy',
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
    totalRecords,
  };
}

module.exports = {
  getStatistics,
  getRecentUsers,
  getRecentBlogPosts,
  getRecentContacts,
  getRecentApplications,
  getRecentPartners,
  getRecentUploads,
  getSystemHealth,
  getActivityFeed,
  getDashboardCards,
};

