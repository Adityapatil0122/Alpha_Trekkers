import axios from 'axios';
import type { ApiResponse, AuthResponse } from '@alpha-trekkers/shared';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

type RefreshTokens = Pick<AuthResponse, 'accessToken' | 'refreshToken'>;
type RetriableRequest = {
  headers?: Record<string, string>;
  _retry?: boolean;
  url?: string;
};

let refreshPromise: Promise<RefreshTokens> | null = null;

function resolveLoginPath() {
  const { user } = useAuthStore.getState();
  const currentPath = window.location.pathname;

  if (user?.role === 'ADMIN' || currentPath.startsWith('/admin')) {
    return '/admin/login';
  }

  return '/login';
}

function redirectToLogin() {
  const loginPath = resolveLoginPath();

  if (window.location.pathname !== loginPath) {
    window.location.assign(loginPath);
  }
}

async function refreshAccessToken(refreshToken: string): Promise<RefreshTokens> {
  const response = await refreshClient.post<ApiResponse<RefreshTokens>>('/auth/refresh-token', {
    refreshToken,
  });

  return response.data.data;
}

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & RetriableRequest) | undefined;
    const { accessToken, refreshToken, isAuthenticated, logout, setTokens } = useAuthStore.getState();

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/refresh-token')) {
      logout();
      redirectToLogin();
      return Promise.reject(error);
    }

    if (!refreshToken || originalRequest._retry) {
      if (accessToken || isAuthenticated) {
        logout();
        redirectToLogin();
      }

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken(refreshToken).finally(() => {
          refreshPromise = null;
        });
      }

      const tokens = await refreshPromise;
      setTokens(tokens);
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      logout();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
