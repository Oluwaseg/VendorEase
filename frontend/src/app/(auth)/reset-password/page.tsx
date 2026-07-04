'use client';

import { logo } from '@/assets';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '@/hooks/use-auth';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    resetPassword(
      {
        token,
        password: data.password,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        },
        onError: (error: any) => {
          console.error('Reset password error:', error);
        },
      }
    );
  };

  if (!token) {
    return (
      <main>
        <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-secondary/5 py-8 sm:py-12'>
          <div className='w-full max-w-md'>
            <div className='flex justify-center mb-8'>
              <Image
                src={logo}
                alt='VendorEase Logo'
                width={50}
                height={24}
                priority
                className='object-contain'
              />
            </div>

            <Card className='border border-border/60 shadow-xl'>
              <div className='p-8 sm:p-10 space-y-6 text-center'>
                <div className='flex justify-center'>
                  <div className='w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center'>
                    <AlertCircle className='w-8 h-8 text-red-500' />
                  </div>
                </div>

                <div className='space-y-2'>
                  <h1 className='text-2xl font-bold text-foreground'>
                    Invalid Link
                  </h1>
                  <p className='text-sm text-foreground/65'>
                    This password reset link is invalid or has expired. Please
                    request a new one.
                  </p>
                </div>

                <Link href='/forgot-password'>
                  <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 text-sm'>
                    Request New Link
                  </Button>
                </Link>

                <Link href='/login'>
                  <Button
                    variant='ghost'
                    className='w-full text-foreground/65 hover:text-foreground h-11'
                  >
                    Back to Sign in
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-secondary/5 py-8 sm:py-12'>
        <div className='w-full max-w-md'>
          <div className='flex justify-center mb-8'>
            <Image
              src={logo}
              alt='VendorEase Logo'
              width={50}
              height={24}
              priority
              className='object-contain'
            />
          </div>

          <Card className='border border-border/60 shadow-xl overflow-hidden'>
            <div className='p-8 sm:p-10 space-y-6 animate-in fade-in duration-300'>
              {/* Header */}
              <div className='space-y-2 text-center'>
                <div className='flex justify-center'>
                  <div className='w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center'>
                    <Lock className='w-7 h-7 text-primary' />
                  </div>
                </div>
                <h1 className='text-3xl font-bold text-foreground'>
                  Reset Password
                </h1>
                <p className='text-sm text-foreground/65 leading-relaxed'>
                  Create a strong password to secure your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                {/* New Password */}
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-foreground'>
                    New Password
                  </label>
                  <div className='relative group'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      className='bg-secondary/40 border-border/60 h-11 text-sm placeholder:text-foreground/40 pr-10 focus:bg-secondary/60 transition-colors'
                      {...register('password')}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors'
                      aria-label='Toggle password visibility'
                    >
                      {showPassword ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <Eye className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className='text-xs text-red-500 font-medium'>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-foreground'>
                    Confirm Password
                  </label>
                  <div className='relative group'>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      className='bg-secondary/40 border-border/60 h-11 text-sm placeholder:text-foreground/40 pr-10 focus:bg-secondary/60 transition-colors'
                      {...register('confirmPassword')}
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors'
                      aria-label='Toggle confirm password visibility'
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <Eye className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className='text-xs text-red-500 font-medium'>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className='bg-secondary/30 border border-border/60 rounded-lg p-3'>
                  <p className='text-xs font-semibold text-foreground mb-2'>
                    Password Requirements:
                  </p>
                  <ul className='text-xs text-foreground/70 space-y-1'>
                    <li className='flex gap-2'>
                      <span className='text-primary'>•</span>
                      <span>At least 8 characters</span>
                    </li>
                    <li className='flex gap-2'>
                      <span className='text-primary'>•</span>
                      <span>Mix of uppercase and lowercase letters</span>
                    </li>
                    <li className='flex gap-2'>
                      <span className='text-primary'>•</span>
                      <span>At least one number</span>
                    </li>
                  </ul>
                </div>

                <Button
                  type='submit'
                  disabled={isPending}
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 text-sm transition-all duration-200 mt-6'
                >
                  {isPending ? (
                    <span className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
                      Resetting...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className='text-center pt-2'>
                <Link
                  href='/login'
                  className='text-sm text-foreground/65 hover:text-foreground transition-colors'
                >
                  Remember your password?{' '}
                  <span className='font-semibold text-primary hover:text-primary/80'>
                    Sign in
                  </span>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
