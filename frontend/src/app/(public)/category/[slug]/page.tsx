'use client';

import {
  InlineEmpty,
  InlineError,
  InlineLoader,
  MiniLoader,
} from '@/components/common/loader';
import { ProductCard } from '@/components/products/product-card';
import { ProductGridSection } from '@/components/products/product-grid-section';
import { Button } from '@/components/ui/button';
import {
  useCategoryBySlug,
  useCategoryProductsBySlug,
} from '@/hooks/use-category';
import { useSubcategoriesWithCategory } from '@/hooks/use-subcategory';
import { DEFAULT_PRODUCT_IMAGE_FALLBACK } from '@/lib/image-fallbacks';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const {
    data: category,
    isLoading,
    isError,
    refetch,
  } = useCategoryBySlug(slug ?? '');

  const {
    data: categoryProducts,
    isLoading: categoryProductsLoading,
    isError: categoryProductsError,
    refetch: refetchProducts,
  } = useCategoryProductsBySlug(slug ?? '', { page: 1, limit: 12 });

  const products = categoryProducts?.products ?? [];

  const { data: subcategories, isLoading: subcategoriesLoading } =
    useSubcategoriesWithCategory(category?._id ?? '');

  const publishedSubcategories =
    subcategories?.filter((subcategory) => subcategory.isPublished) ?? [];

  if (!slug) {
    return (
      <InlineError
        title='Invalid category'
        message='The category you are looking for does not exist.'
        size='lg'
        backHref='/category'
        backLabel='Back to categories'
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return <InlineLoader size='lg' message='Loading category...' />;
  }

  if (isError || !category) {
    return (
      <InlineEmpty
        title='Category not found'
        message='The category you are looking for does not exist.'
        size='lg'
        backHref='/category'
        backLabel='Back to categories'
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <main
      className='min-h-screen'
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* ================= HERO ================= */}
      <section className='relative'>
        <div className='relative h-[60vh] min-h-[420px] max-h-[640px] w-full overflow-hidden bg-surface-2'>
          <Image
            src={category.image?.url?.trim() || DEFAULT_PRODUCT_IMAGE_FALLBACK}
            alt={category.name}
            fill
            className='object-cover scale-105'
            priority
          />

          {/* Layered veils built from theme tokens */}
          <div
            aria-hidden
            className='absolute inset-0'
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, oklch(0.16 0.01 50 / 0.35) 45%, oklch(0.16 0.01 50 / 0.92) 100%)',
            }}
          />
          <div
            aria-hidden
            className='absolute inset-0 mix-blend-overlay opacity-70'
            style={{ background: 'var(--gradient-brand)' }}
          />
          {/* Grain / noise sheen */}
          <div
            aria-hidden
            className='absolute inset-0 opacity-[0.08]'
            style={{
              backgroundImage:
                'radial-gradient(oklch(1 0 0) 1px, transparent 1px)',
              backgroundSize: '3px 3px',
            }}
          />

          {/* Content */}
          <div className='absolute inset-x-0 bottom-0'>
            <div className='container mx-auto px-4 pb-14 md:pb-20'>
              {/* Breadcrumb */}
              <nav
                aria-label='Breadcrumb'
                className='mb-6 flex items-center gap-2 text-xs font-medium tracking-wide text-white/70'
              >
                <Link href='/' className='transition-colors hover:text-white'>
                  Home
                </Link>
                <span aria-hidden>/</span>
                <Link
                  href='/category'
                  className='transition-colors hover:text-white'
                >
                  Categories
                </Link>
                <span aria-hidden>/</span>
                <span className='text-white'>{category.name}</span>
              </nav>

              <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
                <div className='max-w-3xl animate-fade-in'>
                  <span className='inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur'>
                    <span
                      className='h-1.5 w-1.5 rounded-full'
                      style={{ background: 'var(--accent)' }}
                    />
                    Category
                  </span>

                  <h1
                    className='mt-5 text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.98] tracking-tight text-white'
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {category.name}
                  </h1>

                  {category.description ? (
                    <p className='mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-white/85'>
                      {category.description}
                    </p>
                  ) : null}

                  {/* Meta chips */}
                  <div className='mt-7 flex flex-wrap items-center gap-3'>
                    <span className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur'>
                      <span
                        className='h-1.5 w-1.5 rounded-full'
                        style={{ background: 'var(--success)' }}
                      />
                      {products.length} product
                      {products.length === 1 ? '' : 's'}
                    </span>
                    {publishedSubcategories.length > 0 && (
                      <span className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur'>
                        {publishedSubcategories.length} subcategor
                        {publishedSubcategories.length === 1 ? 'y' : 'ies'}
                      </span>
                    )}
                    <span className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur'>
                      /{category.slug}
                    </span>
                  </div>
                </div>

                <div className='flex flex-wrap gap-3 md:justify-end'>
                  <Button
                    asChild
                    className='rounded-full px-7 py-6 text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5'
                    style={{
                      background: 'var(--gradient-brand)',
                      color: 'var(--brand-foreground)',
                    }}
                  >
                    <a href='#category-products'>
                      Browse products
                      <span aria-hidden className='ml-2'>
                        ↓
                      </span>
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant='outline'
                    className='rounded-full border-white/30 bg-white/5 px-7 py-6 text-sm font-semibold text-white backdrop-blur hover:bg-white/15 hover:text-white'
                  >
                    <Link href='/category'>All categories</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SUBCATEGORIES ================= */}
      <section className='border-b border-border/60'>
        <div className='container mx-auto px-4 py-14 md:py-16'>
          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
            <div className='max-w-xl'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-brand'>
                Refine
              </p>
              <h2
                className='mt-2 text-3xl md:text-4xl font-bold tracking-tight text-foreground'
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Subcategories
              </h2>
              <p className='mt-3 text-sm md:text-base text-muted-foreground'>
                Browse narrower groups within{' '}
                <span className='font-medium text-foreground'>
                  {category.name}
                </span>
                .
              </p>
            </div>
          </div>

          {subcategoriesLoading ? (
            <div className='mt-8 max-w-md'>
              <MiniLoader rows={3} message='Loading subcategories...' />
            </div>
          ) : publishedSubcategories.length > 0 ? (
            <div className='mt-8 flex flex-wrap gap-3'>
              {publishedSubcategories.map((subcategory, i) => (
                <Link
                  key={subcategory._id}
                  href={`/subcategory/${subcategory.slug}`}
                  className='group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-card-foreground shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-md'
                  style={{
                    animation: 'fade-in 0.4s ease-out both',
                    animationDelay: `${Math.min(i * 40, 320)}ms`,
                  }}
                >
                  <span
                    aria-hidden
                    className='h-1.5 w-1.5 rounded-full bg-muted-foreground transition-colors group-hover:bg-brand'
                  />
                  {subcategory.name}
                  <span
                    aria-hidden
                    className='opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100'
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className='mt-8 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center'>
              <p className='text-sm text-muted-foreground'>
                No subcategories in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section id='category-products' className='scroll-mt-20 py-16 md:py-20'>
        <div className='container mx-auto px-4'>
          <div className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-brand'>
                Shop the collection
              </p>
              <h2
                className='mt-2 text-3xl md:text-4xl font-bold tracking-tight text-foreground'
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Products in {category.name}
              </h2>
            </div>
            <div className='inline-flex items-center gap-3 self-start rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground sm:self-auto'>
              <span
                className='h-1.5 w-1.5 rounded-full'
                style={{ background: 'var(--brand)' }}
              />
              {products.length} item{products.length === 1 ? '' : 's'}
            </div>
          </div>

          <ProductGridSection
            title=''
            subtitle=''
            products={products}
            isLoading={categoryProductsLoading && products.length === 0}
            isError={categoryProductsError}
            emptyMessage='No products found for this category.'
            refetch={refetchProducts}
            sectionClassName='py-0 bg-transparent'
            containerClassName='px-0'
            renderItem={(product) => (
              <ProductCard key={product._id} product={product} />
            )}
          />

          {/* Footer nav */}
          <div className='mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center'>
            <a
              href='#category-products'
              className='text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-brand'
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
