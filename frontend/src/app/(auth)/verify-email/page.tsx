'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useVerifyEmail } from '@/hooks/use-auth';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
    error,
  } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      return;
    }
    verifyEmail({ token });
  }, [token, verifyEmail]);

  if (!token) {
    return (
      <main>
        <section className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background py-8 sm:py-12'>
          <Card className='w-full max-w-md border border-border shadow-lg rounded-2xl overflow-hidden'>
            <div className='p-8 sm:p-10 space-y-8 text-center'>
              <div className='flex justify-center animate-in fade-in duration-500'>
                <div className='bg-destructive/10 p-5 rounded-full border border-destructive/20'>
                  <AlertCircle className='w-8 h-8 text-destructive' />
                </div>
              </div>

              <div className='space-y-3'>
                <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                  Invalid Link
                </h1>
                <p className='text-sm text-foreground/60 leading-relaxed'>
                  No verification token found in the URL. This link may be
                  expired or invalid.
                </p>
              </div>

              <div className='pt-4 flex flex-col sm:flex-row gap-3'>
                <Link href='/login' className='flex-1'>
                  <Button
                    variant='outline'
                    className='w-full h-11 text-sm font-semibold transition-all duration-200'
                  >
                    Back to Login
                  </Button>
                </Link>
                <Link href='/register' className='flex-1'>
                  <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-sm font-semibold transition-all duration-200'>
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background py-8 sm:py-12'>
        <Card className='w-full max-w-md border border-border shadow-lg rounded-2xl overflow-hidden'>
          <div className='p-8 sm:p-10 space-y-8'>
            {isPending && (
              <>
                <div className='flex justify-center animate-in fade-in duration-500'>
                  <div className='bg-primary/10 p-5 rounded-full border border-primary/20'>
                    <Loader2 className='w-8 h-8 text-primary animate-spin' />
                  </div>
                </div>
                <div className='text-center space-y-3'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                    Verifying Email
                  </h1>
                  <p className='text-sm text-foreground/60 leading-relaxed'>
                    Please wait while we verify your email address. This should
                    only take a moment.
                  </p>
                </div>
                <div className='h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full overflow-hidden'>
                  <div className='h-full w-1/2 bg-primary animate-pulse'></div>
                </div>
              </>
            )}

            {isSuccess && (
              <>
                <div className='flex justify-center animate-in zoom-in-50 duration-500'>
                  <div className='bg-green-500/10 p-5 rounded-full border border-green-500/20'>
                    <CheckCircle2 className='w-8 h-8 text-green-500' />
                  </div>
                </div>
                <div className='text-center space-y-3'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                    Email Verified!
                  </h1>
                  <p className='text-sm text-foreground/60 leading-relaxed'>
                    Your email has been successfully verified. You can now
                    access all features and start using your account.
                  </p>
                </div>
                <div className='pt-4 space-y-3'>
                  <Button
                    onClick={() => router.push('/login')}
                    className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 text-sm transition-all duration-200'
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    onClick={() => router.push('/login')}
                    variant='outline'
                    className='w-full h-11 text-sm font-semibold transition-all duration-200'
                  >
                    Back to Login
                  </Button>
                </div>
              </>
            )}

            {isError && (
              <>
                <div className='flex justify-center animate-in shake duration-500'>
                  <div className='bg-destructive/10 p-5 rounded-full border border-destructive/20'>
                    <AlertCircle className='w-8 h-8 text-destructive' />
                  </div>
                </div>
                <div className='text-center space-y-3'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                    Verification Failed
                  </h1>
                  <p className='text-sm text-foreground/60 leading-relaxed'>
                    {error?.message ||
                      'An error occurred while verifying your email. The link may have expired or been used already.'}
                  </p>
                </div>
                <div className='bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2'>
                  <p className='text-xs font-semibold text-amber-900/80'>
                    What you can do:
                  </p>
                  <ul className='text-xs text-amber-900/70 space-y-1'>
                    <li>
                      • Request a new verification email from your login page
                    </li>
                    <li>• Check your spam folder for the verification email</li>
                    <li>• Contact support if the issue persists</li>
                  </ul>
                </div>
                <div className='pt-4 flex flex-col sm:flex-row gap-3'>
                  <Button
                    onClick={() => router.push('/login')}
                    variant='outline'
                    className='flex-1 h-11 text-sm font-semibold transition-all duration-200'
                  >
                    Back to Login
                  </Button>
                  <Button
                    onClick={() => router.push('/register')}
                    className='flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-sm font-semibold transition-all duration-200'
                  >
                    Try Again
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main>
          <section className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background py-8 sm:py-12'>
            <Card className='w-full max-w-md border border-border shadow-lg rounded-2xl overflow-hidden'>
              <div className='p-8 sm:p-10 space-y-8'>
                <div className='flex justify-center animate-in fade-in duration-500'>
                  <div className='bg-primary/10 p-5 rounded-full border border-primary/20'>
                    <Loader2 className='w-8 h-8 text-primary animate-spin' />
                  </div>
                </div>
                <div className='text-center space-y-3'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                    Loading...
                  </h1>
                  <p className='text-sm text-foreground/60'>
                    Please wait while we prepare your verification page.
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
