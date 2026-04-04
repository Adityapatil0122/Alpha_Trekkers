import { create } from 'zustand';
import type { ApiResponse, AuthResponse, User } from '@alpha-trekkers/shared';
import api from '@/lib/axios';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: AuthResponse) => void;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  login: (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken);
    set({
      user: data.user,
      accessToken: data.accessToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ user: null, accessToken: null, isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const { data } = await api.get<ApiResponse<{ user: User }>>('/auth/me');
      set({
        user: data.data.user,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('accessToken');
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
