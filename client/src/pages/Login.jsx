import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import VaultBackdrop from '../components/layout/VaultBackdrop';
import VaultMark from '../components/layout/VaultMark';
import { authService } from '../services/auth';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await authService.login(data.email, data.password);
      // result is already response.data from axios, which is { success, data: { user, accessToken }, message }
      const { user, accessToken } = result.data;
      setAuth(user, accessToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Login failed';

      if (status === 404) {
        toast.error('User does not exist. Redirecting to sign up...');
        setTimeout(() => navigate('/register'), 1500);
      } else {
        toast.error(message);
      }
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
            Welcome back
          </h2>
          <p className="text-sm text-mocha-700 mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <Button
              type="submit"
              loading={isLoading}
              className="w-full mt-2"
              size="lg"
            >
              <ArrowRight size={18} />
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-mocha-700">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-gold-700 hover:text-gold-800 font-medium underline underline-offset-2 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
