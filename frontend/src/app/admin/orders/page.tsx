'use client';

import { OrdersTable } from '@/components/orders/orders-table';
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
    <div className='min-h-screen bg-surface'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        {/* Header */}
        <div className='mb-10'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-foreground mb-2'>
                Order Management
              </h1>
              <p className='text-foreground/60 text-sm'>
                Track and manage all customer orders
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='gap-2 w-full sm:w-auto border-border hover:bg-surface rounded-[0.375rem]'
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
            <Card className='border-border bg-card hover:border-brand/30 transition-colors'>
              <CardContent className='pt-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2'>
                      Total Orders
                    </p>
                    <p className='text-3xl font-bold text-foreground'>
                      {stats.totalOrders}
                    </p>
                  </div>
                  <div className='p-2.5 bg-brand/10 rounded-[0.375rem]'>
                    <Package className='w-5 h-5 text-brand' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-border bg-card hover:border-brand/30 transition-colors'>
              <CardContent className='pt-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2'>
                      Total Revenue
                    </p>
                    <p className='text-3xl font-bold text-foreground'>
                      ₦{(stats.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className='p-2.5 bg-success/10 rounded-[0.375rem]'>
                    <TrendingUp className='w-5 h-5 text-success' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-border bg-card hover:border-brand/30 transition-colors'>
              <CardContent className='pt-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2'>
                      Amount Paid
                    </p>
                    <p className='text-3xl font-bold text-foreground'>
                      ₦{(stats.totalPaid || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className='p-2.5 bg-success/10 rounded-[0.375rem]'>
                    <Wallet className='w-5 h-5 text-success' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-border bg-card hover:border-brand/30 transition-colors'>
              <CardContent className='pt-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2'>
                      Pending Payment
                    </p>
                    <p className='text-3xl font-bold text-foreground'>
                      ₦{(stats.totalPending || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className='p-2.5 bg-warning/10 rounded-[0.375rem]'>
                    <Zap className='w-5 h-5 text-warning' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading && (
          <div className='py-20 text-center'>
            <div className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-2 mb-3'>
              <RefreshCw className='w-5 h-5 text-foreground/40 animate-spin' />
            </div>
            <p className='text-foreground/60 font-medium text-sm'>
              Loading orders...
            </p>
          </div>
        )}

        {error && (
          <div className='rounded-[0.5rem] border border-danger/30 bg-danger/10 p-4 sm:p-6 flex items-start gap-4'>
            <AlertTriangle className='w-5 h-5 text-danger flex-shrink-0 mt-0.5' />
            <div>
              <p className='text-danger font-semibold text-sm'>
                {error.message || 'Failed to load orders'}
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && orders && orders.length > 0 && (
          <div className='space-y-6'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40' />
              <Input
                placeholder='Search by order ID, customer email, or amount...'
                className='pl-12 border-border rounded-[0.375rem] focus:border-brand focus:ring-brand/20'
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
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-border'>
              <p className='text-xs sm:text-sm text-foreground/60 font-medium'>
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
                  className='gap-2 border-border hover:bg-surface rounded-[0.375rem]'
                >
                  <ChevronLeft className='w-4 h-4' />
                  <span className='hidden sm:inline'>Previous</span>
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className='gap-2 border-border hover:bg-surface rounded-[0.375rem]'
                >
                  <span className='hidden sm:inline'>Next</span>
                  <ChevronRight className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className='rounded-[0.5rem] border border-border bg-card p-12 text-center'>
            <div className='inline-flex items-center justify-center w-14 h-14 rounded-[0.375rem] bg-surface-2 mb-4'>
              <Package className='w-7 h-7 text-foreground/30' />
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>
              No orders yet
            </h3>
            <p className='text-foreground/60 text-sm'>
              There are no customer orders to display at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
