'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/currency-context';
import { formatPrice } from '@/lib/format-price';
import { RecentUserOrder } from '@/types/user-dashboard';
import { format } from 'date-fns';
import { ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

interface RecentOrdersProps {
  orders: RecentUserOrder[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300';
      case 'pending':
        return 'bg-amber-500/20 text-amber-700 dark:text-amber-300';
      case 'failed':
        return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getShippingStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const { currency, convert } = useCurrency();

  if (!orders || orders.length === 0) {
    return (
      <div className='bg-card border border-border rounded-xl p-8'>
        <div className='flex items-center gap-4 mb-6'>
          <div className='p-3 rounded-lg bg-primary/10'>
            <Package size={24} className='text-primary' />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-foreground'>
              Recent Orders
            </h2>
            <p className='text-sm text-foreground/60'>Your latest purchases</p>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <Package size={48} className='text-foreground/20 mb-4' />
          <p className='text-foreground/60 font-medium'>No orders yet</p>
          <p className='text-sm text-foreground/40 mt-1'>
            Start shopping to place your first order
          </p>
          <Link href='/shop'>
            <Button className='mt-4'>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow'>
      <div className='flex items-center gap-4 mb-6'>
        <div className='p-3 rounded-lg bg-primary/10'>
          <Package size={24} className='text-primary' />
        </div>
        <div className='flex-1'>
          <h2 className='text-2xl font-bold text-foreground'>Recent Orders</h2>
          <p className='text-sm text-foreground/60'>Your latest purchases</p>
        </div>
        <Link href='/orders'>
          <Button variant='ghost' size='sm' className='gap-2'>
            View All <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <div className='space-y-3'>
        {orders.map((order) => (
          <div
            key={order._id}
            className='flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50 hover:border-border hover:bg-muted transition-all group cursor-pointer'
          >
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <p className='font-semibold text-foreground'>
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <Badge
                  className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className='flex items-center gap-3'>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${getShippingStatusColor(order.shippingStatus)}`}
                >
                  {order.shippingStatus}
                </span>
                <span className='text-xs text-foreground/50'>
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-lg font-bold text-foreground'>
                {formatPrice(convert(order.total), currency)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
