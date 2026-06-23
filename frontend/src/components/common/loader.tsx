import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowLeft, PackageX, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import {
  EcommerceIllustration,
  type EcommerceIllustrationVariant,
} from './illustration';

// ---------------------------------------------------------------------------
// Velour status surfaces
//   - InlineLoader   : block-level, centered, fills parent (sections / route bodies)
//   - FullPageLoader : fixed full-viewport overlay with blurred backdrop
//   - InlineError    : centered error state with optional retry / back action
//   - InlineEmpty    : centered empty / not-found state
//   - InlineSuccess  : centered success confirmation state
// ---------------------------------------------------------------------------

const markSizes = {
  sm: { box: 'h-14 w-14', glyph: 'text-base', text: 'text-xs', gap: 'gap-3' },
  default: {
    box: 'h-24 w-24',
    glyph: 'text-2xl',
    text: 'text-sm',
    gap: 'gap-5',
  },
  lg: { box: 'h-32 w-32', glyph: 'text-4xl', text: 'text-base', gap: 'gap-6' },
} as const;

type SizeKey = keyof typeof markSizes;

const surfaceVariants = cva(
  'flex w-full flex-col items-center justify-center text-center mx-auto',
  {
    variants: {
      size: {
        sm: 'min-h-[220px] py-10 px-6 gap-4 max-w-sm',
        default: 'min-h-[360px] py-14 px-6 gap-5 max-w-md',
        lg: 'min-h-[500px] py-20 px-6 gap-6 max-w-lg',
      },
    },
    defaultVariants: { size: 'default' },
  }
);

export interface LoaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {
  message?: string;
  /** Override the monogram letter. Defaults to "V" (Velour). */
  monogram?: string;
}

function Monogram({
  size = 'default',
  letter = 'V',
}: {
  size?: SizeKey;
  letter?: string;
}) {
  const s = markSizes[size];
  return (
    <div
      className={cn('relative grid place-items-center', s.box)}
      aria-hidden='true'
    >
      {/* ambient halo */}
      <span
        aria-hidden='true'
        className='absolute inset-[-15%] rounded-full bg-brand/15 blur-3xl animate-loader-pulse'
      />
      {/* hairline track */}
      <span
        aria-hidden='true'
        className='absolute inset-0 rounded-full border border-border/60'
      />
      {/* outer sweeping arc */}
      <span
        aria-hidden='true'
        className='absolute inset-0 rounded-full border-2 border-transparent border-t-brand animate-loader-spin'
      />
      {/* inner counter arc */}
      <span
        aria-hidden='true'
        className='absolute inset-[14%] rounded-full border border-transparent border-b-brand/40 animate-loader-spin-reverse'
      />
      {/* monogram core */}
      <span
        className={cn(
          'relative font-display font-semibold tracking-tight',
          'text-gradient-brand',
          s.glyph
        )}
        aria-hidden='true'
      >
        {letter}
      </span>
    </div>
  );
}

/**
 * InlineLoader — block-level, centers itself in its parent. Use for sections,
 * route bodies, cards, panels.
 */
export function InlineLoader({
  className,
  message = 'Loading…',
  size,
  monogram,
  ...props
}: LoaderProps) {
  const key = (size ?? 'default') as SizeKey;
  const s = markSizes[key];
  return (
    <div
      className={cn(surfaceVariants({ size }), className)}
      role='status'
      aria-live='polite'
      aria-atomic='true'
      aria-busy='true'
      {...props}
    >
      <Monogram size={key} letter={monogram} />
      <div className='flex flex-col items-center gap-2'>
        <p
          className={cn('font-medium tracking-wide text-foreground/85', s.text)}
        >
          {message}
        </p>
        {/* subtle shimmer underline */}
        <span
          aria-hidden='true'
          className='block h-px w-24 overflow-hidden rounded-full bg-border'
        >
          <span className='block h-full w-1/3 bg-brand animate-loader-sweep' />
        </span>
      </div>
    </div>
  );
}

/**
 * FullPageLoader — fixed full-viewport overlay with blurred backdrop.
 */
