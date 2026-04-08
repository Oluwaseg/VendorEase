'use client';

import { Card } from '@/components/ui/card';
import { useInitializePayment } from '@/hooks/use-payment';
import { format } from 'date-fns';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Order {
  _id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentStatus: string;
  shippingStatus: string;
  createdAt: string;
}

interface OrdersListProps {
  orders: Order[];
}

const getStatusIcon = (status: string) => {
  const normalizedStatus = status?.toLowerCase().replace('_', ' ');
  switch (normalizedStatus) {
    case 'delivered':
      return <CheckCircle2 className='w-5 h-5' />;
    case 'shipped':
    case 'processing':
      return <Truck className='w-5 h-5' />;
    case 'pending':
      return <Clock className='w-5 h-5' />;
    case 'failed':
    case 'cancelled':
      return <AlertCircle className='w-5 h-5' />;
    default:
      return <Package className='w-5 h-5' />;
  }
};

const getStatusColors = (status: string) => {
  const normalizedStatus = status?.toLowerCase().replace('_', ' ');
  const colorMap: {
    [key: string]: { bg: string; text: string; icon: string };
  } = {
    delivered: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      icon: 'text-emerald-600',
    },
    shipped: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-400',
      icon: 'text-blue-600',
    },
    processing: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400',
      icon: 'text-amber-600',
    },
    pending: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-700 dark:text-orange-400',
      icon: 'text-orange-600',
    },
    failed: {
      bg: 'bg-red-500/10',
      text: 'text-red-700 dark:text-red-400',
      icon: 'text-red-600',
    },
    cancelled: {
      bg: 'bg-red-500/10',
      text: 'text-red-700 dark:text-red-400',
      icon: 'text-red-600',
    },
    paid: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      icon: 'text-emerald-600',
    },
  };
  return (
    colorMap[normalizedStatus] || {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      icon: 'text-muted-foreground',
    }
  );
};

export function OrdersList({ orders }: OrdersListProps) {
  const { mutate: initializePayment, isPending } = useInitializePayment();
  const handleRetryPayment = (orderId: string) => {
    initializePayment(
      {
        orderId,
        callbackUrl: window.location.origin + '/payment-success',
      },
      {
        onSuccess: (res) => {
          const url = res.paystack.data.authorization_url;
          window.location.href = url;
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to retry payment');
        },
      }
    );
  };
  return (
    <div className='space-y-4'>
      {orders.map((order) => {
        const shippingColors = getStatusColors(order.shippingStatus);
        const paymentColors = getStatusColors(order.paymentStatus);

        return (
          <Link key={order._id} href={`/dashboard/orders/${order._id}`}>
            <Card className='overflow-hidden m-2 hover:shadow-md hover:border-primary/40 transition-all duration-300 bg-card/60 backdrop-blur-sm border-border/40 cursor-pointer group'>
              <div className='p-5 sm:p-6'>
                {/* Header with Order ID and Date */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5'>
                  <div className='flex items-baseline gap-3'>
                    <div>
                      <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest'>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className='hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <Calendar className='w-3.5 h-3.5' />
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-muted-foreground group-hover:translate-x-1 transition-transform'>
                    <span className='text-xs font-medium'>View Details</span>
                    <ArrowRight className='w-4 h-4' />
                  </div>
                </div>

                {/* Items Summary */}
                <div className='mb-4 pb-4 border-b border-border/30'>
                  <div className='space-y-2'>
                    {order.items.slice(0, 1).map((item, idx) => (
                      <div
                        key={idx}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center gap-2 min-w-0'>
                          <Package className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                          <span className='text-sm font-medium text-foreground truncate'>
                            {item.name}
                          </span>
                          <span className='text-xs text-muted-foreground flex-shrink-0'>
                            ×{item.quantity}
                          </span>
                        </div>
                        <span className='text-sm font-semibold text-foreground flex-shrink-0'>
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 1 && (
                      <p className='text-xs text-muted-foreground pl-6'>
                        +{order.items.length - 1} more item
                        {order.items.length - 1 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Total */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  {/* Status Badges */}
                  <div className='flex items-center gap-3 flex-wrap'>
                    {/* Payment Status */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${paymentColors.bg}`}
                    >
                      <span className={paymentColors.icon}>💳</span>
                      <span className={paymentColors.text}>
                        {order.paymentStatus?.replace('_', ' ')}
                      </span>
                    </div>
                    {/* Retry Button (ONLY when pending) */}
                    {order.paymentStatus === 'payment_pending' && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRetryPayment(order._id);
                        }}
                        disabled={isPending}
                        className='px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:opacity-90 transition'
                      >
                        {isPending ? 'Redirecting...' : 'Retry Payment'}
                      </button>
                    )}

                    {/* Shipping Status */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${shippingColors.bg}`}
                    >
                      <span className={`${shippingColors.icon}`}>
                        {getStatusIcon(order.shippingStatus)}
                      </span>
                      <span className={shippingColors.text}>
                        {order.shippingStatus?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className='flex items-center justify-between sm:justify-end gap-4'>
                    <div>
                      <p className='text-xs text-muted-foreground font-medium'>
                        Total
                      </p>
                      <p className='text-lg sm:text-xl font-bold text-foreground'>
                        ₦
                        {order.total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
