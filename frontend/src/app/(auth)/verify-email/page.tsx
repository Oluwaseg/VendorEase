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
          <Card className='w-full max-w-sm border-2 border-border shadow-lg'>
            <div className='p-6 sm:p-8 space-y-6 text-center'>
              <div className='flex justify-center'>
                <div className='bg-destructive/10 p-4 rounded-full'>
                  <AlertCircle className='w-8 h-8 text-destructive' />
                </div>
              </div>
              <div className='space-y-2'>
                <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                  Invalid Link
                </h1>
                <p className='text-sm text-foreground/60'>
                  No verification token found in the URL. This link may be
                  expired or invalid.
                </p>
              </div>
              <div className='flex gap-3'>
                <Link href='/login' className='flex-1'>
                  <Button
                    variant='outline'
                    className='w-full h-10 sm:h-11 text-sm font-semibold'
                  >
                    Back to Login
                  </Button>
                </Link>
                <Link href='/signup' className='flex-1'>
                  <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 sm:h-11 text-sm font-semibold'>
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
        <Card className='w-full max-w-sm border-2 border-border shadow-lg'>
          <div className='p-6 sm:p-8 space-y-6'>
            {isPending && (
              <>
                <div className='flex justify-center'>
                  <div className='bg-primary/10 p-4 rounded-full'>
                    <Loader2 className='w-8 h-8 text-primary animate-spin' />
                  </div>
                </div>
                <div className='text-center space-y-2'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                    Verifying Email
                  </h1>
                  <p className='text-sm text-foreground/60'>
                    Please wait while we verify your email address...
                  </p>
                </div>
              </>
            )}

            {isSuccess && (
              <>
                <div className='flex justify-center'>
                  <div className='bg-green-500/10 p-4 rounded-full'>
                    <CheckCircle2 className='w-8 h-8 text-green-500' />
                  </div>
                </div>
                <div className='text-center space-y-2'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                    Email Verified!
                  </h1>
                  <p className='text-sm text-foreground/60'>
                    Your email has been successfully verified. You can now
                    access all features.
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/login')}
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 sm:h-11 text-sm'
                >
                  Go to Login
                </Button>
              </>
            )}

            {isError && (
              <>
                <div className='flex justify-center'>
                  <div className='bg-destructive/10 p-4 rounded-full'>
                    <AlertCircle className='w-8 h-8 text-destructive' />
                  </div>
                </div>
                <div className='text-center space-y-2'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                    Verification Failed
                  </h1>
                  <p className='text-sm text-foreground/60'>
                    {error?.message ||
                      'An error occurred while verifying your email. The link may have expired.'}
                  </p>
                </div>
                <div className='flex gap-3'>
                  <Button
                    onClick={() => router.push('/login')}
                    variant='outline'
                    className='flex-1 h-10 sm:h-11 text-sm font-semibold'
                  >
                    Back to Login
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
            <Card className='w-full max-w-sm border-2 border-border shadow-lg'>
              <div className='p-6 sm:p-8 space-y-6'>
                <div className='flex justify-center'>
                  <div className='bg-primary/10 p-4 rounded-full'>
                    <Loader2 className='w-8 h-8 text-primary animate-spin' />
                  </div>
                </div>
                <div className='text-center space-y-2'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
                    Loading...
                  </h1>
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
