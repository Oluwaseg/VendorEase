'use client';

import { useCollections } from '@/hooks/use-collection';
import type { Collection } from '@/types/collection';
import Image from 'next/image';
import Link from 'next/link';

export default function CollectionsPage() {
  const { data: collections, isLoading, isError } = useCollections({
    isActive: true,
  });

  if (isLoading) {
    return (
      <main className='min-h-screen py-20'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-8'>Collections</h1>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='h-72 rounded-2xl bg-muted animate-pulse' />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className='min-h-screen py-20'>
        <div className='container mx-auto px-4'>
          <p className='text-foreground/70'>
            Unable to load collections. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const list = (collections ?? []).filter((c) => c.isActive);

  return (
    <main className='min-h-screen py-20'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mb-12'>
          <p className='text-sm uppercase tracking-[0.3em] text-primary/80'>
            Curated
          </p>
          <h1 className='mt-3 text-5xl font-bold'>Collections</h1>
          <p className='mt-4 text-lg text-foreground/70'>
            Browse handpicked product groups chosen for style, season, and value.
          </p>
        </div>

        {list.length === 0 ? (
          <p className='text-foreground/70'>No collections available yet.</p>
        ) : (
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {list.map((collection) => (
              <CollectionListCard key={collection._id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function CollectionListCard({ collection }: { collection: Collection }) {
  const count = Array.isArray(collection.productIds)
    ? collection.productIds.length
    : 0;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className='group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow'
    >
      <div className='relative h-52 bg-muted'>
        {collection.image?.url ? (
          <Image
            src={collection.image.url}
            alt={collection.name}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-muted-foreground text-sm'>
            No cover image
          </div>
        )}
      </div>
      <div className='p-5'>
        <h2 className='text-xl font-bold'>{collection.name}</h2>
        <p className='mt-2 text-sm text-foreground/70 line-clamp-3'>
          {collection.description ?? 'Explore this collection on the storefront.'}
        </p>
        <p className='mt-3 text-xs font-medium text-primary'>
          {count} product{count === 1 ? '' : 's'} →
        </p>
      </div>
    </Link>
  );
}
