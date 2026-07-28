const { BadRequestError, ConflictError, NotFoundError } = require('../../middleware/error/customErrors');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const contactRepository = require('./contactRepository');

function buildEmailPayload({ to, subject, body }) {
  return {
    to,
    subject,
    body,
    provider: 'simulated',
  };
}

function logSimulatedEmail(payload) {
  // eslint-disable-next-line no-console
  console.log('[ContactModule] Simulated email payload:', payload);
}

async function simulateSendEmail({ to, subject, replyMessage }) {
  const payload = buildEmailPayload({
    to,
    subject,
    body: replyMessage,
  });

  logSimulatedEmail(payload);
  return payload;
}

async function createContact(payload) {
  if (!payload || !payload.email) throw new BadRequestError('Invalid payload');
  const created = await contactRepository.createPublic(payload);
  return created;
}

async function getStatus(id) {
  const item = await contactRepository.getById(id);
  if (!item) throw new NotFoundError('Contact not found');
  return { id: item.id, status: item.status };
}

async function adminList(query) {
  const result = await contactRepository.listAdmin(query);
  return result;
}

async function adminGetById(id) {
  const item = await contactRepository.getById(id);
  if (!item) throw new NotFoundError('Contact not found');
  return item;
}

async function adminUpdateById(id, payload) {
  const updated = await contactRepository.updateAdmin(id, payload);
  if (!updated) throw new NotFoundError('Contact not found');
  return updated;
}

async function adminPatchById(id, payload) {
  return adminUpdateById(id, payload);
}

async function adminDeleteById(id) {
  const removed = await contactRepository.softDelete(id);
  if (!removed) throw new NotFoundError('Contact not found');
  return removed;
}

async function adminPatchStatus(id, { status }) {
  const updated = await contactRepository.setStatus(id, status);
  if (!updated) throw new NotFoundError('Contact not found');
  return updated;
}

async function adminAssign(id, { assignedTo }) {
  const updated = await contactRepository.assignTo(id, assignedTo);
  if (!updated) throw new NotFoundError('Contact not found');
  return updated;
}

async function adminReply(id, payload) {
  const existing = await contactRepository.getById(id);
  if (!existing) throw new NotFoundError('Contact not found');

  if (existing.status === contactRepository.STATUS.CLOSED) {
    throw new ConflictError('Contact is closed');
  }

  // Simulate email send and store reply history
  await simulateSendEmail({
    to: existing.email,
    subject: `Re: ${existing.subject}`,
    replyMessage: payload.replyMessage,
  });

  const updated = await contactRepository.addReply(id, {
    replyMessage: payload.replyMessage,
    assignedTo: payload.assignedTo,
    fromEmail: payload.fromEmail,
  });

  if (!updated) throw new NotFoundError('Contact not found');
  return updated;
}

module.exports = {
  createContact,
  getStatus,
  adminList,
  adminGetById,
  adminUpdateById,
  adminPatchById,
  adminDeleteById,
  adminPatchStatus,
  adminAssign,
  adminReply,
};

