'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AdminOrder, ShippingStatus } from '@/types/order';
import { format } from 'date-fns';
import { CheckCircle2, Eye, Package, Truck } from 'lucide-react';
import Link from 'next/link';

const SHIPPING_STATUSES: ShippingStatus[] = [
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const getStatusIcon = (status: string) => {
  const normalizedStatus = status?.toLowerCase().replace('_', ' ');
  switch (normalizedStatus) {
    case 'delivered':
      return <CheckCircle2 className='w-4 h-4' />;
    case 'shipped':
    case 'processing':
      return <Truck className='w-4 h-4' />;
    case 'pending':
      return <Package className='w-4 h-4' />;
    default:
      return <Package className='w-4 h-4' />;
  }
};

const getStatusColors = (status: string) => {
  const normalizedStatus = status?.toLowerCase().replace('_', ' ');
  const colorMap: { [key: string]: { bg: string; text: string } } = {
    delivered: {
      bg: 'bg-success/10',
      text: 'text-success',
    },
    shipped: { bg: 'bg-brand/10', text: 'text-brand' },
    processing: {
      bg: 'bg-warning/10',
      text: 'text-warning',
    },
    pending: {
      bg: 'bg-warning/10',
      text: 'text-warning',
    },
    cancelled: { bg: 'bg-danger/10', text: 'text-danger' },
    paid: {
      bg: 'bg-success/10',
      text: 'text-success',
    },
    payment_pending: {
      bg: 'bg-warning/10',
      text: 'text-warning',
    },
    refunded: {
      bg: 'bg-brand/10',
      text: 'text-brand',
    },
  };
  return (
    colorMap[normalizedStatus] || {
      bg: 'bg-surface-2',
      text: 'text-foreground/60',
    }
  );
};

interface OrdersTableProps {
  orders: AdminOrder[];
  onStatusUpdate?: (id: string, status: ShippingStatus) => void;
  isUpdatingStatus?: boolean;
  lastUpdateId?: string;
}

export function OrdersTable({
  orders,
  onStatusUpdate,
  isUpdatingStatus,
  lastUpdateId,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className='rounded-[0.5rem] border border-border bg-card p-12 text-center'>
        <Package className='w-12 h-12 text-foreground/20 mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-foreground mb-2'>
          No orders found
        </h3>
        <p className='text-foreground/60 text-sm'>
          There are no orders matching your search.
        </p>
      </div>
    );
  }

  return (
    <Card className='border-border bg-card overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-border bg-surface-2'>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider'>
                Order ID
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider'>
                Customer
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider'>
                Date
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider'>
                Items
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider'>
                Total
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider'>
                Payment
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider'>
                Shipping
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider'>
                Status Update
              </th>
              <th className='px-4 sm:px-6 py-4 text-right text-xs font-semibold text-foreground/70 uppercase tracking-wider'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => {
              const paymentColors = getStatusColors(order.paymentStatus);
              const shippingColors = getStatusColors(order.shippingStatus);

              return (
                <tr
                  key={order._id}
                  className={`border-b border-border hover:bg-surface-2/50 transition-colors ${
                    idx % 2 === 0 ? 'bg-card' : 'bg-surface/50'
                  }`}
                >
                  <td className='px-4 sm:px-6 py-4'>
                    <span className='font-mono text-xs sm:text-sm font-semibold text-foreground'>
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className='px-4 sm:px-6 py-4'>
                    <div className='text-xs sm:text-sm text-foreground'>
                      <p className='font-medium'>
                        {typeof order.user === 'string'
                          ? order.user
                          : order.user?.name || 'Unknown'}
                      </p>
                      <p className='text-foreground/60 text-xs'>
                        {typeof order.user === 'string'
                          ? 'Unknown'
                          : order.user?.email}
                      </p>
                    </div>
                  </td>
                  <td className='px-4 sm:px-6 py-4 text-xs sm:text-sm text-foreground/60 whitespace-nowrap'>
                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className='px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-foreground whitespace-nowrap'>
                    {order.items.length} item
                    {order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className='px-4 sm:px-6 py-4'>
                    <span className='font-bold text-foreground text-sm'>
                      ₦{order.total.toLocaleString()}
                    </span>
                  </td>
                  <td className='px-4 sm:px-6 py-4'>
                    <Badge
                      className={`${paymentColors.bg} ${paymentColors.text} border-0 text-xs font-semibold`}
                    >
                      {order.paymentStatus?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className='px-4 sm:px-6 py-4'>
                    <div className='flex items-center gap-1.5'>
                      {getStatusIcon(order.shippingStatus)}
                      <Badge
                        className={`${shippingColors.bg} ${shippingColors.text} border-0 text-xs font-semibold`}
                      >
                        {order.shippingStatus?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </td>
                  <td className='px-4 sm:px-6 py-4'>
                    <select
                      className='border border-border bg-card text-xs rounded-[0.375rem] px-2.5 py-1.5 font-medium transition-colors hover:border-border/70 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand'
                      value={order.shippingStatus ?? 'processing'}
                      onChange={(e) =>
                        onStatusUpdate?.(
                          order._id,
                          e.target.value as ShippingStatus
                        )
                      }
                      disabled={isUpdatingStatus && lastUpdateId === order._id}
                    >
                      {SHIPPING_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='px-4 sm:px-6 py-4 text-right'>
                    <Link href={`/admin/orders/${order._id}`}>
                      <Button
                        variant='outline'
                        size='sm'
                        className='gap-2 border-border hover:bg-surface rounded-[0.375rem]'
                      >
                        <Eye className='w-4 h-4' />
                        <span className='hidden sm:inline'>View</span>
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
