import { Category, ICategory } from '../models/Category';
import productService from './product.service';

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: { url?: string; publicId?: string };
  isPublished?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  image?: { url?: string; publicId?: string } | null;
  isPublished?: boolean;
}

class CategoryService {
  async createCategory(data: CreateCategoryData): Promise<ICategory> {
    // Check if category with same name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [{ name: data.name }, { slug: data.slug }],
    });

    if (existingCategory) {
      throw new Error('Category with this name or slug already exists');
    }

    const category = await Category.create({
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    });

    return category;
  }

  async getCategories(filters?: {
    isPublished?: boolean;
  }): Promise<ICategory[]> {
    const query: any = {};

    if (filters?.isPublished !== undefined) {
      query.isPublished = filters.isPublished;
    }

    const categories = await Category.find(query).sort({ createdAt: -1 });
    return categories;
  }

  async getCategoryById(id: string): Promise<ICategory> {
    const category = await Category.findById(id);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async getCategoryBySlug(slug: string): Promise<ICategory> {
    const category = await Category.findOne({ slug });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async getProductsByCategorySlug(
    slug: string,
    filters?: {
      subcategory?: string;
      brand?: string;
      tags?: string[];
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      flashSaleActive?: boolean;
      isBestSeller?: boolean;
      isPublished?: boolean;
      visibility?: string;
    },
    pagination?: { page: number; limit: number }
  ) {
    const category = await this.getCategoryBySlug(slug);
    return productService.getProducts(
      {
        ...filters,
        category: category._id.toString(),
      },
      pagination
    );
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryData
  ): Promise<ICategory> {
    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    // Check for duplicate name or slug (excluding current category)
    if (data.name || data.slug) {
      const existingCategory = await Category.findOne({
        $or: [
          ...(data.name ? [{ name: data.name, _id: { $ne: id } }] : []),
          ...(data.slug ? [{ slug: data.slug, _id: { $ne: id } }] : []),
        ],
      });

      if (existingCategory) {
        throw new Error('Category with this name or slug already exists');
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      throw new Error('Failed to update category');
    }

    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new Error('Category not found');
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;