export function FullPageLoader({
  className,
  message = 'One moment…',
  size = 'lg',
  monogram,
  ...props
}: LoaderProps) {
  const key = (size ?? 'lg') as SizeKey;
  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 px-6',
        'bg-background/80 backdrop-blur-xl',
        className
      )}
      role='status'
      aria-live='polite'
      aria-atomic='true'
      aria-busy='true'
      {...props}
    >
      <Monogram size={key} letter={monogram} />
      <p className='max-w-sm text-center text-sm font-medium tracking-[0.22em] uppercase text-muted-foreground'>
        {message}
      </p>
      <span
        aria-hidden='true'
        className='block h-px w-40 overflow-hidden rounded-full bg-border'
      >
        <span className='block h-full w-1/3 bg-brand animate-loader-sweep' />
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MiniSpinner / MiniLoader — compact reusable loader for tight UI surfaces
// (filter lists, dropdowns, buttons, small cards). No monogram, no min-height.
// ---------------------------------------------------------------------------

const spinnerSizes = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border',
  default: 'h-5 w-5 border-2',
  lg: 'h-6 w-6 border-2',
} as const;

type SpinnerSize = keyof typeof spinnerSizes;

export interface MiniSpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
}

/**
 * MiniSpinner — bare circular spinner, brand-tinted. Drop into buttons,
 * inputs, list rows, anywhere a tiny loading affordance is needed.
 */
export function MiniSpinner({
  className,
  size = 'default',
  ...props
}: MiniSpinnerProps) {
  return (
    <span
      role='status'
      aria-label='Loading'
      className={cn(
        'inline-block rounded-full border-border/60 border-t-brand animate-loader-spin',
        spinnerSizes[size],
        className
      )}
      {...props}
    />
  );
}

export interface MiniLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: SpinnerSize;
  /** Layout: "row" (spinner + text inline) or "stack" (spinner above text). */
  align?: 'row' | 'stack';
  /** When true, renders skeleton bars instead of a text label (good for lists). */
  rows?: number;
}

/**
 * MiniLoader — compact reusable loader for filter panels, category lists,
 * dropdowns, sidebars. Lightweight; no min-height; matches surrounding type.
 *
 * Examples:
 *   <MiniLoader message="Loading categories…" />
 *   <MiniLoader rows={4} />          // skeleton rows for a list
 *   <MiniLoader align="stack" message="Loading filters…" />
 */
export function MiniLoader({
  className,
  message = 'Loading…',
  size = 'sm',
  align = 'row',
  rows,
  ...props
}: MiniLoaderProps) {
  if (rows && rows > 0) {
    return (
      <div
        className={cn('flex flex-col gap-2 py-2', className)}
        role='status'
        aria-live='polite'
        aria-busy='true'
        aria-label={message}
        {...props}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <span
            key={i}
            aria-hidden='true'
            className='block h-8 w-full overflow-hidden rounded-md bg-muted/60'
          >
            <span className='block h-full w-1/3 bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-loader-sweep' />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center text-muted-foreground',
        align === 'stack' ? 'flex-col gap-2 py-3' : 'flex-row gap-2 py-2',
        className
      )}
      role='status'
      aria-live='polite'
      aria-atomic='true'
      aria-busy='true'
      {...props}
    >
      <MiniSpinner size={size} aria-hidden='true' />
      {message && (
        <span className='text-xs font-medium tracking-wide'>{message}</span>
      )}
    </div>
  );
}

export interface MiniEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  icon?: React.ReactNode;
}

/**
 * MiniEmpty — compact themed empty state for tight surfaces (filter lists,
 * dropdowns, sidebar sections). Use for "no items" / "no results" messages.
 */
export function MiniEmpty({
  className,
  message = 'No items',
  icon,
  ...props
}: MiniEmptyProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-2 py-2 text-xs text-muted-foreground',
        className
      )}
      role='status'
      aria-live='polite'
      aria-atomic='true'
      {...props}
    >
      <span
        className='inline-flex h-4 w-4 items-center justify-center'
        aria-hidden='true'
      >
        {icon ?? <PackageX className='h-3.5 w-3.5 opacity-70' />}
      </span>
      <span>{message}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status states (error / empty)
// ---------------------------------------------------------------------------

type StatusVariant = 'error' | 'empty' | 'success';

export interface StatusStateProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof surfaceVariants> {
  title?: string;
  message?: string;
  variant?: StatusVariant;
  /** Optional retry handler — renders a "Try again" button. */
  onRetry?: () => void;
  /** Optional back link target — renders a secondary "Go back" link. */
  backHref?: string;
  backLabel?: string;
  icon?: React.ReactNode;
}

