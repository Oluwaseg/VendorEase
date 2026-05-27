'use client';

import { cn } from '@/lib/utils';
import { CircleHelp } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type HelpTooltipProps = {
  content: string | React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
};

export function HelpTooltip({
  content,
  className,
  side = 'top',
}: HelpTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type='button'
          className={cn(
            'inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full',
            'bg-primary/10 text-primary hover:bg-primary/20',
            'transition-all duration-200 ease-in-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'hover:shadow-sm active:scale-95',
            className
          )}
          aria-label='Help information'
        >
          <CircleHelp className='h-4 w-4 sm:h-5 sm:w-5' strokeWidth={2.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        sideOffset={12}
        className={cn(
          'w-[min(16rem,calc(100vw-2rem))] sm:w-[min(18rem,calc(100vw-2rem))]',
          'z-50 rounded-lg border border-border/60 bg-popover/95 backdrop-blur-sm',
          'px-3 py-2.5 sm:px-4 sm:py-3',
          'text-xs sm:text-sm leading-relaxed text-popover-foreground',
          'shadow-lg'
        )}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
