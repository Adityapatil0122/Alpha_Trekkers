import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && !user && !isLoading) {
      void checkAuth();
    }
  }, [checkAuth, isAuthenticated, isLoading, user]);

  if (isLoading || (isAuthenticated && !user)) {
    return <LoadingSpinner fullPage text="Verifying access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
