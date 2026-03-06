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
      <div className='px-6 md:px-12 lg:px-16 pb-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='h-48 bg-gradient-to-br from-card/50 to-card/30 rounded-xl animate-pulse'
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
    <div className='px-6 md:px-12 lg:px-16 pb-16'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
