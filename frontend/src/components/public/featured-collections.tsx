'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useCollections } from '@/hooks/use-collection';
import { DEFAULT_PRODUCT_IMAGE_FALLBACK } from '@/lib/image-fallbacks';
import type { Collection } from '@/types/collection';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { InlineLoader } from '../common/loader';

interface FeaturedCollectionsProps {
  className?: string;
  fallbackImageSrc?: string;
}

export function FeaturedCollections({
  className,
  fallbackImageSrc,
}: FeaturedCollectionsProps) {
  const { data: collections, isLoading } = useCollections({ isActive: true });
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const fallbackImage = fallbackImageSrc?.trim() || DEFAULT_PRODUCT_IMAGE_FALLBACK;

  if (isLoading) {
    return (
      <section className={`py-16 ${className ?? ''}`}>
        <InlineLoader size='lg' message='Loading featured collections...' />
      </section>
    );
  }

  const active = collections ?? [];

  if (active.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 ${className ?? ''}`}>
      <div className='container mx-auto px-4'>
        <Carousel
          plugins={[plugin.current]}
          className='w-full'
          opts={{ align: 'start', loop: true }}
        >
          <div className='flex items-center justify-between mb-12'>
            <div>
              <h2 className='text-4xl font-bold'>Featured Collections</h2>
              <p className='mt-2 text-foreground/60'>
                Curated picks from our catalog
              </p>
            </div>
            <div className='flex gap-4'>
              <CarouselPrevious className='relative inset-0 h-10 w-10 border-2 border-foreground/30 hover:border-foreground/50 rounded-full bg-transparent hover:bg-transparent' />
              <CarouselNext className='relative inset-0 h-10 w-10 border-2 border-foreground/30 hover:border-foreground/50 rounded-full bg-transparent hover:bg-transparent' />
            </div>
          </div>

          <CarouselContent className='-ml-2 md:-ml-4 p-2'>
            {active.map((collection) => (
              <CarouselItem
                key={collection._id}
                className='pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3'
              >
                <CollectionCard collection={collection} fallbackImageSrc={fallbackImage} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className='mt-8 text-center'>
          <Link
            href='/collections'
            className='inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold bg-brand hover:text-brand-foreground transition-colors'
          >
            View all collections
          </Link>
        </div>
      </div>
    </section>
  );
}

function CollectionCard({
  collection,
  fallbackImageSrc,
}: {
  collection: Collection;
  fallbackImageSrc: string;
}) {
  const productCount = Array.isArray(collection.productIds)
    ? collection.productIds.length
    : 0;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className='group block overflow-hidden rounded-2xl border border-border bg-card h-full transition-shadow hover:shadow-lg'
    >
      <div className='relative h-56'>
        <Image
          src={collection.image?.url?.trim() || fallbackImageSrc}
          alt={collection.name}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
        <div className='absolute bottom-4 left-4 right-4 text-white'>
          <h3 className='text-xl font-bold'>{collection.name}</h3>
          <p className='text-sm text-white/80 mt-1 line-clamp-2'>
            {collection.description || `${productCount} products`}
          </p>
        </div>
      </div>
    </Link>
  );
}
