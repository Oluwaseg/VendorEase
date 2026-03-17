'use client';

import { Navbar } from '@/components/navbar';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/hooks/use-cart';
import { useProducts } from '@/hooks/use-product';
import {
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading: userLoading, isAuthenticated } = useAuth();
  const { data: cartData } = useCart(isAuthenticated);
  const { data: productsData } = useProducts({ limit: 5 });

  const stats = [
    {
      label: 'Total Orders',
      value: '0',
      icon: ShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Cart Items',
      value: cartData?.items?.length?.toString() || '0',
      icon: Package,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Spent',
      value: `$${cartData?.total?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Products',
      value: productsData?.total?.toString() || '0',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  if (userLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-foreground/60'>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-background'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Header */}
        <div className='mb-12'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h1 className='text-4xl font-bold text-foreground'>
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <p className='text-foreground/60 mt-2'>
                Here's a summary of your account activity
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className='bg-card border border-border rounded-lg p-6 hover:border-border/80 transition-all'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                    <Icon size={20} className={stat.color} />
                  </div>
                  <ArrowUpRight size={16} className='text-foreground/40' />
                </div>
                <h3 className='text-2xl font-bold text-foreground mb-1'>
                  {stat.value}
                </h3>
                <p className='text-sm text-foreground/60'>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Recent Activity */}
          <div className='lg:col-span-2'>
            <div className='bg-card border border-border rounded-lg p-6'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-xl font-bold text-foreground'>
                    Cart Items
                  </h2>
                  <p className='text-sm text-foreground/60 mt-1'>
                    Items in your shopping cart
                  </p>
                </div>
                <Link
                  href='/checkout'
                  className='text-sm text-primary hover:text-primary/80 font-medium transition-colors'
                >
                  View all
                </Link>
              </div>

              {cartData?.items && cartData.items.length > 0 ? (
                <div className='space-y-3'>
                  {cartData.items.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50 hover:border-border transition-colors'
                    >
                      <div className='flex-1'>
                        <p className='font-semibold text-foreground text-sm'>
                          {typeof item.product === 'string'
                            ? item.product
                            : (item.product?.name ?? 'Product')}
                        </p>
                        <p className='text-xs text-foreground/60 mt-1'>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold text-foreground'>
                          ${item.subtotal?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {cartData.items.length > 5 && (
                    <p className='text-xs text-foreground/50 pt-2'>
                      +{cartData.items.length - 5} more items
                    </p>
                  )}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <ShoppingBag size={40} className='text-foreground/20 mb-4' />
                  <p className='text-foreground/60 font-medium'>
                    Cart is empty
                  </p>
                  <p className='text-sm text-foreground/40 mt-1'>
                    Start shopping to add items
                  </p>
                  <Link
                    href='/shop'
                    className='text-primary hover:text-primary/80 text-sm font-medium mt-4 transition-colors'
                  >
                    Continue shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Account Info Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-card border border-border rounded-lg p-6'>
              <h3 className='text-lg font-bold text-foreground mb-6'>
                Account Info
              </h3>

              <div className='space-y-5'>
                <div>
                  <p className='text-xs uppercase font-semibold text-foreground/50 mb-2'>
                    Full Name
                  </p>
                  <p className='font-semibold text-foreground'>
                    {user?.name || 'Not set'}
                  </p>
                </div>

                <div>
                  <p className='text-xs uppercase font-semibold text-foreground/50 mb-2'>
                    Email
                  </p>
                  <p className='font-semibold text-foreground text-sm'>
                    {user?.email || 'Not set'}
                  </p>
                </div>

                <div>
                  <p className='text-xs uppercase font-semibold text-foreground/50 mb-2'>
                    Account Type
                  </p>
                  <div className='inline-block'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                          : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </div>

                <div className='pt-3'>
                  <Link href='/dashboard/profile'>
                    <button className='w-full py-2.5 px-4 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors'>
                      Edit Profile
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='mt-6 space-y-3'>
              <Link
                href='/dashboard/orders'
                className='flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-border/80 transition-colors group'
              >
                <div className='flex items-center gap-3'>
                  <ShoppingBag
                    size={18}
                    className='text-foreground/60 group-hover:text-foreground transition-colors'
                  />
                  <span className='font-semibold text-sm text-foreground'>
                    Orders
                  </span>
                </div>
                <ArrowUpRight
                  size={16}
                  className='text-foreground/40 group-hover:text-foreground transition-colors'
                />
              </Link>

              <Link
                href='/shop'
                className='flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-border/80 transition-colors group'
              >
                <div className='flex items-center gap-3'>
                  <Package
                    size={18}
                    className='text-foreground/60 group-hover:text-foreground transition-colors'
                  />
                  <span className='font-semibold text-sm text-foreground'>
                    Shopping
                  </span>
                </div>
                <ArrowUpRight
                  size={16}
                  className='text-foreground/40 group-hover:text-foreground transition-colors'
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 bg-linear-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8'>
          <div className='flex items-start justify-between'>
            <div>
              <h3 className='text-xl font-bold text-foreground mb-2'>
                Ready to explore more?
              </h3>
              <p className='text-foreground/60'>
                Discover our latest products and exclusive offers
              </p>
            </div>
            <Link href='/shop'>
              <button className='ml-4 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap'>
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
