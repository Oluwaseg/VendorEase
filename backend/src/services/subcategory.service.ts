import { Category } from '../models/Category';
import { ISubcategory, Subcategory } from '../models/SubCategory';

export interface CreateSubcategoryData {
  name: string;
  slug: string;
  category: string;
  description?: string;
  isPublished?: boolean;
}

export interface UpdateSubcategoryData {
  name?: string;
  slug?: string;
  category?: string;
  description?: string;
  isPublished?: boolean;
}

class SubcategoryService {
  async createSubcategory(data: CreateSubcategoryData): Promise<ISubcategory> {
    // Verify category exists
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }

    // Check if subcategory with same name and category already exists
    const existingSubcategory = await Subcategory.findOne({
      name: data.name,
      category: data.category,
    });

    if (existingSubcategory) {
      throw new Error(
        'Subcategory with this name already exists in this category'
      );
    }

    const subcategory = await Subcategory.create({
      name: data.name,
      slug: data.slug,
      category: data.category,
      description: data.description,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    });

    return subcategory;
  }

  async getSubcategories(filters?: {
    category?: string;
    isPublished?: boolean;
  }): Promise<ISubcategory[]> {
    const query: any = {};

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.isPublished !== undefined) {
      query.isPublished = filters.isPublished;
    }

    const subcategories = await Subcategory.find(query)
      .populate('category')
      .sort({ createdAt: -1 });

    return subcategories;
  }

  async getSubcategoryById(id: string): Promise<ISubcategory> {
    const subcategory = await Subcategory.findById(id).populate(
      'category',
      'name'
    );

    if (!subcategory) {
      throw new Error('Subcategory not found');
    }

    return subcategory;
  }

  async getSubcategoryBySlug(slug: string): Promise<ISubcategory> {
    const subcategory = await Subcategory.findOne({ slug }).populate(
      'category',
      'name'
    );

    if (!subcategory) {
      throw new Error('Subcategory not found');
    }

    return subcategory;
  }

  async updateSubcategory(
    id: string,
    data: UpdateSubcategoryData
  ): Promise<ISubcategory> {
    // Check if subcategory exists
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      throw new Error('Subcategory not found');
    }

    // If updating category, verify it exists
    if (data.category) {
      const categoryExists = await Category.findById(data.category);
      if (!categoryExists) {
        throw new Error('Category not found');
      }
    }

    // Check for duplicate name in same category
    if (data.name || data.category) {
      const categoryId = data.category || subcategory.category;
      const existingSubcategory = await Subcategory.findOne({
        name: data.name || subcategory.name,
        category: categoryId,
        _id: { $ne: id },
      });

      if (existingSubcategory) {
        throw new Error(
          'Subcategory with this name already exists in this category'
        );
      }
    }

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('category');

    if (!updatedSubcategory) {
      throw new Error('Failed to update subcategory');
    }

    return updatedSubcategory;
  }

  async deleteSubcategory(id: string): Promise<void> {
    const subcategory = await Subcategory.findByIdAndDelete(id);

    if (!subcategory) {
      throw new Error('Subcategory not found');
    }
  }
}

const subcategoryService = new SubcategoryService();
export default subcategoryService;
