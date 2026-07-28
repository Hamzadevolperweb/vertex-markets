const { BadRequestError, ConflictError, NotFoundError } = require('../../middleware/error/customErrors');
const newsletterRepository = require('./newsletterRepository');

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
  console.log('[NewsletterModule] Simulated email payload:', payload);
}

async function simulateSendEmail({ to, subject, message }) {
  const payload = buildEmailPayload({
    to,
    subject,
    body: message,
  });

  logSimulatedEmail(payload);
  return payload;
}

async function subscribe(payload) {
  if (!payload || !payload.email) {
    throw new BadRequestError('Email is required');
  }

  // Check for existing active subscriber
  const existing = await newsletterRepository.findByEmail(payload.email);
  if (existing) {
    if (existing.active && existing.status === 'subscribed' && !existing.deletedAt) {
      // Already subscribed and active — return as success (idempotent)
      return existing;
    }
    if (existing.deletedAt) {
      // Previously soft-deleted; create a new subscription
      return newsletterRepository.create(payload);
    }
    if (existing.status === 'unsubscribed') {
      // Re-subscribe: update status back to subscribed
      const updated = await newsletterRepository.updateById(existing.id, {
        ...payload,
        active: true,
      });
      return newsletterRepository.setStatus(existing.id, 'subscribed');
    }
  }

  // Simulate welcome email
  await simulateSendEmail({
    to: payload.email,
    subject: 'Welcome to our newsletter!',
    message: `Hello${payload.fullName ? ' ' + payload.fullName : ''}, thank you for subscribing to our newsletter.`,
  });

  return newsletterRepository.create(payload);
}

async function unsubscribe(payload) {
  if (!payload || !payload.email) {
    throw new BadRequestError('Email is required');
  }

  const existing = await newsletterRepository.findByEmail(payload.email);
  if (!existing) {
    throw new NotFoundError('Subscriber not found');
  }
  if (existing.status === 'unsubscribed') {
    return existing;
  }

  // Simulate goodbye email
  await simulateSendEmail({
    to: payload.email,
    subject: 'You have been unsubscribed',
    message: `Hello${existing.fullName ? ' ' + existing.fullName : ''}, you have been successfully unsubscribed from our newsletter.`,
  });

  return newsletterRepository.unsubscribeByEmail(payload.email);
}

async function getStatus(email) {
  if (!email) {
    throw new BadRequestError('Email is required');
  }

  const existing = await newsletterRepository.findByEmail(email);
  if (!existing || existing.deletedAt) {
    throw new NotFoundError('Subscriber not found');
  }

  return {
    id: existing.id,
    email: existing.email,
    status: existing.status,
    active: existing.active,
    subscribedAt: existing.subscribedAt,
    unsubscribedAt: existing.unsubscribedAt,
  };
}

async function adminList(query) {
  return newsletterRepository.list(query);
}

async function adminGetById(id) {
  const item = await newsletterRepository.getById(id);
  if (!item) throw new NotFoundError('Subscriber not found');
  return item;
}

async function adminUpdateById(id, payload) {
  const updated = await newsletterRepository.updateById(id, payload);
  if (!updated) throw new NotFoundError('Subscriber not found');
  return updated;
}

async function adminPatchById(id, payload) {
  return adminUpdateById(id, payload);
}

async function adminDeleteById(id) {
  const removed = await newsletterRepository.softDelete(id);
  if (!removed) throw new NotFoundError('Subscriber not found');
  return removed;
}

async function adminPatchStatus(id, { status }) {
  if (!status) throw new BadRequestError('Status is required');
  if (!['subscribed', 'unsubscribed'].includes(status)) {
    throw new BadRequestError('Status must be "subscribed" or "unsubscribed"');
  }

  const updated = await newsletterRepository.setStatus(id, status);
  if (!updated) throw new NotFoundError('Subscriber not found');

  // Simulate status change email
  if (status === 'subscribed') {
    await simulateSendEmail({
      to: updated.email,
      subject: 'Subscription reactivated',
      message: `Hello${updated.fullName ? ' ' + updated.fullName : ''}, your newsletter subscription has been reactivated.`,
    });
  } else {
    await simulateSendEmail({
      to: updated.email,
      subject: 'Subscription deactivated',
      message: `Hello${updated.fullName ? ' ' + updated.fullName : ''}, your newsletter subscription has been deactivated.`,
    });
  }

  return updated;
}

module.exports = {
  subscribe,
  unsubscribe,
  getStatus,
  adminList,
  adminGetById,
  adminUpdateById,
  adminPatchById,
  adminDeleteById,
  adminPatchStatus,
};

