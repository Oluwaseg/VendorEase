'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useVerifyPayment } from '@/hooks/use-payment';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Home,
  LayoutDashboard,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const reference = useMemo(
    () => searchParams.get('reference') || '',
    [searchParams]
  );

  const {
    mutate: verify,
    data,
    isPending,
    isError,
    error,
  } = useVerifyPayment();

  useEffect(() => {
    if (!reference) return;
    verify(reference);
  }, [reference, verify]);

  const status = data?.data?.status;
  const isSuccess =
    status?.toLowerCase() === 'success' ||
    status?.toLowerCase() === 'completed';

  return (
    <main className='min-h-screen bg-background'>
      <section className='pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-background min-h-[calc(100vh-80px)] flex items-center'>
        <div className='w-full max-w-2xl mx-auto'>
          {!reference ? (
            // Missing Reference State
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden'>
              <div className='p-8 sm:p-12 text-center space-y-6'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10'>
                  <AlertCircle className='w-8 h-8 text-destructive' />
                </div>
                <div>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground mb-2'>
                    Missing Payment Reference
                  </h1>
                  <p className='text-muted-foreground'>
                    We couldn't find your payment reference. Please return to
                    checkout and try again.
                  </p>
                </div>
                <div className='flex flex-col sm:flex-row gap-3 justify-center pt-4'>
                  <Button asChild className='gap-2'>
                    <a href='/'>
                      <Home className='w-4 h-4' />
                      Back to Home
                    </a>
                  </Button>
                  <Button asChild variant='outline' className='gap-2'>
                    <a href='/shop'>
                      <RefreshCw className='w-4 h-4' />
                      Try Checkout Again
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ) : isPending ? (
            // Loading State
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden'>
              <div className='p-8 sm:p-12 text-center space-y-6'>
                <div className='flex justify-center'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0 rounded-full blur-xl animate-pulse' />
                    <div className='relative w-16 h-16 border-4 border-border rounded-full border-t-primary animate-spin' />
                  </div>
                </div>
                <div>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground mb-2'>
                    Verifying Payment
                  </h1>
                  <p className='text-muted-foreground'>
                    Please wait while we confirm your transaction...
                  </p>
                </div>
                <Loader2 className='w-5 h-5 text-primary animate-spin mx-auto' />
              </div>
            </Card>
          ) : isError ? (
            // Error State
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden'>
              <div className='p-8 sm:p-12 text-center space-y-6'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10'>
                  <AlertCircle className='w-8 h-8 text-destructive' />
                </div>
                <div>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground mb-2'>
                    Payment Verification Failed
                  </h1>
                  <p className='text-muted-foreground mb-2'>
                    {error?.message ||
                      'We encountered an error while verifying your payment.'}
                  </p>
                  <p className='text-xs text-muted-foreground font-mono bg-muted/30 p-3 rounded-lg'>
                    Reference: {reference}
                  </p>
                </div>
                <div className='flex flex-col sm:flex-row gap-3 justify-center pt-4'>
                  <Button asChild className='gap-2'>
                    <a href='/'>
                      <Home className='w-4 h-4' />
                      Back to Home
                    </a>
                  </Button>
                  <Button asChild variant='outline' className='gap-2'>
                    <a href='/orders'>
                      <LayoutDashboard className='w-4 h-4' />
                      View Orders
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ) : data ? (
            // Success or Completed State
            <div className='space-y-6'>
              <Card className='border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden'>
                <div className='p-8 sm:p-12 text-center space-y-6'>
                  {/* Success Icon with Animation */}
                  <div className='flex justify-center mb-2'>
                    <div className='relative'>
                      <div className='absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-500/0 rounded-full blur-2xl animate-pulse' />
                      <div className='relative w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-full flex items-center justify-center'>
                        <div className='w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce'>
                          <Check className='w-10 h-10 text-white' />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Success Message */}
                  <div>
                    <h1 className='text-3xl sm:text-4xl font-bold text-foreground mb-2'>
                      {isSuccess ? 'Payment Successful!' : 'Payment Confirmed'}
                    </h1>
                    <p className='text-base text-muted-foreground'>
                      {isSuccess
                        ? 'Your order has been processed and confirmed. Check your email for order details.'
                        : 'Your payment has been received and is being processed.'}
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-border/40'>
                    <div className='p-4 rounded-lg bg-muted/20'>
                      <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1'>
                        Reference ID
                      </p>
                      <p className='text-sm font-mono font-semibold text-foreground break-all'>
                        {reference}
                      </p>
                    </div>
                    <div className='p-4 rounded-lg bg-muted/20'>
                      <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1'>
                        Status
                      </p>
                      <p className='text-sm font-semibold text-emerald-600 capitalize'>
                        {status || 'Completed'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-col sm:flex-row gap-3 justify-center pt-4'>
                    <Button asChild className='gap-2'>
                      <a href='/dashboard/orders'>
                        <LayoutDashboard className='w-4 h-4' />
                        View Your Orders
                      </a>
                    </Button>
                    <Button asChild variant='outline' className='gap-2'>
                      <a href='/'>
                        <ChevronLeft className='w-4 h-4' />
                        Back to Shopping
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Help Text */}
              <div className='text-center'>
                <p className='text-sm text-muted-foreground'>
                  You can safely close this page. A confirmation email has been
                  sent to your inbox.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className='min-h-screen bg-background'>
          <section className='pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-background min-h-[calc(100vh-80px)] flex items-center'>
            <div className='w-full max-w-2xl mx-auto'>
              <Card className='border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden'>
                <div className='p-8 sm:p-12 text-center space-y-6'>
                  <div className='flex justify-center'>
                    <div className='relative'>
                      <div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0 rounded-full blur-xl animate-pulse' />
                      <div className='relative w-16 h-16 border-4 border-border rounded-full border-t-primary animate-spin' />
                    </div>
                  </div>
                  <div>
                    <h1 className='text-2xl sm:text-3xl font-bold text-foreground mb-2'>
                      Loading...
                    </h1>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
