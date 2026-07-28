const { body, param, query } = require('express-validator');

const idParam = () => param('id').isString().notEmpty();
const slugParam = () => param('slug').isString().notEmpty();
const applicationIdParam = () => param('applicationId').isString().notEmpty();

const jobStatusEnum = ['draft', 'open', 'closed'];
const applicationStatusEnum = ['received', 'reviewing', 'shortlisted', 'interview', 'hired', 'rejected'];
const employmentTypeEnum = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary'];
const experienceLevelEnum = ['Entry', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director', 'Executive'];

// ─── Job Body Base (optional fields for PATCH) ────────────────────────────────

const jobBodyBase = () => [
  body('title').optional().isString().notEmpty(),
  body('slug').optional().isString().notEmpty(),
  body('department').optional().isString().notEmpty(),
  body('location').optional().isString().notEmpty(),
  body('employmentType').optional().isIn(employmentTypeEnum),
  body('experienceLevel').optional().isIn(experienceLevelEnum),
  body('description').optional().isString(),
  body('responsibilities').optional().isArray(),
  body('responsibilities.*').optional().isString(),
  body('requirements').optional().isArray(),
  body('requirements.*').optional().isString(),
  body('qualifications').optional().isArray(),
  body('qualifications.*').optional().isString(),
  body('skills').optional().isArray(),
  body('skills.*').optional().isString(),
  body('salaryRange').optional().isObject(),
  body('salaryRange.min').optional().isNumeric(),
  body('salaryRange.max').optional().isNumeric(),
  body('salaryRange.currency').optional().isString(),
  body('salaryRange.period').optional().isString(),
  body('benefits').optional().isArray(),
  body('benefits.*').optional().isString(),
  body('vacancies').optional().isInt({ min: 1 }),
  body('applicationDeadline').optional().isISO8601(),
  body('status').optional().isIn(jobStatusEnum),
  body('featured').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }),
  body('seo').optional().isObject(),
  body('active').optional().isBoolean(),
];

// ─── Job Create Body (required fields) ────────────────────────────────────────

const jobCreateBody = () => [
  body('title').isString().notEmpty().withMessage('title is required'),
  body('slug').optional().isString().notEmpty(),
  body('department').isString().notEmpty().withMessage('department is required'),
  body('location').isString().notEmpty().withMessage('location is required'),
  body('employmentType').optional().isIn(employmentTypeEnum),
  body('experienceLevel').optional().isIn(experienceLevelEnum),
  body('description').optional().isString(),
  body('responsibilities').optional().isArray(),
  body('responsibilities.*').optional().isString(),
  body('requirements').optional().isArray(),
  body('requirements.*').optional().isString(),
  body('qualifications').optional().isArray(),
  body('qualifications.*').optional().isString(),
  body('skills').optional().isArray(),
  body('skills.*').optional().isString(),
  body('salaryRange').optional().isObject(),
  body('salaryRange.min').optional().isNumeric(),
  body('salaryRange.max').optional().isNumeric(),
  body('salaryRange.currency').optional().isString(),
  body('salaryRange.period').optional().isString(),
  body('benefits').optional().isArray(),
  body('benefits.*').optional().isString(),
  body('vacancies').optional().isInt({ min: 1 }),
  body('applicationDeadline').optional().isISO8601(),
  body('status').optional().isIn(jobStatusEnum),
  body('featured').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }),
  body('seo').optional().isObject(),
  body('active').optional().isBoolean(),
];

// ─── Job PUT Body (all required) ──────────────────────────────────────────────

const jobPutBody = () => [
  ...jobCreateBody(),
  body('description').exists().withMessage('description is required').isString(),
  body('employmentType').exists().withMessage('employmentType is required').isIn(employmentTypeEnum),
  body('experienceLevel').exists().withMessage('experienceLevel is required').isIn(experienceLevelEnum),
  body('vacancies').exists().withMessage('vacancies is required').isInt({ min: 1 }),
];

// ─── Job PATCH Body ───────────────────────────────────────────────────────────

const jobPatchBody = () => jobBodyBase();

// ─── Apply Body ───────────────────────────────────────────────────────────────

const applyBody = () => [
  body('fullName').isString().notEmpty().withMessage('fullName is required'),
  body('email').isEmail().withMessage('valid email is required'),
  body('phone').optional().isString(),
  body('country').optional().isString(),
  body('city').optional().isString(),
  body('linkedin').optional().isURL(),
  body('portfolio').optional().isURL(),
  body('coverLetter').optional().isString(),
  body('resume').optional().isObject(),
  body('resume.fileName').optional().isString(),
  body('resume.originalName').optional().isString(),
  body('resume.mimeType').optional().isString(),
  body('resume.size').optional().isNumeric(),
  body('resume.uploadedAt').optional().isISO8601(),
];

// ─── Application Status Body ──────────────────────────────────────────────────

const applicationStatusBody = () => [
  body('status').isString().notEmpty().isIn(applicationStatusEnum).withMessage(`status must be one of: ${applicationStatusEnum.join(', ')}`),
];

// ─── Application Assign Body ──────────────────────────────────────────────────

const applicationAssignBody = () => [
  body('assignedTo').isString().notEmpty().withMessage('assignedTo is required'),
];

// ─── Application Notes Body ───────────────────────────────────────────────────

const applicationNotesBody = () => [
  body('notes').isString().withMessage('notes is required'),
];

// ─── List Query Validators ────────────────────────────────────────────────────

const listPaging = () => [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc', 'ASC', 'DESC', 'Asc', 'Desc']),
  query('q').optional().isString(),
];

const listJobsPublicQuery = () => [
  ...listPaging(),
  query('featured').optional().isBoolean(),
  query('department').optional().isString(),
  query('location').optional().isString(),
  query('employmentType').optional().isIn(employmentTypeEnum),
  query('experienceLevel').optional().isIn(experienceLevelEnum),
];

const listJobsAdminQuery = () => [
  ...listPaging(),
  query('status').optional().isIn(jobStatusEnum),
  query('active').optional().isBoolean(),
  query('department').optional().isString(),
];

const listApplicationsAdminQuery = () => [
  ...listPaging(),
  query('status').optional().isIn(applicationStatusEnum),
  query('jobId').optional().isString(),
];

module.exports = {
  idParam,
  slugParam,
  applicationIdParam,

  jobCreateBody,
  jobPutBody,
  jobPatchBody,
  applyBody,
  applicationStatusBody,
  applicationAssignBody,
  applicationNotesBody,

  listJobsPublicQuery,
  listJobsAdminQuery,
  listApplicationsAdminQuery,
};

