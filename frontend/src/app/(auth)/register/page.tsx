'use client';

import { logo } from '@/assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGoogleAuth, useRegister } from '@/hooks/use-auth';
import { registerSchema, type RegisterFormData } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

declare global {
  interface Window {
    google: any;
  }
}

const steps = [
  { id: 1, title: 'Personal Info', description: 'Your name and email' },
  { id: 2, title: 'Security', description: 'Create a strong password' },
  { id: 3, title: 'Optional', description: 'Referral code & terms' },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: register, isPending } = useRegister();
  const { mutate: googleAuth, isPending: isGooglePending } = useGoogleAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Prefill referral code from URL query parameter
  useEffect(() => {
    const referralCode = searchParams.get('ref');
    if (referralCode) {
      setValue('referralCode', referralCode);
    }
  }, [searchParams, setValue]);

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
          console.error('Google authentication error:', error);
        },
      });
    }
  };

  const validateStep = async (step: number) => {
    switch (step) {
      case 1:
        return await trigger(['firstName', 'lastName', 'email']);
      case 2:
        return await trigger(['password', 'confirmPassword']);
      case 3:
        return await trigger(['agreeToTerms']);
      default:
        return true;
    }
  };

  const handleNextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: RegisterFormData) => {
    register(
      {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        referralCode: data.referralCode,
      },
      {
        onSuccess: () => {
          setTimeout(() => router.push('/login'), 2500);
        },
        onError: (error: any) => {
          console.error('Registration error:', error);
        },
      }
    );
  };

  return (
    <main className='min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
      <div className='w-full max-w-2xl'>
        {/* Header */}
        <div className='mb-12 text-center'>
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
            Create Account
          </h1>
          <p className='text-foreground/60 text-sm sm:text-base'>
            Join VendorEase for curated shopping
          </p>
        </div>

        {/* Stepper */}
        <div className='mb-12'>
          <div className='flex items-center justify-between relative'>
            {/* Progress Line Background */}
            <div className='absolute top-5 left-0 right-0 h-1 bg-surface -z-10 rounded-full' />

            {/* Progress Line Fill */}
            <div
              className='absolute top-5 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-300'
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />

            {steps.map((step) => (
              <div
                key={step.id}
                className='flex flex-col items-center flex-1 relative z-10'
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 mb-3 ${
                    completedSteps.includes(step.id)
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === step.id
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                        : 'bg-surface text-foreground/50'
                  }`}
                >
                  {completedSteps.includes(step.id) ? (
                    <Check className='w-5 h-5' />
                  ) : (
                    step.id
                  )}
                </div>
                <div className='text-center'>
                  <p className='text-xs sm:text-sm font-medium text-foreground'>
                    {step.title}
                  </p>
                  <p className='text-xs text-foreground/50'>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className='bg-card border border-border rounded-2xl shadow-card p-8 sm:p-10'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className='space-y-6 animate-fade-up'>
                <div>
                  <h2 className='text-xl font-display font-bold text-foreground mb-1'>
                    Let&apos;s start with your name
                  </h2>
                  <p className='text-sm text-foreground/60'>
                    We&apos;ll use this to personalize your experience
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground'>
                      First Name
                    </label>
                    <Input
                      type='text'
                      placeholder='John'
                      className='h-11 text-base'
                      {...registerField('firstName')}
                      autoComplete='given-name'
                    />
                    {errors.firstName && (
                      <p className='text-xs text-danger'>
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground'>
                      Last Name
                    </label>
                    <Input
                      type='text'
                      placeholder='Doe'
                      className='h-11 text-base'
                      {...registerField('lastName')}
                      autoComplete='family-name'
                    />
                    {errors.lastName && (
                      <p className='text-xs text-danger'>
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>
                    Email Address
                  </label>
                  <Input
                    type='email'
                    placeholder='you@example.com'
                    className='h-11 text-base'
                    {...registerField('email')}
                    autoComplete='email'
                  />
                  {errors.email && (
                    <p className='text-xs text-danger'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Security */}
            {currentStep === 2 && (
              <div className='space-y-6 animate-fade-up'>
                <div>
                  <h2 className='text-xl font-display font-bold text-foreground mb-1'>
                    Create a strong password
                  </h2>
                  <p className='text-sm text-foreground/60'>
                    Use at least 8 characters with a mix of letters, numbers,
                    and symbols
                  </p>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>
                    Password
                  </label>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      className='h-11 text-base pr-11'
                      {...registerField('password')}
                      autoComplete='new-password'
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
                    <p className='text-xs text-danger'>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      className='h-11 text-base pr-11'
                      {...registerField('confirmPassword')}
                      autoComplete='new-password'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors'
                      aria-label='Toggle confirm password visibility'
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className='text-xs text-danger'>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Optional & Terms */}
            {currentStep === 3 && (
              <div className='space-y-6 animate-fade-up'>
                <div>
                  <h2 className='text-xl font-display font-bold text-foreground mb-1'>
                    Almost there!
                  </h2>
                  <p className='text-sm text-foreground/60'>
                    Add a referral code if you have one, and accept our terms
                  </p>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>
                    Referral Code{' '}
                    <span className='text-foreground/50 text-xs'>
                      (Optional)
                    </span>
                  </label>
                  <Input
                    type='text'
                    placeholder='Enter referral code'
                    className='h-11 text-base'
                    {...registerField('referralCode')}
                  />
                  {errors.referralCode && (
                    <p className='text-xs text-danger'>
                      {errors.referralCode.message}
                    </p>
                  )}
                </div>

                <div className='space-y-3 pt-2'>
                  <label className='flex items-start gap-3 cursor-pointer group'>
                    <input
                      type='checkbox'
                      className='mt-1 w-5 h-5 rounded border-2 border-border accent-primary cursor-pointer transition-colors group-hover:border-primary/50'
                      {...registerField('agreeToTerms')}
                    />
                    <span className='text-sm text-foreground/70 leading-relaxed'>
                      I agree to the{' '}
                      <Link
                        href='#'
                        className='text-primary hover:text-primary/80 font-medium transition-colors'
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href='#'
                        className='text-primary hover:text-primary/80 font-medium transition-colors'
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className='text-xs text-danger'>
                      {errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className='flex gap-3 pt-4'>
              {currentStep > 1 && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={handlePrevStep}
                  className='flex-1 h-11'
                >
                  Back
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button
                  type='button'
                  onClick={handleNextStep}
                  className='flex-1 h-11 gap-2 bg-primary hover:bg-primary/90'
                >
                  Next
                  <ChevronRight className='w-4 h-4' />
                </Button>
              ) : (
                <Button
                  type='submit'
                  disabled={isPending}
                  className='flex-1 h-11 bg-primary hover:bg-primary/90'
                >
                  {isPending ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className='relative py-6 my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-border' />
            </div>
            <div className='relative flex justify-center text-xs'>
              <span className='px-2 bg-card text-foreground/60'>
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <div className='flex justify-center mb-6'>
            <div
              ref={googleButtonRef}
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            />
          </div>

          {/* Sign In Link */}
          <p className='text-center text-sm text-foreground/60'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-primary hover:text-primary/80 font-semibold transition-colors'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
