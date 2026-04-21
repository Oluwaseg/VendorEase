'use client';

import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-category';
import { useSubcategoriesWithCategory } from '@/hooks/use-subcategory';
import {
  CreateProduct,
  FlashSale,
  Product,
  ProductImage,
  UpdateProduct,
} from '@/types/product';
import { Image, Plus, Tag, X } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';

type CreateModeProps = {
  mode: 'create';
  isLoading?: boolean;
  onSubmit: (data: CreateProduct) => void;
};

type EditModeProps = {
  mode: 'edit';
  initialData: Product;
  isLoading?: boolean;
  onSubmit: (data: UpdateProduct) => void;
};

type ProductFormProps = CreateModeProps | EditModeProps;

type ProductFormState = Partial<CreateProduct & UpdateProduct>;

export function ProductForm(props: ProductFormProps) {
  const { mode, isLoading, onSubmit } = props;

  const [form, setForm] = useState<ProductFormState>(
    mode === 'create'
      ? {
          name: '',
          description: '',
          sku: '',
          basePrice: 0,
          stock: 0,
          category: '',
          subcategory: '',
          brand: '',
          tags: [],
          isPublished: false,
          visibility: 'private',
          images: [],
          isBestSeller: false,
        }
      : {}
  );
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: subcategories = [], isLoading: subcategoriesLoading } =
    useSubcategoriesWithCategory(form.category || '');

  const [newTag, setNewTag] = useState('');
  const [showFlashSale, setShowFlashSale] = useState(!!form.flashSale);

  useEffect(() => {
    if (mode === 'edit') {
      setForm({
        name: props.initialData.name,
        description: props.initialData.description,
        sku: props.initialData.sku,
        basePrice: props.initialData.basePrice,
        stock: props.initialData.stock,
        category: props.initialData.category._id,
        subcategory: props.initialData.subcategory?._id,
        brand: props.initialData.brand,
        tags: props.initialData.tags,
        isPublished: props.initialData.isPublished,
        visibility: props.initialData.visibility,
        images: props.initialData.images,
        flashSale: props.initialData.flashSale,
        isBestSeller: props.initialData.isBestSeller,
      });
    }
  }, [mode, props]); // Subcategories are already filtered by backend

  const filteredSubcategories = Array.isArray(subcategories)
    ? subcategories
    : [];

  const update = <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.tags?.includes(newTag)) {
      update('tags', [...(form.tags || []), newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    update('tags', form.tags?.filter((t) => t !== tag) || []);
  };

  const handleRemoveImage = (index: number) => {
    update('images', form.images?.filter((_, i) => i !== index) || []);
  };

  const handleUpdateFlashSale = (key: keyof FlashSale, value: any) => {
    const current = form.flashSale || {
      discountType: 'percentage',
      discountValue: 0,
      startsAt: '',
      endsAt: '',
      isActive: false,
    };
    update('flashSale', { ...current, [key]: value });
  };

  return (
    <form
      className='space-y-6'
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form as never);
      }}
    >
      {/* Basic Information */}
      <div className='space-y-4 pb-6 border-b border-border'>
        <h3 className='text-lg font-bold text-foreground'>Basic Information</h3>

        <div>
          <label className='block text-sm font-semibold text-foreground mb-2'>
            Product Name *
          </label>

          <input
            className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
            placeholder='e.g., Premium Wireless Headphones'
            value={form.name ?? ''}
            onChange={(e) => update('name', e.target.value)}
            required={mode === 'create'}
          />
        </div>

        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              SKU *
            </label>

            <input
              className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
              placeholder='e.g., SKU-001'
              value={form.sku ?? ''}
              onChange={(e) => update('sku', e.target.value)}
              required={mode === 'create'}
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Brand
            </label>

            <input
              className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
              placeholder='e.g., Sony'
              value={form.brand ?? ''}
              onChange={(e) => update('brand', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-semibold text-foreground mb-2'>
            Description
          </label>

          <textarea
            className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none'
            placeholder='Product description and details...'
            rows={4}
            value={form.description ?? ''}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>
      </div>
      {/* Pricing & Stock */}
      <div className='space-y-4 pb-6 border-b border-border'>
        <h3 className='text-lg font-bold text-foreground'>Pricing & Stock</h3>

        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Base Price (₦)
            </label>

            <input
              type='number'
              step='0.01'
              className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
              placeholder='0.00'
              value={form.basePrice ?? 0}
              onChange={(e) => update('basePrice', Number(e.target.value))}
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Stock Quantity
            </label>

            <input
              type='number'
              className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
              placeholder='0'
              value={form.stock ?? 0}
              onChange={(e) => update('stock', Number(e.target.value))}
            />
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className='space-y-4 pb-6 border-b border-border'>
        <h3 className='text-lg font-bold text-foreground'>Categories</h3>
        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Category *
            </label>

            <select
              className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
              value={form.category ?? ''}
              onChange={(e) => {
                update('category', e.target.value);
                update('subcategory', ''); // Reset subcategory when category changes
              }}
              required={mode === 'create'}
              disabled={categoriesLoading}
            >
              <option value=''>Select category</option>{' '}
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {categoriesLoading && (
              <div className='text-xs text-foreground/50 py-2'>
                Loading categories...
              </div>
            )}
          </div>

          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Subcategory
            </label>

            <select
              className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
              value={form.subcategory ?? ''}
              onChange={(e) => update('subcategory', e.target.value)}
              disabled={!form.category || subcategoriesLoading}
            >
              <option value=''>Select subcategory</option>

              {filteredSubcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>

            {subcategoriesLoading && (
              <div className='text-xs text-foreground/50 py-2'>
                Loading subcategories...
              </div>
            )}

            {!subcategoriesLoading &&
              form.category &&
              filteredSubcategories.length === 0 && (
                <div className='text-xs text-foreground/50 py-2'>
                  No subcategories for this category
                </div>
              )}
          </div>
        </div>
      </div>
      {/* Product Images */}
      <div className='space-y-4 pb-6 border-b border-border'>
        <div className='flex items-center gap-2'>
          <Image size={20} className='text-primary' />
          <h3 className='text-lg font-bold text-foreground'>Product Images</h3>
        </div>
        <CldUploadWidget
          signatureEndpoint='/api/cloudinary/signature'
          options={{ multiple: true }}
          onSuccess={(result: any) => {
            const newImage: ProductImage = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };
            setForm((prev) => ({
              ...prev,
              images: [...(prev.images || []), newImage],
            }));
          }}
        >
          {({ open }) => (
            <Button
              type='button'
              onClick={() => open()}
              className='w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 border-2 border-primary rounded-lg flex items-center justify-center gap-2'
            >
              <Plus size={20} />
              Upload Image
            </Button>
          )}
        </CldUploadWidget>

        {form.images && form.images.length > 0 && (
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
            {form.images.map((img, idx) => (
              <div
                key={idx}
                className='relative group border-2 border-border rounded-lg overflow-hidden bg-muted p-2'
              >
                <img
                  src={img.url}
                  alt={`Product ${idx + 1}`}
                  className='w-full h-24 object-cover rounded'
                />

                {/* Remove button */}
                <div className='absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(idx)}
                    className='text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600'
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Tags */}
      <div className='space-y-4 pb-6 border-b border-border'>
        <h3 className='text-lg font-bold text-foreground'>Tags</h3>{' '}
        <div className='flex gap-2'>
          <input
            type='text'
            className='flex-1 px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
            placeholder='Add a tag...'
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />

          <Button
            type='button'
            onClick={handleAddTag}
            className='bg-accent hover:bg-accent/90 text-accent-foreground px-4'
          >
            <Plus size={20} />
          </Button>
        </div>
        {form.tags && form.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {form.tags.map((tag) => (
              <div
                key={tag}
                className='bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium'
              >
                {tag}
                <button
                  type='button'
                  onClick={() => handleRemoveTag(tag)}
                  className='hover:text-primary/60 transition-colors'
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Flash Sale */}
      <div className='space-y-4 pb-6 border-b border-border'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Tag size={20} className='text-accent' />
            <h3 className='text-lg font-bold text-foreground'>Flash Sale</h3>
          </div>

          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='checkbox'
              className='w-5 h-5 accent-accent rounded cursor-pointer'
              checked={showFlashSale}
              onChange={(e) => {
                setShowFlashSale(e.target.checked);
                if (!e.target.checked) {
                  update('flashSale', undefined);
                } else {
                  update('flashSale', {
                    discountType: 'percentage',
                    discountValue: 0,
                    startsAt: new Date().toISOString(),
                    endsAt: new Date(
                      Date.now() + 7 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                    isActive: false,
                  });
                }
              }}
            />

            <span className='text-sm font-semibold text-foreground'>
              Enable Flash Sale
            </span>
          </label>
        </div>

        {showFlashSale && form.flashSale && (
          <div className='space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20'>
            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-foreground mb-2'>
                  Discount Type
                </label>

                <select
                  className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                  value={form.flashSale.discountType}
                  onChange={(e) =>
                    handleUpdateFlashSale('discountType', e.target.value)
                  }
                >
                  <option value='percentage'>Percentage (%)</option>
                  <option value='fixed'>Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-semibold text-foreground mb-2'>
                  Discount Value
                </label>

                <input
                  type='number'
                  step={
                    form.flashSale.discountType === 'percentage' ? '1' : '0.01'
                  }
                  min='0'
                  className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                  placeholder='0'
                  value={form.flashSale.discountValue}
                  onChange={(e) =>
                    handleUpdateFlashSale(
                      'discountValue',
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-foreground mb-2'>
                  Start Date & Time
                </label>

                <input
                  type='datetime-local'
                  className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                  value={new Date(form.flashSale.startsAt)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    handleUpdateFlashSale(
                      'startsAt',
                      new Date(e.target.value).toISOString()
                    )
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-foreground mb-2'>
                  End Date & Time
                </label>

                <input
                  type='datetime-local'
                  className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                  value={new Date(form.flashSale.endsAt)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    handleUpdateFlashSale(
                      'endsAt',
                      new Date(e.target.value).toISOString()
                    )
                  }
                />
              </div>
            </div>

            <label className='flex items-center gap-3 cursor-pointer p-3 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors'>
              <input
                type='checkbox'
                className='w-5 h-5 accent-accent rounded cursor-pointer'
                checked={form.flashSale.isActive}
                onChange={(e) =>
                  handleUpdateFlashSale('isActive', e.target.checked)
                }
              />

              <span className='text-sm font-semibold text-foreground'>
                Activate Flash Sale Now
              </span>
            </label>
          </div>
        )}
      </div>
      {/* Visibility & Status */}
      <div className='space-y-4 pb-6 border-b border-border'>
        <h3 className='text-lg font-bold text-foreground'>
          Visibility & Status
        </h3>

        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Visibility
            </label>

            <select
              className='w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
              value={form.visibility ?? 'private'}
              onChange={(e) => update('visibility', e.target.value as any)}
            >
              <option value='public'>Public</option>
              <option value='private'>Private</option>
              <option value='archived'>Archived</option>
            </select>
          </div>

          <div className='flex items-end'>
            <label className='flex items-center gap-3 cursor-pointer w-full px-4 py-2.5 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors'>
              <input
                type='checkbox'
                className='w-5 h-5 accent-primary rounded cursor-pointer'
                checked={form.isPublished ?? false}
                onChange={(e) => update('isPublished', e.target.checked)}
              />

              <span className='text-sm font-semibold text-foreground'>
                Published
              </span>
            </label>
          </div>
        </div>

        <label className='flex items-center gap-3 cursor-pointer p-4 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors'>
          <input
            type='checkbox'
            className='w-5 h-5 accent-accent rounded cursor-pointer'
            checked={form.isBestSeller ?? false}
            onChange={(e) => update('isBestSeller', e.target.checked)}
          />

          <span className='text-sm font-semibold text-foreground'>
            Mark as Best Seller
          </span>
        </label>
      </div>
      {/* Submit Button */}
      <div className='flex gap-3 pt-4'>
        <Button
          type='submit'
          disabled={isLoading}
          className='flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-all'
        >
          {isLoading
            ? 'Saving...'
            : mode === 'create'
              ? 'Create Product'
              : 'Update Product'}
        </Button>
      </div>
    </form>
  );
}
