'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, Menu, PanelLeft, PanelLeftClose } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LABELS: Record<string, string> = {
  admin: 'Overview',
  products: 'Products',
  categories: 'Categories',
  subcategories: 'Subcategories',
  orders: 'Orders',
  carts: 'Carts',
  payments: 'Payments',
  users: 'Users',
  support: 'Support',
};

function humanize(segment: string) {
  const cleaned = /^[a-f\d]{24}$/i.test(segment) ? 'Details' : segment.replace(/-/g, ' ');
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebarCollapsed?: () => void;
}

export function AdminHeader({
  onOpenMobileSidebar,
  sidebarCollapsed = false,
  onToggleSidebarCollapsed,
}: AdminHeaderProps) {
  const pathname = usePathname() ?? '';
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    const label =
      LABELS[segment.toLowerCase()] ??
      (/^[a-f\d]{24}$/i.test(segment) ? `Order · ${segment.slice(0, 8)}…` : humanize(segment));
    const isLast = index === segments.length - 1;
    return { path, label, isLast };
  });

  return (
    <header className='sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-border border-b bg-background/90 px-4 backdrop-blur-lg md:h-16 md:gap-4 md:px-6'>
      <div className='flex shrink-0 items-center gap-2'>
        <button
          type='button'
          onClick={onOpenMobileSidebar}
          aria-label='Open navigation'
          className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background lg:hidden hover:bg-muted'
        >
          <Menu className='size-[18px]' aria-hidden />
        </button>

        {onToggleSidebarCollapsed ? (
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='hidden size-10 shrink-0 lg:inline-flex'
            onClick={onToggleSidebarCollapsed}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!sidebarCollapsed}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeft className='size-[18px]' aria-hidden />
            ) : (
              <PanelLeftClose className='size-[18px]' aria-hidden />
            )}
          </Button>
        ) : null}
      </div>

      <div className='h-4 w-px shrink-0 bg-border' aria-hidden />

      <nav aria-label='Breadcrumb' className='min-w-0 flex flex-1 items-center gap-1.5 text-sm'>
        {crumbs.length === 0 ? (
          <span className='font-medium text-muted-foreground'>Home</span>
        ) : (
          crumbs.flatMap(({ path, label, isLast }, i) => {
            const parts = [
              isLast ? (
                <span key={path} className='truncate font-medium text-foreground'>
                  {label}
                </span>
              ) : (
                <Link
                  key={path}
                  href={path}
                  className='truncate text-muted-foreground transition-colors hover:text-foreground'
                >
                  {label}
                </Link>
              ),
            ];
            if (i < crumbs.length - 1) {
              parts.push(
                <ChevronRight
                  key={`${path}-sep`}
                  className='size-4 shrink-0 text-muted-foreground/60'
                  aria-hidden
                />,
              );
            }
            return parts;
          })
        )}
      </nav>

      <div className='ml-auto hidden sm:block'>
        <Link
          href='/'
          className='text-muted-foreground text-sm underline-offset-4 transition-colors hover:text-foreground hover:underline'
        >
          View storefront
        </Link>
      </div>
    </header>
  );
}
