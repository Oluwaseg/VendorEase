'use client';

import { useCurrency } from '@/contexts/currency-context';
import { formatPrice } from '@/lib/format-price';
import { UserDashboardPayload } from '@/types/user-dashboard';
import { ShoppingBag, ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { StatCard } from './stat-card';

export function StatsGrid({ data }: { data: UserDashboardPayload }) {
  const { currency, convert } = useCurrency();

  const stats = [
    {
      label: 'Total Orders',
      value: data.orderStats.totalOrders.toString(),
      trend: '+12% this month',
      icon: ShoppingBag,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      label: 'Total Spent',
      value: formatPrice(convert(data.orderStats.totalSpent), currency),
      trend:
        data.orderStats.totalOrders > 0
          ? `${formatPrice(
              convert(data.orderStats.totalSpent / data.orderStats.totalOrders),
              currency
            )} avg order`
          : 'No orders yet',
      icon: TrendingUp,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      label: 'Reviews',
      value: data.reviewCount.toString(),
      trend: 'Keep growing your feedback',
      icon: Star,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    {
      label: 'Cart Items',
      value: data.cartStats.itemCount.toString(),
      trend: `Total: ${formatPrice(convert(data.cartStats.total), currency)}`,
      icon: ShoppingCart,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
