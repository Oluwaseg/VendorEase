'use client';

import { Hero } from '@/components/public/hero';
import { useCollections } from '@/hooks/use-collection';
import { collectionsToHeroSlides } from '@/lib/collection-hero';
import { HERO_FALLBACK_SLIDES } from '@/lib/hero-fallback-slides';

export function HomeHero() {
  const { data: collections, isLoading } = useCollections({
    isActive: true,
    featuredOnHomepage: true,
  });

  const apiSlides = collections ? collectionsToHeroSlides(collections) : [];
  const slides =
    !isLoading && apiSlides.length > 0 ? apiSlides : HERO_FALLBACK_SLIDES;

  return <Hero slides={slides} />;
}
