'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthResponse } from '@/types';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: AuthResponse | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('nexa_user');
    const token = localStorage.getItem('nexa_token');
    if (stored && token) {
      const parsed = JSON.parse(stored) as AuthResponse;
      if (new Date(parsed.expiresAt) > new Date()) {
        setUser(parsed);
      } else {
        localStorage.removeItem('nexa_user');
        localStorage.removeItem('nexa_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await authApi.login(email, password);
    if (res.success && res.data) {
      setUser(res.data);
      localStorage.setItem('nexa_token', res.data.token);
      localStorage.setItem('nexa_user', JSON.stringify(res.data));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexa_token');
    localStorage.removeItem('nexa_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
