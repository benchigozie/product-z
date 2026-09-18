'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { apiFetch } from '@/lib/api';

type User = {
    id: string;
    email: string;
    emailVerified: boolean;
    profile: {
      displayName: string | null;
      username: string | null;
      avatarUrl: string | null;
    } | null;
  };

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: {
    email: string;
    password: string;
  }) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await apiFetch<{ user: User }>('/auth/me');

        setUser(response.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(data: {
    email: string;
    password: string;
  }) {
    const response = await apiFetch<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    setUser(response.user);
  }

  async function register(data: {
    email: string;
    password: string;
  }) {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async function logout() {
    await apiFetch('/auth/logout', {
      method: 'POST',
    });

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider',
    );
  }

  return context;
}