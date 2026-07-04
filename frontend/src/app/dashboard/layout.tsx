'use client';
import ChatWidget from '@/components/chat-widget';
import { Footer } from '@/components/common/footer';
import { InlineLoader } from '@/components/common/loader';
import { Navbar } from '@/components/common/navbar';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/dashboard');
      return;
    }

    if (
      !isLoading &&
      isAuthenticated &&
      (user?.role === 'admin' || user?.role === 'moderator')
    ) {
      router.replace('/admin');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <InlineLoader message='Checking your session…' className='min-h-svh' />
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Navbar />
      {children}
      <ChatWidget />
      <Footer />
    </>
  );
}
