'use client';

import { Button } from '@/components/ui/button';
import { useCartContext } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { formatPrice } from '@/lib/format-price';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type MouseEvent, useState } from 'react';

interface ProductCardProps {
  product: Product;
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  showDescription?: boolean;
}

function getSalePrice(product: Product) {
  const hasFlashSale = Boolean(product.flashSale && product.flashSale.isActive);
  if (!hasFlashSale || !product.flashSale) {
    return {
      hasFlashSale: false,
      salePrice: product.basePrice,
      discountPercent: null as number | null,
    };
  }

  const salePrice =
    product.flashSale.discountType === 'percentage'
      ? product.basePrice * (1 - product.flashSale.discountValue / 100)
      : product.basePrice - product.flashSale.discountValue;

  const discountPercent =
    product.flashSale.discountType === 'percentage'
      ? Math.round(product.flashSale.discountValue)
      : Math.round((1 - salePrice / product.basePrice) * 100);

  return {
    hasFlashSale: true,
    salePrice: Math.max(salePrice, 0),
    discountPercent: Math.max(discountPercent, 0),
  };
}

export function ProductCard({
  product,
  className,
  imageClassName,
  contentClassName,
  showDescription = false,
}: ProductCardProps) {
  const { currency, convert } = useCurrency();
  const { addToCart } = useCartContext();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const { hasFlashSale, salePrice, discountPercent } = getSalePrice(product);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    addToCart({
      id: product._id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product._id);
      return;
    }
    addToWishlist({
      id: product._id,
      name: product.name,
      price: product.basePrice,
      rating: product.averageRating ?? 0,
    });
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-1 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl',
        className
      )}
    >
      <div
        className={cn(
          'relative mb-4 aspect-square overflow-hidden rounded-xl bg-surface',
          imageClassName
        )}
      >
        <Image
          src={
            product.images?.[0]?.url ??
            'https://www.puravidabracelets.com/cdn/shop/files/square-image_2_1.jpg?crop=center&height=400&v=1774219636&width=400'
          }
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://www.puravidabracelets.com/cdn/shop/files/square-image_2_1.jpg?crop=center&height=400&v=1774219636&width=400';
          }}
          alt={product.name}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

        {hasFlashSale ? (
          <div className='flashsale absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1.5 text-xs font-bold text-accent-foreground shadow'>
            <Zap size={13} className='fill-current' />
            {discountPercent}% OFF
          </div>
        ) : product.isBestSeller ? (
          <div className='absolute left-3 top-3 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-bold text-primary-foreground shadow'>
            Best Seller
          </div>
        ) : null}

        <button
          onClick={handleWishlist}
          aria-label='Toggle wishlist'
          className='absolute right-3 top-3 rounded-full bg-background/95 p-2.5 text-foreground shadow-sm transition-colors hover:bg-background'
        >
          <Heart
            size={17}
            className={cn(
              'transition-colors',
              inWishlist ? 'fill-danger text-danger' : 'text-foreground'
            )}
          />
        </button>
      </div>

      <div className={cn('flex flex-1 flex-col px-3 pb-3', contentClassName)}>
        <h3 className='line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-brand'>
          {product.name}
        </h3>

        {showDescription && product.description ? (
          <p className='mt-2 line-clamp-2 text-xs text-muted-foreground'>
            {product.description}
          </p>
        ) : null}

        <div className='mt-2 flex items-center gap-1.5'>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={13}
              className={cn(
                index < Math.round(product.averageRating ?? 0)
                  ? 'fill-accent text-accent'
                  : 'text-foreground/20'
              )}
            />
          ))}
          <span className='text-xs font-medium text-foreground/75'>
            {(product.averageRating ?? 0).toFixed(1)}
          </span>
        </div>

        <div className='mt-auto flex items-end justify-between pt-4'>
          <div>
            <p className='text-lg font-bold text-brand'>
              {formatPrice(convert(salePrice), currency)}
            </p>
            {hasFlashSale ? (
              <p className='text-xs font-medium text-muted-foreground line-through'>
                {formatPrice(convert(product.basePrice), currency)}
              </p>
            ) : null}
          </div>

          <Button
            onClick={handleAddToCart}
            size='icon'
            variant='secondary'
            className={cn(
              'h-9 w-9 rounded-lg border border-border/70 bg-surface-2 text-foreground hover:bg-surface-3',
              isAdded &&
                'border-success/40 bg-success/15 text-success hover:bg-success/20'
            )}
            aria-label='Add to cart'
          >
            <ShoppingCart size={16} />
          </Button>
        </div>
      </div>
    </Link>
  );
}
