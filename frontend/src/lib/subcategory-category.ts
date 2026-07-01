import type { Category } from '@/types/category';
import type { Subcategory } from '@/types/subcategory';

export function getSubcategoryCategoryId(
  subcategory: Subcategory | undefined
): string | undefined {
  if (!subcategory?.category) return undefined;

  if (typeof subcategory.category === 'string') {
    return subcategory.category;
  }

  return subcategory.category._id;
}

export function getSubcategoryCategoryRef(
  subcategory: Subcategory | undefined,
  fetchedCategory?: Category
): Category | null {
  const resolved =
    fetchedCategory ??
    (typeof subcategory?.category === 'object' ? subcategory.category : null);

  if (!resolved?.slug) return null;

  return resolved;
}

export function getSubcategoryCategoryName(
  subcategory: Subcategory | undefined,
  fetchedCategory?: Category
): string | null {
  if (fetchedCategory?.name) return fetchedCategory.name;

  if (typeof subcategory?.category === 'object') {
    return subcategory.category.name ?? null;
  }

  return null;
}
