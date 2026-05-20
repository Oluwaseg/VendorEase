'use client';

import { Spinner } from '@/components/ui/spinner';
import { useCurrency } from '@/contexts/currency-context';
import { useAdminDashboard } from '@/hooks/use-admin';
import { formatPrice } from '@/lib/format-price';
import { DollarSign, Package, ShoppingBag, Star, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading, error } = useAdminDashboard();
  const { currency, convert } = useCurrency();

  if (isLoading) {
    return (
      <div className='flex flex-1 items-center justify-center py-24'>
        <Spinner className='w-8 h-8' />
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
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      trend: '+2.5%',
    },
    {
      label: 'Products',
      value: dashboard.productCount.toString(),
      icon: Package,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      trend: '+12%',
    },
    {
      label: 'Total Orders',
      value: dashboard.orderStats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      trend: '+5.2%',
    },
    {
      label: 'Total Sales',
      value: formatPrice(convert(dashboard.orderStats.totalSales), currency),
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      trend: '+18%',
    },
  ];

  return (
    <div className='space-y-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Header */}
        <div className='mb-12'>
          <h1 className='text-4xl font-bold text-foreground'>
            Admin Dashboard
          </h1>
          <p className='text-foreground/60 mt-2'>
            Overview of your store performance and metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className='bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-200'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon size={22} className={stat.color} />
                  </div>
                  <span className='text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full'>
                    {stat.trend}
                  </span>
                </div>
                <h3 className='text-3xl font-bold text-foreground mb-1'>
                  {stat.value}
                </h3>
                <p className='text-sm text-foreground/60'>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12'>
          {/* Quick Links */}
          <div className='lg:col-span-3'>
            <div className='bg-card border border-border rounded-xl p-6 mb-6'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-xl font-bold text-foreground'>
                    Quick Links
                  </h2>
                  <p className='text-sm text-foreground/60 mt-1'>
                    Access admin management pages
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Link
                  href='/admin/carts'
                  className='rounded-lg border border-border/50 bg-muted/30 p-5 hover:border-primary/50 hover:bg-muted/50 transition-all'
                >
                  <p className='text-sm font-semibold text-foreground mb-2'>
                    Abandoned Carts
                  </p>
                  <p className='text-xs text-foreground/60'>
                    Manage abandoned shopping carts and send reminders
                  </p>
                </Link>

                <Link
                  href='/admin/payments'
                  className='rounded-lg border border-border/50 bg-muted/30 p-5 hover:border-primary/50 hover:bg-muted/50 transition-all'
                >
                  <p className='text-sm font-semibold text-foreground mb-2'>
                    Payment Reconciliation
                  </p>
                  <p className='text-xs text-foreground/60'>
                    Reconcile pending Paystack payments
                  </p>
                </Link>

                <Link
                  href='/admin/products'
                  className='rounded-lg border border-border/50 bg-muted/30 p-5 hover:border-primary/50 hover:bg-muted/50 transition-all'
                >
                  <p className='text-sm font-semibold text-foreground mb-2'>
                    Low Stock Products
                  </p>
                  <p className='text-xs text-foreground/60'>
                    View and manage low inventory items
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className='lg:col-span-2'>
            <div className='bg-card border border-border rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-xl font-bold text-foreground'>
                    Recent Orders
                  </h2>
                  <p className='text-sm text-foreground/60 mt-1'>
                    Latest {dashboard.recentOrders.length} orders
                  </p>
                </div>
                <Link
                  href='/admin/orders'
                  className='text-sm text-primary hover:text-primary/80 font-medium transition-colors'
                >
                  View all
                </Link>
              </div>

              <div className='space-y-3'>
                {dashboard.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className='flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-border transition-colors'
                  >
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-foreground text-sm'>
                        {order.user.name}
                      </p>
                      <p className='text-xs text-foreground/60 mt-1'>
                        {order.user.email}
                      </p>
                      <div className='flex items-center gap-2 mt-2'>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            order.shippingStatus === 'delivered'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : order.shippingStatus === 'shipped'
                                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
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

          {/* Quick Stats Sidebar */}
          <div className='space-y-6'>
            {/* Categories */}
            <div className='bg-card border border-border rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-bold text-foreground'>
                  Top Categories
                </h3>
                <Link
                  href='/admin/categories'
                  className='text-sm text-primary hover:text-primary/80 font-medium transition-colors'
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
                    <span className='text-sm font-semibold text-primary'>
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className='bg-primary/5 border border-primary/20 rounded-xl p-6'>
              <h3 className='text-lg font-bold text-foreground mb-4'>
                Key Insights
              </h3>

              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Star
                    size={18}
                    className='text-primary mt-0.5 flex-shrink-0'
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
                    className='text-primary mt-0.5 flex-shrink-0'
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
        <div className='bg-card border border-border rounded-xl p-6 mb-12'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-xl font-bold text-foreground'>
                Best Sellers
              </h2>
              <p className='text-sm text-foreground/60 mt-1'>
                Top performing products
              </p>
            </div>
            <Link
              href='/admin/products'
              className='text-sm text-primary hover:text-primary/80 font-medium transition-colors'
            >
              View all products
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
            {dashboard.bestSellers.map((product) => (
              <div
                key={product._id}
                className='bg-muted/30 border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors'
              >
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1 min-w-0'>
                    <h4 className='font-semibold text-sm text-foreground truncate'>
                      {product.name}
                    </h4>
                  </div>
                  {product.averageRating > 0 && (
                    <div className='flex items-center gap-1 ml-2 flex-shrink-0'>
                      <Star
                        size={14}
                        className='text-yellow-500 fill-yellow-500'
                      />
                      <span className='text-xs font-semibold text-foreground'>
                        {product.averageRating}
                      </span>
                    </div>
                  )}
                </div>

                <div className='space-y-2'>
                  <div>
                    <p className='text-xs text-foreground/60 mb-1'>Price</p>
                    <p className='font-bold text-foreground'>
                      {formatPrice(convert(product.basePrice), currency)}
                    </p>
                  </div>

                  <div>
                    <p className='text-xs text-foreground/60 mb-1'>Stock</p>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold text-sm text-foreground'>
                        {product.stock}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          product.stock > 50
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : product.stock > 20
                              ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
                              : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}
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

        {/* Recent Users */}
        <div className='bg-card border border-border rounded-xl p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-xl font-bold text-foreground'>
                Recent Users
              </h2>
              <p className='text-sm text-foreground/60 mt-1'>
                Latest {dashboard.recentUsers.length} registrations
              </p>
            </div>
            <Link
              href='/admin/users'
              className='text-sm text-primary hover:text-primary/80 font-medium transition-colors'
            >
              View all users
            </Link>
          </div>

          <div className='space-y-3'>
            {dashboard.recentUsers.map((user) => (
              <div
                key={user._id}
                className='flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-border transition-colors'
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
