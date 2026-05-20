'use client';

import { AdminShell } from '@/components/admin';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      !(user?.role === 'admin' || user?.role === 'moderator')
    ) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user) {
    return (
      <div className='flex min-h-svh items-center justify-center bg-background'>
        <p className='text-muted-foreground'>Loading admin dashboard…</p>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
