import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  EnvelopeSimple,
  Eye,
  EyeSlash,
  Lock,
  Mountains,
  Phone,
  User,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import toast from 'react-hot-toast';
import type { ApiResponse, AuthResponse } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';

const schema = z
  .object({
    firstName: z.string().trim().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().trim().min(2, 'Last name must be at least 2 characters'),
    email: z.string().trim().email('Please enter a valid email').toLowerCase(),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || undefined,
        password: data.password,
      };
      const response = await api.post<ApiResponse<AuthResponse & { refreshToken: string }>>('/auth/register', payload);
      login(response.data.data);
      toast.success('Account created successfully');
      navigate('/', { replace: true });
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string; errors?: Array<{ message?: string }> } };
      };
      const message =
        apiError.response?.data?.errors?.[0]?.message ||
        apiError.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-28">
      <img
        src={MAHARASHTRA_MONSOON_IMAGES.heroes.login}
        alt="Alpha Trekkers registration"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.74),rgba(15,23,42,0.44),rgba(15,23,42,0.16))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.26),rgba(15,23,42,0.1),rgba(15,23,42,0.38))]" />

      <div className="relative mx-auto flex max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_0.8fr] lg:items-center lg:gap-14">
          <div className="hero-copy max-w-2xl text-white">
            <p className="playful-text mt-3 text-2xl !text-primary-400">~ start your adventure ~</p>
            <h1 className="mt-5 font-heading text-4xl leading-[0.95] !text-white sm:text-5xl lg:text-6xl">
              Create an account and keep the new booking experience connected.
            </h1>
            <p className="mt-5 text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
              Save your spot, revisit departures, and move from discovery to payment with a cleaner
              travel-template inspired account flow.
            </p>
          </div>

          <div className="w-full max-w-md rounded-[2.4rem] border border-white/22 bg-white/18 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-2xl sm:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Mountains className="h-7 w-7 text-forest-500" weight="duotone" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/82">Traveler onboarding</p>
                <h2 className="font-heading text-3xl !text-white sm:text-4xl">Create account</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" autoComplete="off">
              <input type="text" name="fake_register_name" autoComplete="name" className="hidden" tabIndex={-1} />
              <input type="email" name="fake_register_email" autoComplete="email" className="hidden" tabIndex={-1} />
              <input type="password" name="fake_register_password" autoComplete="new-password" className="hidden" tabIndex={-1} />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">First name</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                    <User className="h-5 w-5 text-forest-500" />
                    <input
                      {...register('firstName')}
                      autoComplete="off"
                      className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/65 focus:outline-none"
                      placeholder="Enter your first name"
                    />
                  </div>
                  {errors.firstName ? <p className="mt-2 text-xs text-white/80">{errors.firstName.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Last name</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                    <User className="h-5 w-5 text-forest-500" />
                    <input
                      {...register('lastName')}
                      autoComplete="off"
                      className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/65 focus:outline-none"
                      placeholder="Enter your last name"
                    />
                  </div>
                  {errors.lastName ? <p className="mt-2 text-xs text-white/80">{errors.lastName.message}</p> : null}
                </div>
              </div>

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
                {errors.email ? <p className="mt-2 text-xs text-white/80">{errors.email.message}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">Phone</label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                  <Phone className="h-5 w-5 text-forest-500" />
                  <input
                    {...register('phone')}
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/65 focus:outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>
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
                    placeholder="Create your password"
                  />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-white/80">
                    {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password ? <p className="mt-2 text-xs text-white/80">{errors.password.message}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">Confirm password</label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                  <Lock className="h-5 w-5 text-forest-500" />
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    autoComplete="new-password"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/65 focus:outline-none"
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword ? <p className="mt-2 text-xs text-white/80">{errors.confirmPassword.message}</p> : null}
              </div>

              <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                Create traveler account
              </Button>
            </form>

            <p className="mt-6 text-sm text-white/80">
              Already registered?{' '}
              <Link to="/login" className="font-medium text-forest-500 hover:text-forest-400">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
