'use client';

import {
  FilterState,
  ProductCard,
  ProductFilters,
  ProductGridSection,
} from '@/components/products';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/use-product';
import type { Product } from '@/types/product';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ShopPageClient() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
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
              <ProductGridSection
                title='All Products'
                subtitle='Shop from our complete collection'
                sectionClassName='py-0 bg-transparent'
                containerClassName='max-w-none px-0'
                products={products}
                isLoading={isLoading}
                isError={isError}
                emptyMessage='No products found.'
                skeletonCount={12}
                actions={
                  <div className='hidden sm:flex items-center gap-2 rounded-lg bg-muted p-1'>
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
                }
                renderItem={(product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    className='rounded-xl'
                  />
                )}
              />

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
