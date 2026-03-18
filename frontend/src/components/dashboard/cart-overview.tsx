'use client';

import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/currency-context';
import { formatPrice } from '@/lib/format-price';
import { CartStats } from '@/types/user-dashboard';
import { CreditCard, Heart, ShoppingCart, Truck } from 'lucide-react';
import Link from 'next/link';

interface CartOverviewProps {
  cartStats: CartStats;
}

export function CartOverview({ cartStats }: CartOverviewProps) {
  const { currency, convert } = useCurrency();
  return (
    <div className='space-y-6'>
      {/* Cart Stats Card */}
      <div className='bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6'>
        <div className='mb-6'>
          <div className='p-3 rounded-lg bg-primary/20 w-fit mb-4'>
            <ShoppingCart size={24} className='text-primary' />
          </div>
          <h2 className='text-2xl font-bold text-foreground'>Cart Summary</h2>
        </div>

        <div className='space-y-4 mb-6'>
          <div className='flex items-center justify-between py-3 border-b border-border/50'>
            <span className='text-foreground/60 text-sm'>Items in Cart</span>
            <span className='text-2xl font-bold text-foreground'>
              {cartStats.itemCount}
            </span>
          </div>
          <div className='flex items-center justify-between py-3'>
            <span className='text-foreground/60 text-sm'>Cart Total</span>
            <span className='text-2xl font-bold text-primary'>
              {formatPrice(convert(cartStats.total), currency)}
            </span>
          </div>
        </div>

        {cartStats.itemCount > 0 ? (
          <Link href='/checkout' className='w-full'>
            <Button className='w-full gap-2'>
              <ShoppingCart size={18} />
              Proceed to Checkout
            </Button>
          </Link>
        ) : (
          <Link href='/shop' className='w-full'>
            <Button variant='outline' className='w-full'>
              Continue Shopping
            </Button>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className='bg-card border border-border rounded-xl p-6'>
        <h3 className='text-lg font-bold text-foreground mb-4'>
          Quick Actions
        </h3>
        <div className='space-y-3'>
          <Link href='/orders'>
            <div className='flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-border bg-muted/50 hover:bg-muted transition-all group cursor-pointer'>
              <div className='p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors'>
                <Truck size={20} className='text-blue-600 dark:text-blue-400' />
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-sm text-foreground'>
                  Track Orders
                </p>
                <p className='text-xs text-foreground/60'>
                  View your shipments
                </p>
              </div>
            </div>
          </Link>

          <Link href='/payment-methods'>
            <div className='flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-border bg-muted/50 hover:bg-muted transition-all group cursor-pointer'>
              <div className='p-3 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors'>
                <CreditCard
                  size={20}
                  className='text-emerald-600 dark:text-emerald-400'
                />
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-sm text-foreground'>
                  Payment Methods
                </p>
                <p className='text-xs text-foreground/60'>Manage your cards</p>
              </div>
            </div>
          </Link>

          <Link href='/wishlist'>
            <div className='flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-border bg-muted/50 hover:bg-muted transition-all group cursor-pointer'>
              <div className='p-3 rounded-lg bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors'>
                <Heart size={20} className='text-rose-600 dark:text-rose-400' />
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-sm text-foreground'>
                  Wishlist
                </p>
                <p className='text-xs text-foreground/60'>Saved items</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
