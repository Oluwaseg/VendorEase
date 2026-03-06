import { Category } from './category';

export interface Subcategory {
  _id: string;

  name: string;
  slug: string;

  // Relation
  category: Category; // Category _id

  description?: string;
  isPublished: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface SubcategoryInput {
  name: string;
  slug: string;
  category: string; // category ID
  description?: string;
  isPublished: boolean;
}
