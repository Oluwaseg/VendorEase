'use client';

import { ProductFilters, type FilterState } from '@/components/product-filters';
import { Button } from '@/components/ui/button';
import { useCartContext } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useProducts } from '@/hooks/use-product';
import { formatPrice } from '@/lib/format-price';
import type { Product } from '@/types/product';
import { ArrowRight, Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ShopPageClient() {
  const { addToCart } = useCartContext();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const { currency, convert } = useCurrency();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    const flashSaleActive = searchParams.get('flashSaleActive') === 'true';
    const isBestSeller = searchParams.get('isBestSeller') === 'true';
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000');

    return {
      search,
      category,
      subcategory,
      minPrice,
      maxPrice,
      isBestSeller,
      flashSaleActive,
    };
  });

  const { data, isLoading, isError } = useProducts({
    page,
    limit,
    ...(filters.search && { search: filters.search }),
    ...(filters.category && { category: filters.category }),
    ...(filters.subcategory && { subcategory: filters.subcategory }),
    ...(filters.minPrice > 0 && { minPrice: filters.minPrice }),
    ...(filters.maxPrice < 10000 && { maxPrice: filters.maxPrice }),
    ...(filters.isBestSeller && { isBestSeller: filters.isBestSeller }),
    ...(filters.flashSaleActive && {
      flashSaleActive: filters.flashSaleActive,
    }),
  });
  const products: Product[] = data?.products ?? [];

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.basePrice,
      quantity: 1,
    });
    setAddedItems((prev) => [...prev, product._id]);
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product._id));
    }, 2000);
  };

  const handleWishlist = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.basePrice,
        rating: product.averageRating ?? 0,
      });
    }
  };

  function RatingStars({
    rating,
    reviewCount = 0,
  }: {
    rating: number;
    reviewCount?: number;
  }) {
    return (
      <div className='space-y-1'>
        <div className='flex items-center gap-1.5'>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.round(rating)
                  ? 'fill-accent text-accent'
                  : 'text-foreground/20'
              }
            />
          ))}
          <span className='text-xs font-medium text-foreground'>
            {rating.toFixed(1)}
          </span>
        </div>
        {reviewCount > 0 && (
          <span className='text-xs text-foreground/60'>
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        )}
      </div>
    );
  }

  function ProductCard({ product }: { product: Product }) {
    const isAdded = addedItems.includes(product._id);
    const inWishlist = isInWishlist(product._id);
    const hasFlashSale =
      product.flashSale && product.flashSale.isActive ? true : false;
    const salePrice =
      hasFlashSale && product.flashSale
        ? product.flashSale.discountType === 'percentage'
          ? product.basePrice * (1 - product.flashSale.discountValue / 100)
          : product.basePrice - product.flashSale.discountValue
        : product.basePrice;

    return (
      <Link href={`/shop/${product.slug}`}>
        <div className='group cursor-pointer'>
          <div className='relative overflow-hidden rounded-lg bg-secondary/50 aspect-square mb-4'>
            <Image
              src={product.images?.[0]?.url ?? '/placeholder.png'}
              alt={product.name}
              fill
              className='object-cover group-hover:scale-110 transition-transform duration-500'
            />
            {hasFlashSale && (
              <div className='absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-bold flashsale'>
                <Zap size={14} className='fill-current' />
                Flash Sale
              </div>
            )}
            {product.isBestSeller && !hasFlashSale && (
              <div className='absolute top-3 left-3 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold'>
                Best Seller
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleWishlist(product);
              }}
              className='absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm'
            >
              <Heart
                size={18}
                className={
                  inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'
                }
              />
            </button>
          </div>
          <div className='space-y-2'>
            <h3 className='font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2'>
              {product.name}
            </h3>
            <RatingStars
              rating={product.averageRating ?? 0}
              reviewCount={product.reviewCount ?? 0}
            />
            <div className='flex items-center justify-between pt-1'>
              <div className='flex flex-col gap-1'>
                <p className='text-lg font-bold text-primary'>
                  {formatPrice(convert(salePrice), currency)}
                </p>
                {hasFlashSale && (
                  <p className='text-xs text-foreground/50 line-through'>
                    {formatPrice(convert(product.basePrice), currency)}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(product);
                }}
                className={`p-2 rounded-lg transition-all ${
                  isAdded
                    ? 'bg-green-100 text-green-600'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-32 pb-24 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto'>
            <div className='inline-block'>
              <span className='text-xs font-semibold text-primary uppercase tracking-widest'>
                Curated Collection
              </span>
            </div>
            <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance'>
              Discover Premium Products
            </h1>
            <p className='text-lg sm:text-xl text-foreground/60 max-w-2xl text-balance'>
              Handpicked items that combine quality, functionality, and
              exceptional value. Every product tells a story.
            </p>
            <div className='flex items-center gap-3 pt-4'>
              <div className='w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center'>
                <ArrowRight size={20} className='text-accent' />
              </div>
              <p className='text-sm font-semibold text-foreground'>
                Explore our latest collection below
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className='px-4 sm:px-6 lg:px-8 py-20 bg-background'>
        <div className='max-w-7xl mx-auto'>
          {/* Section Header */}
          <div className='flex items-center justify-between mb-16'>
            <div>
              <h2 className='text-3xl sm:text-4xl font-bold text-foreground mb-2'>
                All Products
              </h2>
              <p className='text-foreground/60'>
                Shop from our complete collection
              </p>
            </div>
            <div className='hidden sm:flex items-center gap-2 bg-muted p-1 rounded-lg'>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className='bg-transparent px-3 py-2 text-sm font-medium text-foreground focus:outline-none'
              >
                <option value={6}>Show 6</option>
                <option value={12}>Show 12</option>
                <option value={24}>Show 24</option>
              </select>
            </div>
          </div>

          {/* Filters and Products Layout */}
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Sidebar Filters */}
            <div className='lg:w-64 flex-shrink-0'>
              <ProductFilters
                initialFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            {/* Products Grid */}
            <div className='flex-1'>
              {/* Products Grid */}
              {isLoading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className='animate-pulse'>
                      <div className='bg-muted aspect-square rounded-lg mb-4' />
                      <div className='h-4 bg-muted rounded w-3/4 mb-2' />
                      <div className='h-3 bg-muted rounded w-1/2' />
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className='text-center py-20'>
                  <p className='text-foreground/60'>
                    Failed to load products. Please try again.
                  </p>
                </div>
              ) : products.length === 0 ? (
                <div className='text-center py-20'>
                  <p className='text-foreground/60'>No products found.</p>
                </div>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {products.length > 0 && (
                <div className='flex flex-col sm:flex-row items-center justify-between gap-6 mt-20 pt-12 border-t border-border'>
                  <div className='flex items-center gap-3'>
                    <span className='text-sm text-foreground/60'>
                      Page{' '}
                      <span className='font-semibold text-foreground'>
                        {data?.page ?? page}
                      </span>{' '}
                      of{' '}
                      <span className='font-semibold text-foreground'>
                        {data?.pages ?? 1}
                      </span>
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      variant='outline'
                      className='disabled:opacity-50'
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= (data?.pages ?? 1)}
                      className='disabled:opacity-50'
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
