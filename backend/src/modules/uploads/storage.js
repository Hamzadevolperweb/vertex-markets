const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { nanoid } = require('nanoid');
const { getSupabase, isSupabaseConfigured } = require('../../config/supabase');

const uploadsRepository = require('./uploadsRepository');

const BASE_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

function ensureDirectories() {
  const dirs = Object.values(uploadsRepository.CATEGORY_DIRS);
  dirs.forEach((dir) => {
    const fullPath = path.join(BASE_UPLOAD_DIR, dir.replace('uploads/', ''));
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
  if (!fs.existsSync(BASE_UPLOAD_DIR)) {
    fs.mkdirSync(BASE_UPLOAD_DIR, { recursive: true });
  }
}

function getCategorySubDir(category) {
  const dirMap = {
    avatar: 'avatars',
    blog: 'blog',
    cms: 'cms',
    platform: 'platforms',
    market: 'markets',
    partner: 'partners',
    resume: 'resumes',
    document: 'documents',
  };
  return dirMap[category] || 'documents';
}

function createStorage(category) {
  // Prefer memory so we can stream to Supabase Storage; also keep local disk fallback.
  if (isSupabaseConfigured()) {
    return multer.memoryStorage();
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      const subDir = getCategorySubDir(category);
      const dest = path.join(BASE_UPLOAD_DIR, subDir);
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${nanoid(12)}${ext}`;
      cb(null, uniqueName);
    },
  });
}

function createFileFilter(category) {
  return (req, file, cb) => {
    const allowedMimes = uploadsRepository.CATEGORY_ALLOWED_MIMES[category];
    if (!allowedMimes) {
      return cb(new Error(`Invalid upload category: ${category}`));
    }

    if (allowedMimes.includes(file.mimetype)) {
      return cb(null, true);
    }

    const errMsg = `File type '${file.mimetype}' is not allowed for category '${category}'`;
    return cb(new Error(errMsg));
  };
}

function createUploadMiddleware(category) {
  const maxSize = uploadsRepository.CATEGORY_MAX_SIZE[category] || 10 * 1024 * 1024;

  return multer({
    storage: createStorage(category),
    limits: { fileSize: maxSize },
    fileFilter: createFileFilter(category),
  });
}

const uploadAvatar = createUploadMiddleware('avatar');
const uploadBlogImage = createUploadMiddleware('blog');
const uploadCmsImage = createUploadMiddleware('cms');
const uploadPlatformImage = createUploadMiddleware('platform');
const uploadMarketIcon = createUploadMiddleware('market');
const uploadPartnerDoc = createUploadMiddleware('partner');
const uploadResume = createUploadMiddleware('resume');
const uploadDocument = createUploadMiddleware('document');

function buildPublicUrl(fileName, storagePath) {
  if (isSupabaseConfigured() && storagePath) {
    const supabase = getSupabase();
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
    if (data?.publicUrl) return data.publicUrl;
  }

  const baseUrl = process.env.APP_PUBLIC_URL || 'http://localhost:3000';
  return `${baseUrl}/api/v1/uploads/file/${fileName}`;
}

function getFullFilePath(subDir, fileName) {
  return path.join(BASE_UPLOAD_DIR, subDir, fileName);
}

/**
 * Persist an uploaded multer file to Supabase Storage (or local disk).
 * Returns { fileName, storagePath, publicUrl, size, mimeType }.
 */
async function persistUploadedFile(file, category) {
  const ext = path.extname(file.originalname || '').toLowerCase() || '';
  const fileName = file.filename || `${nanoid(12)}${ext}`;
  const subDir = getCategorySubDir(category);
  const storagePath = `${subDir}/${fileName}`;

  if (isSupabaseConfigured() && file.buffer) {
    const supabase = getSupabase();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Supabase storage upload failed: ${error.message}`);
    }

    return {
      fileName,
      storagePath,
      publicUrl: buildPublicUrl(fileName, storagePath),
      size: file.size,
      mimeType: file.mimetype,
      provider: 'supabase',
    };
  }

  // Disk fallback — multer already wrote the file
  const diskName = file.filename || fileName;
  return {
    fileName: diskName,
    storagePath: `${subDir}/${diskName}`,
    publicUrl: buildPublicUrl(diskName),
    size: file.size,
    mimeType: file.mimetype,
    provider: 'local',
  };
}

async function deleteStoredFile(storagePath) {
  if (!storagePath) return;
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    return;
  }

  const full = path.join(BASE_UPLOAD_DIR, storagePath.replace(/^uploads\//, ''));
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

ensureDirectories();

module.exports = {
  ensureDirectories,
  BASE_UPLOAD_DIR,
  STORAGE_BUCKET,
  getCategorySubDir,
  createStorage,
  createFileFilter,
  createUploadMiddleware,
  uploadAvatar,
  uploadBlogImage,
  uploadCmsImage,
  uploadPlatformImage,
  uploadMarketIcon,
  uploadPartnerDoc,
  uploadResume,
  uploadDocument,
  buildPublicUrl,
  getFullFilePath,
  persistUploadedFile,
  deleteStoredFile,
};
