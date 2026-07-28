const { success } = require('../../utils/response');
const careersService = require('./careersService');

// ─── Public: List Jobs ────────────────────────────────────────────────────────

async function getJobs(req, res, next) {
  try {
    const data = await careersService.publicListJobs(req.query);
    return success(res, { message: 'Jobs fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Public: Get Job By ID ────────────────────────────────────────────────────

async function getJobById(req, res, next) {
  try {
    const data = await careersService.publicGetJobById(req.params.id);
    return success(res, { message: 'Job fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Public: Get Job By Slug ──────────────────────────────────────────────────

async function getJobBySlug(req, res, next) {
  try {
    const data = await careersService.publicGetJobBySlug(req.params.slug);
    return success(res, { message: 'Job fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Public: Apply for Job ────────────────────────────────────────────────────

async function applyForJob(req, res, next) {
  try {
    const data = await careersService.applyForJob(req.params.id, req.body);
    return success(res, { status: 201, message: 'Application submitted', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Public: Check Application Status ─────────────────────────────────────────

async function getApplicationStatus(req, res, next) {
  try {
    const data = await careersService.publicGetApplicationStatus(req.params.applicationId);
    return success(res, { message: 'Application status fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: List All Jobs ─────────────────────────────────────────────────────

async function adminListJobs(req, res, next) {
  try {
    const data = await careersService.adminListJobs(req.query);
    return success(res, { message: 'Admin jobs fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Create Job ────────────────────────────────────────────────────────

async function createJob(req, res, next) {
  try {
    const data = await careersService.adminCreateJob(req.body);
    return success(res, { status: 201, message: 'Job created', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Update Job (PUT) ──────────────────────────────────────────────────

async function putJob(req, res, next) {
  try {
    const data = await careersService.adminPutJob(req.params.id, req.body);
    return success(res, { message: 'Job updated', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Update Job (PATCH) ────────────────────────────────────────────────

async function patchJob(req, res, next) {
  try {
    const data = await careersService.adminPatchJob(req.params.id, req.body);
    return success(res, { message: 'Job patched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Delete Job ────────────────────────────────────────────────────────

async function deleteJob(req, res, next) {
  try {
    const data = await careersService.adminDeleteJob(req.params.id);
    return success(res, { message: 'Job deleted', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: List Applications ─────────────────────────────────────────────────

async function adminListApplications(req, res, next) {
  try {
    const data = await careersService.adminListApplications(req.query);
    return success(res, { message: 'Applications fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Get Application By ID ─────────────────────────────────────────────

async function adminGetApplicationById(req, res, next) {
  try {
    const data = await careersService.adminGetApplicationById(req.params.id);
    return success(res, { message: 'Application fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Update Application Status ─────────────────────────────────────────

async function adminUpdateApplicationStatus(req, res, next) {
  try {
    const data = await careersService.adminUpdateApplicationStatus(req.params.id, req.body.status);
    return success(res, { message: 'Application status updated', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Assign Application ────────────────────────────────────────────────

async function adminAssignApplication(req, res, next) {
  try {
    const data = await careersService.adminAssignApplication(req.params.id, req.body.assignedTo);
    return success(res, { message: 'Application assigned', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Update Application Notes ──────────────────────────────────────────

async function adminUpdateApplicationNotes(req, res, next) {
  try {
    const data = await careersService.adminUpdateApplicationNotes(req.params.id, req.body.notes);
    return success(res, { message: 'Application notes updated', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Delete Application ────────────────────────────────────────────────

async function adminDeleteApplication(req, res, next) {
  try {
    const data = await careersService.adminDeleteApplication(req.params.id);
    return success(res, { message: 'Application deleted', data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  // public
  getJobs,
  getJobById,
  getJobBySlug,
  applyForJob,
  getApplicationStatus,

  // admin jobs
  adminListJobs,
  createJob,
  putJob,
  patchJob,
  deleteJob,

  // admin applications
  adminListApplications,
  adminGetApplicationById,
  adminUpdateApplicationStatus,
  adminAssignApplication,
  adminUpdateApplicationNotes,
  adminDeleteApplication,
};

