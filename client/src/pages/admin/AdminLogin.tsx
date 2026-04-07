import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeSlash, Lock, UserCircleGear } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { ApiResponse, AuthResponse } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, checkAuth, isAuthenticated, isLoading, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated && !user && !isLoading) {
      void checkAuth();
    }
  }, [checkAuth, isAuthenticated, isLoading, user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post<ApiResponse<AuthResponse & { refreshToken: string }>>(
        '/auth/login',
        data,
      );

      if (response.data.data.user.role !== 'ADMIN') {
        toast.error('This login page is only for admin accounts.');
        return;
      }

      login(response.data.data);
      toast.success(`Admin access granted, ${response.data.data.user.firstName}`);
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Admin login failed. Please try again.';
      toast.error(message);
    }
  };

  if (isLoading || (isAuthenticated && !user)) {
    return <LoadingSpinner fullPage text="Checking admin access..." />;
  }

  if (isAuthenticated && user?.role === 'ADMIN') {
    return <Navigate to={from} replace />;
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <img
        src={MAHARASHTRA_MONSOON_IMAGES.trips.torna[3]}
        alt="Torna fort landscape"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900/48 via-dark-900/28 to-dark-900/42" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-[2.4rem] border border-white/22 bg-white/18 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-2xl sm:p-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <UserCircleGear className="h-8 w-8 text-forest-500" weight="duotone" />
            </div>
            <h1 className="font-heading text-4xl !text-white">Admin Sign In</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" autoComplete="off">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Admin email</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="section-admin username"
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/65 backdrop-blur-md focus:border-white/35 focus:outline-none"
                placeholder="admin@alphatrekkers.com"
              />
              {errors.email ? (
                <p className="mt-2 text-xs text-white/80">{errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                <Lock className="h-5 w-5 text-forest-500" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="section-admin current-password"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/65 focus:outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-white/80"
                >
                  {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-2 text-xs text-white/80">{errors.password.message}</p>
              ) : null}
            </div>

            <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
