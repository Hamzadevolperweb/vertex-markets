import { apiRequest } from './client';
import type { MarketsListResponse } from './types';

export async function fetchMarkets(params?: {
  type?: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<MarketsListResponse> {
  const query = new URLSearchParams();
  if (params?.type) query.set('type', params.type);
  if (params?.q) query.set('q', params.q);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return apiRequest<MarketsListResponse>(`/markets${qs ? `?${qs}` : ''}`);
}
