import { DEFAULT_HERO_TEXT_POSITION } from '../constants/hero-position';
import {
  Collection,
  ICollection,
  ICollectionImage,
} from '../models/Collection';
import type { HeroTextPosition } from '../constants/hero-position';
import type { SortOrder } from 'mongoose';

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
  image?: ICollectionImage;
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
  image?: ICollectionImage | null;
  productIds?: string[];
  isActive?: boolean;
  featuredOnHomepage?: boolean;
  heroOrder?: number;
}

class CollectionService {
  async createCollection(data: CreateCollectionData): Promise<ICollection> {
    // Check if collection with same name or slug already exists
    const existingCollection = await Collection.findOne({
      $or: [{ name: data.name }, { slug: data.slug }],
    });

    if (existingCollection) {
      throw new Error('Collection with this name or slug already exists');
    }

    const collection = await Collection.create({
      name: data.name,
      slug: data.slug,
      description: data.description,
      ctaText: data.ctaText,
      position: data.position ?? DEFAULT_HERO_TEXT_POSITION,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      showHeroTitle: data.showHeroTitle !== undefined ? data.showHeroTitle : true,
      showHeroSubtitle:
        data.showHeroSubtitle !== undefined ? data.showHeroSubtitle : true,
      showHeroCta: data.showHeroCta !== undefined ? data.showHeroCta : true,
      ctaButtonBgColor: data.ctaButtonBgColor,
      ctaButtonTextColor: data.ctaButtonTextColor,
      image: data.image,
      productIds: data.productIds,
      isActive: data.isActive !== undefined ? data.isActive : true,
      featuredOnHomepage:
        data.featuredOnHomepage !== undefined ? data.featuredOnHomepage : false,
      heroOrder: data.heroOrder ?? 0,
    });

    return collection;
  }

  async getCollections(filters?: {
    isActive?: boolean;
    featuredOnHomepage?: boolean;
  }): Promise<ICollection[]> {
    const query: Record<string, unknown> = {};

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.featuredOnHomepage !== undefined) {
      query.featuredOnHomepage = filters.featuredOnHomepage;
    }

    const sort: Record<string, SortOrder> = filters?.featuredOnHomepage
      ? { heroOrder: 1, createdAt: -1 }
      : { createdAt: -1 };

    const collections = await Collection.find(query)
      .populate('productIds')
      .sort(sort);
    return collections;
  }

  async getCollectionById(id: string): Promise<ICollection | null> {
    const collection = await Collection.findById(id).populate('productIds');
    return collection;
  }

  async getCollectionBySlug(slug: string): Promise<ICollection | null> {
    const collection = await Collection.findOne({ slug }).populate(
      'productIds'
    );
    return collection;
  }

  async updateCollection(
    id: string,
    data: UpdateCollectionData
  ): Promise<ICollection | null> {
    // If updating slug or name, check for duplicates
    if (data.slug || data.name) {
      const query: any = { _id: { $ne: id } };

      if (data.slug) {
        query.slug = data.slug;
      }
      if (data.name) {
        query.name = data.name;
      }

      const existingCollection = await Collection.findOne(query);
      if (existingCollection) {
        throw new Error('Collection with this name or slug already exists');
      }
    }

    const collection = await Collection.findByIdAndUpdate(id, data, {
      new: true,
    }).populate('productIds');
    return collection;
  }

  async deleteCollection(id: string): Promise<boolean> {
    const result = await Collection.findByIdAndDelete(id);
    return !!result;
  }

  async addProductToCollection(
    collectionId: string,
    productId: string
  ): Promise<ICollection | null> {
    const collection = await Collection.findByIdAndUpdate(
      collectionId,
      {
        $addToSet: { productIds: productId },
      },
      { new: true }
    ).populate('productIds');
    return collection;
  }

  async removeProductFromCollection(
    collectionId: string,
    productId: string
  ): Promise<ICollection | null> {
    const collection = await Collection.findByIdAndUpdate(
      collectionId,
      {
        $pull: { productIds: productId },
      },
      { new: true }
    ).populate('productIds');
    return collection;
  }

  async getCollectionProducts(collectionId: string): Promise<any[]> {
    const collection =
      await Collection.findById(collectionId).populate('productIds');
    return collection?.productIds || [];
  }
}

export default new CollectionService();
