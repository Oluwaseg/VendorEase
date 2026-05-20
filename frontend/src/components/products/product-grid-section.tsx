'use client';

import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';
import type { ReactNode } from 'react';

interface ProductGridSectionProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  sectionClassName?: string;
  containerClassName?: string;
  gridClassName?: string;
  skeletonClassName?: string;
  skeletonCount?: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  products?: Product[];
  renderItem?: (product: Product) => ReactNode;
  children?: ReactNode;
}

export function ProductGridSection({
  title,
  subtitle,
  actions,
  sectionClassName,
  containerClassName,
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8',
  skeletonClassName,
  skeletonCount = 6,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load products. Please try again.',
  emptyMessage = 'No products available right now.',
  products = [],
  renderItem,
  children,
}: ProductGridSectionProps) {
  return (
    <section className={cn('py-12 md:py-16 bg-background', sectionClassName)}>
      <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', containerClassName)}>
        <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-3xl font-bold text-foreground sm:text-4xl'>{title}</h2>
            {subtitle ? <p className='mt-2 text-foreground/60'>{subtitle}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </div>

        {isLoading ? (
          <div className={gridClassName}>
            {[...Array(skeletonCount)].map((_, index) => (
              <div key={index} className={cn('animate-pulse', skeletonClassName)}>
                <div className='mb-4 aspect-square rounded-xl bg-muted' />
                <div className='mb-2 h-4 w-3/4 rounded bg-muted' />
                <div className='h-3 w-1/2 rounded bg-muted' />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className='py-20 text-center'>
            <p className='text-foreground/60'>{errorMessage}</p>
          </div>
        ) : products.length === 0 ? (
          <div className='rounded-2xl border border-border bg-card p-12 text-center'>
            <p className='text-foreground/60'>{emptyMessage}</p>
          </div>
        ) : children ? (
          children
        ) : (
          <div className={gridClassName}>{products.map((product) => renderItem?.(product))}</div>
        )}
      </div>
    </section>
  );
}
