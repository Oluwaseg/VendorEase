'use client';

import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/use-order';
import { ShippingStatus } from '@/types/order';
import { format } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Package,
  RefreshCw,
  Search,
  TrendingUp,
  Truck,
  Wallet,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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
      return <Clock className='w-4 h-4' />;
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
  };
  return (
    colorMap[normalizedStatus] || {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
    }
  );
};

export default function AdminOrdersPage() {
  const { data, isLoading, error } = useAdminOrders();
  const orders = data?.orders || [];
  const stats = data?.stats;
  const {
    mutate: updateStatus,
    isPending: isUpdatingStatus,
    variables: lastUpdateVars,
  } = useUpdateOrderStatus();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 15;

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    const term = searchTerm.toLowerCase();

    return orders.filter((order) => {
      return (
        order._id.toLowerCase().includes(term) ||
        order.user.email.toLowerCase().includes(term) ||
        order.total.toString().includes(searchTerm)
      );
    });
  }, [orders, searchTerm]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredOrders.length / pageSize);
  }, [filteredOrders]);

  return (
    <main className='min-h-screen bg-background'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-foreground mb-1'>
                Orders Management
              </h1>
              <p className='text-muted-foreground'>
                View and manage all customer orders
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='gap-2 w-fit'
              onClick={() => window.location.reload()}
            >
              <RefreshCw className='w-4 h-4' />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && !isLoading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors'>
              <CardContent className='pt-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1'>
                      Total Orders
                    </p>
                    <p className='text-3xl font-bold text-foreground'>
                      {stats.totalOrders}
                    </p>
                  </div>
                  <div className='p-2.5 bg-primary/10 rounded-lg'>
                    <Package className='w-5 h-5 text-primary' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors'>
              <CardContent className='pt-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1'>
                      Total Revenue
                    </p>
                    <p className='text-3xl font-bold text-foreground'>
                      ₦{(stats.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className='p-2.5 bg-blue-500/10 rounded-lg'>
                    <TrendingUp className='w-5 h-5 text-blue-600' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors'>
              <CardContent className='pt-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1'>
                      Amount Paid
                    </p>
                    <p className='text-3xl font-bold text-foreground'>
                      ₦{(stats.totalPaid || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className='p-2.5 bg-emerald-500/10 rounded-lg'>
                    <Wallet className='w-5 h-5 text-emerald-600' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors'>
              <CardContent className='pt-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1'>
                      Pending Payment
                    </p>
                    <p className='text-3xl font-bold text-foreground'>
                      ₦{(stats.totalPending || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className='p-2.5 bg-amber-500/10 rounded-lg'>
                    <Zap className='w-5 h-5 text-amber-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading && (
          <div className='py-20 text-center'>
            <div className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted/40 mb-3'>
              <RefreshCw className='w-5 h-5 text-muted-foreground animate-spin' />
            </div>
            <p className='text-muted-foreground font-medium'>
              Loading orders...
            </p>
          </div>
        )}

        {error && (
          <div className='rounded-lg border border-destructive/20 bg-destructive/5 p-6 flex items-center gap-3'>
            <AlertTriangle className='w-5 h-5 text-destructive flex-shrink-0' />
            <div>
              <p className='text-destructive font-semibold'>
                {error.message || 'Failed to load orders'}
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && orders && orders.length > 0 && (
          <div className='space-y-6'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search by order ID, customer email, or amount...'
                className='pl-10'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Orders Table */}
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-border/40 bg-muted/30'>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Order
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Customer
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Date
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Items
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Total
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Payment
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Shipping
                      </th>
                      <th className='px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                        Update Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((order) => {
                      const paymentColors = getStatusColors(
                        order.paymentStatus
                      );
                      const shippingColors = getStatusColors(
                        order.shippingStatus
                      );

                      return (
                        <tr
                          key={order._id}
                          className='border-b border-border/40 hover:bg-muted/20 transition-colors'
                        >
                          <td className='px-6 py-4'>
                            <span className='font-mono text-sm font-semibold text-foreground'>
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='text-sm text-foreground'>
                              {typeof order.user === 'string'
                                ? order.user
                                : (order.user?.email ?? 'Unknown')}
                            </div>
                          </td>
                          <td className='px-6 py-4 text-sm text-muted-foreground'>
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </td>
                          <td className='px-6 py-4 text-sm font-medium text-foreground'>
                            {order.items.length}
                          </td>
                          <td className='px-6 py-4'>
                            <span className='font-bold text-foreground'>
                              ₦{order.total.toLocaleString()}
                            </span>
                          </td>
                          <td className='px-6 py-4'>
                            <Badge
                              className={`${paymentColors.bg} ${paymentColors.text} border-0`}
                            >
                              {order.paymentStatus?.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-1.5'>
                              {getStatusIcon(order.shippingStatus)}
                              <Badge
                                className={`${shippingColors.bg} ${shippingColors.text} border-0`}
                              >
                                {order.shippingStatus?.replace('_', ' ')}
                              </Badge>
                            </div>
                          </td>
                          <td className='px-6 py-4 text-right'>
                            <select
                              className='border border-border bg-background text-xs rounded-md px-2 py-1.5 font-medium transition-colors hover:border-border/60'
                              value={order.shippingStatus ?? 'processing'}
                              onChange={(e) =>
                                updateStatus({
                                  id: order._id,
                                  status: e.target.value as ShippingStatus,
                                })
                              }
                              disabled={
                                isUpdatingStatus &&
                                lastUpdateVars?.id === order._id
                              }
                            >
                              {SHIPPING_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status.replace('_', ' ')}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <p className='text-xs text-muted-foreground font-medium'>
                Showing {paginated.length > 0 ? (page - 1) * pageSize + 1 : 0}{' '}
                to {Math.min(page * pageSize, filteredOrders.length)} of{' '}
                {filteredOrders.length} orders
              </p>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className='gap-2'
                >
                  <ChevronLeft className='w-4 h-4' />
                  Previous
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className='gap-2'
                >
                  Next
                  <ChevronRight className='w-4 h-4' />
                </Button>
              </div>
            </div>

            {/* Updating Toast */}
            {isUpdatingStatus && (
              <div className='fixed bottom-4 right-4 bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg text-sm text-foreground'>
                <CheckCircle2 className='w-4 h-4 text-primary animate-pulse' />
                <span>Updating order status...</span>
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className='rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm p-12 text-center'>
            <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted/40 mb-4'>
              <Package className='w-7 h-7 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>
              No orders yet
            </h3>
            <p className='text-muted-foreground'>
              There are no customer orders to display at this time.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
