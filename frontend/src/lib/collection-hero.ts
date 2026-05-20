import type { CarouselSlide, TextPosition } from '@/components/public/hero';
import type { Collection } from '@/types/collection';
import {
  DEFAULT_HERO_TEXT_POSITION,
  HERO_TEXT_POSITIONS,
} from '@/types/hero-position';

const DEFAULT_COLLECTION_CTA = 'Shop now';

const VALID_POSITIONS = new Set<string>(HERO_TEXT_POSITIONS);

export function getCollectionHeroPosition(
  collection: Pick<Collection, 'position'>
): TextPosition {
  const value = collection.position;
  if (value && VALID_POSITIONS.has(value)) {
    return value as TextPosition;
  }
  return DEFAULT_HERO_TEXT_POSITION;
}

export function getCollectionCtaText(
  collection: Pick<Collection, 'ctaText'>
): string {
  return collection.ctaText?.trim() || DEFAULT_COLLECTION_CTA;
}

export function collectionToHeroSlide(collection: Collection): CarouselSlide | null {
  if (!collection.image?.url) {
    return null;
  }

  return {
    id: collection._id,
    image: collection.image.url,
    alt: collection.name,
    title: collection.name,
    subtitle:
      collection.description?.trim() || 'Explore our curated selection',
    buttonText: getCollectionCtaText(collection),
    buttonHref: `/collections/${collection.slug}`,
    position: getCollectionHeroPosition(collection),
  };
}

export function collectionsToHeroSlides(collections: Collection[]): CarouselSlide[] {
  return collections
    .filter((c) => c.isActive && (c.featuredOnHomepage ?? false))
    .sort((a, b) => (a.heroOrder ?? 0) - (b.heroOrder ?? 0))
    .map(collectionToHeroSlide)
    .filter((slide): slide is CarouselSlide => slide !== null);
}
