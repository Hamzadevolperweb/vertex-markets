/**
 * Email via Resend (https://resend.com)
 */
const { Resend } = require('resend');

let client;

function getClient() {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
}

function fromAddress() {
  return process.env.EMAIL_FROM || 'Vertex Markets <onboarding@resend.dev>';
}

async function sendEmail({ to, subject, html, text }) {
  const resend = getClient();
  if (!resend) {
    // eslint-disable-next-line no-console
    console.warn('[email] RESEND_API_KEY missing — logging email instead');
    // eslint-disable-next-line no-console
    console.log('[email:simulated]', { to, subject, text: text || html?.slice(0, 200) });
    return { id: `sim_${Date.now()}`, simulated: true };
  }

  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  });

  if (error) {
    const err = new Error(error.message || 'Email send failed');
    err.status = 502;
    err.details = error;
    throw err;
  }
  return data;
}

async function sendVerificationEmail({ to, token }) {
  const base = process.env.APP_FRONTEND_URL || 'http://localhost:5173';
  const link = `${base}/verify-email?token=${encodeURIComponent(token)}`;
  return sendEmail({
    to,
    subject: 'Verify your Vertex Markets account',
    html: `<p>Welcome to Vertex Markets.</p><p><a href="${link}">Verify your email</a></p><p>Or use this token: <code>${token}</code></p>`,
    text: `Verify your email: ${link}`,
  });
}

async function sendPasswordResetEmail({ to, token }) {
  const base = process.env.APP_FRONTEND_URL || 'http://localhost:5173';
  const link = `${base}/reset-password?token=${encodeURIComponent(token)}`;
  return sendEmail({
    to,
    subject: 'Reset your Vertex Markets password',
    html: `<p>Reset your password:</p><p><a href="${link}">Reset password</a></p><p>Token: <code>${token}</code></p>`,
    text: `Reset password: ${link}`,
  });
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
