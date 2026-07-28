const kycService = require('./kycService');
const { success } = require('../../utils/response');

async function startVerification(req, res, next) {
  try {
    const userId = req.auth.userId;
    const email = req.body?.email || req.auth?.email;
    const levelName = req.body?.levelName;
    const data = await kycService.createAccessToken({ userId, email, levelName });
    return success(res, { message: 'KYC session created', data });
  } catch (err) {
    return next(err);
  }
}

async function myStatus(req, res, next) {
  try {
    const data = await kycService.getStatus(req.auth.userId);
    return success(res, { message: 'KYC status', data });
  } catch (err) {
    return next(err);
  }
}

async function listAll(req, res, next) {
  try {
    const data = await kycService.listApplications();
    return success(res, { message: 'KYC applications', data: { items: data } });
  } catch (err) {
    return next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    const data = await kycService.updateStatus(req.params.id, req.body.status, req.body.notes);
    if (!data) {
      const err = new Error('KYC application not found');
      err.status = 404;
      throw err;
    }
    return success(res, { message: 'KYC updated', data });
  } catch (err) {
    return next(err);
  }
}

module.exports = { startVerification, myStatus, listAll, patchStatus };
