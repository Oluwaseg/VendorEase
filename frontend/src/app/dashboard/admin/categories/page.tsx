'use client';

import { CategoriesHeader } from '@/components/categories/categories-header';
import { CategoryGrid } from '@/components/categories/category-grid';
import { CategoryModal } from '@/components/categories/category-modal';
import { LoadingState } from '@/components/categories/loading-state';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
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
    <main className='min-h-screen bg-gradient-to-br from-background via-background to-background/50'>
      <Navbar />
      {/* Background gradient accent */}
      <div className='fixed inset-0 -z-10 opacity-30'>
        <div className='absolute top-0 -right-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply blur-3xl' />
        <div className='absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply blur-3xl' />
      </div>

      <div className='relative z-10'>
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
      <Footer />
    </main>
  );
}
