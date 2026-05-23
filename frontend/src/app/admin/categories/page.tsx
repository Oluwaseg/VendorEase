'use client';

import { CategoriesHeader } from '@/components/admin/categories/categories-header';
import { CategoryGrid } from '@/components/admin/categories/category-grid';
import { CategoryModal } from '@/components/admin/categories/category-modal';
import { LoadingState } from '@/components/admin/categories/loading-state';
import { Category } from '@/types/category';
import { Suspense, useState } from 'react';

export default function AdminCategoriesPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  const openCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  return (
    <div className='min-h-screen bg-background'>
      <CategoriesHeader onCreateClick={openCreate} />

      <Suspense fallback={<LoadingState />}>
        <CategoryGrid
          onEditClick={(category) => {
            setSelected(category);
            setOpen(true);
          }}
        />
      </Suspense>

      <CategoryModal
        open={open}
        onClose={() => setOpen(false)}
        category={selected}
      />
    </div>
  );
}
