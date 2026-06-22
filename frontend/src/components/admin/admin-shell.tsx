'use client';

import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useEffect, useState, type ReactNode } from 'react';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'admin_sidebar_collapsed';

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
      setSidebarCollapsed(stored === '1');
    } catch {
      // ignore unavailable storage
    }
  }, []);

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(
          SIDEBAR_COLLAPSED_STORAGE_KEY,
          next ? '1' : '0'
        );
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className='flex min-h-svh w-full bg-surface'>
      <aside
        className={cn(
          'sticky top-0 z-40 hidden h-svh shrink-0 border-border border-r bg-transparent lg:flex lg:flex-col lg:transition-[width] lg:duration-300 lg:ease-out',
          sidebarCollapsed ? 'lg:w-[4.75rem]' : 'lg:w-64'
        )}
      >
        <AdminSidebar collapsed={sidebarCollapsed} />
      </aside>

      <div className='flex min-h-svh min-w-0 flex-1 flex-col bg-background'>
        <AdminHeader
          onOpenMobileSidebar={() => setMobileNavOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebarCollapsed={toggleSidebarCollapsed}
        />
        <div className='relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto'>
          <div className='mx-auto w-full max-w-[1600px] flex-1 p-4 md:p-6'>
            {children}
          </div>
        </div>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side='left'
          showCloseButton
          className='flex h-full min-h-svh flex-col gap-0 p-0 [&>button]:top-5 z-[60] w-[min(20rem,calc(100vw-2rem))]'
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>Admin navigation</SheetTitle>
          </SheetHeader>
          <AdminSidebar
            collapsed={false}
            onNavigate={() => setMobileNavOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
