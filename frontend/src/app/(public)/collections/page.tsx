'use client';

import {
  InlineEmpty,
  InlineError,
  InlineLoader,
} from '@/components/common/loader';
import { useCollections } from '@/hooks/use-collection';
import type { Collection } from '@/types/collection';
import Image from 'next/image';
import Link from 'next/link';

export default function CollectionsPage() {
  const {
    data: collections,
    isLoading,
    isError,
    refetch,
  } = useCollections({ isActive: true });

  if (isLoading) return <InlineLoader message="Loading collections…" />;
  if (isError)
    return (
      <InlineError
        title="Couldn't load collections"
        message="Please try again."
        onRetry={() => refetch()}
      />
    );

  const list = (collections ?? []).filter((c) => c.isActive);

  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-border/60"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(60% 50% at 15% 20%, color-mix(in oklab, var(--brand) 35%, transparent), transparent 60%), radial-gradient(50% 40% at 85% 80%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 60%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence baseFrequency=%220.9%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="/" className="transition hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Collections</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
            Curated Sets
          </div>

          <h1
            className="mt-6 max-w-4xl text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Our{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--gradient-brand)' }}
            >
              Collections
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Handpicked product groups chosen for style, season, and value —
            edited like a magazine, priced like a shop.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="rounded-2xl border border-border/60 bg-card/70 px-6 py-4 backdrop-blur">
              <div
                className="text-3xl leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {list.length}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Live collections
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/70 px-6 py-4 backdrop-blur">
              <div
                className="text-3xl leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {list.reduce(
                  (n, c) =>
                    n + (Array.isArray(c.productIds) ? c.productIds.length : 0),
                  0
                )}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Total products
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.25em] text-[color:var(--brand)]">
              Browse
            </div>
            <h2
              className="mt-2 text-3xl md:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              All collections
            </h2>
          </div>
          <div className="hidden text-sm text-muted-foreground md:block">
            {list.length} result{list.length === 1 ? '' : 's'}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-16 text-center">
            <InlineEmpty
              title="No collections yet"
              message="New sets will appear here as they go live."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((collection, i) => (
              <CollectionListCard
                key={collection._id as string}
                collection={collection}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function CollectionListCard({
  collection,
  index,
}: {
  collection: Collection;
  index: number;
}) {
  const count = Array.isArray(collection.productIds)
    ? collection.productIds.length
    : 0;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--brand)]/50 hover:shadow-2xl"
      style={{ animation: `fadeUp 0.6s ${index * 60}ms both` }}
    >
      {/* accent bar */}
      <span
        className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
        style={{ background: 'var(--gradient-brand)' }}
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {collection.image?.url ? (
          <Image
            src={collection.image.url}
            alt={collection.name}
            fill
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
            sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-sm text-muted-foreground"
            style={{ background: 'var(--gradient-brand)', opacity: 0.15 }}
          >
            No cover image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
          Live
        </div>

        <div className="absolute right-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold backdrop-blur">
          {count} {count === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[color:var(--brand)]">
            Collection
          </div>
          <h3
            className="mt-1 text-2xl leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {collection.name}
          </h3>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {collection.description ??
            'Explore this collection on the storefront.'}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-dashed border-border pt-4">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            /{collection.slug}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-all group-hover:gap-2 group-hover:text-[color:var(--brand)]">
            View <span aria-hidden>→</span>
          </span>
        </div>
      </div>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </Link>
  );
}
