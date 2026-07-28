const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require('../../middleware/error/customErrors');

const partnersRepository = require('./partnersRepository');

// ─── Public: Register Partner ─────────────────────────────────────────────

async function registerPartner(payload = {}) {
  if (!payload.fullName) throw new BadRequestError('fullName is required');
  if (!payload.email) throw new BadRequestError('email is required');
  if (!payload.phone) throw new BadRequestError('phone is required');
  if (!payload.country) throw new BadRequestError('country is required');
  if (!payload.partnerType) throw new BadRequestError('partnerType is required');

  if (!partnersRepository.isValidPartnerType(payload.partnerType)) {
    throw new BadRequestError(
      `Invalid partnerType. Must be one of: ${partnersRepository.PARTNER_TYPES.join(', ')}`,
    );
  }

  // Duplicate email prevention
  const existing = await partnersRepository.getPartnerByEmail(payload.email);
  if (existing) {
    throw new ConflictError('A partner with this email is already registered');
  }

  const partner = await partnersRepository.createPartner({
    fullName: payload.fullName,
    companyName: payload.companyName || '',
    email: payload.email,
    phone: payload.phone,
    country: payload.country,
    city: payload.city || '',
    website: payload.website || '',
    partnerType: payload.partnerType,
    experience: payload.experience || '',
    monthlyClients: payload.monthlyClients || '',
    businessDescription: payload.businessDescription || '',
    referralSource: payload.referralSource || '',
  });

  return sanitizePublicPartner(partner);
}

// ─── Public: Submit Referral ──────────────────────────────────────────────

async function submitReferral(payload = {}) {
  if (!payload.clientName) throw new BadRequestError('clientName is required');
  if (!payload.clientEmail) throw new BadRequestError('clientEmail is required');
  if (!payload.clientPhone) throw new BadRequestError('clientPhone is required');
  if (!payload.country) throw new BadRequestError('country is required');
  if (!payload.referredBy) throw new BadRequestError('referredBy is required');

  const referral = await partnersRepository.createReferral({
    clientName: payload.clientName,
    clientEmail: payload.clientEmail,
    clientPhone: payload.clientPhone,
    country: payload.country,
    tradingExperience: payload.tradingExperience || '',
    estimatedDeposit: payload.estimatedDeposit || '',
    message: payload.message || '',
    referredBy: payload.referredBy,
  });

  return sanitizePublicReferral(referral);
}

// ─── Public: Check Status ─────────────────────────────────────────────────

async function checkStatus(partnerId) {
  const partner = await partnersRepository.getPartnerById(partnerId);
  if (!partner) throw new NotFoundError('Partner not found');

  return {
    id: partner.id,
    fullName: partner.fullName,
    email: partner.email,
    status: partner.status,
    createdAt: partner.createdAt,
    updatedAt: partner.updatedAt,
  };
}

// ─── Admin: List Partners ─────────────────────────────────────────────────

async function adminListPartners(query = {}) {
  const result = await partnersRepository.listPartners(query);
  return result;
}

// ─── Admin: Get Partner By ID ─────────────────────────────────────────────

async function adminGetPartnerById(id) {
  const partner = await partnersRepository.getPartnerById(id);
  if (!partner) throw new NotFoundError('Partner not found');
  return partner;
}

// ─── Admin: Update Partner (PUT) ──────────────────────────────────────────

async function adminPutPartner(id, payload = {}) {
  if (!payload.fullName) throw new BadRequestError('fullName is required');
  if (!payload.email) throw new BadRequestError('email is required');
  if (!payload.phone) throw new BadRequestError('phone is required');
  if (!payload.country) throw new BadRequestError('country is required');
  if (!payload.partnerType) throw new BadRequestError('partnerType is required');

  if (!partnersRepository.isValidPartnerType(payload.partnerType)) {
    throw new BadRequestError(
      `Invalid partnerType. Must be one of: ${partnersRepository.PARTNER_TYPES.join(', ')}`,
    );
  }

  const existing = await partnersRepository.getPartnerById(id);
  if (!existing) throw new NotFoundError('Partner not found');

  // Check email uniqueness (exclude current partner)
  const emailOwner = await partnersRepository.getPartnerByEmail(payload.email);
  if (emailOwner && String(emailOwner.id) !== String(id)) {
    throw new ConflictError('Email already in use by another partner');
  }

  const status = payload.status || existing.status;
  if (!partnersRepository.isValidPartnerStatus(status)) {
    throw new BadRequestError(
      `Invalid status. Must be one of: ${Object.values(partnersRepository.PARTNER_STATUS).join(', ')}`,
    );
  }

  const updated = await partnersRepository.updatePartnerById(id, {
    fullName: payload.fullName,
    companyName: payload.companyName || '',
    email: payload.email,
    phone: payload.phone,
    country: payload.country,
    city: payload.city || '',
    website: payload.website || '',
    partnerType: payload.partnerType,
    experience: payload.experience || '',
    monthlyClients: payload.monthlyClients || '',
    businessDescription: payload.businessDescription || '',
    referralSource: payload.referralSource || '',
    status,
    active: payload.active !== undefined ? Boolean(payload.active) : existing.active,
  });

  return updated;
}

// ─── Admin: Patch Partner ─────────────────────────────────────────────────

