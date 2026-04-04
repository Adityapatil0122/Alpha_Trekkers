import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeSlash, Lock, ShieldCheck, UserCircleGear } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
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
    <section className="travel-dark relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(94,180,170,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(223,157,53,0.12),transparent_24%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[0.92fr_0.78fr] lg:items-center">
          <div className="max-w-2xl text-white">
            <span className="section-label !bg-white/10 !text-sand-100 before:!bg-gold-400">
              Admin Access Only
            </span>
            <h1 className="mt-6 font-heading text-5xl leading-[0.95] sm:text-6xl">
              Control trip operations, schedules, pricing, and media from one place.
            </h1>
            <p className="mt-5 text-lg leading-8 text-sand-100/76">
              This route is intentionally separate from the public website. Only administrator
              accounts can proceed beyond this point.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.7rem] border border-white/10 bg-white/8 p-5">
                <ShieldCheck className="h-8 w-8 text-gold-400" weight="duotone" />
                <p className="mt-4 font-heading text-3xl text-white">Private admin route</p>
                <p className="mt-2 text-sm leading-7 text-sand-100/72">
                  Public users do not see any admin link in the main website navigation.
                </p>
              </div>
              <div className="rounded-[1.7rem] border border-white/10 bg-white/8 p-5">
                <UserCircleGear className="h-8 w-8 text-gold-400" weight="duotone" />
                <p className="mt-4 font-heading text-3xl text-white">Role-checked sign in</p>
                <p className="mt-2 text-sm leading-7 text-sand-100/72">
                  Even valid non-admin accounts are blocked from this admin login flow.
                </p>
              </div>
            </div>
          </div>

          <div className="travel-glass rounded-[2.4rem] p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-500/10">
                <ShieldCheck className="h-7 w-7 text-forest-500" weight="duotone" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-forest-500">
                  Separate Admin Login
                </p>
                <h2 className="font-heading text-4xl text-ink-900">Sign in to admin</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" autoComplete="off">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Admin email</label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="section-admin username"
                  className="travel-input"
                  placeholder="admin@alphatrekkers.com"
                />
                {errors.email ? (
                  <p className="mt-2 text-xs text-coral-600">{errors.email.message}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Password</label>
                <div className="travel-input flex items-center gap-3">
                  <Lock className="h-5 w-5 text-forest-500" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="section-admin current-password"
                    className="min-w-0 flex-1 bg-transparent focus:outline-none"
                    placeholder="Admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-ink-600"
                  >
                    {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="mt-2 text-xs text-coral-600">{errors.password.message}</p>
                ) : null}
              </div>

              <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                Enter admin panel
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
