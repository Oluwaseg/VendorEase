'use client';

import { useCategories, useDeleteCategory } from '@/hooks/use-category';
import { Category } from '@/types/category';
import { CategoryCard } from './category-card';
import { EmptyState } from './empty-state';

interface CategoryGridProps {
  onEditClick: (category: Category) => void;
}

export function CategoryGrid({ onEditClick }: CategoryGridProps) {
  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
        <div className='space-y-4'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='h-56 md:h-48 bg-muted rounded-xl animate-pulse'
            />
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
      <div className='space-y-3'>
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            onEdit={() => onEditClick(category)}
            onDelete={() => deleteCategory.mutate(category._id)}
            isDeleting={deleteCategory.isPending}
          />
        ))}
      </div>
    </div>
  );
}
