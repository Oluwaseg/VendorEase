'use client';

import { OrdersTable } from '@/components/orders-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/use-order';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Package,
  RefreshCw,
  Search,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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
        (typeof order.user !== 'string' &&
          order.user?.email.toLowerCase().includes(term)) ||
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
            <OrdersTable
              orders={paginated}
              onStatusUpdate={(id, status) => updateStatus({ id, status })}
              isUpdatingStatus={isUpdatingStatus}
              lastUpdateId={lastUpdateVars?.id}
            />

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
