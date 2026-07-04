'use client';

import { logo } from '@/assets';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForgotPassword } from '@/hooks/use-auth';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const { mutate: forgetPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch('email');

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgetPassword(
      { email: data.email },
      {
        onSuccess: () => {
          setEmailSent(true);
        },
        onError: (error: any) => {
          console.error('Forgot password error:', error);
        },
      }
    );
  };

  return (
    <main>
      <section className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-secondary/5 py-8 sm:py-12'>
        <div className='w-full max-w-md'>
          {/* Logo */}
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
            <div className='p-8 sm:p-10'>
              {!emailSent ? (
                <div className='space-y-6 animate-in fade-in duration-300'>
                  {/* Header */}
                  <div className='space-y-2 text-center'>
                    <div className='flex justify-center'>
                      <div className='w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center'>
                        <Mail className='w-7 h-7 text-primary' />
                      </div>
                    </div>
                    <h1 className='text-3xl font-bold text-foreground'>
                      Forgot Password?
                    </h1>
                    <p className='text-sm text-foreground/65 leading-relaxed'>
                      No worries! Enter your email address and we&apos;ll send
                      you a link to reset your password.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-semibold text-foreground'>
                        Email Address
                      </label>
                      <Input
                        type='email'
                        placeholder='you@example.com'
                        className='bg-secondary/40 border-border/60 h-11 text-sm placeholder:text-foreground/40 focus:bg-secondary/60 transition-colors'
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className='text-xs text-red-500 font-medium'>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type='submit'
                      disabled={isPending}
                      className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 text-sm transition-all duration-200'
                    >
                      {isPending ? (
                        <span className='flex items-center gap-2'>
                          <div className='w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
                          Sending...
                        </span>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </form>

                  {/* Footer */}
                  <div className='text-center pt-2'>
                    <Link
                      href='/login'
                      className='inline-flex items-center gap-2 text-sm text-foreground/65 hover:text-foreground transition-colors group'
                    >
                      <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
                      Back to Sign in
                    </Link>
                  </div>
                </div>
              ) : (
                <div className='space-y-6 animate-in fade-in duration-300'>
                  {/* Success State */}
                  <div className='space-y-2 text-center'>
                    <div className='flex justify-center'>
                      <div className='w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center'>
                        <CheckCircle2 className='w-8 h-8 text-green-500' />
                      </div>
                    </div>
                    <h2 className='text-2xl font-bold text-foreground'>
                      Check Your Email
                    </h2>
                    <p className='text-sm text-foreground/65'>
                      We&apos;ve sent a password reset link to:
                    </p>
                  </div>

                  {/* Email Display */}
                  <div className='bg-primary/5 border border-primary/20 rounded-xl p-4'>
                    <p className='text-center font-semibold text-foreground text-sm break-all'>
                      {emailValue}
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className='bg-secondary/40 border border-border/60 rounded-xl p-4 space-y-2'>
                    <h3 className='font-semibold text-sm text-foreground'>
                      What&apos;s next?
                    </h3>
                    <ul className='text-xs text-foreground/70 space-y-1.5'>
                      <li className='flex gap-2'>
                        <span className='text-primary font-bold'>1.</span>
                        <span>Click the link in your email</span>
                      </li>
                      <li className='flex gap-2'>
                        <span className='text-primary font-bold'>2.</span>
                        <span>Create a new password</span>
                      </li>
                      <li className='flex gap-2'>
                        <span className='text-primary font-bold'>3.</span>
                        <span>You&apos;re all set!</span>
                      </li>
                    </ul>
                  </div>

                  {/* Spam Notice */}
                  <div className='bg-amber-50 border border-amber-200 rounded-lg p-3'>
                    <p className='text-xs text-amber-800'>
                      <span className='font-semibold'>Tip:</span> If you
                      don&apos;t see the email in a few minutes, check your spam
                      folder.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className='space-y-2 pt-2'>
                    <Button
                      onClick={() => setEmailSent(false)}
                      variant='outline'
                      className='w-full border-border/60 h-11 text-sm font-medium hover:bg-secondary/40 transition-colors'
                    >
                      Try Another Email
                    </Button>
                    <Link href='/login' className='block'>
                      <Button
                        variant='ghost'
                        className='w-full h-11 text-sm text-foreground/65 hover:text-foreground'
                      >
                        Back to Sign in
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