async function adminPatchPartner(id, payload = {}) {
  const existing = await partnersRepository.getPartnerById(id);
  if (!existing) throw new NotFoundError('Partner not found');

  // Validate partnerType if provided
  if (payload.partnerType !== undefined && !partnersRepository.isValidPartnerType(payload.partnerType)) {
    throw new BadRequestError(
      `Invalid partnerType. Must be one of: ${partnersRepository.PARTNER_TYPES.join(', ')}`,
    );
  }

  // Validate status if provided
  if (payload.status !== undefined && !partnersRepository.isValidPartnerStatus(payload.status)) {
    throw new BadRequestError(
      `Invalid status. Must be one of: ${Object.values(partnersRepository.PARTNER_STATUS).join(', ')}`,
    );
  }

  // Check email uniqueness if changing
  if (payload.email !== undefined) {
    const emailOwner = await partnersRepository.getPartnerByEmail(payload.email);
    if (emailOwner && String(emailOwner.id) !== String(id)) {
      throw new ConflictError('Email already in use by another partner');
    }
  }

  const patch = {};
  if (payload.fullName !== undefined) patch.fullName = payload.fullName;
  if (payload.companyName !== undefined) patch.companyName = payload.companyName;
  if (payload.email !== undefined) patch.email = payload.email;
  if (payload.phone !== undefined) patch.phone = payload.phone;
  if (payload.country !== undefined) patch.country = payload.country;
  if (payload.city !== undefined) patch.city = payload.city;
  if (payload.website !== undefined) patch.website = payload.website;
  if (payload.partnerType !== undefined) patch.partnerType = payload.partnerType;
  if (payload.experience !== undefined) patch.experience = payload.experience;
  if (payload.monthlyClients !== undefined) patch.monthlyClients = payload.monthlyClients;
  if (payload.businessDescription !== undefined) patch.businessDescription = payload.businessDescription;
  if (payload.referralSource !== undefined) patch.referralSource = payload.referralSource;
  if (payload.status !== undefined) patch.status = payload.status;
  if (payload.active !== undefined) patch.active = Boolean(payload.active);

  const updated = await partnersRepository.updatePartnerById(id, patch);
  return updated;
}

// ─── Admin: Soft Delete Partner ───────────────────────────────────────────

async function adminDeletePartner(id) {
  const removed = await partnersRepository.softDeletePartner(id);
  if (!removed) throw new NotFoundError('Partner not found');
  return removed;
}

// ─── Admin: Update Partner Status ─────────────────────────────────────────

async function adminUpdatePartnerStatus(id, status) {
  if (!status) throw new BadRequestError('status is required');
  if (!partnersRepository.isValidPartnerStatus(status)) {
    throw new BadRequestError(
      `Invalid status. Must be one of: ${Object.values(partnersRepository.PARTNER_STATUS).join(', ')}`,
    );
  }

  const existing = await partnersRepository.getPartnerById(id);
  if (!existing) throw new NotFoundError('Partner not found');

  const updated = await partnersRepository.setPartnerStatus(id, status);
  if (!updated) throw new NotFoundError('Partner not found');
  return updated;
}

// ─── Admin: Assign Partner ────────────────────────────────────────────────

async function adminAssignPartner(id, assignedTo) {
  if (!assignedTo) throw new BadRequestError('assignedTo is required');

  const existing = await partnersRepository.getPartnerById(id);
  if (!existing) throw new NotFoundError('Partner not found');

  const updated = await partnersRepository.assignPartner(id, assignedTo);
  if (!updated) throw new NotFoundError('Partner not found');
  return updated;
}

// ─── Admin: Update Partner Notes ──────────────────────────────────────────

async function adminUpdatePartnerNotes(id, notes) {
  if (notes === undefined) throw new BadRequestError('notes is required');

  const existing = await partnersRepository.getPartnerById(id);
  if (!existing) throw new NotFoundError('Partner not found');

  const updated = await partnersRepository.updatePartnerNotes(id, notes);
  if (!updated) throw new NotFoundError('Partner not found');
  return updated;
}

// ─── Admin: List Referrals ────────────────────────────────────────────────

async function adminListReferrals(query = {}) {
  const result = await partnersRepository.listReferrals(query);
  return result;
}

// ─── Admin: Get Referral By ID ────────────────────────────────────────────

async function adminGetReferralById(id) {
  const referral = await partnersRepository.getReferralById(id);
  if (!referral) throw new NotFoundError('Referral not found');
  return referral;
}

// ─── Admin: Update Referral Status ────────────────────────────────────────

async function adminUpdateReferralStatus(id, status) {
  if (!status) throw new BadRequestError('status is required');
  if (!partnersRepository.isValidReferralStatus(status)) {
    throw new BadRequestError(
      `Invalid status. Must be one of: ${Object.values(partnersRepository.REFERRAL_STATUS).join(', ')}`,
    );
  }

  const existing = await partnersRepository.getReferralById(id);
  if (!existing) throw new NotFoundError('Referral not found');

  const updated = await partnersRepository.setReferralStatus(id, status);
  if (!updated) throw new NotFoundError('Referral not found');
  return updated;
}

// ─── Admin: Delete Referral ───────────────────────────────────────────────

async function adminDeleteReferral(id) {
  const removed = await partnersRepository.softDeleteReferral(id);
  if (!removed) throw new NotFoundError('Referral not found');
  return removed;
}

// ─── Helpers: Sanitize Public Output ──────────────────────────────────────

function sanitizePublicPartner(partner) {
  return {
    id: partner.id,
    fullName: partner.fullName,
    email: partner.email,
    status: partner.status,
    createdAt: partner.createdAt,
    updatedAt: partner.updatedAt,
  };
}

function sanitizePublicReferral(referral) {
  return {
    id: referral.id,
    clientName: referral.clientName,
    clientEmail: referral.clientEmail,
    status: referral.status,
    createdAt: referral.createdAt,
    updatedAt: referral.updatedAt,
  };
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

