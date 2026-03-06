import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CategoriesHeaderProps {
  onCreateClick: () => void;
}

export function CategoriesHeader({ onCreateClick }: CategoriesHeaderProps) {
  return (
    <div className='px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-8'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
        <div className='flex-1'>
          <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-2'>
            Categories
          </h1>
          <p className='text-muted-foreground text-lg'>
            Manage your product categories and organization
          </p>
        </div>

        <Button
          onClick={onCreateClick}
          size='lg'
          className='group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto'
        >
          <Plus className='w-5 h-5 mr-2 group-hover:rotate-90 transition-transform' />
          Create Category
        </Button>
      </div>
    </div>
  );
}
