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
import { ChevronUp, ExternalLink, LayoutDashboard, LogOut, Store } from 'lucide-react';
import Link from 'next/link';
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

export function AdminNavUser({ collapsed = false, onNavigate }: AdminNavUserProps) {
  const { user } = useAuth();
  const logout = useLogout();

  if (!user) {
    return null;
  }

  const roleLabel = user.role === 'admin' ? 'Administrator' : 'Moderator';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className={cn(
            'flex w-full items-center gap-3 rounded-xl border border-border/80 bg-muted/40 px-2 py-2 text-left transition-colors hover:bg-muted/70',
            collapsed &&
              'justify-center border-transparent bg-transparent px-0 py-2 hover:bg-muted/50',
          )}
        >
          <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-semibold text-primary text-xs'>
            {initials(user.name || user.username || user.email)}
          </div>
          {!collapsed ? (
            <Fragment>
              <div className='min-w-0 flex-1'>
                <p className='truncate font-semibold text-foreground text-sm'>
                  {user.name || user.username}
                </p>
                <p className='truncate text-muted-foreground text-xs'>{roleLabel}</p>
              </div>
              <ChevronUp className='size-4 shrink-0 text-muted-foreground opacity-70' />
            </Fragment>
          ) : (
            <span className='sr-only'>Open account menu</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' side='top' className='w-56 rounded-xl'>
        <div className='px-2 py-2'>
          <p className='truncate font-semibold text-foreground text-sm'>{user.name}</p>
          <p className='truncate text-muted-foreground text-xs'>{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/admin' className='flex cursor-pointer gap-2' onClick={onNavigate}>
            <LayoutDashboard className='size-4 opacity-70' />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/' className='flex cursor-pointer gap-2' onClick={onNavigate}>
            <Store className='size-4 opacity-70' />
            Storefront
            <ExternalLink className='size-4 opacity-50' />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          className='cursor-pointer'
          onClick={() => logout.mutate()}
        >
          <LogOut className='size-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
