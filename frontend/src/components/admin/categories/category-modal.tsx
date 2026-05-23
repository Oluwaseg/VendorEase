'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCategory, useUpdateCategory } from '@/hooks/use-category';
import { CLOUDINARY_FOLDER_CATEGORIES } from '@/lib/cloudinary-folders';
import { Category } from '@/types/category';
import { Plus } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

import type { CategoryImage } from '@/types/category';

function isCloudinaryTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest('[class*="cloudinary"]') ||
    target.closest('iframe[src*="cloudinary"]')
  );
}

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  image?: CategoryImage;
  isPublished: boolean;
};

export function CategoryModal({ open, onClose, category }: CategoryModalProps) {
  const isEdit = !!category;

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isLoading = createCategory.isPending || updateCategory.isPending;

  const [form, setForm] = useState<CategoryForm>({
    name: '',
    slug: '',
    description: '',
    image: undefined,
    isPublished: true,
  });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        image: category.image,
        isPublished: category.isPublished,
      });
    } else {
      setForm({
        name: '',
        slug: '',
        description: '',
        image: undefined,
        isPublished: true,
      });
    }
  }, [category, open]);

  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSwitch = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      isPublished: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && category) {
      updateCategory.mutate(
        { id: category._id, data: form },
        { onSuccess: onClose }
      );
    } else {
      createCategory.mutate(form, { onSuccess: onClose });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      modal={false}
    >
      <DialogContent
        className='w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border/50 rounded-2xl shadow-lg'
        onPointerDownOutside={(e) => {
          if (isCloudinaryTarget(e.target)) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isCloudinaryTarget(e.target)) e.preventDefault();
        }}
      >
        <DialogHeader className='sticky top-0 bg-background z-10 pb-4 border-b border-brand/20'>
          <DialogTitle className='text-2xl font-bold text-brand'>
            {isEdit ? 'Edit Category' : 'Create New Category'}
          </DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground mt-2'>
            {isEdit
              ? 'Update the category details and customize its appearance'
              : 'Set up a new category with all the details customers need to know'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6 py-6 px-0'>
          {/* Image Upload Section */}
          <div className='space-y-4 px-6'>
            <div>
              <Label className='text-base font-semibold text-foreground'>
                Category image
              </Label>
              <p className='text-sm text-muted-foreground mt-1'>
                Uploaded to Cloudinary folder:{' '}
                <code className='text-xs'>{CLOUDINARY_FOLDER_CATEGORIES}</code>
              </p>
            </div>
            <CldUploadWidget
              signatureEndpoint='/api/cloudinary/signature'
              options={{
                folder: CLOUDINARY_FOLDER_CATEGORIES,
                multiple: false,
              }}
              onSuccess={(result) => {
                const info = result.info;
                if (
                  typeof info === 'string' ||
                  !info?.secure_url ||
                  !info?.public_id
                )
                  return;
                const newImage: CategoryImage = {
                  url: info.secure_url,
                  publicId: info.public_id,
                };
                setForm((prev) => ({ ...prev, image: newImage }));
              }}
            >
              {({ open }) => (
                <Button
                  type='button'
                  onClick={() => open()}
                  className='w-full bg-brand hover:bg-brand/90 text-brand-foreground'
                >
                  <Plus size={20} />
                  {form.image ? 'Change image' : 'Upload image'}
                </Button>
              )}
            </CldUploadWidget>
            {form.image?.url ? (
              <div className='relative rounded-lg overflow-hidden border border-border'>
                <img
                  src={form.image.url}
                  alt='Category preview'
                  className='w-full h-40 object-cover'
                />
                <Button
                  type='button'
                  size='sm'
                  variant='destructive'
                  className='absolute top-2 right-2'
                  onClick={() =>
                    setForm((prev) => ({ ...prev, image: undefined }))
                  }
                >
                  Remove
                </Button>
              </div>
            ) : null}
          </div>

          {/* Divider */}
          <div className='border-t border-border/30' />

          {/* Form Fields Section */}
          <div className='space-y-4 px-6'>
            {/* Category Name */}
            <div className='space-y-2'>
              <Label
                htmlFor='name'
                className='text-sm font-semibold text-foreground'
              >
                Category Name <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='name'
                name='name'
                placeholder='e.g., Electronics, Fashion, Home & Garden'
                value={form.name}
                onChange={handleChange}
                required
                className='border-brand/30 bg-card/40 focus:border-brand focus:bg-card transition-colors h-10 text-sm'
              />
            </div>

            {/* Slug */}
            <div className='space-y-2'>
              <Label
                htmlFor='slug'
                className='text-sm font-semibold text-foreground'
              >
                URL Slug <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='slug'
                name='slug'
                placeholder='auto-generated from name'
                value={form.slug}
                onChange={handleChange}
                required
                className='border-brand/30 bg-surface/50 focus:border-brand focus:bg-surface transition-colors h-10 text-sm text-muted-foreground'
              />
              <p className='text-xs text-muted-foreground'>
                Automatically generated from the category name
              </p>
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label
                htmlFor='description'
                className='text-sm font-semibold text-foreground'
              >
                Description
              </Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Add a compelling description to help customers understand this category...'
                value={form.description}
                onChange={handleChange}
                rows={3}
                className='border-brand/30 bg-card/40 focus:border-brand focus:bg-card transition-colors resize-none text-sm'
              />
            </div>

            {/* Publish Status */}
            <div className='flex items-center justify-between p-4 bg-brand/5 border border-brand/20 rounded-xl'>
              <div>
                <p className='font-semibold text-sm text-foreground'>
                  Publish Category
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Make this category visible to customers
                </p>
              </div>
              <Switch
                checked={form.isPublished}
                className='data-[state=checked]:bg-brand'
                onCheckedChange={handleSwitch}
              />
            </div>
          </div>
        </form>

        <DialogFooter className='flex gap-2 pt-4 px-6 border-t border-brand/20 sticky bottom-0 bg-background'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='border-brand/30 h-10'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className='gap-2 bg-brand hover:bg-brand/90 text-brand-foreground h-10 px-6'
          >
            {isLoading && <Spinner className='w-4 h-4' />}
            {isEdit ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
