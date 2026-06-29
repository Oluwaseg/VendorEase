'use client';

import { InlineEmpty, InlineError } from '@/components/common/loader';
import { CartOverview } from '@/components/dashboard/cart-overview';
import { DashboardHeader } from '@/components/dashboard/header';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { RecentReviews } from '@/components/dashboard/recent-reviews';
import { DashboardSkeleton } from '@/components/dashboard/skeleton';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { useUserDashboard } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useUserDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <InlineError
        title='Failed to load Dashboard'
        message='Please try refreshing the page or contact support'
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <InlineEmpty
        title='No data found'
        message=' please try again'
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-background via-background to-primary/5'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <DashboardHeader />

        {/* Stats Grid */}
        <StatsGrid data={data} />

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8'>
          {/* Left Column - Recent Orders & Reviews */}
          <div className='lg:col-span-2 space-y-6'>
            <RecentOrders orders={data.recentOrders} />
            <RecentReviews reviews={data.recentReviews} />
          </div>

          {/* Right Column - Cart & Quick Actions */}
          <CartOverview cartStats={data.cartStats} />
        </div>
      </div>
    </main>
  );
}
