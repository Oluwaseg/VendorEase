'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminOrder, useUpdateOrderStatus } from '@/hooks/use-order';
import { format } from 'date-fns';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Shield,
  Truck,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

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
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
    },
    shipped: {
      bg: 'bg-brand/10',
      text: 'text-brand',
      border: 'border-brand/20',
    },
    processing: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    pending: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    failed: {
      bg: 'bg-danger/10',
      text: 'text-danger',
      border: 'border-danger/20',
    },
    cancelled: {
      bg: 'bg-danger/10',
      text: 'text-danger',
      border: 'border-danger/20',
    },
    paid: {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
    },
    payment_pending: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
    },
  };
  return (
    colorMap[normalizedStatus] || {
      bg: 'bg-surface-2',
      text: 'text-foreground/70',
      border: 'border-border',
    }
  );
};

const AdminOrderTimeline = ({ order }: { order: any }) => {
  const normalizedShippingStatus =
    order.shippingStatus?.toLowerCase().replace('_', ' ') || '';

  const statuses = [
    { label: 'Order Placed', completed: true, color: 'success' },
    {
      label: 'Processing',
      completed: normalizedShippingStatus !== 'pending',
      color: 'brand',
    },
    {
      label: 'Shipped',
      completed: ['shipped', 'delivered'].includes(normalizedShippingStatus),
      color: 'brand',
    },
    {
      label: 'Delivered',
      completed: normalizedShippingStatus === 'delivered',
      color: 'success',
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
                status.completed ? 'bg-success' : 'bg-border'
              }`}
            />
          )}

          {/* Dot */}
          <div className='relative z-10'>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                status.completed
                  ? 'bg-success text-white shadow-md shadow-success/30'
                  : 'bg-surface-2 text-foreground/50'
              }`}
            >
              {status.completed ? '✓' : idx + 1}
            </div>
          </div>

          {/* Content */}
          <div className='pt-1'>
            <p
              className={`font-semibold ${status.completed ? 'text-foreground' : 'text-foreground/50'}`}
            >
              {status.label}
            </p>
            {status.completed && status.label === 'Order Placed' && (
              <p className='text-xs text-foreground/60 mt-1'>
                {format(new Date(order.createdAt), 'MMM dd, yyyy · h:mm a')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { data, isLoading, error } = useAdminOrder(orderId);
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus();
  const [copiedId, setCopiedId] = useState(false);
  const order = data;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className='min-h-screen bg-surface'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Back Button */}
        <Link href='/admin/orders' className='inline-block mb-8'>
          <Button
            variant='ghost'
            size='sm'
            className='gap-2 text-foreground/60 hover:text-foreground hover:bg-surface-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Orders
          </Button>
        </Link>

        {isLoading && (
          <div className='flex flex-col items-center justify-center py-24'>
            <Loader2 className='w-10 h-10 text-brand animate-spin mb-3' />
            <p className='text-foreground/60 font-medium'>
              Loading order details...
            </p>
          </div>
        )}

        {error && (
          <div className='rounded-[0.5rem] border border-danger/20 bg-danger/5 p-6 text-center'>
            <p className='text-danger font-semibold mb-1'>
              Failed to load order
            </p>
            <p className='text-sm text-foreground/60 mb-4'>{error.message}</p>
            <Link href='/admin/orders'>
              <Button variant='outline' size='sm'>
                Return to Orders
              </Button>
            </Link>
          </div>
        )}

        {!isLoading && !error && order && (
          <div className='space-y-6'>
            {/* Header Card */}
            <Card className='border-border bg-card shadow-sm'>
              <CardContent className='p-6 sm:p-8'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6'>
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <p className='text-xs font-semibold text-foreground/60 uppercase tracking-widest'>
                        Order Number
                      </p>
                      <Badge
                        variant='outline'
                        className='bg-brand/10 border-brand/20 text-brand gap-1'
                      >
                        <Shield className='w-3 h-3' />
                        Admin View
                      </Badge>
                    </div>
                    <div className='flex items-center gap-3'>
                      <h1 className='text-2xl sm:text-3xl font-bold text-foreground font-mono'>
                        #{order._id.slice(-8).toUpperCase()}
                      </h1>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => copyToClipboard(order._id)}
                        className='h-8 w-8 p-0 hover:bg-surface-2'
                      >
                        <Copy
                          className='w-4 h-4'
                          fill={copiedId ? 'currentColor' : 'none'}
                        />
                      </Button>
                    </div>
                    <p className='text-sm text-foreground/60 mt-2'>
                      Placed {format(new Date(order.createdAt), 'MMMM d, yyyy')}{' '}
                      at {format(new Date(order.createdAt), 'h:mm a')}
                    </p>
                  </div>
                  <div className='flex flex-col gap-2 items-start sm:items-end'>
                    <Badge
                      className={`${getStatusColors(order.paymentStatus).bg} ${getStatusColors(order.paymentStatus).text} border ${getStatusColors(order.paymentStatus).border}`}
                    >
                      💳 {order.paymentStatus?.replace('_', ' ')}
                    </Badge>
                    <Badge
                      className={`${getStatusColors(order.shippingStatus).bg} ${getStatusColors(order.shippingStatus).text} border ${getStatusColors(order.shippingStatus).border} flex items-center gap-1.5`}
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
              {/* Left Column - Customer & Order Items */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Customer Information Card */}
                <Card className='border-border bg-card shadow-sm'>
                  <CardHeader className='border-b border-border pb-4'>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <User className='w-5 h-5 text-brand' />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                      {/* Customer Details */}
                      <div className='space-y-4'>
                        <div>
                          <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1'>
                            Name
                          </p>
                          <p className='text-foreground font-semibold text-lg'>
                            {order.user?.name || 'Unknown'}
                          </p>
                        </div>
                        <div className='flex items-start gap-2'>
                          <Mail className='w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0' />
                          <div className='min-w-0'>
                            <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wider'>
                              Email
                            </p>
                            <p className='text-foreground text-sm break-all'>
                              {order.user?.email || 'N/A'}
                            </p>
                          </div>
                        </div>
                        {order.user?.phone && (
                          <div className='flex items-start gap-2'>
                            <Phone className='w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0' />
                            <div>
                              <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wider'>
                                Phone
                              </p>
                              <p className='text-foreground text-sm'>
                                {order.user.phone}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* User Verification Status */}
                      <div className='space-y-3 p-4 rounded-[0.5rem] border border-border bg-surface-2'>
                        <div>
                          <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2'>
                            Account Status
                          </p>
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  order.user?.isActive
                                    ? 'bg-success'
                                    : 'bg-danger'
                                }`}
                              />
                              <span className='text-xs text-foreground'>
                                {order.user?.isActive
                                  ? 'Active Account'
                                  : 'Inactive Account'}
                              </span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  order.user?.isEmailVerified
                                    ? 'bg-success'
                                    : 'bg-warning'
                                }`}
                              />
                              <span className='text-xs text-foreground'>
                                {order.user?.isEmailVerified
                                  ? 'Email Verified'
                                  : 'Email Not Verified'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='pt-2 border-t border-border'>
                          <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1'>
                            Member Since
                          </p>
                          <p className='text-xs text-foreground'>
                            {order.user?.createdAt
                              ? format(
                                  new Date(order.user.createdAt),
                                  'MMM dd, yyyy'
                                )
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card className='border-border bg-card shadow-sm'>
                  <CardHeader className='border-b border-border pb-4'>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <Package className='w-5 h-5 text-brand' />
                      Order Items ({order.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <div className='space-y-3'>
                      {order.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-[0.5rem] border border-border bg-surface hover:bg-surface-2/50 transition-colors'
                        >
                          <div className='min-w-0 flex-1'>
                            <p className='font-semibold text-foreground'>
                              {item.name}
                            </p>
                            <p className='text-xs text-foreground/60 mt-1'>
                              Product ID:{' '}
                              <span className='font-mono'>
                                {typeof item.product === 'string'
                                  ? item.product.slice(-6)
                                  : 'N/A'}
                              </span>
                            </p>
                            <p className='text-xs text-foreground/60 mt-1'>
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
                    <div className='mt-6 pt-6 border-t border-border space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-foreground/60'>Subtotal</span>
                        <span className='font-semibold'>
                          ₦{(order.subtotal || order.total).toLocaleString()}
                        </span>
                      </div>
                      {order.discount > 0 && (
                        <div className='flex items-center justify-between'>
                          <span className='text-foreground/60'>Discount</span>
                          <span className='font-semibold text-success'>
                            -₦{order.discount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {order.shippingFee > 0 && (
                        <div className='flex items-center justify-between'>
                          <span className='text-foreground/60'>Shipping</span>
                          <span className='font-semibold'>
                            ₦{order.shippingFee.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className='flex items-center justify-between pt-4 border-t border-border bg-brand/5 px-4 py-3 rounded-[0.5rem]'>
                        <span className='font-bold text-lg'>Total</span>
                        <span className='text-2xl font-bold text-brand'>
                          ₦{order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className='border-border bg-card shadow-sm'>
                  <CardHeader className='border-b border-border pb-4'>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <MapPin className='w-5 h-5 text-brand' />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <div className='p-4 rounded-[0.5rem] border border-border bg-surface-2'>
                      <p className='font-semibold text-foreground'>
                        {order.shipping.addressLine}
                      </p>
                      <div className='mt-3 space-y-1 text-sm text-foreground/60'>
                        <p>
                          {order.shipping.city}, {order.shipping.state}{' '}
                          {order.shipping.postalCode}
                        </p>
                        <p>{order.shipping.country}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Status & Timeline */}
              <div className='space-y-6'>
                {/* Timeline Card */}
                <Card className='border-border bg-card shadow-sm'>
                  <CardHeader className='border-b border-border pb-4'>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <Calendar className='w-5 h-5 text-brand' />
                      Order Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <AdminOrderTimeline order={order} />
                  </CardContent>
                </Card>

                {/* Payment Details Card */}
                <Card className='border-border bg-card shadow-sm'>
                  <CardHeader className='border-b border-border pb-4'>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <DollarSign className='w-5 h-5 text-brand' />
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6 space-y-4'>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-foreground/60 text-sm'>
                          Payment Method
                        </span>
                        <span className='font-semibold text-sm'>
                          {/* {order.paymentMethod || 'Card'} */}
                          Card
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-foreground/60 text-sm'>
                          Status
                        </span>
                        <Badge
                          className={`${getStatusColors(order.paymentStatus).bg} ${getStatusColors(order.paymentStatus).text} border ${getStatusColors(order.paymentStatus).border} text-xs`}
                        >
                          {order.paymentStatus?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-foreground/60 text-sm'>
                          Amount
                        </span>
                        <span className='font-bold text-brand'>
                          ₦{order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Status Card */}
                <Card className='border-border bg-card shadow-sm'>
                  <CardHeader className='border-b border-border pb-4'>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <Truck className='w-5 h-5 text-brand' />
                      Shipping Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-6 space-y-4'>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-foreground/60 text-sm'>
                          Status
                        </span>
                        <Badge
                          className={`${getStatusColors(order.shippingStatus).bg} ${getStatusColors(order.shippingStatus).text} border ${getStatusColors(order.shippingStatus).border} text-xs flex items-center gap-1`}
                        >
                          {getStatusIcon(order.shippingStatus)}
                          <span>{order.shippingStatus?.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      {/* {order.trackingNumber && (
                        <div>
                          <p className='text-foreground/60 text-xs font-semibold mb-1'>
                            TRACKING NUMBER
                          </p>
                          <p className='font-mono text-sm font-semibold'>
                            {order.trackingNumber}
                          </p>
                        </div>
                      )} */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
