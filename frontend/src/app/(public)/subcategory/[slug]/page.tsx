'use client';

import {
  InlineEmpty,
  InlineError,
  InlineLoader,
} from '@/components/common/loader';
import { ProductCard } from '@/components/products/product-card';
import { ProductGridSection } from '@/components/products/product-grid-section';
import { useCategoryById } from '@/hooks/use-category';
import { useProducts } from '@/hooks/use-product';
import { useSubcategoryBySlug } from '@/hooks/use-subcategory';
import {
  getSubcategoryCategoryId,
  getSubcategoryCategoryRef,
} from '@/lib/subcategory-category';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SubcategoryDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const {
    data: subcategory,
    isLoading,
    isError,
    refetch,
  } = useSubcategoryBySlug(slug ?? '');

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useProducts(
    {
      page: 1,
      limit: 12,
      subcategory: subcategory?._id,
    },
    { enabled: Boolean(subcategory?._id) }
  );

  const products = productsData?.products ?? [];
  const categoryId = getSubcategoryCategoryId(subcategory);
  const { data: fetchedCategory } = useCategoryById(categoryId ?? '');
  const category = getSubcategoryCategoryRef(subcategory, fetchedCategory);

  if (!slug) {
    return (
      <InlineError
        title='Invalid subcategory'
        message='The subcategory you are looking for does not exist.'
        size='lg'
        backHref='/subcategory'
        backLabel='Back to subcategories'
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return <InlineLoader size='lg' message='Loading subcategory...' />;
  }

  if (isError || !subcategory) {
    return (
      <InlineEmpty
        title='Subcategory not found'
        message='The subcategory you are looking for does not exist.'
        size='lg'
        backHref='/subcategory'
        backLabel='Back to subcategories'
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
      <section className='relative overflow-hidden border-b border-border/60'>
        {/* Ambient brand wash */}
        <div
          aria-hidden
          className='absolute inset-0 opacity-90'
          style={{ background: 'var(--gradient-brand)' }}
        />
        {/* Soft radial highlight */}
        <div
          aria-hidden
          className='absolute inset-0'
          style={{
            background:
              'radial-gradient(80% 60% at 15% 0%, oklch(1 0 0 / 0.25), transparent 60%), radial-gradient(60% 60% at 90% 100%, oklch(0 0 0 / 0.35), transparent 60%)',
          }}
        />
        {/* Grain */}
        <div
          aria-hidden
          className='absolute inset-0 opacity-[0.08]'
          style={{
            backgroundImage:
              'radial-gradient(oklch(1 0 0) 1px, transparent 1px)',
            backgroundSize: '3px 3px',
          }}
        />

        <div className='relative container mx-auto px-4 py-24 md:py-32'>
          {/* Breadcrumb */}
          <nav
            aria-label='Breadcrumb'
            className='mb-8 flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-white/75'
          >
            <Link href='/' className='transition-colors hover:text-white'>
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link
              href='/subcategory'
              className='transition-colors hover:text-white'
            >
              Subcategories
            </Link>
            {category ? (
              <>
                <span aria-hidden>/</span>
                <Link
                  href={`/category/${category.slug}`}
                  className='transition-colors hover:text-white'
                >
                  {category.name}
                </Link>
              </>
            ) : null}
            <span aria-hidden>/</span>
            <span className='text-white'>{subcategory.name}</span>
          </nav>

          <div className='grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end'>
            <div className='animate-fade-in'>
              <span className='inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur'>
                <span
                  className='h-1.5 w-1.5 rounded-full'
                  style={{ background: 'var(--accent)' }}
                />
                Subcategory
              </span>

              <h1
                className='mt-6 text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.98] tracking-tight text-white'
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {subcategory.name}
              </h1>

              {category ? (
                <p className='mt-5 text-sm text-white/80'>
                  A curated collection under{' '}
                  <Link
                    href={`/category/${category.slug}`}
                    className='font-semibold text-white underline decoration-white/40 decoration-2 underline-offset-4 transition-colors hover:decoration-white'
                  >
                    {category.name}
                  </Link>
                </p>
              ) : null}

              <p className='mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-white/85'>
                {subcategory.description ??
                  'This subcategory does not have a description yet.'}
              </p>

              {/* Meta chips */}
              <div className='mt-8 flex flex-wrap items-center gap-3'>
                <span className='inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-1.5 text-xs font-medium text-white backdrop-blur'>
                  <span
                    className='h-1.5 w-1.5 rounded-full'
                    style={{ background: 'var(--success)' }}
                  />
                  {products.length} product
                  {products.length === 1 ? '' : 's'}
                </span>
                <span className='inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-1.5 text-xs font-medium text-white backdrop-blur'>
                  /{subcategory.slug}
                </span>
                {category ? (
                  <Link
                    href={`/category/${category.slug}`}
                    className='inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white/20'
                  >
                    ↳ {category.name}
                  </Link>
                ) : null}
              </div>

              <div className='mt-9 flex flex-wrap gap-3'>
                <a
                  href='#subcategory-products'
                  className='inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-foreground shadow-lg transition-all hover:-translate-y-0.5'
                >
                  Browse products
                  <span aria-hidden>↓</span>
                </a>
                <Link
                  href='/subcategory'
                  className='inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20'
                >
                  All subcategories
                </Link>
              </div>
            </div>

            {/* Decorative token card */}
            <div className='hidden md:block'>
              <div
                className='ml-auto w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl'
                style={{
                  animation: 'scale-in 0.6s cubic-bezier(0.22,1,0.36,1) both',
                }}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className='flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold text-white'
                    style={{ background: 'oklch(1 0 0 / 0.18)' }}
                  >
                    {subcategory.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-white'>
                      {subcategory.name}
                    </p>
                    <p className='truncate text-xs text-white/70'>
                      {category?.name ?? 'Collection'}
                    </p>
                  </div>
                </div>

                <div className='mt-6 grid grid-cols-2 gap-3 text-white'>
                  <div className='rounded-2xl bg-white/10 p-4'>
                    <p className='text-xs uppercase tracking-wider text-white/70'>
                      Items
                    </p>
                    <p
                      className='mt-1 text-2xl font-bold'
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {products.length}
                    </p>
                  </div>
                  <div className='rounded-2xl bg-white/10 p-4'>
                    <p className='text-xs uppercase tracking-wider text-white/70'>
                      Status
                    </p>
                    <p className='mt-1 flex items-center gap-2 text-sm font-semibold'>
                      <span
                        className='h-2 w-2 rounded-full'
                        style={{ background: 'var(--success)' }}
                      />
                      Live
                    </p>
                  </div>
                </div>

                {category ? (
                  <Link
                    href={`/category/${category.slug}`}
                    className='mt-5 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm text-white transition-colors hover:bg-white/20'
                  >
                    <span>
                      Parent ·{' '}
                      <span className='font-semibold'>{category.name}</span>
                    </span>
                    <span aria-hidden>→</span>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section
        id='subcategory-products'
        className='scroll-mt-20 py-16 md:py-20'
      >
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
                Products in {subcategory.name}
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
            isLoading={productsLoading && products.length === 0}
            isError={productsError}
            emptyMessage='No products found for this subcategory.'
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
              href='#subcategory-products'
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
