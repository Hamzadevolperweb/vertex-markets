export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  details?: Array<{ field?: string; message: string }>;
};

export type AuthUser = {
  id: string;
  email: string;
  role: 'Admin' | 'Customer' | string;
  verified?: boolean;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type MarketItem = {
  id: string;
  type: 'Forex' | 'Crypto' | 'Stocks' | 'Commodities' | 'Indices' | string;
  title: string;
  slug: string;
  icon?: string;
  description?: string;
  order?: number;
  active?: boolean;
};

export type MarketsListResponse = {
  items: MarketItem[];
  total: number;
  page: number;
  limit: number;
};
