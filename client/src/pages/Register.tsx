import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Mountains,
  EnvelopeSimple,
  Lock,
  User,
  Phone,
  Eye,
  EyeSlash,
} from '@phosphor-icons/react';
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
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = { ...data };
      delete payload.confirmPassword;
      const res = await api.post<ApiResponse<AuthResponse & { refreshToken: string }>>(
        '/auth/register',
        payload,
      );
      login(res.data.data);
      toast.success('Welcome to Alpha Trekkers!');
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-forest-700 bg-forest-800/50 py-3 pl-12 pr-4 text-sm text-white placeholder:text-forest-500 focus:border-forest-500 focus:outline-none';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 px-4 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-forest-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        <div className="glass-dark overflow-hidden rounded-3xl p-8 shadow-2xl sm:p-10">
          <div className="mb-8 text-center">
            <Link to="/" className="mb-4 inline-flex items-center gap-2">
              <Mountains className="h-8 w-8 text-forest-400" weight="duotone" />
              <span className="font-heading text-2xl font-bold text-white">
                Alpha <span className="text-forest-400">Trekkers</span>
              </span>
            </Link>
            <h1 className="mt-4 font-heading text-2xl font-bold text-white">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-forest-300/60">
              Join thousands of adventurers exploring Maharashtra
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-forest-200">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest-500" />
                  <input
                    type="text"
                    {...register('firstName')}
                    placeholder="John"
                    className={inputClass}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-forest-200">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest-500" />
                  <input
                    type="text"
                    {...register('lastName')}
                    placeholder="Doe"
                    className={inputClass}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-forest-200">Email</label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest-500" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-forest-200">
                Phone <span className="text-forest-500">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest-500" />
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-forest-200">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-forest-700 bg-forest-800/50 py-3 pl-12 pr-12 text-sm text-white placeholder:text-forest-500 focus:border-forest-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-forest-500 hover:text-forest-300"
                >
                  {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-forest-200">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest-500" />
                <input
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="Re-enter password"
                  className={inputClass}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-forest-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest-300 hover:text-white">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
