const { success } = require('../../utils/response');
const partnersService = require('./partnersService');

// ─── Public: Register Partner ─────────────────────────────────────────────

async function registerPartner(req, res, next) {
  try {
    const data = await partnersService.registerPartner(req.body);
    return success(res, { status: 201, message: 'Partner registration submitted', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Public: Submit Referral ──────────────────────────────────────────────

async function submitReferral(req, res, next) {
  try {
    const data = await partnersService.submitReferral(req.body);
    return success(res, { status: 201, message: 'Referral submitted', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Public: Check Status ─────────────────────────────────────────────────

async function checkStatus(req, res, next) {
  try {
    const data = await partnersService.checkStatus(req.params.id);
    return success(res, { message: 'Partner status fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: List Partners ─────────────────────────────────────────────────

async function adminListPartners(req, res, next) {
  try {
    const data = await partnersService.adminListPartners(req.query);
    return success(res, { message: 'Partners fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Get Partner By ID ─────────────────────────────────────────────

async function adminGetPartnerById(req, res, next) {
  try {
    const data = await partnersService.adminGetPartnerById(req.params.id);
    return success(res, { message: 'Partner fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Update Partner (PUT) ──────────────────────────────────────────

async function adminPutPartner(req, res, next) {
  try {
    const data = await partnersService.adminPutPartner(req.params.id, req.body);
    return success(res, { message: 'Partner updated', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Update Partner (PATCH) ────────────────────────────────────────

async function adminPatchPartner(req, res, next) {
  try {
    const data = await partnersService.adminPatchPartner(req.params.id, req.body);
    return success(res, { message: 'Partner patched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Delete Partner ────────────────────────────────────────────────

async function adminDeletePartner(req, res, next) {
  try {
    const data = await partnersService.adminDeletePartner(req.params.id);
    return success(res, { message: 'Partner deleted', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Update Partner Status ─────────────────────────────────────────

async function adminUpdatePartnerStatus(req, res, next) {
  try {
    const data = await partnersService.adminUpdatePartnerStatus(req.params.id, req.body.status);
    return success(res, { message: 'Partner status updated', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Assign Partner ────────────────────────────────────────────────

async function adminAssignPartner(req, res, next) {
  try {
    const data = await partnersService.adminAssignPartner(req.params.id, req.body.assignedTo);
    return success(res, { message: 'Partner assigned', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Update Partner Notes ──────────────────────────────────────────

async function adminUpdatePartnerNotes(req, res, next) {
  try {
    const data = await partnersService.adminUpdatePartnerNotes(req.params.id, req.body.notes);
    return success(res, { message: 'Partner notes updated', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: List Referrals ────────────────────────────────────────────────

async function adminListReferrals(req, res, next) {
  try {
    const data = await partnersService.adminListReferrals(req.query);
    return success(res, { message: 'Referrals fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Get Referral By ID ────────────────────────────────────────────

async function adminGetReferralById(req, res, next) {
  try {
    const data = await partnersService.adminGetReferralById(req.params.id);
    return success(res, { message: 'Referral fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Update Referral Status ────────────────────────────────────────

async function adminUpdateReferralStatus(req, res, next) {
  try {
    const data = await partnersService.adminUpdateReferralStatus(req.params.id, req.body.status);
    return success(res, { message: 'Referral status updated', data });
  } catch (err) {
    return next(err);
  }
}

// ─── Admin: Delete Referral ───────────────────────────────────────────────

async function adminDeleteReferral(req, res, next) {
  try {
    const data = await partnersService.adminDeleteReferral(req.params.id);
    return success(res, { message: 'Referral deleted', data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  // Public
  registerPartner,
  submitReferral,
  checkStatus,

  // Admin: Partners
  adminListPartners,
  adminGetPartnerById,
  adminPutPartner,
  adminPatchPartner,
  adminDeletePartner,
  adminUpdatePartnerStatus,
  adminAssignPartner,
  adminUpdatePartnerNotes,

  // Admin: Referrals
  adminListReferrals,
  adminGetReferralById,
  adminUpdateReferralStatus,
  adminDeleteReferral,
};

