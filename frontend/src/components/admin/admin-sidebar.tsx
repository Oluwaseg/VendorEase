'use client';

import { logo } from '@/assets';
import { ADMIN_NAV_SECTIONS } from '@/components/admin/admin-nav';
import { AdminNavUser } from '@/components/admin/admin-nav-user';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

function isHrefActive(pathname: string, href: string) {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ collapsed, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname() ?? '';

  return (
    <div className='flex h-full min-h-svh flex-col bg-card'>
      <div
        className={cn(
          'flex shrink-0 items-center gap-3 border-border border-b px-4 py-4',
          collapsed && 'justify-center px-2',
        )}
      >
        <Link
          href='/admin'
          className={cn(
            'flex items-center gap-3 rounded-lg transition-colors hover:bg-muted/60',
            collapsed && 'justify-center p-2',
          )}
          onClick={onNavigate}
        >
          <div className='relative shrink-0'>
            <Image src={logo} alt='Admin' width={36} height={28} className='object-contain' />
          </div>
          {!collapsed ? (
            <div className='min-w-0'>
              <p className='font-semibold text-foreground text-sm'>SOSTECH</p>
              <p className='text-muted-foreground text-xs'>Admin</p>
            </div>
          ) : (
            <span className='sr-only'>Go to dashboard</span>
          )}
        </Link>
      </div>

      <nav className='flex-1 space-y-5 overflow-y-auto px-3 py-4'>
        {collapsed ? (
          <div className='space-y-1'>
            {ADMIN_NAV_SECTIONS.flatMap((section) => section.items).map((item) => {
              const Icon = item.icon;
              const active = isHrefActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center justify-center rounded-lg px-0 py-2.5 font-medium text-sm transition-colors',
                    active
                      ? 'bg-brand/15 text-brand'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className='size-[18px] shrink-0 opacity-90' aria-hidden />
                </Link>
              );
            })}
          </div>
        ) : (
          ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className='mb-2 px-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wide'>
                {section.label}
              </p>
              <div className='space-y-1'>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isHrefActive(pathname, item.href);
                  return (
                    <Link
                      key={`${section.label}-${item.href}`}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors',
                        active
                          ? 'bg-brand/15 text-brand'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon className='size-[18px] shrink-0 opacity-90' />
                      <span className='truncate'>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </nav>

      <div
        className={cn(
          'shrink-0 space-y-2 border-border border-t p-3',
          collapsed && 'px-2',
        )}
      >
        <AdminNavUser collapsed={collapsed} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
