'use client';

import { Button } from '@/components/ui/button';
import { HelpTooltip } from '@/components/ui/help-tooltip';
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

  const formatDateTimeLocal = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isFinite(date.getTime())
      ? date.toISOString().slice(0, 16)
      : '';
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
        <div className='flex items-center gap-1'>
          <h3 className='text-lg font-bold text-foreground'>
            Basic Information
          </h3>
          <HelpTooltip content='Set the product identity details customers use to recognize and search this item.' />
        </div>

        <div>
          <label className='block text-sm font-semibold text-foreground mb-2'>
            Product Name *
          </label>

          <input
            className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
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
              className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
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
              className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
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
            className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-none'
            placeholder='Product description and details...'
            rows={4}
            value={form.description ?? ''}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className='space-y-4 pb-6 border-b border-border'>
        <div className='flex items-center gap-1'>
          <h3 className='text-lg font-bold text-foreground'>Pricing & Stock</h3>
          <HelpTooltip content='Use base price and stock to control availability and buying experience in the store.' />
        </div>

        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Base Price (₦)
            </label>

            <input
              type='number'
              step='0.01'
              className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
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
              className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
              placeholder='0'
              value={form.stock ?? 0}
              onChange={(e) => update('stock', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className='space-y-4 pb-6 border-b border-border'>
        <div className='flex items-center gap-1'>
          <h3 className='text-lg font-bold text-foreground'>Categories</h3>
          <HelpTooltip content='Pick category first, then subcategory. Subcategory choices are filtered by your category selection.' />
        </div>
        <div className='grid sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Category *
            </label>

            <select
              className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
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
              className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
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
          <Image size={20} className='text-brand' />
          <h3 className='text-lg font-bold text-foreground'>Product Images</h3>
          <HelpTooltip content='Add clear images for product cards and details. The first image is usually the primary display image.' />
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
              className='w-full bg-brand hover:bg-brand/90 text-brand-foreground px-4 py-2.5 border border-brand rounded-[0.5rem] flex items-center justify-center gap-2'
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
                className='relative group border border-border rounded-[0.5rem] overflow-hidden bg-surface-2 p-2'
              >
                <img
                  src={img.url}
                  alt={`Product ${idx + 1}`}
                  className='w-full h-24 object-cover rounded-[0.375rem]'
                />

                {/* Remove button */}
                <div className='absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(idx)}
                    className='text-xs px-2 py-1 rounded-[0.375rem] bg-danger text-white hover:bg-danger/90'
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
            className='flex-1 px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
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
                className='bg-brand/10 text-brand px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium'
              >
                {tag}
                <button
                  type='button'
                  onClick={() => handleRemoveTag(tag)}
                  className='hover:text-brand/60 transition-colors'
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
            <HelpTooltip content='Run a temporary discount by setting dates, discount type, and activating when ready.' />
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
          <div className='space-y-4 p-4 bg-accent/5 rounded-[0.5rem] border border-accent/20'>
            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-foreground mb-2'>
                  Discount Type
                </label>

                <select
                  className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
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
                  className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
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
                  className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
                  value={formatDateTimeLocal(form.flashSale.startsAt)}
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
                  className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
                  value={formatDateTimeLocal(form.flashSale.endsAt)}
                  onChange={(e) =>
                    handleUpdateFlashSale(
                      'endsAt',
                      new Date(e.target.value).toISOString()
                    )
                  }
                />
              </div>
            </div>

            <label className='flex items-center gap-3 cursor-pointer p-3 border border-border rounded-[0.5rem] hover:bg-surface/50 transition-colors'>
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
        <div className='flex items-center gap-1'>
          <h3 className='text-lg font-bold text-foreground'>
            Visibility & Status
          </h3>
          <HelpTooltip content='Publish controls storefront visibility. Best Seller adds merchandising emphasis.' />
        </div>

        <div className='space-y-3'>
          <label className='flex items-center gap-3 cursor-pointer p-3 border border-border rounded-[0.5rem] hover:bg-surface/50 transition-colors'>
            <input
              type='checkbox'
              className='w-5 h-5 accent-brand rounded cursor-pointer'
              checked={form.isPublished ?? false}
              onChange={(e) => update('isPublished', e.target.checked)}
            />
            <div>
              <span className='text-sm font-semibold text-foreground'>
                Publish Product
              </span>
              <p className='text-xs text-foreground/50'>
                Make this product visible to customers
              </p>
            </div>
          </label>

          <label className='flex items-center gap-3 cursor-pointer p-3 border border-border rounded-[0.5rem] hover:bg-surface/50 transition-colors'>
            <input
              type='checkbox'
              className='w-5 h-5 accent-brand rounded cursor-pointer'
              checked={form.isBestSeller ?? false}
              onChange={(e) => update('isBestSeller', e.target.checked)}
            />
            <div>
              <span className='text-sm font-semibold text-foreground'>
                Best Seller
              </span>
              <p className='text-xs text-foreground/50'>
                Mark this as a best-selling product
              </p>
            </div>
          </label>
        </div>

        <div>
          <label className='block text-sm font-semibold text-foreground mb-2'>
            Visibility
          </label>

          <select
            className='w-full px-4 py-2.5 border border-border rounded-[0.5rem] bg-card text-foreground focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
            value={form.visibility ?? 'private'}
            onChange={(e) => update('visibility', e.target.value as any)}
          >
            <option value='private'>Private (visible to admins only)</option>
            <option value='public'>Public (visible to all)</option>
          </select>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className='flex gap-3 pt-4'>
        <Button
          type='submit'
          disabled={isLoading}
          className='flex-1 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold py-2.5 rounded-[0.5rem]'
        >
          {isLoading ? (
            <div className='w-5 h-5 border-2 border-brand-foreground/30 border-t-brand-foreground rounded-full animate-spin' />
          ) : mode === 'create' ? (
            'Create Product'
          ) : (
            'Update Product'
          )}
        </Button>
      </div>
    </form>
  );
}
