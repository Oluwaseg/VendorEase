'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyOrder } from '@/hooks/use-order';
import { format } from 'date-fns';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const getStatusIcon = (status: string) => {
  const normalizedStatus = status?.toLowerCase().replace('_', ' ');
  switch (normalizedStatus) {
    case 'delivered':
      return <CheckCircle2 className='w-6 h-6' />;
    case 'shipped':
    case 'processing':
      return <Truck className='w-6 h-6' />;
    case 'pending':
      return <Clock className='w-6 h-6' />;
    case 'failed':
    case 'cancelled':
      return <AlertCircle className='w-6 h-6' />;
    default:
      return <Package className='w-6 h-6' />;
  }
};

const getStatusColors = (status: string) => {
  const normalizedStatus = status?.toLowerCase().replace('_', ' ');
  const colorMap: {
    [key: string]: { bg: string; text: string; border: string };
  } = {
    delivered: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    shipped: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    processing: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
    },
    pending: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-700 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    failed: {
      bg: 'bg-red-500/10',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
    },
    cancelled: {
      bg: 'bg-red-500/10',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
    },
    paid: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
  };
  return (
    colorMap[normalizedStatus] || {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      border: 'border-border',
    }
  );
};

const OrderTimeline = ({ order }: { order: any }) => {
  const normalizedShippingStatus =
    order.shippingStatus?.toLowerCase().replace('_', ' ') || '';

  const statuses = [
    { label: 'Order Placed', completed: true, color: 'emerald' },
    {
      label: 'Processing',
      completed: normalizedShippingStatus !== 'pending',
      color: 'blue',
    },
    {
      label: 'Shipped',
      completed: ['shipped', 'delivered'].includes(normalizedShippingStatus),
      color: 'purple',
    },
    {
      label: 'Delivered',
      completed: normalizedShippingStatus === 'delivered',
      color: 'green',
    },
  ];

  return (
    <div className='space-y-6'>
      {statuses.map((status, idx) => (
        <div key={idx} className='relative flex gap-4 pb-2'>
          {/* Vertical line */}
          {idx < statuses.length - 1 && (
            <div
              className={`absolute left-4 top-10 w-0.5 h-12 ${
                status.completed ? 'bg-emerald-400' : 'bg-border'
              }`}
            />
          )}

          {/* Dot */}
          <div className='relative z-10'>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                status.completed
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'bg-border text-muted-foreground'
              }`}
            >
              {status.completed ? '✓' : idx + 1}
            </div>
          </div>

          {/* Content */}
          <div className='pt-1'>
            <p
              className={`font-semibold ${status.completed ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {status.label}
            </p>
            {status.completed && status.label === 'Order Placed' && (
              <p className='text-xs text-muted-foreground mt-1'>
                {format(new Date(order.createdAt), 'MMM dd, yyyy · h:mm a')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { data, isLoading, error } = useMyOrder(orderId);
  const order = data;

  return (
    <main className='min-h-screen bg-background'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        {/* Back Button */}
        <Link href='/dashboard/orders' className='inline-block mb-8'>
          <Button
            variant='ghost'
            size='sm'
            className='gap-2 text-muted-foreground hover:text-foreground'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Orders
          </Button>
        </Link>

        {isLoading && (
          <div className='flex flex-col items-center justify-center py-24'>
            <Loader2 className='w-10 h-10 text-primary animate-spin mb-3' />
            <p className='text-muted-foreground font-medium'>
              Loading order details...
            </p>
          </div>
        )}

        {error && (
          <div className='rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center'>
            <p className='text-destructive font-semibold mb-1'>
              Failed to load order
            </p>
            <p className='text-sm text-muted-foreground mb-4'>
              {error.message}
            </p>
            <Link href='/dashboard/orders'>
              <Button variant='outline' size='sm'>
                Return to Orders
              </Button>
            </Link>
          </div>
        )}

        {!isLoading && !error && order && (
          <div className='space-y-6'>
            {/* Header Card */}
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden'>
              <CardContent className='p-6 sm:p-8'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6'>
                  <div>
                    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2'>
                      Order Number
                    </p>
                    <h1 className='text-3xl sm:text-4xl font-bold text-foreground font-mono'>
                      #{order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className='text-sm text-muted-foreground mt-2'>
                      Placed {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className='flex flex-col gap-2 items-start sm:items-end'>
                    <Badge
                      className={`${getStatusColors(order.paymentStatus).bg} ${getStatusColors(order.paymentStatus).text} border`}
                    >
                      💳 {order.paymentStatus?.replace('_', ' ')}
                    </Badge>
                    <Badge
                      className={`${getStatusColors(order.shippingStatus).bg} ${getStatusColors(order.shippingStatus).text} border flex items-center gap-1.5`}
                    >
                      {getStatusIcon(order.shippingStatus)}
                      <span>{order.shippingStatus?.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Left Column - Order Items & Shipping */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Order Items */}
                <Card className='border-border/40 bg-card/50 backdrop-blur-sm'>
                  <CardHeader className='border-b border-border/40'>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <Package className='w-5 h-5 text-primary' />
                      Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <div className='space-y-3'>
                      {order.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className='flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 transition-colors'
                        >
                          <div className='min-w-0'>
                            <p className='font-semibold text-foreground'>
                              {item.name}
                            </p>
                            <p className='text-xs text-muted-foreground mt-1'>
                              Qty:{' '}
                              <span className='font-medium'>
                                {item.quantity}
                              </span>{' '}
                              × ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                          <div className='text-right flex-shrink-0'>
                            <p className='font-bold text-foreground text-lg'>
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className='mt-6 pt-6 border-t border-border/40 space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-muted-foreground'>Subtotal</span>
                        <span className='font-semibold'>
                          ₦{(order.subtotal || order.total).toLocaleString()}
                        </span>
                      </div>
                      {order.discount > 0 && (
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground'>
                            Discount
                          </span>
                          <span className='font-semibold text-emerald-600'>
                            -₦{order.discount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {order.shippingFee > 0 && (
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground'>
                            Shipping
                          </span>
                          <span className='font-semibold'>
                            ₦{order.shippingFee.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className='flex items-center justify-between pt-4 border-t border-border/40 bg-primary/5 px-4 py-3 rounded-lg'>
                        <span className='font-bold text-lg'>Total</span>
                        <span className='text-2xl font-bold text-primary'>
                          ₦{order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className='border-border/40 bg-card/50 backdrop-blur-sm'>
                  <CardHeader className='border-b border-border/40'>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <MapPin className='w-5 h-5 text-primary' />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <div className='p-4 rounded-lg border border-border/40 bg-card/30'>
                      <p className='font-semibold text-foreground'>
                        {order.shipping.addressLine}
                      </p>
                      <div className='mt-3 space-y-1 text-sm text-muted-foreground'>
                        <p>
                          {order.shipping.city}, {order.shipping.state}{' '}
                          {order.shipping.postalCode}
                        </p>
                        <p>{order.shipping.country}</p>
                        <p className='mt-3 pt-3 border-t border-border/40'>
                          <span className='text-xs font-semibold uppercase tracking-wider text-foreground'>
                            Shipping Method:{' '}
                          </span>
                          <span className='capitalize font-medium'>
                            {order.shipping.method}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Timeline & Summary */}
              <div className='space-y-6'>
                {/* Order Timeline */}
                <Card className='border-border/40 bg-card/50 backdrop-blur-sm'>
                  <CardHeader className='border-b border-border/40'>
                    <CardTitle className='text-lg'>Delivery Status</CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <OrderTimeline order={order} />
                  </CardContent>
                </Card>

                {/* Order Summary Box */}
                <Card className='border-border/40 bg-card/50 backdrop-blur-sm'>
                  <CardHeader className='border-b border-border/40'>
                    <CardTitle className='text-lg'>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6 space-y-4'>
                    <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/30'>
                      <Calendar className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                      <div className='min-w-0'>
                        <p className='text-xs text-muted-foreground'>
                          Order Date
                        </p>
                        <p className='font-semibold text-foreground text-sm'>
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/30'>
                      <Package className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                      <div className='min-w-0'>
                        <p className='text-xs text-muted-foreground'>Items</p>
                        <p className='font-semibold text-foreground text-sm'>
                          {order.items.reduce(
                            (sum: number, item: any) => sum + item.quantity,
                            0
                          )}{' '}
                          item
                          {order.items.reduce(
                            (sum: number, item: any) => sum + item.quantity,
                            0
                          ) !== 1
                            ? 's'
                            : ''}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3 p-3 rounded-lg bg-primary/5'>
                      <DollarSign className='w-4 h-4 text-primary flex-shrink-0' />
                      <div className='min-w-0'>
                        <p className='text-xs text-muted-foreground'>
                          Order Total
                        </p>
                        <p className='font-bold text-foreground text-lg'>
                          ₦{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className='space-y-2 pt-2'>
                  <Button className='w-full gap-2' variant='outline'>
                    <Download className='w-4 h-4' />
                    Download Invoice
                  </Button>
                  <Button className='w-full gap-2' variant='outline'>
                    <Navigation className='w-4 h-4' />
                    Track Shipment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
