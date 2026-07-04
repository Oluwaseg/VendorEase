'use client';

import { AdminShell } from '@/components/admin';
import { InlineLoader } from '@/components/common/loader';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/admin');
      return;
    }

    if (
      !isLoading &&
      isAuthenticated &&
      !(user?.role === 'admin' || user?.role === 'moderator')
    ) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <InlineLoader message='Checking admin access…' className='min-h-svh' />
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}
