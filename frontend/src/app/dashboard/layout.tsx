'use client';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      (user?.role === 'admin' || user?.role === 'moderator')
    ) {
      router.replace('/admin');
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
