import { Category } from './category';
import { Subcategory } from './subcategory';

export type ProductVisibility = 'public' | 'private' | 'archived';

export interface ProductImage {
  url: string;
  publicId: string;
}

export type FlashSaleDiscountType = 'percentage' | 'fixed';

export interface FlashSale {
  discountType: FlashSaleDiscountType;
  discountValue: number;
  startsAt: string; // ISO date string
  endsAt: string; // ISO date string
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  basePrice: number;
  stock: number;
  images: ProductImage[];
  category: Category;
  subcategory?: Subcategory;
  createdBy: string;
  brand?: string;
  tags: string[];
  isPublished: boolean;
  visibility: ProductVisibility;
  averageRating: number;
  ratingCount: number;
  reviewCount: number;
  flashSale?: FlashSale;
  isBestSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string; // e.g., 'price_asc', 'price_desc', 'latest'
  search?: string;
}

// Paginated payload from API
export interface ProductListPayload {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface CreateProduct {
  name: string;
  description: string;
  sku: string;
  basePrice: number;
  stock: number;
  category: string; // categoryId
  subcategory?: string; // subcategoryId
  brand?: string;
  tags: string[];
  isPublished: boolean;
  visibility: ProductVisibility;
  images: ProductImage[];
  flashSale?: FlashSale;
  isBestSeller: boolean;
}

export interface UpdateProduct {
  name?: string;
  description?: string;
  sku?: string;
  basePrice?: number;
  stock?: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  tags?: string[];
  isPublished?: boolean;
  visibility?: ProductVisibility;
  images?: ProductImage[];
  flashSale?: FlashSale | null;
  isBestSeller?: boolean;
}
