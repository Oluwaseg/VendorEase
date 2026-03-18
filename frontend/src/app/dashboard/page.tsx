'use client';

import { CartOverview } from '@/components/dashboard/cart-overview';
import { DashboardHeader } from '@/components/dashboard/header';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { RecentReviews } from '@/components/dashboard/recent-reviews';
import { DashboardSkeleton } from '@/components/dashboard/skeleton';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { useUserDashboard } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { data, isLoading, error } = useUserDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background px-4 py-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center'>
            <h2 className='text-xl font-semibold text-destructive mb-2'>
              Failed to load dashboard
            </h2>
            <p className='text-foreground/60'>
              Please try refreshing the page or contact support
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
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
