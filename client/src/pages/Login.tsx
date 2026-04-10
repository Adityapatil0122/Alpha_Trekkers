import { useEffect, useState } from 'react';
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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    reset({ email: '', password: '' });
  }, [reset]);

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
    <section className="relative min-h-screen overflow-hidden pt-28">
      <img
        src={MAHARASHTRA_MONSOON_IMAGES.heroes.login}
        alt="Alpha Trekkers sign in"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.74),rgba(15,23,42,0.44),rgba(15,23,42,0.16))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.26),rgba(15,23,42,0.1),rgba(15,23,42,0.38))]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[0.98fr_0.78fr] lg:items-center lg:gap-14">
          <div className="hero-copy max-w-2xl text-white">
            <p className="playful-text mt-3 text-2xl !text-primary-400">~ start your adventure ~</p>
            <h1 className="mt-5 font-heading text-4xl leading-[0.95] !text-white sm:text-5xl lg:text-6xl">
              Sign in and keep your next trek booking moving without friction.
            </h1>
            <p className="mt-5 text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
              Pick up where you left off, review departures, and manage your bookings with the same
              cleaner account flow used across the travel experience.
            </p>
          </div>

          <div className="w-full max-w-md rounded-[2.4rem] border border-white/22 bg-white/18 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-2xl sm:p-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Mountains className="h-8 w-8 text-forest-500" weight="duotone" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/82">Account access</p>
                <h2 className="font-heading text-3xl !text-white sm:text-4xl">Sign In</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" autoComplete="off">
              <input type="text" name="fake_username" autoComplete="username" className="hidden" tabIndex={-1} />
              <input type="password" name="fake_password" autoComplete="current-password" className="hidden" tabIndex={-1} />

              <div>
                <label className="mb-2 block text-sm font-medium text-white">Email</label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                  <EnvelopeSimple className="h-5 w-5 text-forest-500" />
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/65 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
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
                    autoComplete="new-password"
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

            <p className="mt-6 text-sm text-white/80">
              New to Alpha Trekkers?{' '}
              <Link to="/register" className="font-medium text-forest-500 hover:text-forest-400">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
