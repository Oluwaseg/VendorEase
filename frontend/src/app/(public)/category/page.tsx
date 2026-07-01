'use client';

import {
  InlineEmpty,
  InlineError,
  InlineLoader,
} from '@/components/common/loader';
import { useCategories } from '@/hooks/use-category';
import { DEFAULT_PRODUCT_IMAGE_FALLBACK } from '@/lib/image-fallbacks';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryPage() {
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const publishedCategories =
    categories?.filter((category) => category.isPublished) ?? [];

  if (isLoading) {
    return <InlineLoader size='lg' message='Loading categories...' />;
  }

  if (isError) {
    return (
      <InlineError
        title='Error loading categories'
        message='Unable to load categories right now.'
        size='lg'
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <main
      className='min-h-screen'
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Hero */}
      <section className='border-b border-border/60'>
        <div className='container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-20'>
          <div className='flex flex-col gap-8 md:flex-row md:items-end md:justify-between'>
            <div className='max-w-2xl animate-[fadeUp_0.6s_cubic-bezier(0.22,1,0.36,1)_both]'>
              <span className='inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur'>
                <span className='h-1.5 w-1.5 rounded-full bg-brand' />
                Explore the catalog
              </span>
              <h1
                className='mt-5 text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight text-foreground'
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Shop by{' '}
                <span
                  className='bg-clip-text text-transparent'
                  style={{ backgroundImage: 'var(--gradient-brand)' }}
                >
                  Category
                </span>
              </h1>
              <p className='mt-5 text-base md:text-lg text-muted-foreground leading-relaxed'>
                Browse all available categories and explore the products inside
                each one — curated collections across{' '}
                <span className='text-foreground font-medium'>
                  {publishedCategories.length}
                </span>{' '}
                departments.
              </p>
            </div>

            <Link
              href='/subcategory'
              className='group inline-flex items-center gap-2 self-start rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-xs transition-all hover:border-brand hover:text-brand hover:shadow-md md:self-auto'
            >
              View subcategories
              <span
                aria-hidden
                className='transition-transform group-hover:translate-x-1'
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className='container mx-auto px-4 py-16 md:py-20'>
        {publishedCategories.length === 0 ? (
          <InlineEmpty
            size='lg'
            title='No categories found'
            message='No published categories available yet.'
          />
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {publishedCategories.map((category, i) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className='group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-ring'
                style={{
                  animation: `fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both`,
                  animationDelay: `${Math.min(i * 60, 480)}ms`,
                }}
              >
                {/* Image */}
                <div className='relative aspect-[4/3] overflow-hidden bg-surface-2'>
                  <Image
                    src={
                      category.image?.url?.trim() ||
                      DEFAULT_PRODUCT_IMAGE_FALLBACK
                    }
                    alt={category.name}
                    width={600}
                    height={450}
                    className='h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105'
                  />
                  {/* Gradient veil */}
                  <div
                    aria-hidden
                    className='pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply'
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 40%, oklch(0.16 0.01 50 / 0.55) 100%)',
                    }}
                  />
                  {/* Badge */}
                  <span className='absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground shadow-xs backdrop-blur'>
                    {category.slug}
                  </span>
                </div>

                {/* Body */}
                <div className='flex flex-1 flex-col gap-3 p-6'>
                  <div className='flex items-start justify-between gap-4'>
                    <h2
                      className='text-xl font-semibold leading-tight text-card-foreground transition-colors group-hover:text-brand'
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {category.name}
                    </h2>
                    <span
                      aria-hidden
                      className='mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground group-hover:rotate-[-45deg]'
                    >
                      →
                    </span>
                  </div>
                  <p className='line-clamp-3 text-sm leading-relaxed text-muted-foreground'>
                    {category.description ?? 'No description available.'}
                  </p>
                  <div className='mt-auto flex items-center gap-2 pt-4 text-xs font-medium text-muted-foreground'>
                    <span className='h-px flex-1 bg-border' />
                    <span className='tracking-wide uppercase'>
                      Explore products
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
