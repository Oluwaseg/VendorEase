import type { HeroTextPosition } from './hero-position';
import { Product } from './product';

export interface CollectionImage {
  url: string;
  publicId: string;
}

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  ctaText?: string;
  position?: HeroTextPosition;
  heroTitle?: string;
  heroSubtitle?: string;
  showHeroTitle?: boolean;
  showHeroSubtitle?: boolean;
  showHeroCta?: boolean;
  ctaButtonBgColor?: string;
  ctaButtonTextColor?: string;
  image?: CollectionImage;
  productIds: string[] | Product[];
  isActive: boolean;
  featuredOnHomepage: boolean;
  heroOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionData {
  name: string;
  slug: string;
  description?: string;
  ctaText?: string;
  position?: HeroTextPosition;
  heroTitle?: string;
  heroSubtitle?: string;
  showHeroTitle?: boolean;
  showHeroSubtitle?: boolean;
  showHeroCta?: boolean;
  ctaButtonBgColor?: string;
  ctaButtonTextColor?: string;
  image?: CollectionImage;
  productIds: string[];
  isActive?: boolean;
  featuredOnHomepage?: boolean;
  heroOrder?: number;
}

export interface UpdateCollectionData {
  name?: string;
  slug?: string;
  description?: string;
  ctaText?: string;
  position?: HeroTextPosition;
  heroTitle?: string;
  heroSubtitle?: string;
  showHeroTitle?: boolean;
  showHeroSubtitle?: boolean;
  showHeroCta?: boolean;
  ctaButtonBgColor?: string | null;
  ctaButtonTextColor?: string | null;
  image?: CollectionImage | null;
  productIds?: string[];
  isActive?: boolean;
  featuredOnHomepage?: boolean;
  heroOrder?: number;
}
