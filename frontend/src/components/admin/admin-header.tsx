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
  const cleaned = /^[a-f\d]{24}$/i.test(segment)
    ? 'Details'
    : segment.replace(/-/g, ' ');
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
      (/^[a-f\d]{24}$/i.test(segment)
        ? `Order · ${segment.slice(0, 8)}…`
        : humanize(segment));
    const isLast = index === segments.length - 1;
    return { path, label, isLast };
  });

  return (
    <header
      className='sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 backdrop-blur-sm md:h-16 md:gap-4 md:px-6'
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
      }}
    >
      <div className='flex shrink-0 items-center gap-2'>
        <button
          type='button'
          onClick={onOpenMobileSidebar}
          aria-label='Open navigation'
          className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border transition-colors lg:hidden'
          style={{ '--hover-bg': 'var(--surface)' } as React.CSSProperties}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--surface)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          <Menu
            className='size-[18px]'
            aria-hidden
            style={{ color: 'var(--foreground)' }}
          />
        </button>

        {onToggleSidebarCollapsed ? (
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='hidden size-10 shrink-0 lg:inline-flex border-border'
            onClick={onToggleSidebarCollapsed}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!sidebarCollapsed}
            aria-label={
              sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
          >
            {sidebarCollapsed ? (
              <PanelLeft className='size-[18px]' aria-hidden />
            ) : (
              <PanelLeftClose className='size-[18px]' aria-hidden />
            )}
          </Button>
        ) : null}
      </div>

      <div
        className='h-4 w-px shrink-0'
        style={{ backgroundColor: 'var(--border)' }}
        aria-hidden
      />

      <nav
        aria-label='Breadcrumb'
        className='min-w-0 flex flex-1 items-center gap-1.5 text-sm'
      >
        {crumbs.length === 0 ? (
          <span
            className='font-medium'
            style={{ color: 'var(--muted-foreground)' }}
          >
            Home
          </span>
        ) : (
          crumbs.flatMap(({ path, label, isLast }, i) => {
            const parts = [
              isLast ? (
                <span
                  key={path}
                  className='truncate font-medium'
                  style={{ color: 'var(--foreground)' }}
                >
                  {label}
                </span>
              ) : (
                <Link
                  key={path}
                  href={path}
                  className='truncate transition-colors'
                  style={{ color: 'var(--muted-foreground)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'var(--brand)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'var(--muted-foreground)')
                  }
                >
                  {label}
                </Link>
              ),
            ];
            if (i < crumbs.length - 1) {
              parts.push(
                <ChevronRight
                  key={`${path}-sep`}
                  className='size-4 shrink-0'
                  style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
                  aria-hidden
                />
              );
            }
            return parts;
          })
        )}
      </nav>

      <div className='ml-auto hidden sm:block'>
        <Link
          href='/'
          className='text-sm font-semibold py-2 px-4 rounded-lg transition-all'
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-foreground)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          View Store-Front
        </Link>
      </div>
    </header>
  );
}
