import { apiRequest } from './client';

export type KycStartResponse = {
  applicationId: string;
  accessToken: string;
  userId: string;
  levelName: string;
  simulated?: boolean;
};

export type KycStatus = {
  id?: string;
  userId: string;
  status: string;
  levelName?: string;
  createdAt?: string;
};

export async function startKyc(levelName?: string): Promise<KycStartResponse> {
  return apiRequest<KycStartResponse>('/kyc/start', {
    method: 'POST',
    body: levelName ? { levelName } : {},
    auth: true,
  });
}

export async function getMyKycStatus(): Promise<KycStatus> {
  return apiRequest<KycStatus>('/kyc/me', { auth: true });
}
