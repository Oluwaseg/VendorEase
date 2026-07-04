'use client';

import { logo } from '@/assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useGoogleAuth,
  useLogin,
  useResendVerification,
} from '@/hooks/use-auth';
import { loginSchema, type LoginFormData } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const { mutate: resendVerification, isPending: isResendPending } =
    useResendVerification();
  const { mutate: googleAuth, isPending: isGooglePending } = useGoogleAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleSuccess,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleSuccess = (response: any) => {
    if (response.credential) {
      googleAuth(response.credential, {
        onSuccess: () => {
          setTimeout(() => router.push('/dashboard'), 2500);
        },
        onError: (error: any) => {
          console.error('Google login error:', error);
        },
      });
    }
  };

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        setTimeout(() => router.push('/dashboard'), 2500);
      },
      onError: (error: any) => {
        console.error(
          'Login error:',
          error.message || 'Login failed. Please try again.'
        );

        // If server says user must verify email, show resend option
        if (
          error?.message &&
          /verify|verification|not verified|please verify/i.test(error.message)
        ) {
          setShowResend(true);
          setResendEmail(data.email);
        }
      },
    });
  };

  return (
    <main className='min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='mb-10 text-center'>
          <div className='flex justify-center mb-6'>
            <Image
              src={logo}
              alt='VendorEase Logo'
              width={64}
              height={64}
              priority
              className='object-contain'
            />
          </div>
          <h1 className='text-3xl sm:text-4xl font-display font-bold text-foreground mb-2'>
            Welcome Back
          </h1>
          <p className='text-foreground/60 text-sm sm:text-base'>
            Sign in to your VendorEase account
          </p>
        </div>

        {/* Form Card */}
        <div className='bg-card border border-border rounded-2xl shadow-card p-8 sm:p-10 space-y-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* Email Field */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                <Mail className='w-4 h-4 text-primary/60' />
                Email Address
              </label>
              <Input
                type='email'
                placeholder='you@example.com'
                className='h-11 text-base'
                {...register('email')}
                autoComplete='email'
              />
              {errors.email && (
                <p className='text-xs text-danger'>{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground flex items-center gap-2'>
                <Lock className='w-4 h-4 text-primary/60' />
                Password
              </label>
              <div className='relative'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  className='h-11 text-base pr-11'
                  {...register('password')}
                  autoComplete='current-password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors'
                  aria-label='Toggle password visibility'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-xs text-danger'>{errors.password.message}</p>
              )}
            </div>

            {/* Resend Verification Alert */}
            {showResend && (
              <div className='bg-warning/10 border border-warning/30 rounded-lg p-4 space-y-3'>
                <p className='text-sm text-warning font-medium'>
                  Email Verification Required
                </p>
                <p className='text-xs text-foreground/70'>
                  Your email hasn&apos;t been verified yet. We&apos;ll send you
                  a verification link.
                </p>
                <Button
                  type='button'
                  onClick={() =>
                    resendVerification(
                      { email: resendEmail || '' },
                      {
                        onSuccess: () => {
                          setShowResend(false);
                          setResendEmail(null);
                        },
                      }
                    )
                  }
                  disabled={isResendPending}
                  className='w-full h-10 text-sm bg-warning hover:bg-warning/90 text-warning-foreground'
                >
                  {isResendPending
                    ? 'Sending Verification...'
                    : 'Resend Verification Email'}
                </Button>
              </div>
            )}

            {/* Remember & Forgot */}
            <div className='flex items-center justify-between text-xs pt-1'>
              <label className='flex items-center gap-2 cursor-pointer group'>
                <input
                  type='checkbox'
                  className='w-4 h-4 rounded border border-border accent-primary cursor-pointer transition-colors group-hover:border-primary/50'
                  aria-label='Remember me'
                />
                <span className='text-foreground/70 group-hover:text-foreground transition-colors'>
                  Remember me
                </span>
              </label>
              <Link
                href='/forgot-password'
                className='text-primary hover:text-primary/80 font-medium transition-colors'
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type='submit'
              disabled={isPending || isGooglePending}
              className='w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base transition-all'
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className='relative py-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-border' />
            </div>
            <div className='relative flex justify-center text-xs'>
              <span className='px-3 bg-card text-foreground/60 font-medium'>
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <div className='flex justify-center'>
            <div
              ref={googleButtonRef}
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            />
          </div>

          {/* Sign Up Link */}
          <p className='text-center text-sm text-foreground/60'>
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='text-primary hover:text-primary/80 font-semibold transition-colors'
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer Info */}
        <div className='mt-8 text-center text-xs text-foreground/50'>
          <p>
            By signing in, you agree to our{' '}
            <Link
              href='#'
              className='text-primary hover:text-primary/80 transition-colors'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='#'
              className='text-primary hover:text-primary/80 transition-colors'
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
