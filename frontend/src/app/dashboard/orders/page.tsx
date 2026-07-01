'use client';

import {
  InlineEmpty,
  InlineError,
  InlineLoader,
} from '@/components/common/loader';
import { OrdersList } from '@/components/orders/orders-list';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrency } from '@/contexts/currency-context';
import { useMyOrders } from '@/hooks/use-order';
import { formatPrice } from '@/lib/format-price';
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from 'lucide-react';

export default function OrdersPage() {
  const { data, isLoading, error, refetch } = useMyOrders();
  const { currency, convert } = useCurrency();
  const orders = data?.orders || [];
  const stats = data?.stats;

  return (
    <main className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14'>
        {/* Header Section */}
        <div className='mb-10'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8'>
            <div>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-2'>
                Order History
              </h1>
              <p className='text-base text-muted-foreground'>
                Manage and track all your purchases in one place
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          {stats && !isLoading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {/* Total Orders */}
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
                      <ShoppingBag className='w-5 h-5 text-primary' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Spent */}
              <Card className='border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors'>
                <CardContent className='pt-6'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1'>
                        Total Spent
                      </p>
                      <p className='text-3xl font-bold text-foreground'>
                        {formatPrice(convert(stats.totalAmount || 0), currency)}
                      </p>
                    </div>
                    <div className='p-2.5 bg-blue-500/10 rounded-lg'>
                      <TrendingUp className='w-5 h-5 text-blue-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paid Amount */}
              <Card className='border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors'>
                <CardContent className='pt-6'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1'>
                        Amount Paid
                      </p>
                      <p className='text-3xl font-bold text-foreground'>
                        {formatPrice(convert(stats.totalPaid || 0), currency)}
                      </p>
                    </div>
                    <div className='p-2.5 bg-emerald-500/10 rounded-lg'>
                      <Wallet className='w-5 h-5 text-emerald-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Amount */}
              <Card className='border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors'>
                <CardContent className='pt-6'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1'>
                        Pending Payment
                      </p>
                      <p className='text-3xl font-bold text-foreground'>
                        {formatPrice(
                          convert(stats.totalPending || 0),
                          currency
                        )}
                      </p>
                    </div>
                    <div className='p-2.5 bg-amber-500/10 rounded-lg'>
                      <Package className='w-5 h-5 text-amber-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Content Section */}
        {isLoading && <InlineLoader message='Loading your orders...' />}

        {error && (
          <InlineError
            title='Failed to load orders'
            message="We couldn't fetch your orders. Please try again."
            backHref='/dashboard'
            backLabel='Return to Dashboard'
            backIcon={<ArrowLeft className='h-3.5 w-3.5' />}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && orders.length === 0 && (
          <InlineEmpty
            title='No orders yet'
            message="You haven't placed any orders. Start shopping to see them here!"
            backHref='/shop'
            backLabel='Start Shopping'
            backIcon={<ShoppingBag className='h-3.5 w-3.5' />}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div>
            <div className='flex items-baseline justify-between mb-6'>
              <div>
                <p className='text-sm font-medium text-foreground'>
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Click on any order to view details
                </p>
              </div>
            </div>
            <OrdersList orders={orders} />
          </div>
        )}
      </div>
    </main>
  );
}
