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
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
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
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };
      const response = await api.post<ApiResponse<AuthResponse & { refreshToken: string }>>('/auth/register', payload);
      login(response.data.data);
      toast.success('Account created successfully');
      navigate('/', { replace: true });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <section className="travel-dark relative mb-12 min-h-screen overflow-hidden pt-28 sm:mb-14 lg:mb-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${MAHARASHTRA_MONSOON_IMAGES.heroes.register})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-dark-900/50 to-transparent" />

      <div className="relative mx-auto flex max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
          <div className="hero-copy max-w-2xl text-white">
            <p className="playful-text mt-3 text-2xl !text-primary-400">~ start your adventure ~</p>
            <h1 className="mt-5 font-heading text-5xl leading-[0.95] !text-white sm:text-6xl">
              Create an account and keep the new booking experience connected.
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/82">
              Save your spot, revisit departures, and move from discovery to payment with a cleaner
              travel-template inspired account flow.
            </p>
          </div>

          <div className="travel-glass rounded-[2.4rem] p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-500/10">
                <Mountains className="h-7 w-7 text-forest-500" weight="duotone" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-forest-500">Traveler onboarding</p>
                <h2 className="font-heading text-4xl text-ink-900">Create account</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" autoComplete="off">
              <input type="text" name="fake_register_name" autoComplete="name" className="hidden" tabIndex={-1} />
              <input type="email" name="fake_register_email" autoComplete="email" className="hidden" tabIndex={-1} />
              <input type="password" name="fake_register_password" autoComplete="new-password" className="hidden" tabIndex={-1} />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">First name</label>
                  <div className="travel-input flex items-center gap-3">
                    <User className="h-5 w-5 text-forest-500" />
                    <input
                      {...register('firstName')}
                      autoComplete="off"
                      className="min-w-0 flex-1 bg-transparent focus:outline-none"
                    />
                  </div>
                  {errors.firstName ? <p className="mt-2 text-xs text-coral-600">{errors.firstName.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-700">Last name</label>
                  <div className="travel-input flex items-center gap-3">
                    <User className="h-5 w-5 text-forest-500" />
                    <input
                      {...register('lastName')}
                      autoComplete="off"
                      className="min-w-0 flex-1 bg-transparent focus:outline-none"
                    />
                  </div>
                  {errors.lastName ? <p className="mt-2 text-xs text-coral-600">{errors.lastName.message}</p> : null}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Email</label>
                <div className="travel-input flex items-center gap-3">
                  <EnvelopeSimple className="h-5 w-5 text-forest-500" />
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent focus:outline-none"
                  />
                </div>
                {errors.email ? <p className="mt-2 text-xs text-coral-600">{errors.email.message}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Phone</label>
                <div className="travel-input flex items-center gap-3">
                  <Phone className="h-5 w-5 text-forest-500" />
                  <input
                    {...register('phone')}
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Password</label>
                <div className="travel-input flex items-center gap-3">
                  <Lock className="h-5 w-5 text-forest-500" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="min-w-0 flex-1 bg-transparent focus:outline-none"
                  />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-ink-600">
                    {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password ? <p className="mt-2 text-xs text-coral-600">{errors.password.message}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">Confirm password</label>
                <div className="travel-input flex items-center gap-3">
                  <Lock className="h-5 w-5 text-forest-500" />
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    autoComplete="new-password"
                    className="min-w-0 flex-1 bg-transparent focus:outline-none"
                  />
                </div>
                {errors.confirmPassword ? <p className="mt-2 text-xs text-coral-600">{errors.confirmPassword.message}</p> : null}
              </div>

              <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                Create traveler account
              </Button>
            </form>

            <p className="mt-6 text-sm text-ink-700/72">
              Already registered?{' '}
              <Link to="/login" className="font-medium text-forest-500 hover:text-forest-500">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
