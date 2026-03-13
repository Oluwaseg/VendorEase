'use client';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/use-order';
import { ShippingStatus } from '@/types/order';
import { format } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const SHIPPING_STATUSES: ShippingStatus[] = [
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

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
  const pageSize = 10;

  const paginated = useMemo(() => {
    if (!orders) return [];
    const start = (page - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, page]);

  const totalPages = useMemo(() => {
    if (!orders || orders.length === 0) return 1;
    return Math.ceil(orders.length / pageSize);
  }, [orders]);

  return (
    <main className='min-h-screen bg-background'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Orders Management
            </h1>
            <p className='text-foreground/60 mt-1'>
              View and manage all customer orders.
            </p>
          </div>
          <Button
            variant='outline'
            size='icon'
            onClick={() => window.location.reload()}
            className='rounded-full'
          >
            <RefreshCw size={18} />
          </Button>
        </div>

        {isLoading && (
          <div className='py-16 text-center text-foreground/60'>
            Loading orders...
          </div>
        )}

        {error && (
          <div className='py-16 flex items-center justify-center gap-2 text-red-500'>
            <AlertTriangle size={18} />
            <span>{error.message || 'Failed to load orders.'}</span>
          </div>
        )}

        {!isLoading && !error && orders && orders.length === 0 && (
          <div className='py-16 text-center text-foreground/60'>
            No orders found yet.
          </div>
        )}

        {!isLoading && !error && orders && orders.length > 0 && (
          <>
            {stats && (
              <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="bg-muted/30">
                  <CardContent className="py-4 text-center">
                    <div className="text-xs text-foreground/60">Total Orders</div>
                    <div className="text-xl font-bold">{stats.totalOrders}</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="py-4 text-center">
                    <div className="text-xs text-foreground/60">Total Amount</div>
                    <div className="text-xl font-bold">
                      ₦{stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="py-4 text-center">
                    <div className="text-xs text-foreground/60">Total Paid</div>
                    <div className="text-xl font-bold">
                      ₦{stats.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="py-4 text-center">
                    <div className="text-xs text-foreground/60">Total Pending</div>
                    <div className="text-xl font-bold">
                      ₦{stats.totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <Card className='border border-border/50 bg-card/40'>
              <CardContent className='p-0'>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b border-border/60 bg-muted/40'>
                        <th className='px-6 py-3 text-left text-foreground/60 font-semibold'>
                          Order
                        </th>
                        <th className='px-6 py-3 text-left text-foreground/60 font-semibold'>
                          Customer
                        </th>
                        <th className='px-6 py-3 text-left text-foreground/60 font-semibold'>
                          Date
                        </th>
                        <th className='px-6 py-3 text-left text-foreground/60 font-semibold'>
                          Items
                        </th>
                        <th className='px-6 py-3 text-left text-foreground/60 font-semibold'>
                          Total
                        </th>
                        <th className='px-6 py-3 text-left text-foreground/60 font-semibold'>
                          Payment
                        </th>
                        <th className='px-6 py-3 text-left text-foreground/60 font-semibold'>
                          Shipping
                        </th>
                        <th className='px-6 py-3 text-right text-foreground/60 font-semibold'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((order) => (
                        <tr
                          key={order._id}
                          className='border-b border-border/40 hover:bg-muted/40 transition-colors'
                        >
                          <td className='px-6 py-4 font-mono text-xs text-foreground'>
                            #{order._id.slice(-8)}
                          </td>
                          <td className='px-6 py-4 text-foreground/80'>
                            {typeof order.user === 'string'
                              ? order.user
                              : (order.user?.email ?? 'Unknown')}
                          </td>
                          <td className='px-6 py-4 text-foreground/80'>
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </td>
                          <td className='px-6 py-4 text-foreground/80'>
                            {order.items.length}
                          </td>
                          <td className='px-6 py-4 text-foreground font-semibold'>
                            ₦{order.total.toFixed(2)}
                          </td>
                          <td className='px-6 py-4'>
                            <Badge
                              variant='outline'
                              className='capitalize whitespace-nowrap'
                            >
                              {order.paymentStatus?.replace('_', ' ') ??
                                'Unknown'}
                            </Badge>
                          </td>
                          <td className='px-6 py-4'>
                            <Badge
                              variant='outline'
                              className='capitalize whitespace-nowrap mr-2'
                            >
                              {order.shippingStatus?.replace('_', ' ') ??
                                'Unknown'}
                            </Badge>
                          </td>
                          <td className='px-6 py-4 text-right'>
                            <select
                              className='border border-border bg-background text-xs rounded-md px-2 py-1'
                              value={order.shippingStatus ?? 'Unknown'}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className='flex items-center justify-between mt-6'>
              <p className='text-xs text-foreground/60'>
                Page {page} of {totalPages} · {orders.length} orders
              </p>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            {isUpdatingStatus && (
              <div className='fixed bottom-4 right-4 bg-card border border-border rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg text-xs text-foreground'>
                <CheckCircle2 size={14} className='text-primary' />
                <span>Updating order status...</span>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
