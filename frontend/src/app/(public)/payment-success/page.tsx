'use client';

import { InlineError, InlineLoader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useVerifyPayment } from '@/hooks/use-payment';
import { Check, ChevronRight, FileText, Home, Mail } from 'lucide-react';
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
      {/* Background decorative elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-primary/0 rounded-full blur-3xl' />
        <div className='absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-tr from-accent/5 to-accent/0 rounded-full blur-3xl' />
      </div>

      <section className='relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center'>
        <div className='w-full max-w-4xl mx-auto'>
          {!reference ? (
            <InlineError
              size='lg'
              title='Missing payment reference'
              message="We couldn't find your payment reference. Please return to checkout and try again."
              backHref='/'
              backLabel='Back to home'
            />
          ) : isPending ? (
            <InlineLoader size='lg' message='Verifying payment...' />
          ) : isError ? (
            <InlineError
              size='lg'
              title='Payment verification failed'
              message={
                error?.message ||
                'We encountered an error while verifying your payment.'
              }
              backHref='/orders'
              backLabel='View orders'
              onRetry={() => verify(reference)}
            />
          ) : data ? (
            // Success or Completed State
            <div className='space-y-8'>
              {/* Main Success Card */}
              <Card className='border border-primary/20 bg-gradient-to-br from-card via-card to-card/80 shadow-2xl overflow-hidden backdrop-blur-xl'>
                <div className='p-8 sm:p-12 lg:p-16'>
                  {/* Success Icon with Animation */}
                  <div className='flex justify-center mb-8'>
                    <div className='relative'>
                      {/* Outer glow circles */}
                      <div className='absolute inset-0 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-pulse' />
                      <div className='absolute inset-4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse animation-delay-100' />

                      {/* Main icon container */}
                      <div className='relative w-32 h-32 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full flex items-center justify-center border border-primary/30'>
                        <div className='w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg'>
                          <Check
                            className='w-12 h-12 text-white animate-bounce'
                            strokeWidth={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Success Message */}
                  <div className='text-center mb-10 space-y-3'>
                    <h1 className='text-4xl sm:text-5xl font-bold text-foreground'>
                      {isSuccess ? 'Payment Successful!' : 'Payment Confirmed'}
                    </h1>
                    <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                      {isSuccess
                        ? 'Your order has been processed and confirmed. A confirmation email has been sent to your inbox.'
                        : 'Your payment has been received and is being processed. You can track your order anytime.'}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className='h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-10' />

                  {/* Payment Details Grid */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
                    {/* Reference ID Card */}
                    <div className='p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/40 hover:border-primary/30 transition-colors'>
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2'>
                            Reference ID
                          </p>
                          <p className='text-sm font-mono font-semibold text-foreground break-all hover:text-primary transition-colors cursor-pointer'>
                            {reference}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Card */}
                    <div className='p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-colors'>
                      <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2'>
                        Payment Status
                      </p>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 rounded-full bg-primary animate-pulse' />
                        <p className='text-sm font-semibold text-primary capitalize'>
                          {status || 'Completed'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className='bg-muted/30 border border-border/40 rounded-2xl p-6 mb-10'>
                    <h3 className='font-semibold text-foreground mb-4 flex items-center gap-2'>
                      <Mail className='w-5 h-5 text-primary' />
                      What&apos;s Next?
                    </h3>
                    <ul className='space-y-3 text-sm text-muted-foreground'>
                      <li className='flex gap-3'>
                        <span className='text-primary font-bold'>1.</span>
                        <span>
                          Check your email for order confirmation and receipt
                        </span>
                      </li>
                      <li className='flex gap-3'>
                        <span className='text-primary font-bold'>2.</span>
                        <span>
                          View detailed order information in your dashboard
                        </span>
                      </li>
                      <li className='flex gap-3'>
                        <span className='text-primary font-bold'>3.</span>
                        <span>
                          Download invoices and track your order status anytime
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                    <Button asChild size='lg' className='gap-2 px-8'>
                      <a href='/dashboard/orders'>
                        <FileText className='w-5 h-5' />
                        View Orders
                        <ChevronRight className='w-4 h-4' />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant='outline'
                      size='lg'
                      className='gap-2 px-8'
                    >
                      <a href='/'>
                        <Home className='w-5 h-5' />
                        Back to Home
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Security Info Footer */}
              <div className='text-center'>
                <p className='text-sm text-muted-foreground flex items-center justify-center gap-2'>
                  <Check className='w-4 h-4 text-primary' />
                  Your transaction is secure and encrypted
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
    <Suspense fallback={<InlineLoader size='lg' message='Loading...' />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
