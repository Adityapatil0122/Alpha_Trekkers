import { create } from 'zustand';
import type { ApiResponse, AuthResponse, User } from '@alpha-trekkers/shared';
import api from '@/lib/axios';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

function clearStoredTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function storeTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: AuthResponse) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setTokens: (tokens: Pick<AuthResponse, 'accessToken' | 'refreshToken'>) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  isAuthenticated: !!(localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY)),
  isLoading: false,

  login: (data: AuthResponse) => {
    storeTokens(data.accessToken, data.refreshToken);
    set({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    clearStoredTokens();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  setTokens: (tokens) => {
    storeTokens(tokens.accessToken, tokens.refreshToken);
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: true,
    });
  },

  checkAuth: async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!accessToken && !refreshToken) {
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: true,
    });

    try {
      const { data } = await api.get<ApiResponse<{ user: User }>>('/auth/me');
      set({
        user: data.data.user,
        accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
        refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      clearStoredTokens();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
