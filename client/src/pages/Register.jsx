import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import VaultBackdrop from '../components/layout/VaultBackdrop';
import VaultMark from '../components/layout/VaultMark';
import { authService } from '../services/auth';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await authService.register(data.name, data.email, data.password);
      // result is already response.data from axios, which is { success, data: { user, accessToken }, message }
      const { user, accessToken } = result.data;
      setAuth(user, accessToken);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <VaultBackdrop />

      <div className="w-full max-w-md relative z-10 animate-slideUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <VaultMark size={58} className="mb-4" />
          <h1 className="font-display text-3xl font-semibold text-warm-900 mb-1.5">
            What I Signed
          </h1>
          <p className="text-[11px] tracking-[0.16em] uppercase text-mocha-600">
            Your personal agreement vault
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-strong rounded-2xl p-8">
          <h2 className="font-display text-xl font-semibold text-warm-900 mb-1">
            Create your account
          </h2>
          <p className="text-sm text-mocha-700 mb-6">Start securing your agreements</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              loading={isLoading}
              className="w-full mt-2"
              size="lg"
            >
              <ArrowRight size={18} />
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-mocha-700">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-gold-700 hover:text-gold-800 font-medium underline underline-offset-2 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
