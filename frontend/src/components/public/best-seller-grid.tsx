'use client';

import { InlineEmpty, InlineError } from '@/components/common/loader';
import { useCurrency } from '@/contexts/currency-context';
import { useProducts } from '@/hooks/use-product';
import { formatPrice } from '@/lib/format-price';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';

const FALLBACK_IMAGE =
  'https://www.puravidabracelets.com/cdn/shop/files/square-image_2_1.jpg?crop=center&height=400&v=1774219636&width=400';

const BEST_SELLER_LIMIT = 7;

function getSalePrice(product: Product) {
  const hasFlashSale = Boolean(product.flashSale?.isActive);
  if (!hasFlashSale || !product.flashSale) {
    return product.basePrice;
  }

  const salePrice =
    product.flashSale.discountType === 'percentage'
      ? product.basePrice * (1 - product.flashSale.discountValue / 100)
      : product.basePrice - product.flashSale.discountValue;

  return Math.max(salePrice, 0);
}

function getStockLabel(stock: number) {
  if (stock <= 0) return 'Out of stock';
  if (stock <= 5) return `Only ${stock} left · Ships in 2 days`;
  return 'In stock · Ships in 2 days';
}

function BestSellerSkeleton() {
  return (
    <div className='mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
      {Array.from({ length: BEST_SELLER_LIMIT }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse overflow-hidden rounded-2xl border border-border bg-card',
            i === 0 && 'col-span-2 row-span-2 lg:col-span-2 lg:row-span-2'
          )}
        >
          <div className='aspect-[4/5] bg-muted' />
          <div className='space-y-2 p-4'>
            <div className='h-4 w-3/4 rounded bg-muted' />
            <div className='h-3 w-1/2 rounded bg-muted' />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BestSellerGrid() {
  const { currency, convert } = useCurrency();
  const { data, isLoading, isError, refetch } = useProducts({
    page: 1,
    limit: BEST_SELLER_LIMIT,
    isBestSeller: true,
  });

  const products = data?.products ?? [];

  return (
    <section className='relative bg-background py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-6 sm:px-10'>
        <div className='flex flex-wrap items-end justify-between gap-6'>
          <div>
            <span className='text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground'>
              Best Sellers
            </span>
            <h3 className='mt-2 text-4xl sm:text-5xl'>
              Seven pieces. One story.
            </h3>
          </div>
          <Link
            href='/shop?isBestSeller=true'
            className='text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'
          >
            View all best sellers →
          </Link>
        </div>

        {isLoading ? (
          <BestSellerSkeleton />
        ) : isError ? (
          <div className='mt-12'>
            <InlineError
              title='Could not load best sellers'
              message='Please try again in a moment.'
              onRetry={() => refetch()}
            />
          </div>
        ) : products.length === 0 ? (
          <div className='mt-12'>
            <InlineEmpty
              title='No best sellers yet'
              message='Check back soon for our top picks.'
              onRetry={() => refetch()}
            />
          </div>
        ) : (
          <div className='mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
            {products.map((product, i) => (
              <Link
                key={product._id}
                href={`/shop/${product.slug}`}
                className={cn(
                  'group relative block overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]',
                  i === 0 &&
                    'col-span-2 row-span-2 lg:col-span-2 lg:row-span-2'
                )}
              >
                <div className='relative aspect-[4/5] overflow-hidden'>
                  <Image
                    src={product.images?.[0]?.url ?? FALLBACK_IMAGE}
                    alt={product.name}
                    fill
                    sizes={
                      i === 0
                        ? '(max-width: 1024px) 100vw, 50vw'
                        : '(max-width: 768px) 50vw, 25vw'
                    }
                    className='object-cover transition duration-700 group-hover:scale-[1.04]'
                  />
                  <div className='absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur'>
                    {product.category?.name ?? 'Featured'}
                  </div>
                </div>
                <div className='flex items-center justify-between gap-3 p-4'>
                  <div className='min-w-0'>
                    <div className='truncate font-display text-base'>
                      {product.name}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {getStockLabel(product.stock)}
                    </div>
                  </div>
                  <div className='shrink-0 text-sm font-semibold text-foreground'>
                    {formatPrice(convert(getSalePrice(product)), currency)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
