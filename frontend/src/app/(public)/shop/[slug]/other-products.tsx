'use client';

import { Button } from '@/components/ui/button';
import { useCartContext } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { formatPrice } from '@/lib/format-price';
import { DEFAULT_PRODUCT_IMAGE_FALLBACK } from '@/lib/image-fallbacks';
import { Product } from '@/types/product';
import { Heart, Star, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface OtherProductsProps {
  products: Product[];
  currentProductId?: string;
}

export function OtherProducts({
  products,
  currentProductId,
}: OtherProductsProps) {
  const { currency, convert } = useCurrency();
  const { addToCart } = useCartContext();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Filter out current product and ensure we have products to display
  const filteredProducts = products.filter((p) => p._id !== currentProductId);

  if (!filteredProducts || filteredProducts.length === 0) {
    return null;
  }

  const handleToggleWishlist = (product: Product) => {
    setWishlistLoading(product._id);
    try {
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
      } else {
        addToWishlist({
          id: product._id,
          name: product.name,
          price: product.basePrice,
          rating: Number(product.averageRating),
        });
      }
    } finally {
      setWishlistLoading(null);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
    });
  };

  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50'>
      <div className='mb-12'>
        <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-3'>
          You Might Also Like
        </h2>
        <p className='text-foreground/60'>
          Explore more products from our collection
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {filteredProducts.map((product) => {
          const discountedPrice = product.flashSale?.isActive
            ? product.flashSale.discountType === 'percentage'
              ? product.basePrice * (1 - product.flashSale.discountValue / 100)
              : product.basePrice - product.flashSale.discountValue
            : product.basePrice;

          const isWishlisted = isInWishlist(product._id);

          return (
            <Link key={product._id} href={`/shop/${product.slug}`}>
              <div className='group rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-card hover:bg-muted/30 h-full flex flex-col'>
                {/* Image Container */}
                <div className='relative overflow-hidden bg-linear-to-br from-muted to-muted/50 aspect-square flex items-center justify-center'>
                  <Image
                    src={
                      imageErrors[product._id]
                        ? DEFAULT_PRODUCT_IMAGE_FALLBACK
                        : product.images?.[0]?.url ||
                          DEFAULT_PRODUCT_IMAGE_FALLBACK
                    }
                    onError={() =>
                      setImageErrors((prev) => ({
                        ...prev,
                        [product._id]: true,
                      }))
                    }
                    alt={product.name}
                    width={300}
                    height={300}
                    className='object-cover w-full h-full group-hover:scale-110 transition-transform duration-300'
                  />
                  {/* Flash Sale Badge */}
                  {product.flashSale?.isActive && (
                    <div className='absolute top-3 right-3 bg-linear-to-r from-red-600 to-pink-500 text-white px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-lg'>
                      <Zap size={14} className='fill-white' />
                      <span className='font-bold text-xs'>
                        {product.flashSale.discountType === 'percentage'
                          ? `${product.flashSale.discountValue}%`
                          : `$${product.flashSale.discountValue}`}
                      </span>
                    </div>
                  )}
                  {/* Stock Badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className='absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold'>
                      Only {product.stock} left
                    </div>
                  )}
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleWishlist(product);
                    }}
                    disabled={wishlistLoading === product._id}
                    className='absolute top-3 right-3 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2.5 rounded-full bg-white/90 hover:bg-white shadow-lg z-10'
                  >
                    <Heart
                      size={18}
                      className={`transition-all ${
                        isWishlisted
                          ? 'fill-red-500 stroke-red-500'
                          : 'stroke-foreground/60 hover:stroke-foreground'
                      }`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className='p-4 flex flex-col grow'>
                  {/* Category */}
                  <p className='text-xs font-bold text-primary/70 mb-2 uppercase tracking-wider'>
                    {product.category?.name}
                  </p>

                  {/* Product Name */}
                  <h3 className='font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors'>
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className='flex items-center gap-2 mb-3'>
                    <div className='flex gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.round(Number(product.averageRating))
                              ? 'fill-accent stroke-accent'
                              : 'stroke-foreground/20'
                          }
                        />
                      ))}
                    </div>
                    <p className='text-xs font-semibold text-foreground/60'>
                      ({product.ratingCount})
                    </p>
                  </div>

                  {/* Price */}
                  <div className='mb-4 flex items-baseline gap-2'>
                    {product.flashSale?.isActive && (
                      <p className='text-sm font-semibold text-foreground/40 line-through'>
                        {formatPrice(convert(product.basePrice), currency)}
                      </p>
                    )}
                    <p className='text-lg font-bold text-foreground'>
                      {formatPrice(convert(discountedPrice), currency)}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    disabled={product.stock === 0}
                    className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 rounded-lg transition-all duration-200 mt-auto'
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
