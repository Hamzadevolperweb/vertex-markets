import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '../api/auth';
import { getAccessToken, setAccessToken } from '../api/client';
import { ApiError } from '../api/client';
import type { AuthUser } from '../api/types';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: {
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
  }) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function splitName(fullName?: string) {
  if (!fullName?.trim()) return { firstName: '', lastName: '' };
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = getAccessToken();
      if (!token) {
        if (!cancelled) setIsBootstrapping(false);
        return;
      }
      try {
        const me = await authApi.getMe();
        if (!cancelled) setUser(me);
      } catch {
        setAccessToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedIn } = await authApi.login({ email, password });
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(
    async (input: { email: string; password: string; fullName?: string; phone?: string }) => {
      const { firstName, lastName } = splitName(input.fullName);
      await authApi.register({
        email: input.email,
        password: input.password,
        profile: {
          firstName,
          lastName,
          phone: input.phone || '',
        },
      });
      // Auto-login after signup for smoother UX
      return login(input.email, input.password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      if (!(err instanceof ApiError)) throw err;
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'Admin',
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [user, isBootstrapping, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
