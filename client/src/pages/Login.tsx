import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EnvelopeSimple, Eye, EyeSlash, Lock, Mountains } from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import toast from 'react-hot-toast';
import type { ApiResponse, AuthResponse } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post<ApiResponse<AuthResponse & { refreshToken: string }>>('/auth/login', data);

      if (response.data.data.user.role === 'ADMIN') {
        toast.error('Administrator accounts must sign in from /admin/login');
        navigate('/admin/login', { replace: true, state: { from: location.state?.from } });
        return;
      }

      login(response.data.data);
      toast.success(`Welcome back, ${response.data.data.user.firstName}`);
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <section className="travel-dark relative min-h-screen overflow-hidden pt-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-18"
        style={{ backgroundImage: `url(${MAHARASHTRA_MONSOON_IMAGES.heroes.login})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/88 via-ink-900/78 to-ink-900/35" />

      <div className="relative mx-auto flex max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_0.75fr] lg:items-center">
          <div className="max-w-2xl text-white">
            <span className="section-label !bg-white/10 !text-sand-100 before:!bg-gold-400">
              Return to your account
            </span>
            <p className="playful-text text-2xl text-gold-400 mt-3">~ welcome back, explorer ~</p>
            <h1 className="mt-6 font-heading text-5xl leading-[0.95] sm:text-6xl">
              Continue from discovery to booking without losing the travel mood.
            </h1>
            <p className="mt-5 text-lg leading-8 text-sand-100/76">
              Sign in to manage bookings, revisit saved departures, and move through the redesigned
              journey flow.
            </p>
          </div>

          <div className="travel-glass rounded-[2.4rem] p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-500/10">
                <Mountains className="h-7 w-7 text-forest-500" weight="duotone" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-forest-500">Account access</p>
                <h2 className="font-heading text-4xl text-ink-900">Sign in</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" autoComplete="off">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Email</label>
                <div className="travel-input flex items-center gap-3">
                  <EnvelopeSimple className="h-5 w-5 text-forest-500" />
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="section-user username"
                    className="min-w-0 flex-1 bg-transparent focus:outline-none"
                  />
                </div>
                {errors.email ? <p className="mt-2 text-xs text-coral-600">{errors.email.message}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Password</label>
                <div className="travel-input flex items-center gap-3">
                  <Lock className="h-5 w-5 text-forest-500" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="section-user current-password"
                    className="min-w-0 flex-1 bg-transparent focus:outline-none"
                  />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-ink-600">
                    {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password ? <p className="mt-2 text-xs text-coral-600">{errors.password.message}</p> : null}
              </div>

              <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                Enter dashboard
              </Button>
            </form>

            <p className="mt-6 text-sm text-ink-700/72">
              New to Alpha Trekkers?{' '}
              <Link to="/register" className="font-medium text-forest-500 hover:text-forest-500">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
