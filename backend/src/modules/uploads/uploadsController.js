const { success } = require('../../utils/response');
const uploadsService = require('./uploadsService');

// ─── Public: Get file by ID ───────────────────────────────────────────────

async function getFileById(req, res, next) {
  try {
    const data = await uploadsService.getFileById(req.params.id);
    return success(res, { message: 'File fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Public: Serve file by fileName ───────────────────────────────────────

async function serveFileByFileName(req, res, next) {
  try {
    const result = await uploadsService.getFileByFileName(req.params.fileName);
    if (result.redirectUrl) {
      return res.redirect(result.redirectUrl);
    }
    const { metadata, fullPath } = result;
    res.setHeader('Content-Type', metadata.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${metadata.originalName}"`);
    return res.sendFile(fullPath);
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Upload (generic handler) ──────────────────────────────────────

async function adminUpload(req, res, next) {
  try {
    const category = req.params.category || req.body.category;
    const data = await uploadsService.uploadFile({
      category,
      file: req.file,
      userId: req.auth?.userId,
    });
    return success(res, { status: 201, message: 'File uploaded', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Upload avatar ─────────────────────────────────────────────────

async function adminUploadAvatar(req, res, next) {
  try {
    const data = await uploadsService.uploadFile({
      category: 'avatar',
      file: req.file,
      userId: req.auth?.userId,
    });
    return success(res, { status: 201, message: 'Avatar uploaded', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Upload blog image ─────────────────────────────────────────────

async function adminUploadBlogImage(req, res, next) {
  try {
    const data = await uploadsService.uploadFile({
      category: 'blog',
      file: req.file,
      userId: req.auth?.userId,
    });
    return success(res, { status: 201, message: 'Blog image uploaded', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Upload CMS image ──────────────────────────────────────────────

async function adminUploadCmsImage(req, res, next) {
  try {
    const data = await uploadsService.uploadFile({
      category: 'cms',
      file: req.file,
      userId: req.auth?.userId,
    });
    return success(res, { status: 201, message: 'CMS image uploaded', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Upload platform image ─────────────────────────────────────────

async function adminUploadPlatformImage(req, res, next) {
  try {
    const data = await uploadsService.uploadFile({
      category: 'platform',
      file: req.file,
      userId: req.auth?.userId,
    });
    return success(res, { status: 201, message: 'Platform image uploaded', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Upload market icon ────────────────────────────────────────────

async function adminUploadMarketIcon(req, res, next) {
  try {
    const data = await uploadsService.uploadFile({
      category: 'market',
      file: req.file,
      userId: req.auth?.userId,
    });
    return success(res, { status: 201, message: 'Market icon uploaded', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Upload resume ─────────────────────────────────────────────────

async function adminUploadResume(req, res, next) {
  try {
    const data = await uploadsService.uploadFile({
      category: 'resume',
      file: req.file,
      userId: req.auth?.userId,
    });
    return success(res, { status: 201, message: 'Resume uploaded', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Upload document ───────────────────────────────────────────────

async function adminUploadDocument(req, res, next) {
  try {
    const data = await uploadsService.uploadFile({
      category: 'document',
      file: req.file,
      userId: req.auth?.userId,
    });
    return success(res, { status: 201, message: 'Document uploaded', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: List files ────────────────────────────────────────────────────

async function adminListFiles(req, res, next) {
  try {
    const data = await uploadsService.listFiles(req.query);
    return success(res, { message: 'Files fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Get file details ──────────────────────────────────────────────

async function adminGetFileDetails(req, res, next) {
  try {
    const data = await uploadsService.getFileDetailsById(req.params.id);
    return success(res, { message: 'File details fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Patch file ────────────────────────────────────────────────────

async function adminPatchFile(req, res, next) {
  try {
    const data = await uploadsService.updateFile(req.params.id, req.body);
    return success(res, { message: 'File updated', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Delete file (soft) ────────────────────────────────────────────

async function adminDeleteFile(req, res, next) {
  try {
    const data = await uploadsService.deleteFile(req.params.id);
    return success(res, { message: 'File deleted', data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  // Public
  getFileById,
  serveFileByFileName,

  // Admin
  adminUpload,
  adminUploadAvatar,
  adminUploadBlogImage,
  adminUploadCmsImage,
  adminUploadPlatformImage,
  adminUploadMarketIcon,
  adminUploadResume,
  adminUploadDocument,
  adminListFiles,
  adminGetFileDetails,
  adminPatchFile,
  adminDeleteFile,
};

