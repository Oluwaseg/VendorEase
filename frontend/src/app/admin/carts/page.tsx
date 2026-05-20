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
      <div className='flex flex-1 items-center justify-center py-24'>
        <Spinner className='w-8 h-8' />
      </div>
    );
  }

  const cartCount = carts?.length ?? 0;

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Header */}
        <div className='bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 mb-12'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h1 className='text-4xl lg:text-5xl font-bold text-foreground'>
                Abandoned Carts
              </h1>
              <p className='text-foreground/60 mt-2'>
                {cartCount} carts inactive for {days}+ days
              </p>
            </div>
            <Button
              onClick={() => sendReminders(days)}
              disabled={isSending || cartCount === 0}
              className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg'
            >
              <Send size={20} />
              {isSending ? 'Sending...' : 'Send Reminders'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className='mb-8'>
          <div className='bg-card border border-border rounded-xl p-6'>
            <label className='block mb-3'>
              <span className='text-sm font-semibold text-foreground mb-2 block'>
                Filter by inactivity (days):
              </span>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className='w-full max-w-xs px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
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

        {/* Carts List */}
        <div className='rounded-2xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg'>
          {cartCount === 0 ? (
            <div className='p-12 text-center'>
              <ShoppingCart
                size={48}
                className='mx-auto text-foreground/30 mb-4'
              />
              <p className='text-foreground/60'>
                No abandoned carts found for the selected period.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-border/50 bg-muted/50'>
                    <th className='px-6 py-4 text-left'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        User Email
                      </span>
                    </th>
                    <th className='px-6 py-4 text-center'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        Items
                      </span>
                    </th>
                    <th className='px-6 py-4 text-right'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        Cart Total
                      </span>
                    </th>
                    <th className='px-6 py-4 text-left'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        Last Updated
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {carts?.map((cart, idx) => (
                    <tr
                      key={cart._id}
                      className={`border-b border-border/30 hover:bg-primary/5 transition-colors ${
                        idx % 2 === 0 ? 'bg-background/50' : 'bg-background'
                      }`}
                    >
                      <td className='px-6 py-4'>
                        <p className='font-semibold text-foreground text-sm'>
                          {(cart.user as any)?.email || 'Unknown'}
                        </p>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent'>
                          {cart.items.length}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <span className='font-bold text-foreground'>
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
