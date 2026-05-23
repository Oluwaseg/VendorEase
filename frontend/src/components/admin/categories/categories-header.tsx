import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CategoriesHeaderProps {
  onCreateClick: () => void;
}

export function CategoriesHeader({ onCreateClick }: CategoriesHeaderProps) {
  return (
    <div className='border-b border-border/40 bg-background sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8 lg:py-10'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 md:gap-6'>
          <div className='flex-1'>
            <h1 className='text-3xl md:text-4xl font-bold text-foreground tracking-tight'>
              Categories
            </h1>
            <p className='text-muted-foreground text-sm md:text-base mt-2 leading-relaxed max-w-2xl'>
              Manage and organize your product categories
            </p>
          </div>

          <Button
            onClick={onCreateClick}
            className='group bg-brand hover:bg-brand/90 text-brand-foreground shadow-md hover:shadow-lg transition-all duration-300 font-semibold h-10 px-6 flex-shrink-0'
          >
            <Plus className='w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300' />
            Add Category
          </Button>
        </div>
      </div>
    </div>
  );
}