const statusConfig: Record<
  StatusVariant,
  {
    illustration: EcommerceIllustrationVariant;
    tone: string;
    halo: string;
  }
> = {
  error: {
    illustration: 'alert',
    tone: 'text-destructive bg-destructive/10 border-destructive/30',
    halo: 'bg-destructive/15',
  },
  empty: {
    illustration: 'empty',
    tone: 'text-muted-foreground bg-muted border-border',
    halo: 'bg-muted-foreground/10',
  },
  success: {
    illustration: 'success',
    tone: 'text-success bg-success/10 border-success/30',
    halo: 'bg-success/15',
  },
};

function StatusBadge({
  variant,
  icon,
  size,
}: {
  variant: StatusVariant;
  icon?: React.ReactNode;
  size: SizeKey;
}) {
  const s = markSizes[size];
  const config = statusConfig[variant];
  return (
    <div
      className={cn(
        'relative grid place-items-center rounded-full border',
        s.box,
        config.tone
      )}
      aria-hidden='true'
    >
      <span
        aria-hidden='true'
        className={cn(
          'absolute inset-[-15%] rounded-full blur-3xl opacity-60',
          config.halo
        )}
      />
      <span className='relative flex h-full w-full items-center justify-center overflow-hidden '>
        {icon ?? <EcommerceIllustration variant={config.illustration} />}
      </span>
    </div>
  );
}

/**
 * InlineStatus — shared inline error / empty / success surface. Centered,
 * padded, with optional retry + back actions.
 */
export function InlineStatus({
  className,
  title,
  message,
  variant = 'error',
  size,
  onRetry,
  backHref,
  backLabel = 'Go back',
  icon,
  ...props
}: StatusStateProps) {
  const key = (size ?? 'default') as SizeKey;
  const s = markSizes[key];
  const titleMap: Record<StatusVariant, string> = {
    error: 'Something went wrong',
    empty: 'Nothing here yet',
    success: 'All set',
  };
  const resolvedTitle = title ?? titleMap[variant];
  const live = variant === 'error' ? 'assertive' : 'polite';
  return (
    <div
      className={cn(surfaceVariants({ size }), className)}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={live}
      aria-atomic='true'
      {...props}
    >
      <StatusBadge variant={variant} icon={icon} size={key} />

      <div className='flex flex-col items-center gap-2'>
        <h3
          className={cn(
            'font-display font-semibold tracking-tight text-foreground',
            key === 'lg' ? 'text-xl' : key === 'sm' ? 'text-sm' : 'text-lg'
          )}
        >
          {resolvedTitle}
        </h3>
        {message && (
          <p
            className={cn(
              'max-w-prose text-muted-foreground leading-relaxed',
              s.text
            )}
          >
            {message}
          </p>
        )}
      </div>
      {(onRetry || backHref) && (
        <div className='flex flex-wrap items-center justify-center gap-3 pt-1'>
          {onRetry && (
            <button
              type='button'
              onClick={onRetry}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-border bg-brand px-4 py-2 text-xs font-medium tracking-wide text-foreground',
                'transition-colors hover:bg-accent hover:text-accent-foreground '
              )}
            >
              <RefreshCw className='h-3.5 w-3.5' />
              Try again
            </button>
          )}
          {backHref && (
            <Link
              href={backHref}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-wide text-foreground',
                'transition-colors hover:bg-brand hover:text-muted bg-accent'
              )}
            >
              <ArrowLeft className='h-3.5 w-3.5' />
              {backLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/** Convenience wrapper — `InlineStatus` preset to the error variant. */
export function InlineError(props: Omit<StatusStateProps, 'variant'>) {
  return <InlineStatus variant='error' {...props} />;
}

/** Convenience wrapper — `InlineStatus` preset to the empty variant. */
export function InlineEmpty(props: Omit<StatusStateProps, 'variant'>) {
  return <InlineStatus variant='empty' {...props} />;
}

/** Convenience wrapper — `InlineStatus` preset to the success variant. */
export function InlineSuccess(props: Omit<StatusStateProps, 'variant'>) {
  return <InlineStatus variant='success' {...props} />;
}
