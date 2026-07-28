const { store } = require('../../infrastructure/store');

const JOBS = 'career_jobs';
const APPLICATIONS = 'career_applications';

function jobsCollection() {
  return store.collection(JOBS);
}
function applicationsCollection() {
  return store.collection(APPLICATIONS);
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

function safeArrayValues(v) {
  if (v === undefined || v === null) return [];
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [];
}

function jobKey(id) {
  return `id::${id}`;
}
function applicationKey(id) {
  return `id::${id}`;
}

// ─── Job Helpers ──────────────────────────────────────────────────────────────

async function getJobById(id) {
  const col = jobsCollection();
  return col.get(jobKey(id)) || null;
}

async function getJobBySlug(slug) {
  const s = normalizeSlug(slug);
  const col = jobsCollection();
  return [...col.values()].find((j) => j.slug === s) || null;
}

async function isJobSlugInUse({ slug, excludeId = null }) {
  const existing = await getJobBySlug(slug);
  if (!existing) return false;
  if (excludeId && String(existing.id) === String(excludeId)) return false;
  return true;
}

async function createJob(payload) {
  const col = jobsCollection();
  const now = new Date().toISOString();
  const id = payload.id || store.newId('job');
  const resolvedSlug = normalizeSlug(payload.slug || payload.title);

  const entity = {
    id,
    title: payload.title,
    slug: resolvedSlug,
    department: payload.department || '',
    location: payload.location || '',
    employmentType: payload.employmentType || '',
    experienceLevel: payload.experienceLevel || '',
    description: payload.description || '',
    responsibilities: safeArrayValues(payload.responsibilities),
    requirements: safeArrayValues(payload.requirements),
    qualifications: safeArrayValues(payload.qualifications),
    skills: safeArrayValues(payload.skills),
    salaryRange: payload.salaryRange || {},
    benefits: safeArrayValues(payload.benefits),
    vacancies: payload.vacancies || 1,
    applicationDeadline: payload.applicationDeadline || null,
    status: payload.status || 'draft',
    featured: Boolean(payload.featured),
    order: payload.order || 0,
    seo: payload.seo || {},
    active: payload.active === undefined ? true : Boolean(payload.active),
    createdAt: now,
    updatedAt: now,
  };

  col.set(jobKey(id), entity);
  return entity;
}

async function updateJobById(id, patch) {
  const col = jobsCollection();
  const existing = await getJobById(id);
  if (!existing) return null;

  const resolved = {
    ...existing,
    ...patch,
    id: existing.id,
    slug: patch.slug !== undefined ? normalizeSlug(patch.slug) : existing.slug,
    title: patch.title !== undefined ? patch.title : existing.title,
    responsibilities: patch.responsibilities !== undefined ? safeArrayValues(patch.responsibilities) : existing.responsibilities,
    requirements: patch.requirements !== undefined ? safeArrayValues(patch.requirements) : existing.requirements,
    qualifications: patch.qualifications !== undefined ? safeArrayValues(patch.qualifications) : existing.qualifications,
    skills: patch.skills !== undefined ? safeArrayValues(patch.skills) : existing.skills,
    benefits: patch.benefits !== undefined ? safeArrayValues(patch.benefits) : existing.benefits,
    updatedAt: new Date().toISOString(),
  };

  // If title changed but slug not provided, keep slug aligned
  if (patch.title !== undefined && patch.slug === undefined) {
    resolved.slug = normalizeSlug(patch.title);
  }

  col.set(jobKey(id), resolved);
  return resolved;
}

async function deleteJobById(id) {
  const col = jobsCollection();
  const existing = await getJobById(id);
  if (!existing) return null;
  col.delete(jobKey(id));
  return existing;
}

// ─── Job Listing ──────────────────────────────────────────────────────────────

async function listJobsPublic({
  page = 1,
  limit = 20,
  sortBy = 'order',
  sortOrder = 'asc',
  q = null,
  featured = undefined,
  department = undefined,
  location = undefined,
  employmentType = undefined,
  experienceLevel = undefined,
} = {}) {
  let items = [...jobsCollection().values()].filter((j) => j.status === 'open' && j.active === true);

  if (featured !== undefined) {
    items = items.filter((j) => Boolean(j.featured) === Boolean(featured));
  }

  if (department !== undefined && department !== null && department !== '') {
    const d = String(department).toLowerCase();
    items = items.filter((j) => (j.department || '').toLowerCase() === d);
  }

  if (location !== undefined && location !== null && location !== '') {
    const loc = String(location).toLowerCase();
    items = items.filter((j) => (j.location || '').toLowerCase().includes(loc));
  }

  if (employmentType !== undefined && employmentType !== null && employmentType !== '') {
    const e = String(employmentType).toLowerCase();
    items = items.filter((j) => (j.employmentType || '').toLowerCase() === e);
  }

  if (experienceLevel !== undefined && experienceLevel !== null && experienceLevel !== '') {
    const el = String(experienceLevel).toLowerCase();
    items = items.filter((j) => (j.experienceLevel || '').toLowerCase() === el);
  }

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((j) =>
      (j.title || '').toLowerCase().includes(qq) ||
      (j.slug || '').toLowerCase().includes(qq) ||
      (j.description || '').toLowerCase().includes(qq) ||
      (j.department || '').toLowerCase().includes(qq) ||
      (j.location || '').toLowerCase().includes(qq),
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

async function listJobsAdmin({
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  q = null,
  status = undefined,
  active = undefined,
  department = undefined,
} = {}) {
  let items = [...jobsCollection().values()];

  if (status !== undefined && status !== null && status !== '') {
    items = items.filter((j) => j.status === status);
  }

  if (active !== undefined && active !== null && active !== '') {
    items = items.filter((j) => Boolean(j.active) === Boolean(active));
  }

  if (department !== undefined && department !== null && department !== '') {
    const d = String(department).toLowerCase();
    items = items.filter((j) => (j.department || '').toLowerCase() === d);
  }

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((j) =>
      (j.title || '').toLowerCase().includes(qq) ||
      (j.slug || '').toLowerCase().includes(qq) ||
      (j.description || '').toLowerCase().includes(qq),
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

// ─── Application Helpers ──────────────────────────────────────────────────────

async function getApplicationById(id) {
  const col = applicationsCollection();
  return col.get(applicationKey(id)) || null;
}

async function getApplicationsByJobId(jobId) {
  const col = applicationsCollection();
  return [...col.values()].filter((a) => String(a.jobId) === String(jobId));
}

async function createApplication(payload) {
  const col = applicationsCollection();
  const now = new Date().toISOString();
  const id = payload.id || store.newId('app');

  const entity = {
    id,
    jobId: String(payload.jobId),
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone || '',
    country: payload.country || '',
    city: payload.city || '',
    linkedin: payload.linkedin || '',
    portfolio: payload.portfolio || '',
    coverLetter: payload.coverLetter || '',
    resume: payload.resume || {},
    status: payload.status || 'received',
    notes: payload.notes || '',
    assignedTo: payload.assignedTo || null,
    active: payload.active === undefined ? true : Boolean(payload.active),
    createdAt: now,
    updatedAt: now,
  };

  col.set(applicationKey(id), entity);
  return entity;
}

async function updateApplicationById(id, patch) {
  const col = applicationsCollection();
  const existing = await getApplicationById(id);
  if (!existing) return null;

  const resolved = {
    ...existing,
    ...patch,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  col.set(applicationKey(id), resolved);
  return resolved;
}

async function deleteApplicationById(id) {
  const col = applicationsCollection();
  const existing = await getApplicationById(id);
  if (!existing) return null;
  col.delete(applicationKey(id));
  return existing;
}

async function listApplicationsAdmin({
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  q = null,
  status = undefined,
  jobId = undefined,
} = {}) {
  let items = [...applicationsCollection().values()];

  if (status !== undefined && status !== null && status !== '') {
    items = items.filter((a) => a.status === status);
  }

  if (jobId !== undefined && jobId !== null && jobId !== '') {
    items = items.filter((a) => String(a.jobId) === String(jobId));
  }

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((a) =>
      (a.fullName || '').toLowerCase().includes(qq) ||
      (a.email || '').toLowerCase().includes(qq) ||
      (a.phone || '').toLowerCase().includes(qq),
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

module.exports = {
  normalizeSlug,
  isJobSlugInUse,

  // Jobs
  getJobById,
  getJobBySlug,
  createJob,
  updateJobById,
  deleteJobById,
  listJobsPublic,
  listJobsAdmin,

  // Applications
  getApplicationById,
  getApplicationsByJobId,
  createApplication,
  updateApplicationById,
  deleteApplicationById,
  listApplicationsAdmin,
};

