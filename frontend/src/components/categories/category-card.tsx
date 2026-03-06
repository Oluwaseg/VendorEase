'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Category } from '@/types/category';
import { format } from 'date-fns';
import { Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  isDeleting,
}: CategoryCardProps) {
  return (
    <Card className='group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 backdrop-blur-sm'>
      {/* Gradient overlay on hover */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-colors duration-300 pointer-events-none' />

      <div className='relative p-6 flex flex-col h-full'>
        {/* Header */}
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div className='flex-1 min-w-0'>
            <h3 className='text-xl font-semibold text-foreground truncate group-hover:text-primary transition-colors'>
              {category.name}
            </h3>
            <p className='text-sm text-muted-foreground mt-1 truncate'>
              {category.slug}
            </p>
          </div>

          <Badge
            variant={category.isPublished ? 'default' : 'secondary'}
            className='flex-shrink-0 whitespace-nowrap gap-1'
          >
            {category.isPublished ? (
              <>
                <Eye className='w-3 h-3' />
                Published
              </>
            ) : (
              <>
                <EyeOff className='w-3 h-3' />
                Draft
              </>
            )}
          </Badge>
        </div>

        {/* Description */}
        {category.description && (
          <p className='text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow'>
            {category.description}
          </p>
        )}

        {/* Metadata */}
        <div className='text-xs text-muted-foreground/60 space-y-1 mb-6'>
          <p>Created {format(new Date(category.createdAt), 'MMM dd, yyyy')}</p>
          {category.updatedAt && (
            <p>
              Updated {format(new Date(category.updatedAt), 'MMM dd, yyyy')}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className='flex gap-2 pt-4 border-t border-border/40'>
          <Button
            onClick={onEdit}
            variant='outline'
            size='sm'
            className='flex-1 gap-2 border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-colors'
          >
            <Edit2 className='w-4 h-4' />
            <span className='hidden sm:inline'>Edit</span>
          </Button>

          <Button
            onClick={onDelete}
            disabled={isDeleting}
            variant='ghost'
            size='sm'
            className='flex-1 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors'
          >
            {isDeleting ? (
              <Spinner className='w-4 h-4' />
            ) : (
              <Trash2 className='w-4 h-4' />
            )}
            <span className='hidden sm:inline'>Delete</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
