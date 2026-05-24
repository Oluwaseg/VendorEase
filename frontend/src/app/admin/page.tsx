'use client';

import { Spinner } from '@/components/ui/spinner';
import { useCurrency } from '@/contexts/currency-context';
import { useAdminDashboard } from '@/hooks/use-admin';
import { formatPrice } from '@/lib/format-price';
import {
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingBag,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading, error } = useAdminDashboard();
  const { currency, convert } = useCurrency();

  if (isLoading) {
    return (
      <div className='flex flex-1 items-center justify-center py-24'>
        <Spinner className='w-8 h-8' style={{ color: 'var(--brand)' }} />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className='flex flex-1 items-center justify-center py-24'>
        <div className='text-center'>
          <p className='text-foreground/60 font-medium'>
            Failed to load dashboard
          </p>
          <p className='text-sm text-foreground/40 mt-1'>
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Users',
      value: dashboard.userCount.toString(),
      icon: Users,
      trend: '+2.5%',
    },
    {
      label: 'Products',
      value: dashboard.productCount.toString(),
      icon: Package,
      trend: '+12%',
    },
    {
      label: 'Total Orders',
      value: dashboard.orderStats.totalOrders.toString(),
      icon: ShoppingBag,
      trend: '+5.2%',
    },
    {
      label: 'Total Sales',
      value: formatPrice(convert(dashboard.orderStats.totalSales), currency),
      icon: DollarSign,
      trend: '+18%',
    },
  ];

  return (
    <div className='space-y-8 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-10'>
          <h1 className='text-4xl md:text-5xl font-bold text-foreground'>
            Dashboard
          </h1>
          <p className='text-foreground/60 mt-3 text-lg'>
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className='rounded-xl border border-border p-6 transition-all hover:shadow-lg'
                style={{ backgroundColor: 'var(--card)' }}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div
                    className='p-3 rounded-lg'
                    style={{
                      backgroundColor:
                        'color-mix(in oklch, var(--brand) 15%, transparent)',
                    }}
                  >
                    <Icon size={24} style={{ color: 'var(--brand)' }} />
                  </div>
                  <div
                    className='flex items-center gap-1 text-xs font-semibold'
                    style={{ color: 'var(--success)' }}
                  >
                    <ArrowUpRight size={16} />
                    {stat.trend}
                  </div>
                </div>
                <h3 className='text-3xl font-bold text-foreground mb-2'>
                  {stat.value}
                </h3>
                <p className='text-sm text-foreground/60'>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className='mb-12'>
          <div
            className='rounded-xl border border-border p-8'
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-2xl font-bold text-foreground'>
                  Quick Links
                </h2>
                <p className='text-sm text-foreground/60 mt-2'>
                  Jump to important management pages
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <Link
                href='/admin/carts'
                className='group rounded-lg border border-border p-6 transition-all hover:border-brand'
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <p className='text-sm font-semibold text-foreground mb-2 group-hover:text-brand transition-colors'>
                  Abandoned Carts
                </p>
                <p className='text-xs text-foreground/60'>
                  Manage abandoned shopping carts and send reminders
                </p>
              </Link>

              <Link
                href='/admin/payments'
                className='group rounded-lg border border-border p-6 transition-all hover:border-brand'
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <p className='text-sm font-semibold text-foreground mb-2 group-hover:text-brand transition-colors'>
                  Payment Reconciliation
                </p>
                <p className='text-xs text-foreground/60'>
                  Reconcile pending Paystack payments
                </p>
              </Link>

              <Link
                href='/admin/products'
                className='group rounded-lg border border-border p-6 transition-all hover:border-brand'
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <p className='text-sm font-semibold text-foreground mb-2 group-hover:text-brand transition-colors'>
                  Low Stock Products
                </p>
                <p className='text-xs text-foreground/60'>
                  View and manage low inventory items
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12'>
          {/* Recent Orders */}
          <div className='lg:col-span-2'>
            <div
              className='rounded-xl border border-border p-8'
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <h2 className='text-2xl font-bold text-foreground'>
                    Recent Orders
                  </h2>
                  <p className='text-sm text-foreground/60 mt-2'>
                    Latest {dashboard.recentOrders.length} orders
                  </p>
                </div>
                <Link
                  href='/admin/orders'
                  className='text-sm font-semibold transition-colors'
                  style={{ color: 'var(--brand)' }}
                >
                  View all
                </Link>
              </div>

              <div className='space-y-3'>
                {dashboard.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className='flex items-center justify-between p-4 rounded-lg border border-border transition-colors hover:border-brand/30'
                    style={{ backgroundColor: 'var(--surface)' }}
                  >
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-foreground text-sm'>
                        {order.user.name}
                      </p>
                      <p className='text-xs text-foreground/60 mt-1'>
                        {order.user.email}
                      </p>
                      <div className='flex items-center gap-2 mt-3'>
                        <span
                          className='text-xs px-2.5 py-1 rounded-full font-medium'
                          style={{
                            backgroundColor:
                              order.paymentStatus === 'paid'
                                ? 'color-mix(in oklch, var(--success) 15%, transparent)'
                                : 'color-mix(in oklch, var(--warning) 15%, transparent)',
                            color:
                              order.paymentStatus === 'paid'
                                ? 'var(--success)'
                                : 'var(--warning)',
                          }}
                        >
                          {order.paymentStatus}
                        </span>
                        <span
                          className='text-xs px-2.5 py-1 rounded-full font-medium'
                          style={{
                            backgroundColor:
                              'color-mix(in oklch, var(--brand) 15%, transparent)',
                            color: 'var(--brand)',
                          }}
                        >
                          {order.shippingStatus}
                        </span>
                      </div>
                    </div>
                    <div className='text-right ml-4'>
                      <p className='font-bold text-foreground'>
                        {formatPrice(convert(order.total), currency)}
                      </p>
                      <p className='text-xs text-foreground/60 mt-1'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Top Categories */}
            <div
              className='rounded-xl border border-border p-6'
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-bold text-foreground'>
                  Top Categories
                </h3>
                <Link
                  href='/admin/categories'
                  className='text-xs font-semibold transition-colors'
                  style={{ color: 'var(--brand)' }}
                >
                  View all
                </Link>
              </div>

              <div className='space-y-3'>
                {dashboard.topCategories.map((category, idx) => (
                  <div key={idx} className='flex items-center justify-between'>
                    <span className='text-sm text-foreground/70'>
                      {category.name}
                    </span>
                    <span
                      className='text-sm font-semibold'
                      style={{ color: 'var(--brand)' }}
                    >
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insights */}
            <div
              className='rounded-xl border p-6'
              style={{
                backgroundColor:
                  'color-mix(in oklch, var(--brand) 10%, transparent)',
                borderColor:
                  'color-mix(in oklch, var(--brand) 30%, transparent)',
              }}
            >
              <h3 className='text-lg font-bold text-foreground mb-5'>
                Key Insights
              </h3>

              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Star
                    size={18}
                    className='mt-0.5 flex-shrink-0'
                    style={{ color: 'var(--brand)' }}
                  />
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-foreground'>
                      Reviews
                    </p>
                    <p className='text-xs text-foreground/60 mt-1'>
                      {dashboard.reviewCount} total reviews
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Package
                    size={18}
                    className='mt-0.5 flex-shrink-0'
                    style={{ color: 'var(--brand)' }}
                  />
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-foreground'>
                      Inventory
                    </p>
                    <p className='text-xs text-foreground/60 mt-1'>
                      {dashboard.categoryCount} categories managed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Sellers */}
        <div className='mb-12'>
          <div
            className='rounded-xl border border-border p-8'
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-2xl font-bold text-foreground'>
                  Best Sellers
                </h2>
                <p className='text-sm text-foreground/60 mt-2'>
                  Top performing products this month
                </p>
              </div>
              <Link
                href='/admin/products'
                className='text-sm font-semibold transition-colors'
                style={{ color: 'var(--brand)' }}
              >
                View all products
              </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
              {dashboard.bestSellers.map((product) => (
                <div
                  key={product._id}
                  className='rounded-lg border border-border p-5 transition-all hover:border-brand'
                  style={{ backgroundColor: 'var(--surface)' }}
                >
                  <div className='flex items-start justify-between mb-4'>
                    <h4 className='font-semibold text-sm text-foreground truncate flex-1'>
                      {product.name}
                    </h4>
                    {product.averageRating > 0 && (
                      <div className='flex items-center gap-1 ml-2 flex-shrink-0'>
                        <Star
                          size={14}
                          className='fill-yellow-500'
                          style={{ color: '#fbbf24' }}
                        />
                        <span className='text-xs font-semibold text-foreground'>
                          {product.averageRating}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className='space-y-3'>
                    <div>
                      <p className='text-xs text-foreground/60 mb-1'>Price</p>
                      <p className='font-bold text-foreground'>
                        {formatPrice(convert(product.basePrice), currency)}
                      </p>
                    </div>

                    <div>
                      <p className='text-xs text-foreground/60 mb-2'>Stock</p>
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-sm text-foreground'>
                          {product.stock}
                        </span>
                        <span
                          className='text-xs px-2 py-1 rounded-full font-medium'
                          style={{
                            backgroundColor:
                              product.stock > 50
                                ? 'color-mix(in oklch, var(--success) 15%, transparent)'
                                : product.stock > 20
                                  ? 'color-mix(in oklch, var(--warning) 15%, transparent)'
                                  : 'color-mix(in oklch, var(--danger) 15%, transparent)',
                            color:
                              product.stock > 50
                                ? 'var(--success)'
                                : product.stock > 20
                                  ? 'var(--warning)'
                                  : 'var(--danger)',
                          }}
                        >
                          {product.stock > 50
                            ? 'High'
                            : product.stock > 20
                              ? 'Medium'
                              : 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div
          className='rounded-xl border border-border p-8'
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-2xl font-bold text-foreground'>
                Recent Users
              </h2>
              <p className='text-sm text-foreground/60 mt-2'>
                Latest {dashboard.recentUsers.length} registrations
              </p>
            </div>
            <Link
              href='/admin/users'
              className='text-sm font-semibold transition-colors'
              style={{ color: 'var(--brand)' }}
            >
              View all users
            </Link>
          </div>

          <div className='space-y-3'>
            {dashboard.recentUsers.map((user) => (
              <div
                key={user._id}
                className='flex items-center justify-between p-4 rounded-lg border border-border transition-colors hover:border-brand/30'
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-foreground text-sm'>
                    {user.name}
                  </p>
                  <p className='text-xs text-foreground/60 mt-1'>
                    {user.email}
                  </p>
                </div>
                <div className='text-right ml-4 flex-shrink-0'>
                  <p className='text-xs text-foreground/60'>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
