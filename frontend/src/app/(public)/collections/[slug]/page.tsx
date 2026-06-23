'use client';

import {
  InlineEmpty,
  InlineError,
  InlineLoader,
} from '@/components/common/loader';
import { ProductCard } from '@/components/products/product-card';
import { ProductGridSection } from '@/components/products/product-grid-section';
import { Button } from '@/components/ui/button';
import {
  useCollectionBySlug,
  useCollectionProducts,
} from '@/hooks/use-collection';
import { getCollectionCtaText } from '@/lib/collection-hero';
import type { Collection } from '@/types/collection';
import type { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function getPopulatedProducts(collection: Collection | undefined): Product[] {
  if (!collection?.productIds?.length) {
    return [];
  }
  return collection.productIds.filter(
    (item): item is Product =>
      typeof item === 'object' && item !== null && '_id' in item
  );
}

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const {
    data: collection,
    isLoading,
    isError,
    refetch,
  } = useCollectionBySlug(slug ?? '');

  const collectionId =
    collection && typeof collection._id === 'string' ? collection._id : '';

  const { data: productsFromApi, isLoading: productsLoading } =
    useCollectionProducts(collectionId);

  const populatedProducts = getPopulatedProducts(collection);
  const products =
    productsFromApi && productsFromApi.length > 0
      ? productsFromApi
      : populatedProducts;

  if (!slug) {
    return (
      <InlineError
        title='Invalid collection'
        message='The collection you are looking for does not exist.'
        size='lg'
        backHref='/collections'
        backLabel='Back to collections'
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return <InlineLoader size='lg' message='Loading collection...' />;
  }

  if (isError || !collection) {
    return (
      <InlineEmpty
        title='No collection found'
        message='The collection you are looking for does not exist.'
        size='lg'
        backHref='/collections'
        backLabel='Back to collections'
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <main className='min-h-screen'>
      <section className='relative'>
        <div className='relative h-[280px] sm:h-[360px] bg-muted'>
          {collection.image?.url ? (
            <Image
              src={collection.image.url}
              alt={collection.name}
              fill
              className='object-cover'
              priority
            />
          ) : null}
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
          <div className='absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-10'>
            <p className='text-sm uppercase tracking-[0.3em] text-white/80'>
              Collection
            </p>
            <h1 className='mt-2 text-4xl sm:text-5xl font-bold text-white'>
              {collection.name}
            </h1>
            {collection.description ? (
              <p className='mt-3 max-w-2xl text-white/90 text-lg'>
                {collection.description}
              </p>
            ) : null}
            <Button
              asChild
              className='mt-6 rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground hover:bg-accent/90'
            >
              <a href='#collection-products'>
                {getCollectionCtaText(collection)}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section id='collection-products' className='py-12 md:py-16 scroll-mt-20'>
        <div className='container mx-auto px-4'>
          <ProductGridSection
            title='Products in this collection'
            subtitle={`${products.length} item${products.length === 1 ? '' : 's'}`}
            products={products}
            isLoading={productsLoading && products.length === 0}
            emptyMessage='No products in this collection yet.'
            refetch={refetch}
            renderItem={(product) => (
              <ProductCard key={product._id} product={product} />
            )}
          />

          <Link
            href='/collections'
            className='mt-10 inline-flex rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted transition-colors'
          >
            ← All collections
          </Link>
        </div>
      </section>
    </main>
  );
}
