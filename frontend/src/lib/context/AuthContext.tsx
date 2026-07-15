'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '@/lib/api/client';
import type { UserDto } from '@/lib/types';

interface AuthContextType {
  user: UserDto | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { fullName?: string; avatarUrl?: string }) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function setTokenCookie(token: string) {
  document.cookie = `accessToken=${token}; path=/; sameSite=lax; max-age=${7 * 24 * 60 * 60}`;
}

function clearTokenCookie() {
  document.cookie = 'accessToken=; path=/; sameSite=lax; max-age=0';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { setUser(null); return; }
      const { data } = await authApi.me();
      setUser(data.data ?? data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { data: res } = await authApi.login({ email, password });
    const tokens = res.data ?? res;
    if (!tokens.accessToken) {
      throw new Error('Login failed: No access token received from server');
    }
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken ?? '');
    setTokenCookie(tokens.accessToken);
    await refreshUser();
  };

  const register = async (email: string, password: string, fullName?: string) => {
    const { data: res } = await authApi.register({ email, password, fullName });
    const tokens = res.data ?? res;
    if (tokens.accessToken) {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken ?? '');
      setTokenCookie(tokens.accessToken);
      await refreshUser();
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Swallow server errors so client logout always proceeds
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearTokenCookie();
    setUser(null);
  };

  const updateProfile = async (data: { fullName?: string; avatarUrl?: string }) => {
    const { data: res } = await authApi.updateProfile(data);
    setUser(res.data ?? res);
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    await authApi.changePassword(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
