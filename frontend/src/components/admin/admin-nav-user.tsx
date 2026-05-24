'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { useLogout } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { ChevronUp, LogOut } from 'lucide-react';
import { Fragment } from 'react';

interface AdminNavUserProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return 'A';
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
}

export function AdminNavUser({
  collapsed = false,
  onNavigate,
}: AdminNavUserProps) {
  const { user } = useAuth();
  const logout = useLogout();

  if (!user) {
    return null;
  }

  const roleLabel = user.role === 'admin' ? 'administrator' : 'moderator';

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className={cn(
            'flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-left transition-all hover:border-brand/50',
            collapsed &&
              'justify-center border-transparent px-0 py-2 hover:bg-surface'
          )}
          style={{
            backgroundColor: collapsed ? 'transparent' : 'var(--surface)',
          }}
        >
          <div
            className='flex size-10 shrink-0 items-center justify-center rounded-lg font-semibold text-xs'
            style={{
              backgroundColor: 'var(--brand)',
              color: 'var(--brand-foreground)',
            }}
          >
            {initials(user.name || user.username || user.email)}
          </div>
          {!collapsed ? (
            <Fragment>
              <div className='min-w-0 flex-1'>
                <p className='truncate font-semibold text-foreground text-sm'>
                  {user.name || user.username}
                </p>
                <p className='truncate text-muted-foreground text-xs'>
                  {roleLabel}
                </p>
              </div>
              <ChevronUp className='size-4 shrink-0 text-muted-foreground opacity-60' />
            </Fragment>
          ) : (
            <span className='sr-only'>Open account menu</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        side='top'
        sideOffset={8}
        className='z-[100] w-56 rounded-lg border-border'
        style={{ backgroundColor: 'var(--card)' }}
      >
        <div className='px-3 py-3'>
          <p className='truncate font-semibold text-foreground text-sm'>
            {user.name}
          </p>
          <p className='truncate text-muted-foreground text-xs'>{user.email}</p>
        </div>
        <DropdownMenuSeparator style={{ backgroundColor: 'var(--border)' }} />

        <DropdownMenuItem
          className='cursor-pointer gap-2 focus:bg-destructive/10'
          onClick={() => logout.mutate()}
        >
          <LogOut className='size-4' style={{ color: 'var(--danger)' }} />
          <span style={{ color: 'var(--danger)' }}>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
