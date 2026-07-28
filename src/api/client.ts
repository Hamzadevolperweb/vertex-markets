import type { ApiFailure, ApiSuccess } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const ACCESS_TOKEN_KEY = 'vertex_access_token';

let accessTokenMemory: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function getAccessToken(): string | null {
  if (accessTokenMemory) return accessTokenMemory;
  try {
    accessTokenMemory = localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    accessTokenMemory = null;
  }
  return accessTokenMemory;
}

export function setAccessToken(token: string | null) {
  accessTokenMemory = token;
  try {
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // ignore storage errors (private mode)
  }
}

export class ApiError extends Error {
  status: number;
  details?: ApiFailure['details'];

  constructor(message: string, status: number, details?: ApiFailure['details']) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  skipRefresh?: boolean;
};

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = (await parseJson(res)) as ApiSuccess<{ accessToken: string }> | ApiFailure | null;
      if (!res.ok || !json || !('success' in json) || !json.success) {
        setAccessToken(null);
        return null;
      }
      setAccessToken(json.data.accessToken);
      return json.data.accessToken;
    } catch {
      setAccessToken(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, skipRefresh = false } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && !skipRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, skipRefresh: true });
    }
  }

  const json = (await parseJson(res)) as ApiSuccess<T> | ApiFailure | null;

  if (!res.ok || !json || (typeof json === 'object' && 'success' in json && json.success === false)) {
    const failure = json as ApiFailure | null;
    throw new ApiError(
      failure?.message || res.statusText || 'Request failed',
      res.status,
      failure?.details,
    );
  }

  return (json as ApiSuccess<T>).data;
}

export { API_BASE };
