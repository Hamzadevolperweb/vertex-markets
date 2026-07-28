/**
 * Sumsub-compatible KYC access-token issuer.
 * Credentials: KYC_PUBLIC_ID (app token) + KYC_SECRET_KEY (secret / index encryption key)
 * Docs: https://docs.sumsub.com/reference/authentication
 */
const crypto = require('crypto');
const { store } = require('../../infrastructure/store');

const SUMSUB_BASE = process.env.KYC_API_BASE_URL || 'https://api.sumsub.com';
const KYC_COLLECTION = 'kycApplications';

function getCredentials() {
  const appToken = process.env.KYC_PUBLIC_ID || process.env.SUMSUB_APP_TOKEN;
  const secretKey = process.env.KYC_SECRET_KEY || process.env.SUMSUB_SECRET_KEY;
  if (!appToken || !secretKey) {
    const err = new Error('KYC credentials are not configured');
    err.status = 503;
    throw err;
  }
  return { appToken, secretKey };
}

function sign(secretKey, ts, method, path, body = '') {
  return crypto
    .createHmac('sha256', secretKey)
    .update(ts + method.toUpperCase() + path + body)
    .digest('hex');
}

async function sumsubRequest(method, path, bodyObj) {
  const { appToken, secretKey } = getCredentials();
  const ts = Math.floor(Date.now() / 1000).toString();
  const body = bodyObj ? JSON.stringify(bodyObj) : '';
  const signature = sign(secretKey, ts, method, path, body);

  const res = await fetch(`${SUMSUB_BASE}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-App-Token': appToken,
      'X-App-Access-Ts': ts,
      'X-App-Access-Sig': signature,
    },
    body: body || undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error((data && (data.description || data.message)) || `KYC provider error (${res.status})`);
    err.status = res.status;
    err.details = data;
    throw err;
  }
  return data;
}

function applications() {
  return store.collection(KYC_COLLECTION);
}

async function createAccessToken({ userId, levelName, email }) {
  const level = levelName || process.env.KYC_LEVEL_NAME || 'basic-kyc-level';
  const ttl = Number(process.env.KYC_TOKEN_TTL_SECONDS || 600);
  const path = `/resources/accessTokens?userId=${encodeURIComponent(userId)}&levelName=${encodeURIComponent(level)}&ttlInSecs=${ttl}`;

  let tokenPayload;
  try {
    tokenPayload = await sumsubRequest('POST', path);
  } catch (err) {
    // Dev fallback when provider rejects credentials / sandbox unavailable
    if (process.env.NODE_ENV !== 'production') {
      tokenPayload = {
        token: `dev_kyc_${userId}_${Date.now()}`,
        userId,
        simulated: true,
      };
    } else {
      throw err;
    }
  }

  const id = store.newId('kyc');
  const record = {
    id,
    userId,
    email: email || null,
    levelName: level,
    status: 'pending',
    provider: 'sumsub',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  applications().set(id, record);

  return {
    applicationId: id,
    accessToken: tokenPayload.token,
    userId,
    levelName: level,
    simulated: Boolean(tokenPayload.simulated),
  };
}

async function getStatus(userId) {
  const items = [...applications().values()]
    .filter((a) => a.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return items[0] || { status: 'not_started', userId };
}

async function listApplications() {
  return [...applications().values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

async function updateStatus(id, status, notes) {
  const col = applications();
  const existing = col.get(id);
  if (!existing) return null;
  const updated = {
    ...existing,
    status,
    notes: notes || existing.notes,
    updatedAt: new Date().toISOString(),
  };
  col.set(id, updated);
  return updated;
}

module.exports = {
  createAccessToken,
  getStatus,
  listApplications,
  updateStatus,
};
