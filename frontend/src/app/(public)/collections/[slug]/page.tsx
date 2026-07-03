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
import { DEFAULT_PRODUCT_IMAGE_FALLBACK } from '@/lib/image-fallbacks';
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
        title="Missing collection"
          message="No slug provided."
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return <InlineLoader message="Loading collection…" />;
  }

  if (isError || !collection) {
    return (
      <InlineError
        title="Couldn't load this collection"
        message="Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const heroImg = collection.image?.url ?? DEFAULT_PRODUCT_IMAGE_FALLBACK;

  return (
    <main className="min-h-screen bg-background">
      {/* EDITORIAL SPLIT HERO */}
      <section className="relative border-b border-border">
        {/* subtle brand wash on the type side */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              'radial-gradient(40% 60% at 12% 20%, var(--brand), transparent 70%), radial-gradient(35% 55% at 5% 90%, var(--accent), transparent 70%)',
          }}
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-16 pt-10 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-16">
          {/* LEFT — type column */}
          <div className="lg:col-span-6 lg:pr-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              <Link href="/" className="transition hover:text-foreground">
                Home
              </Link>
              <span className="opacity-40">/</span>
              <Link
                href="/collections"
                className="transition hover:text-foreground"
              >
                Collections
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-foreground">{collection.name}</span>
            </nav>

            {/* Issue-style marker */}
            <div className="mt-10 flex items-center gap-4">
              <span
                className="h-px w-10"
                style={{ background: 'var(--gradient-brand)' }}
              />
              <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-[color:var(--brand)]">
                The Collection
              </span>
            </div>

            {/* Massive editorial title */}
            <h1
              className="mt-6 text-6xl leading-[0.9] tracking-tight md:text-7xl lg:text-8xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {collection.name}
            </h1>

            {collection.description ? (
              <p className="mt-8 max-w-xl border-l-2 border-[color:var(--brand)]/40 pl-5 text-lg leading-relaxed text-muted-foreground">
                {collection.description}
              </p>
            ) : null}

            {/* Stats row */}
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-y border-border py-6">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Products
                </dt>
                <dd
                  className="mt-1 text-2xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {products.length}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Status
                </dt>
                <dd className="mt-1 inline-flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
                  Live
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Slug
                </dt>
                <dd className="mt-1 truncate font-mono text-xs text-foreground">
                  /{collection.slug}
                </dd>
              </div>
            </dl>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full border-0 text-white shadow-md"
                style={{ background: 'var(--gradient-brand)' }}
              >
                <Link href="#products">{getCollectionCtaText(collection)}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full"
              >
                <Link href="/collections">All collections →</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT — image column, offset & framed */}
          <div className="relative lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-2xl">
              <Image
                src={heroImg}
                alt={collection.name}
                fill
                priority
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
              {/* soft brand veil */}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-multiply opacity-40"
                style={{
                  background:
                    'linear-gradient(160deg, transparent 40%, color-mix(in oklab, var(--brand) 40%, transparent))',
                }}
              />
              {/* floating meta tag */}
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                Collection
              </div>
            </div>

            {/* Overlapping caption card */}
            <div className="absolute -bottom-6 -left-4 hidden max-w-[240px] rounded-2xl border border-border bg-card p-4 shadow-lg lg:block">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Curated by
              </div>
              <div
                className="mt-1 text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                The Studio
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-[color:var(--brand)]">
              The Line-up
            </div>
            <h2
              className="mt-2 text-3xl md:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Every piece in {collection.name}
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
            {products.length} item{products.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* untouched — same props as your original */}
        <ProductGridSection
          title=""
          refetch={refetch}
          products={products}
          isLoading={productsLoading}
          renderItem={(product) => (
            <ProductCard product={product} key={product._id as string} />
          )}
        />

        <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
          {/* <Button asChild variant="outline" className="rounded-full">
            <Link href="/collections">← All collections</Link>
          </Button> */}
          <a
            href="#products"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Back to top ↑
          </a>
        </div>
      </section>
    </main>
  );
}
