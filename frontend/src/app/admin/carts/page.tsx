'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useCurrency } from '@/contexts/currency-context';
import {
  useGetAbandonedCarts,
  useSendAbandonedCartReminders,
} from '@/hooks/use-admin';
import { formatPrice } from '@/lib/format-price';
import { Send, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function AdminCartsPage() {
  const [days, setDays] = useState(7);
  const { data: carts, isLoading } = useGetAbandonedCarts(days);
  const { mutate: sendReminders, isPending: isSending } =
    useSendAbandonedCartReminders();
  const { currency, convert } = useCurrency();

  if (isLoading) {
    return (
      <div className='flex flex-1 items-center justify-center min-h-screen bg-surface'>
        <Spinner className='w-8 h-8' />
      </div>
    );
  }

  const cartCount = carts?.length ?? 0;

  return (
    <div className='min-h-screen bg-surface'>
      {/* Header */}
      <div className='border-b border-border bg-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-foreground'>
                Abandoned Carts
              </h1>
              <p className='text-foreground/60 mt-2 text-sm sm:text-base'>
                {cartCount} cart{cartCount !== 1 ? 's' : ''} inactive for {days}
                + day{days !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              onClick={() => sendReminders(days)}
              disabled={isSending || cartCount === 0}
              className='bg-brand hover:bg-brand/90 text-brand-foreground font-semibold px-6 py-3 rounded-[0.5rem] flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center sm:justify-start disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Send size={20} />
              {isSending ? 'Sending...' : 'Send Reminders'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Filter Card */}
        <div className='mb-8'>
          <div className='bg-card border border-border rounded-[0.5rem] p-6'>
            <label className='block'>
              <span className='text-sm font-semibold text-foreground mb-3 block'>
                Filter by inactivity (days):
              </span>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className='w-full max-w-xs px-4 py-2 border border-border rounded-[0.375rem] bg-surface-2 text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
              >
                <option value={1}>1+ days</option>
                <option value={3}>3+ days</option>
                <option value={7}>7+ days</option>
                <option value={14}>14+ days</option>
                <option value={30}>30+ days</option>
              </select>
            </label>
          </div>
        </div>

        {/* Carts Table */}
        <div className='rounded-[0.5rem] border border-border overflow-hidden bg-card shadow-sm'>
          {cartCount === 0 ? (
            <div className='p-12 text-center'>
              <ShoppingCart
                size={48}
                className='mx-auto text-foreground/20 mb-4'
              />
              <p className='text-foreground/60 text-sm sm:text-base'>
                No abandoned carts found for the selected period.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-border bg-surface-2'>
                    <th className='px-6 py-4 text-left'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-widest'>
                        Customer Email
                      </span>
                    </th>
                    <th className='px-6 py-4 text-center'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-widest'>
                        Items
                      </span>
                    </th>
                    <th className='px-6 py-4 text-right'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-widest'>
                        Total Value
                      </span>
                    </th>
                    <th className='px-6 py-4 text-left'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-widest'>
                        Last Updated
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {carts?.map((cart, idx) => (
                    <tr
                      key={cart._id}
                      className={`border-b border-border hover:bg-surface-2/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-card' : 'bg-surface/50'
                      }`}
                    >
                      <td className='px-6 py-4'>
                        <p className='font-semibold text-foreground text-sm truncate'>
                          {(cart.user as any)?.email || 'Unknown'}
                        </p>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand'>
                          {cart.items.length}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <span className='font-bold text-foreground text-sm'>
                          {formatPrice(convert(cart.total), currency)}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-foreground/60'>
                        {new Date(cart.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
