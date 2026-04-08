'use client';

import { logo } from '@/assets';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '@/hooks/use-auth';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
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
        <section className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background py-8 sm:py-12'>
          <Card className='w-full max-w-sm border-2 border-border shadow-lg'>
            <div className='p-6 sm:p-8 space-y-5 text-center'>
              <div className='space-y-1'>
                <div className='flex justify-center'>
                  <Image
                    src={logo}
                    alt='SOS-Store Logo'
                    width={60}
                    height={30}
                    priority
                    className='object-contain'
                  />
                </div>
                <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                  Invalid Link
                </h1>
                <p className='text-sm text-foreground/60'>
                  This password reset link is invalid or has expired.
                </p>
              </div>
              <Link href='/forgot-password'>
                <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 sm:h-11 text-sm'>
                  Request New Link
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background py-8 sm:py-12'>
        <Card className='w-full max-w-sm border-2 border-border shadow-lg'>
          <div className='p-6 sm:p-8 space-y-5'>
            <div className='text-center space-y-1'>
              <div className='flex justify-center'>
                <Image
                  src={logo}
                  alt='SOS-Store Logo'
                  width={60}
                  height={30}
                  priority
                  className='object-contain'
                />
              </div>
              <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                Reset Password
              </h1>
              <p className='text-sm text-foreground/60'>
                Create a new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* New Password */}
              <div className='space-y-1.5'>
                <label className='text-xs sm:text-sm font-medium text-foreground'>
                  New Password
                </label>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    className='bg-secondary/50 border-border h-9 sm:h-10 text-sm pr-10'
                    {...register('password')}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors'
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
                  <p className='text-xs text-red-500 line-clamp-1'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className='space-y-1.5'>
                <label className='text-xs sm:text-sm font-medium text-foreground'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    className='bg-secondary/50 border-border h-9 sm:h-10 text-sm pr-10'
                    {...register('confirmPassword')}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors'
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
                  <p className='text-xs text-red-500 line-clamp-1'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type='submit'
                disabled={isPending}
                className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 sm:h-11 text-sm'
              >
                {isPending ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>

            <div className='text-center'>
              <p className='text-xs text-foreground/60'>
                Remember your password?{' '}
                <Link
                  href='/login'
                  className='text-accent hover:text-accent/80 font-semibold'
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
