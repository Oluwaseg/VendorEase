'use client';

import {
  InlineEmpty,
  InlineError,
  InlineLoader,
} from '@/components/common/loader';
import { useSubcategories } from '@/hooks/use-subcategory';
import { getSubcategoryCategoryName } from '@/lib/subcategory-category';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function SubcategoryPage() {
  const {
    data: subcategories,
    isLoading,
    isError,
    refetch,
  } = useSubcategories();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const published = useMemo(
    () => subcategories?.filter((s) => s.isPublished) ?? [],
    [subcategories]
  );

  const categoryGroups = useMemo(() => {
    const map = new Map<string, number>();
    published.forEach((s) => {
      const name = getSubcategoryCategoryName(s) ?? 'Uncategorized';
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [published]);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return published;
    return published.filter(
      (s) =>
        (getSubcategoryCategoryName(s) ?? 'Uncategorized') === activeCategory
    );
  }, [published, activeCategory]);

  if (isLoading)
    return <InlineLoader size='lg' message='Loading subcategories...' />;
  if (isError)
    return (
      <InlineError
        title='Error loading subcategories'
        message='Unable to load subcategories right now.'
        size='lg'
        onRetry={() => refetch()}
      />
    );

  return (
    <main className='relative min-h-screen bg-background'>
      {/* Hero */}
      <section
        className='relative overflow-hidden border-b border-border'
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div
          className='pointer-events-none absolute inset-0 opacity-40'
          style={{
            background:
              'radial-gradient(60% 60% at 15% 20%, color-mix(in oklab, var(--brand) 35%, transparent), transparent 70%), radial-gradient(50% 50% at 85% 80%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)',
          }}
        />
        <div
          className='pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.08]'
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
          }}
        />

        <div className='relative container mx-auto px-4 py-24 md:py-32'>
          <nav className='mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground'>
            <Link href='/' className='hover:text-foreground transition-colors'>
              Home
            </Link>
            <span>/</span>
            <span className='text-foreground'>Subcategories</span>
          </nav>

          <div className='flex flex-col gap-10 md:flex-row md:items-end md:justify-between'>
            <div className='max-w-2xl'>
              <div className='inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] backdrop-blur'>
                <span
                  className='h-1.5 w-1.5 rounded-full'
                  style={{ background: 'var(--accent)' }}
                />
                Explore the catalog
              </div>
              <h1
                className='mt-6 text-5xl leading-[1.02] font-semibold tracking-tight md:text-7xl'
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Every
                <span
                  className='mx-3 inline-block bg-clip-text text-transparent'
                  style={{ backgroundImage: 'var(--gradient-brand)' }}
                >
                  subcategory
                </span>
                in one place.
              </h1>
              <p className='mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg'>
                Drill straight into the niches you care about — curated groups
                across every category, organized for the way people actually
                shop.
              </p>

              <div className='mt-8 flex flex-wrap items-center gap-3'>
                <Link
                  href='/category'
                  className='inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5'
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  Browse categories
                  <span aria-hidden>→</span>
                </Link>
                <a
                  href='#grid'
                  className='inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-card'
                >
                  Jump to list
                </a>
              </div>
            </div>

            {/* Stat card */}
            <div className='grid grid-cols-2 gap-3 md:min-w-[280px]'>
              <div className='rounded-2xl border border-border bg-card/70 p-5 backdrop-blur'>
                <p className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>
                  Subcategories
                </p>
                <p
                  className='mt-2 text-4xl font-semibold'
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {published.length}
                </p>
              </div>
              <div className='rounded-2xl border border-border bg-card/70 p-5 backdrop-blur'>
                <p className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>
                  Categories
                </p>
                <p
                  className='mt-2 text-4xl font-semibold'
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {categoryGroups.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter chips */}
      {categoryGroups.length > 0 && (
        <section className='sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur'>
          <div className='container mx-auto px-4'>
            <div className='flex gap-2 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
              <FilterChip
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                label='All'
                count={published.length}
              />
              {categoryGroups.map(([name, count]) => (
                <FilterChip
                  key={name}
                  active={activeCategory === name}
                  onClick={() => setActiveCategory(name)}
                  label={name}
                  count={count}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section id='grid' className='container mx-auto px-4 py-16 md:py-24'>
        <div className='mb-10 flex items-end justify-between'>
          <div>
            <p
              className='text-xs uppercase tracking-[0.3em]'
              style={{ color: 'var(--brand)' }}
            >
              {activeCategory === 'all' ? 'All subcategories' : activeCategory}
            </p>
            <h2
              className='mt-2 text-3xl font-semibold tracking-tight md:text-4xl'
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {filtered.length} result{filtered.length === 1 ? '' : 's'}
            </h2>
          </div>
        </div>

        {filtered.length === 0 ? (
          <InlineEmpty
            size='lg'
            title='No subcategories found'
            message='No published subcategories available yet.'
          />
        ) : (
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filtered.map((subcategory, i) => {
              const categoryName =
                getSubcategoryCategoryName(subcategory) ?? 'Category';
              const initial = subcategory.name?.charAt(0).toUpperCase() ?? '·';
              return (
                <Link
                  key={subcategory._id}
                  href={`/subcategory/${subcategory.slug}`}
                  className='group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-2xl'
                  style={{
                    animation: `fadeUp 0.5s ease-out ${i * 40}ms both`,
                  }}
                >
                  {/* Hover gradient wash */}
                  <div
                    className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'
                    style={{
                      background:
                        'linear-gradient(135deg, color-mix(in oklab, var(--brand) 8%, transparent), color-mix(in oklab, var(--accent) 8%, transparent))',
                    }}
                  />
                  {/* Accent bar */}
                  <div
                    className='absolute left-0 top-0 h-full w-1 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100'
                    style={{ background: 'var(--gradient-brand)' }}
                  />

                  <div className='relative flex items-start justify-between'>
                    <div
                      className='flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-md'
                      style={{
                        background: 'var(--gradient-brand)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {initial}
                    </div>
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground backdrop-blur'>
                      <span
                        className='h-1 w-1 rounded-full'
                        style={{ background: 'var(--success)' }}
                      />
                      Live
                    </span>
                  </div>

                  <div className='relative mt-6'>
                    <p className='text-[10px] uppercase tracking-[0.25em] text-muted-foreground'>
                      {categoryName}
                    </p>
                    <h3
                      className='mt-2 text-xl font-semibold tracking-tight'
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {subcategory.name}
                    </h3>
                    <p className='mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground'>
                      {subcategory.description ?? 'No description available.'}
                    </p>
                  </div>

                  <div className='relative mt-6 flex items-center justify-between border-t border-dashed border-border pt-4'>
                    <span className='text-xs font-medium text-muted-foreground'>
                      /{subcategory.slug}
                    </span>
                    <span
                      className='inline-flex items-center gap-1.5 text-xs font-semibold transition-transform group-hover:translate-x-1'
                      style={{ color: 'var(--brand)' }}
                    >
                      Explore
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active
          ? 'border-transparent text-white shadow-md'
          : 'border-border bg-card text-foreground hover:border-foreground/30'
      }`}
      style={active ? { background: 'var(--gradient-brand)' } : undefined}
    >
      {label}
      <span
        className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
          active ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
        }`}
      >
        {count}
      </span>
    </button>
  );
}
