'use client';

import { Navbar } from '@/components/navbar';
import { OrdersList } from '@/components/orders-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMyOrders } from '@/hooks/use-order';
import {
  Loader2,
  Package,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { data, isLoading, error } = useMyOrders();
  const orders = data?.orders || [];
  const stats = data?.stats;

  return (
    <main className='min-h-screen bg-background'>
      <Navbar />

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
                        ₦{(stats.totalAmount || 0).toLocaleString()}
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
                        ₦{(stats.totalPaid || 0).toLocaleString()}
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
                        ₦{(stats.totalPending || 0).toLocaleString()}
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
        {isLoading && (
          <div className='flex flex-col items-center justify-center py-20'>
            <Loader2 className='w-10 h-10 text-primary animate-spin mb-3' />
            <p className='text-muted-foreground font-medium'>
              Loading your orders...
            </p>
          </div>
        )}

        {error && (
          <div className='rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center'>
            <p className='text-destructive font-semibold mb-1'>
              Failed to load orders
            </p>
            <p className='text-sm text-muted-foreground'>{error.message}</p>
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className='rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm p-12 text-center'>
            <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted/40 mb-4'>
              <ShoppingBag className='w-7 h-7 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>
              No orders yet
            </h3>
            <p className='text-muted-foreground mb-6 max-w-sm mx-auto'>
              You haven&apos;t placed any orders. Start shopping to see them
              here!
            </p>
            <Link href='/shop'>
              <Button className='gap-2'>
                <ShoppingBag className='w-4 h-4' />
                Start Shopping
              </Button>
            </Link>
          </div>
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
