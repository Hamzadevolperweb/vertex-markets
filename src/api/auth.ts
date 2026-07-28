import { apiRequest, setAccessToken } from './client';
import type { AuthUser, LoginResponse } from './types';

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
};

export async function login(input: LoginInput): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: input,
  });
  setAccessToken(data.accessToken);
  return data;
}

export async function register(input: RegisterInput): Promise<{ user: { id: string; email: string } }> {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: input,
  });
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST', body: {}, auth: true });
  } finally {
    setAccessToken(null);
  }
}

export async function getMe(): Promise<AuthUser> {
  return apiRequest<AuthUser>('/users/me', { auth: true });
}
