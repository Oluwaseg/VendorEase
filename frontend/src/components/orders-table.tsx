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
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
    },
    shipped: { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400' },
    processing: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-700 dark:text-orange-400',
    },
    pending: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-700 dark:text-yellow-400',
    },
    cancelled: { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400' },
    paid: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
    },
    payment_pending: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400',
    },
    refunded: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-400',
    },
  };
  return (
    colorMap[normalizedStatus] || {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
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
      <div className='rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm p-12 text-center'>
        <Package className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-foreground mb-2'>
          No orders found
        </h3>
        <p className='text-muted-foreground'>
          There are no orders matching your search.
        </p>
      </div>
    );
  }

  return (
    <Card className='border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-border/40 bg-muted/30'>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Order ID
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Customer
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Date
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Items
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Total
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Payment
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Shipping
              </th>
              <th className='px-4 sm:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Status Update
              </th>
              <th className='px-4 sm:px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const paymentColors = getStatusColors(order.paymentStatus);
              const shippingColors = getStatusColors(order.shippingStatus);

              return (
                <tr
                  key={order._id}
                  className='border-b border-border/40 hover:bg-muted/20 transition-colors'
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
                      <p className='text-muted-foreground text-xs'>
                        {typeof order.user === 'string'
                          ? 'Unknown'
                          : order.user?.email}
                      </p>
                    </div>
                  </td>
                  <td className='px-4 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground whitespace-nowrap'>
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
                      className={`${paymentColors.bg} ${paymentColors.text} border-0 text-xs`}
                    >
                      {order.paymentStatus?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className='px-4 sm:px-6 py-4'>
                    <div className='flex items-center gap-1.5'>
                      {getStatusIcon(order.shippingStatus)}
                      <Badge
                        className={`${shippingColors.bg} ${shippingColors.text} border-0 text-xs`}
                      >
                        {order.shippingStatus?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </td>
                  <td className='px-4 sm:px-6 py-4'>
                    <select
                      className='border border-border bg-background text-xs rounded-md px-2 py-1.5 font-medium transition-colors hover:border-border/60 focus:outline-none focus:ring-2 focus:ring-primary'
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
                      <Button variant='outline' size='sm' className='gap-2'>
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
