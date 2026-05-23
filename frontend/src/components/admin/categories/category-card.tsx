'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Category } from '@/types/category';
import { format } from 'date-fns';
import { Edit2, Eye, EyeOff, Image as ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';

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
    <div className='group relative overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-md'>
      {/* Grid Layout: Image on left, details on right */}
      <div className='flex flex-col md:flex-row md:items-stretch'>
        {/* Image Section */}
        <div className='relative h-64 w-full overflow-hidden bg-surface-2 md:h-auto md:w-1/3 flex items-center justify-center'>
          {category.image ? (
            <>
              <Image
                src={category.image.url}
                alt={category.name}
                fill
                className='object-cover transition-transform duration-300 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
            </>
          ) : (
            <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground/40'>
              <ImageIcon className='w-10 h-10' />
              <span className='text-xs font-medium'>No image</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className='flex flex-1 flex-col gap-4 p-5 md:p-6'>
          {/* Header with Title and Status */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex-1 min-w-0'>
                <h3 className='text-xl font-semibold text-foreground truncate transition-colors duration-300 group-hover:text-brand'>
                  {category.name}
                </h3>
                <p className='text-xs text-muted-foreground/60 mt-1 font-mono truncate'>
                  /{category.slug}
                </p>
              </div>

              <Badge
                variant={category.isPublished ? 'default' : 'secondary'}
                className={`flex-shrink-0 whitespace-nowrap gap-1.5 px-3 py-1 text-xs font-medium transition-all duration-300 ${
                  category.isPublished
                    ? 'bg-brand/10 text-brand border border-brand/30 hover:bg-brand/15'
                    : 'bg-muted text-muted-foreground border border-border/50'
                }`}
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
          </div>

          {/* Description */}
          {category.description ? (
            <p className='text-sm text-muted-foreground leading-relaxed line-clamp-3'>
              {category.description}
            </p>
          ) : (
            <p className='text-sm text-muted-foreground/40 italic'>
              No description
            </p>
          )}

          {/* Divider */}
          <div className='border-t border-border/20' />

          {/* Metadata */}
          <div className='text-xs text-muted-foreground/70 space-y-1'>
            <p className='flex justify-between'>
              <span>Created:</span>
              <span className='font-medium'>
                {format(new Date(category.createdAt), 'MMM dd, yyyy')}
              </span>
            </p>
            {category.updatedAt !== category.createdAt && (
              <p className='flex justify-between'>
                <span>Updated:</span>
                <span className='font-medium'>
                  {format(new Date(category.updatedAt), 'MMM dd, yyyy')}
                </span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className='flex gap-2 pt-2'>
            <Button
              onClick={onEdit}
              variant='outline'
              size='sm'
              className='flex-1 gap-2 border-brand/20 text-foreground hover:bg-brand/8 hover:border-brand/40 hover:text-brand transition-all duration-300 h-9 text-xs font-medium'
            >
              <Edit2 className='w-4 h-4' />
              Edit
            </Button>

            <Button
              onClick={onDelete}
              disabled={isDeleting}
              variant='ghost'
              size='sm'
              className='flex-1 gap-2 text-destructive/70 hover:bg-destructive/8 hover:text-destructive transition-all duration-300 h-9 text-xs font-medium'
            >
              {isDeleting ? (
                <Spinner className='w-4 h-4' />
              ) : (
                <Trash2 className='w-4 h-4' />
              )}
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
