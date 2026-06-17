import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-parchment relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-20 -right-32 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10 animate-slideUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-700 shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">W</span>
          </div>
          <h1 className="text-2xl font-bold text-warm-900 mb-1">
            What Did I Sign?
          </h1>
          <p className="text-sm text-warm-500">Your personal agreement vault</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 border border-cream-300/60 shadow-lg rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-warm-900 mb-1">Welcome back</h2>
          <p className="text-sm text-warm-500 mb-6">Sign in to your account</p>

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
            <p className="text-sm text-warm-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-warm-700 hover:text-warm-900 font-medium transition-colors"
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
