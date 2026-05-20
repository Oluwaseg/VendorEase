'use client';

import { Button } from '@/components/ui/button';
import { useReconcilePayments } from '@/hooks/use-payment';
import { AlertCircle, Check, X, Zap } from 'lucide-react';
import { useState } from 'react';

export default function AdminPaymentsPage() {
  const [hours, setHours] = useState(1);
  const [result, setResult] = useState<any | null>(null);
  const { mutate: reconcile, isPending: isReconciling } =
    useReconcilePayments();

  const handleReconcile = () => {
    reconcile(hours, {
      onSuccess: (data) => {
        setResult(data);
      },
    });
  };

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Header */}
        <div className='bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 mb-12'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h1 className='text-4xl lg:text-5xl font-bold text-foreground'>
                Payment Reconciliation
              </h1>
              <p className='text-foreground/60 mt-2'>
                Reconcile pending Paystack payments with your database
              </p>
            </div>
            <Button
              onClick={handleReconcile}
              disabled={isReconciling}
              className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg'
            >
              <Zap size={20} />
              {isReconciling ? 'Reconciling...' : 'Start Reconciliation'}
            </Button>
          </div>
        </div>

        {/* Configuration */}
        <div className='mb-8'>
          <div className='bg-card border border-border rounded-xl p-6'>
            <div>
              <label className='block'>
                <span className='text-sm font-semibold text-foreground mb-2 block'>
                  Reconcile payments pending for (hours):
                </span>
                <select
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className='w-full max-w-xs px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                </select>
              </label>
              <p className='text-xs text-foreground/60 mt-3'>
                Only payments that have been pending for at least the selected
                duration will be reconciled.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className='space-y-6'>
            <div className='rounded-2xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg p-8'>
              <h2 className='text-2xl font-bold text-foreground mb-8'>
                Reconciliation Results
              </h2>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
                {/* Checked */}
                <div className='rounded-xl border border-border/50 bg-muted/30 p-6'>
                  <p className='text-sm uppercase tracking-[0.2em] text-foreground/50 mb-3'>
                    Checked
                  </p>
                  <p className='text-4xl font-bold text-foreground'>
                    {result.checked ?? 0}
                  </p>
                  <p className='text-xs text-foreground/60 mt-2'>
                    Payments verified against Paystack
                  </p>
                </div>

                {/* Paid */}
                <div className='rounded-xl border border-border/50 bg-green-950/20 border-green-800/30 p-6'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Check size={16} className='text-green-600' />
                    <p className='text-sm uppercase tracking-[0.2em] text-green-700'>
                      Paid
                    </p>
                  </div>
                  <p className='text-4xl font-bold text-green-600'>
                    {result.paid ?? 0}
                  </p>
                  <p className='text-xs text-green-700/60 mt-2'>
                    Successfully verified and updated
                  </p>
                </div>

                {/* Cancelled */}
                <div className='rounded-xl border border-border/50 bg-red-950/20 border-red-800/30 p-6'>
                  <div className='flex items-center gap-2 mb-3'>
                    <X size={16} className='text-red-600' />
                    <p className='text-sm uppercase tracking-[0.2em] text-red-700'>
                      Cancelled
                    </p>
                  </div>
                  <p className='text-4xl font-bold text-red-600'>
                    {result.cancelled ?? 0}
                  </p>
                  <p className='text-xs text-red-700/60 mt-2'>
                    Marked as cancelled
                  </p>
                </div>

                {/* Untouched */}
                <div className='rounded-xl border border-border/50 bg-yellow-950/20 border-yellow-800/30 p-6'>
                  <div className='flex items-center gap-2 mb-3'>
                    <AlertCircle size={16} className='text-yellow-600' />
                    <p className='text-sm uppercase tracking-[0.2em] text-yellow-700'>
                      Untouched
                    </p>
                  </div>
                  <p className='text-4xl font-bold text-yellow-600'>
                    {result.untouched ?? 0}
                  </p>
                  <p className='text-xs text-yellow-700/60 mt-2'>
                    Still pending verification
                  </p>
                </div>

                {/* Errors */}
                <div className='rounded-xl border border-border/50 bg-orange-950/20 border-orange-800/30 p-6'>
                  <div className='flex items-center gap-2 mb-3'>
                    <AlertCircle size={16} className='text-orange-600' />
                    <p className='text-sm uppercase tracking-[0.2em] text-orange-700'>
                      Errors
                    </p>
                  </div>
                  <p className='text-4xl font-bold text-orange-600'>
                    {result.errors ?? 0}
                  </p>
                  <p className='text-xs text-orange-700/60 mt-2'>
                    Failed reconciliation attempts
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className='mt-8 pt-8 border-t border-border/30'>
                <p className='text-sm text-foreground/70'>
                  <strong>Summary:</strong> Out of {result.checked} payments
                  checked, {result.paid} were verified as paid,{' '}
                  {result.cancelled} were cancelled, {result.untouched} remain
                  pending, and {result.errors} encountered errors during
                  reconciliation.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              <Button
                onClick={handleReconcile}
                disabled={isReconciling}
                className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-lg flex items-center gap-2'
              >
                <Zap size={20} />
                {isReconciling ? 'Reconciling...' : 'Run Again'}
              </Button>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!result && (
          <div className='rounded-2xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg p-12 text-center'>
            <Zap size={48} className='mx-auto text-foreground/30 mb-4' />
            <p className='text-foreground/60'>
              Click "Start Reconciliation" to begin matching pending payments
              with Paystack
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
