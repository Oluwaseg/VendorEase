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
    <div className='min-h-screen bg-surface'>
      {/* Header */}
      <div className='border-b border-border bg-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-foreground'>
                Payment Reconciliation
              </h1>
              <p className='text-foreground/60 mt-2 text-sm sm:text-base'>
                Sync pending Paystack payments with your database
              </p>
            </div>
            <Button
              onClick={handleReconcile}
              disabled={isReconciling}
              className='bg-brand hover:bg-brand/90 text-brand-foreground font-semibold px-6 py-3 rounded-[0.5rem] flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center sm:justify-start'
            >
              <Zap size={20} />
              {isReconciling ? 'Reconciling...' : 'Start Reconciliation'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Configuration Card */}
        <div className='mb-8'>
          <div className='bg-card border border-border rounded-[0.5rem] p-6'>
            <label className='block'>
              <span className='text-sm font-semibold text-foreground mb-3 block'>
                Reconcile payments pending for (hours):
              </span>
              <select
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className='w-full max-w-xs px-4 py-2 border border-border rounded-[0.375rem] bg-surface-2 text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
              >
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={6}>6 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
              </select>
              <p className='text-xs text-foreground/60 mt-3'>
                Only payments pending for at least the selected duration will be
                reconciled.
              </p>
            </label>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className='space-y-6'>
            {/* Results Card */}
            <div className='rounded-[0.5rem] border border-border overflow-hidden bg-card shadow-sm'>
              <div className='p-6 sm:p-8'>
                <h2 className='text-2xl font-bold text-foreground mb-8'>
                  Reconciliation Results
                </h2>

                {/* Stats Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
                  {/* Checked */}
                  <div className='rounded-[0.5rem] border border-border bg-surface-2 p-5'>
                    <p className='text-xs uppercase tracking-widest text-foreground/60 mb-2'>
                      Checked
                    </p>
                    <p className='text-3xl sm:text-4xl font-bold text-foreground'>
                      {result.checked ?? 0}
                    </p>
                    <p className='text-xs text-foreground/60 mt-2'>
                      Verified against Paystack
                    </p>
                  </div>

                  {/* Paid */}
                  <div className='rounded-[0.5rem] border border-success/30 bg-success/5 p-5'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Check size={16} className='text-success' />
                      <p className='text-xs uppercase tracking-widest text-success'>
                        Paid
                      </p>
                    </div>
                    <p className='text-3xl sm:text-4xl font-bold text-success'>
                      {result.paid ?? 0}
                    </p>
                    <p className='text-xs text-success/70 mt-2'>
                      Successfully verified and updated
                    </p>
                  </div>

                  {/* Cancelled */}
                  <div className='rounded-[0.5rem] border border-danger/30 bg-danger/5 p-5'>
                    <div className='flex items-center gap-2 mb-2'>
                      <X size={16} className='text-danger' />
                      <p className='text-xs uppercase tracking-widest text-danger'>
                        Cancelled
                      </p>
                    </div>
                    <p className='text-3xl sm:text-4xl font-bold text-danger'>
                      {result.cancelled ?? 0}
                    </p>
                    <p className='text-xs text-danger/70 mt-2'>
                      Marked as cancelled
                    </p>
                  </div>

                  {/* Untouched */}
                  <div className='rounded-[0.5rem] border border-warning/30 bg-warning/5 p-5'>
                    <div className='flex items-center gap-2 mb-2'>
                      <AlertCircle size={16} className='text-warning' />
                      <p className='text-xs uppercase tracking-widest text-warning'>
                        Pending
                      </p>
                    </div>
                    <p className='text-3xl sm:text-4xl font-bold text-warning'>
                      {result.untouched ?? 0}
                    </p>
                    <p className='text-xs text-warning/70 mt-2'>
                      Still pending verification
                    </p>
                  </div>

                  {/* Errors */}
                  <div className='rounded-[0.5rem] border border-danger/30 bg-danger/5 p-5'>
                    <div className='flex items-center gap-2 mb-2'>
                      <AlertCircle size={16} className='text-danger' />
                      <p className='text-xs uppercase tracking-widest text-danger'>
                        Errors
                      </p>
                    </div>
                    <p className='text-3xl sm:text-4xl font-bold text-danger'>
                      {result.errors ?? 0}
                    </p>
                    <p className='text-xs text-danger/70 mt-2'>
                      Failed attempts
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className='mt-8 pt-8 border-t border-border'>
                  <p className='text-sm text-foreground/70 leading-relaxed'>
                    <strong className='text-foreground'>Summary:</strong> Out of{' '}
                    {result.checked} payments checked, {result.paid} were
                    verified as paid, {result.cancelled} were cancelled,{' '}
                    {result.untouched} remain pending, and {result.errors}{' '}
                    encountered errors during reconciliation.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='flex gap-4'>
              <Button
                onClick={handleReconcile}
                disabled={isReconciling}
                className='bg-brand hover:bg-brand/90 text-brand-foreground font-semibold px-6 py-3 rounded-[0.5rem] flex items-center gap-2'
              >
                <Zap size={20} />
                {isReconciling ? 'Reconciling...' : 'Run Again'}
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && (
          <div className='rounded-[0.5rem] border border-border overflow-hidden bg-card shadow-sm'>
            <div className='p-12 text-center'>
              <Zap size={48} className='mx-auto text-foreground/20 mb-4' />
              <p className='text-foreground/60 text-sm sm:text-base'>
                Click "Start Reconciliation" to begin matching pending payments
                with Paystack
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
