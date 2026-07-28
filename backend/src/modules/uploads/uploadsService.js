const path = require('path');
const fs = require('fs');
const { BadRequestError, NotFoundError } = require('../../middleware/error/customErrors');

const uploadsRepository = require('./uploadsRepository');
const storage = require('./storage');

// ─── Upload a file ────────────────────────────────────────────────────────

async function uploadFile({ category, file, userId }) {
  if (!category) throw new BadRequestError('category is required');
  if (!file) throw new BadRequestError('File is required');

  if (!uploadsRepository.CATEGORIES.includes(category)) {
    throw new BadRequestError(
      `Invalid category. Must be one of: ${uploadsRepository.CATEGORIES.join(', ')}`,
    );
  }

  const mimeType = file.mimetype;
  const fileSize = file.size;

  // Validate MIME type for category
  const allowedMimes = uploadsRepository.CATEGORY_ALLOWED_MIMES[category];
  if (!allowedMimes.includes(mimeType)) {
    throw new BadRequestError(
      `File type '${mimeType}' is not allowed for category '${category}'`,
    );
  }

  // Validate file size for category
  const maxSize = uploadsRepository.CATEGORY_MAX_SIZE[category];
  if (fileSize > maxSize) {
    const maxMb = Math.round(maxSize / (1024 * 1024));
    throw new BadRequestError(
      `File size exceeds the maximum allowed size of ${maxMb}MB for category '${category}'`,
    );
  }

  const persisted = await storage.persistUploadedFile(file, category);
  const ext = path.extname(persisted.fileName).toLowerCase();
  const filePath = `uploads/${persisted.storagePath}`;

  const metadata = await uploadsRepository.create({
    originalName: file.originalname,
    fileName: persisted.fileName,
    mimeType,
    extension: ext.replace('.', ''),
    fileSize: persisted.size || fileSize,
    category,
    uploadedBy: userId || null,
    filePath,
    publicUrl: persisted.publicUrl,
    storageProvider: persisted.provider,
    storagePath: persisted.storagePath,
  });

  return metadata;
}

// ─── Get file by ID (public) ──────────────────────────────────────────────

async function getFileById(id) {
  const file = await uploadsRepository.getById(id);
  if (!file) throw new NotFoundError('File not found');
  if (!file.active) throw new NotFoundError('File not found or inactive');
  return file;
}

// ─── Get file metadata by ID (admin, includes inactive) ───────────────────

async function getFileDetailsById(id) {
  const file = await uploadsRepository.getById(id, { includeDeleted: true });
  if (!file) throw new NotFoundError('File not found');
  return file;
}

// ─── Get file by fileName (public streaming) ──────────────────────────────

async function getFileByFileName(fileName) {
  if (!fileName) throw new BadRequestError('fileName is required');

  const file = await uploadsRepository.getByFileName(fileName);
  if (!file) throw new NotFoundError('File not found');
  if (!file.active) throw new NotFoundError('File not found or inactive');

  // Prefer public CDN/Supabase URL when available
  if (file.publicUrl && file.storageProvider === 'supabase') {
    return { metadata: file, redirectUrl: file.publicUrl };
  }

  const fullPath = path.resolve(storage.BASE_UPLOAD_DIR, '..', file.filePath);
  if (!fs.existsSync(fullPath)) {
    if (file.publicUrl) {
      return { metadata: file, redirectUrl: file.publicUrl };
    }
    throw new NotFoundError('File not found on disk');
  }

  return { metadata: file, fullPath };
}

// ─── List files (admin) ──────────────────────────────────────────────────

async function listFiles(query = {}) {
  return uploadsRepository.list(query);
}

// ─── Update file (patch) ──────────────────────────────────────────────────

async function updateFile(id, patch = {}) {
  const existing = await uploadsRepository.getById(id, { includeDeleted: true });
  if (!existing) throw new NotFoundError('File not found');

  const updated = await uploadsRepository.updateById(id, patch);
  return updated;
}

// ─── Soft delete file ─────────────────────────────────────────────────────

async function deleteFile(id) {
  const removed = await uploadsRepository.softDelete(id);
  if (!removed) throw new NotFoundError('File not found');
  if (removed.storagePath) {
    try {
      await storage.deleteStoredFile(removed.storagePath);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[uploads] storage delete failed', err.message);
    }
  }
  return removed;
}

module.exports = {
  uploadFile,
  getFileById,
  getFileDetailsById,
  getFileByFileName,
  listFiles,
  updateFile,
  deleteFile,
};

