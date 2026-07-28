const {
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require('../../middleware/error/customErrors');

const careersRepository = require('./careersRepository');

const JOB_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  CLOSED: 'closed',
};

const APPLICATION_STATUS = {
  RECEIVED: 'received',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  INTERVIEW: 'interview',
  HIRED: 'hired',
  REJECTED: 'rejected',
};

const VALID_JOB_STATUSES = Object.values(JOB_STATUS);
const VALID_APPLICATION_STATUSES = Object.values(APPLICATION_STATUS);

function normalizeBool(v, fallback = false) {
  if (v === undefined) return fallback;
  return Boolean(v);
}

function slugify(input) {
  return careersRepository.normalizeSlug(input);
}

// ─── Public: List Jobs ────────────────────────────────────────────────────────

async function publicListJobs(query = {}) {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    q,
    featured,
    department,
    location,
    employmentType,
    experienceLevel,
  } = query;

  const result = await careersRepository.listJobsPublic({
    page,
    limit,
    sortBy,
    sortOrder,
    q,
    featured: featured !== undefined ? (featured === 'true' || featured === true) : undefined,
    department,
    location,
    employmentType,
    experienceLevel,
  });

  return {
    items: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

// ─── Public: Get Job By ID ────────────────────────────────────────────────────

async function publicGetJobById(id) {
  const job = await careersRepository.getJobById(id);
  if (!job) return null;
  if (job.status !== JOB_STATUS.OPEN) return null;
  if (job.active !== true) return null;
  return job;
}

// ─── Public: Get Job By Slug ──────────────────────────────────────────────────

async function publicGetJobBySlug(slug) {
  const job = await careersRepository.getJobBySlug(slug);
  if (!job) return null;
  if (job.status !== JOB_STATUS.OPEN) return null;
  if (job.active !== true) return null;
  return job;
}

// ─── Public: Apply for Job ────────────────────────────────────────────────────

async function applyForJob(jobId, payload = {}) {
  const job = await careersRepository.getJobById(jobId);
  if (!job) throw new NotFoundError('Job not found');
  if (job.status !== JOB_STATUS.OPEN) throw new BadRequestError('Job is not accepting applications');
  if (job.active !== true) throw new BadRequestError('Job is not active');

  if (!payload.fullName) throw new BadRequestError('fullName is required');
  if (!payload.email) throw new BadRequestError('email is required');

  // Validate application deadline
  if (job.applicationDeadline) {
    const deadline = new Date(job.applicationDeadline);
    if (isNaN(deadline.getTime())) throw new BadRequestError('Invalid application deadline');
    if (new Date() > deadline) throw new BadRequestError('Application deadline has passed');
  }

  const application = await careersRepository.createApplication({
    jobId,
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone || '',
    country: payload.country || '',
    city: payload.city || '',
    linkedin: payload.linkedin || '',
    portfolio: payload.portfolio || '',
    coverLetter: payload.coverLetter || '',
    resume: payload.resume || {},
    status: APPLICATION_STATUS.RECEIVED,
  });

  return application;
}

// ─── Public: Check Application Status ─────────────────────────────────────────

async function publicGetApplicationStatus(applicationId) {
  const app = await careersRepository.getApplicationById(applicationId);
  if (!app) throw new NotFoundError('Application not found');

  return {
    id: app.id,
    jobId: app.jobId,
    fullName: app.fullName,
    email: app.email,
    status: app.status,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  };
}

// ─── Admin: Create Job ────────────────────────────────────────────────────────

async function adminCreateJob(payload = {}) {
  if (!payload.title) throw new BadRequestError('title is required');
  if (!payload.department) throw new BadRequestError('department is required');
  if (!payload.location) throw new BadRequestError('location is required');

  const status = payload.status || JOB_STATUS.DRAFT;
  if (!VALID_JOB_STATUSES.includes(status)) throw new BadRequestError('Invalid status');

  const resolvedSlug = slugify(payload.slug || payload.title);
  if (await careersRepository.isJobSlugInUse({ slug: resolvedSlug })) {
    throw new ConflictError('Slug already in use');
  }

  const created = await careersRepository.createJob({
    ...payload,
    title: payload.title,
    slug: resolvedSlug,
    status,
    featured: normalizeBool(payload.featured, false),
    active: payload.active === undefined ? true : normalizeBool(payload.active, true),
    order: payload.order || 0,
    vacancies: payload.vacancies || 1,
    salaryRange: payload.salaryRange || {},
    seo: payload.seo || {},
  });

  return created;
}

// ─── Admin: Update Job (PUT/PATCH) ────────────────────────────────────────────

async function adminUpdateJob(id, payload = {}, { mode } = {}) {
  const existing = await careersRepository.getJobById(id);
  if (!existing) throw new NotFoundError('Job not found');

  const status = payload.status !== undefined ? payload.status : existing.status;
  if (!VALID_JOB_STATUSES.includes(status)) throw new BadRequestError('Invalid status');

  // Slug resolution
  const nextTitle = payload.title !== undefined ? payload.title : existing.title;
  const nextSlug = payload.slug !== undefined ? slugify(payload.slug) : existing.slug;
  const derivedSlug = payload.slug === undefined && payload.title !== undefined ? slugify(nextTitle) : nextSlug;

  if (payload.slug !== undefined || payload.title !== undefined) {
    if (await careersRepository.isJobSlugInUse({ slug: derivedSlug, excludeId: id })) {
      throw new ConflictError('Slug already in use');
    }
  }

  if (mode === 'put') {
    if (payload.title === undefined) throw new BadRequestError('title is required');
    if (payload.department === undefined) throw new BadRequestError('department is required');
    if (payload.location === undefined) throw new BadRequestError('location is required');
    if (payload.description === undefined) throw new BadRequestError('description is required');
  }

  const patch = {};
  if (payload.title !== undefined) patch.title = payload.title;
  if (payload.department !== undefined) patch.department = payload.department;
  if (payload.location !== undefined) patch.location = payload.location;
  if (payload.employmentType !== undefined) patch.employmentType = payload.employmentType;
  if (payload.experienceLevel !== undefined) patch.experienceLevel = payload.experienceLevel;
  if (payload.description !== undefined) patch.description = payload.description;
  if (payload.responsibilities !== undefined) patch.responsibilities = payload.responsibilities;
  if (payload.requirements !== undefined) patch.requirements = payload.requirements;
  if (payload.qualifications !== undefined) patch.qualifications = payload.qualifications;
  if (payload.skills !== undefined) patch.skills = payload.skills;
  if (payload.salaryRange !== undefined) patch.salaryRange = payload.salaryRange;
  if (payload.benefits !== undefined) patch.benefits = payload.benefits;
  if (payload.vacancies !== undefined) patch.vacancies = payload.vacancies;
  if (payload.applicationDeadline !== undefined) patch.applicationDeadline = payload.applicationDeadline;
  if (payload.featured !== undefined) patch.featured = normalizeBool(payload.featured, false);
  if (payload.order !== undefined) patch.order = payload.order;
  if (payload.seo !== undefined) patch.seo = payload.seo;
  if (payload.active !== undefined) patch.active = normalizeBool(payload.active, true);
  if (payload.status !== undefined) patch.status = status;

  // Handle slug alignment
  if (payload.slug !== undefined) patch.slug = derivedSlug;
  if (payload.slug === undefined && payload.title !== undefined) patch.slug = derivedSlug;

  const updated = await careersRepository.updateJobById(id, patch);
  if (!updated) throw new NotFoundError('Job not found');
  return updated;
}

async function adminPatchJob(id, payload) {
  return adminUpdateJob(id, payload, { mode: 'patch' });
}

async function adminPutJob(id, payload) {
  return adminUpdateJob(id, payload, { mode: 'put' });
}

// ─── Admin: Delete Job ────────────────────────────────────────────────────────

async function adminDeleteJob(id) {
  const removed = await careersRepository.deleteJobById(id);
  if (!removed) throw new NotFoundError('Job not found');
  return removed;
}

// ─── Admin: List Jobs ─────────────────────────────────────────────────────────

async function adminListJobs(query = {}) {
  const result = await careersRepository.listJobsAdmin(query);
  return {
    items: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

// ─── Admin: List Applications ─────────────────────────────────────────────────

async function adminListApplications(query = {}) {
  const result = await careersRepository.listApplicationsAdmin(query);
  return {
    items: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

// ─── Admin: Get Application By ID ─────────────────────────────────────────────

async function adminGetApplicationById(id) {
  const app = await careersRepository.getApplicationById(id);
  if (!app) throw new NotFoundError('Application not found');
  return app;
}

// ─── Admin: Update Application Status ─────────────────────────────────────────

async function adminUpdateApplicationStatus(id, status) {
  if (!status) throw new BadRequestError('status is required');
  if (!VALID_APPLICATION_STATUSES.includes(status)) {
    throw new BadRequestError(`Invalid status. Must be one of: ${VALID_APPLICATION_STATUSES.join(', ')}`);
  }

  const existing = await careersRepository.getApplicationById(id);
  if (!existing) throw new NotFoundError('Application not found');

  const updated = await careersRepository.updateApplicationById(id, { status });
  return updated;
}

// ─── Admin: Assign Application ────────────────────────────────────────────────

async function adminAssignApplication(id, assignedTo) {
  if (!assignedTo) throw new BadRequestError('assignedTo is required');

  const existing = await careersRepository.getApplicationById(id);
  if (!existing) throw new NotFoundError('Application not found');

  const updated = await careersRepository.updateApplicationById(id, { assignedTo });
  return updated;
}

// ─── Admin: Update Application Notes ──────────────────────────────────────────

async function adminUpdateApplicationNotes(id, notes) {
  if (notes === undefined) throw new BadRequestError('notes is required');

  const existing = await careersRepository.getApplicationById(id);
  if (!existing) throw new NotFoundError('Application not found');

  const updated = await careersRepository.updateApplicationById(id, { notes });
  return updated;
}

// ─── Admin: Delete Application ────────────────────────────────────────────────

async function adminDeleteApplication(id) {
  const removed = await careersRepository.deleteApplicationById(id);
  if (!removed) throw new NotFoundError('Application not found');
  return removed;
}

module.exports = {
  // public
  publicListJobs,
  publicGetJobById,
  publicGetJobBySlug,
  applyForJob,
  publicGetApplicationStatus,

  // admin jobs
  adminCreateJob,
  adminPutJob,
  adminPatchJob,
  adminDeleteJob,
  adminListJobs,

  // admin applications
  adminListApplications,
  adminGetApplicationById,
  adminUpdateApplicationStatus,
  adminAssignApplication,
  adminUpdateApplicationNotes,
  adminDeleteApplication,

  JOB_STATUS,
  APPLICATION_STATUS,
};

