'use client';

import { ProductCard, ProductGridSection } from '@/components/products';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useProducts } from '@/hooks/use-product';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useRef } from 'react';

interface FeaturedProductsSectionProps {
  title: string;
  viewAllHref: string;
  filter: {
    flashSaleActive?: boolean;
    isBestSeller?: boolean;
  };
}

function FeaturedProductsSection({
  title,
  viewAllHref,
  filter,
}: FeaturedProductsSectionProps) {
  const { data, isLoading, refetch } = useProducts({
    page: 1,
    limit: 8,
    ...filter,
  });

  const products = data?.products ?? [];
  const pluginRef = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <ProductGridSection
      title={title}
      sectionClassName='py-12 md:py-16 bg-surface'
      containerClassName='container mx-auto px-4'
      products={products}
      isLoading={isLoading}
      skeletonCount={4}
      refetch={refetch}
      gridClassName='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
      skeletonClassName='rounded-2xl bg-card/50 h-96'
      actions={
        <Link
          href={viewAllHref}
          className='inline-flex items-center text-sm font-semibold text-brand transition-colors group hover:text-brand/80'
        >
          VIEW ALL
          <span className='ml-2 transition-transform group-hover:translate-x-1'>
            →
          </span>
        </Link>
      }
    >
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[pluginRef.current]}
        className='w-full'
      >
        <CarouselContent className='-ml-4'>
          {products.map((product) => (
            <CarouselItem
              key={product._id}
              className='pl-4 basis-full sm:basis-1/2 lg:basis-1/4'
            >
              <ProductCard
                product={product}
                showDescription
                imageClassName='aspect-[4/3] h-56 mb-0'
                className='rounded-xl'
                contentClassName='pt-4'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation Buttons */}
        <div className='flex justify-end gap-2 mt-8'>
          <CarouselPrevious className='relative static w-10 h-10 border border-border hover:bg-accent/10' />
          <CarouselNext className='relative static w-10 h-10 border border-border hover:bg-accent/10' />
        </div>
      </Carousel>
    </ProductGridSection>
  );
}

export function FlashSaleProducts() {
  return (
    <FeaturedProductsSection
      title='Flash Sale'
      viewAllHref='/shop?flashSaleActive=true'
      filter={{ flashSaleActive: true }}
    />
  );
}

export function BestSellerProducts() {
  return (
    <FeaturedProductsSection
      title='Best Sellers'
      viewAllHref='/shop?isBestSeller=true'
      filter={{ isBestSeller: true }}
    />
  );
}
