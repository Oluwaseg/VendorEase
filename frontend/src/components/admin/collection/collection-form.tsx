'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/hooks/use-product';
import { CLOUDINARY_FOLDER_COLLECTIONS } from '@/lib/cloudinary-folders';
import {
  Collection,
  CollectionImage,
  CreateCollectionData,
} from '@/types/collection';
import {
  DEFAULT_HERO_TEXT_POSITION,
  HERO_TEXT_POSITION_LABELS,
  HERO_TEXT_POSITIONS,
  type HeroTextPosition,
} from '@/types/hero-position';
import { Product } from '@/types/product';
import { Image, X } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useMemo, useState } from 'react';

type CollectionFormData = CreateCollectionData;

interface CollectionFormProps {
  mode: 'create' | 'edit';
  initialData?: Collection;
  isLoading?: boolean;
  onSubmit: (data: CollectionFormData) => void;
}

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeProductIds(
  productIds: Collection['productIds'] | undefined
): string[] {
  if (!productIds?.length) {
    return [];
  }
  return productIds.map((item) => (typeof item === 'string' ? item : item._id));
}

export function CollectionForm({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
}: CollectionFormProps) {
  const { data: productsData } = useProducts({ page: 1, limit: 100 });
  const products = productsData?.products ?? [];

  const [form, setForm] = useState<CollectionFormData>({
    name: '',
    slug: '',
    description: '',
    ctaText: '',
    position: DEFAULT_HERO_TEXT_POSITION,
    image: undefined,
    productIds: [],
    isActive: true,
    featuredOnHomepage: false,
    heroOrder: 0,
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description ?? '',
        ctaText: initialData.ctaText ?? '',
        position: initialData.position ?? DEFAULT_HERO_TEXT_POSITION,
        image: initialData.image,
        productIds: normalizeProductIds(initialData.productIds),
        isActive: initialData.isActive,
        featuredOnHomepage: initialData.featuredOnHomepage ?? false,
        heroOrder: initialData.heroOrder ?? 0,
      });
    }
  }, [mode, initialData]);

  const selectedProducts = useMemo(
    () => products.filter((p) => form.productIds.includes(p._id)),
    [products, form.productIds]
  );

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: mode === 'create' ? generateSlug(value) : prev.slug,
    }));
  };

  const toggleProduct = (productId: string) => {
    setForm((prev) => {
      const exists = prev.productIds.includes(productId);
      return {
        ...prev,
        productIds: exists
          ? prev.productIds.filter((id) => id !== productId)
          : [...prev.productIds, productId],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      description: form.description?.trim() || undefined,
      ctaText: form.ctaText?.trim() || undefined,
      image: form.image,
      heroOrder: form.featuredOnHomepage ? (form.heroOrder ?? 0) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      <div className='space-y-5 pb-8 border-b border-border'>
        <div className='flex items-center gap-2 mb-2'>
          <div
            className='w-1 h-6 rounded-full'
            style={{ backgroundColor: 'var(--brand)' }}
          ></div>
          <h3 className='text-lg font-bold text-foreground'>Basic Details</h3>
        </div>
        <div className='space-y-3'>
          <Label
            htmlFor='collection-name'
            className='font-semibold text-foreground'
          >
            Collection name *
          </Label>
          <Input
            id='collection-name'
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder='e.g., Summer Essentials, New Arrivals'
            className='border-border focus:border-border'
            style={{ '--tw-ring-color': 'var(--ring)' } as React.CSSProperties}
          />
        </div>
        <div className='space-y-3'>
          <Label
            htmlFor='collection-slug'
            className='font-semibold text-foreground'
          >
            URL slug *
          </Label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
              /
            </span>
            <Input
              id='collection-slug'
              value={form.slug}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
              placeholder='summer-essentials'
              className='border-border focus:border-border pl-8'
              style={
                { '--tw-ring-color': 'var(--ring)' } as React.CSSProperties
              }
            />
          </div>
        </div>
        <div className='space-y-3'>
          <Label
            htmlFor='collection-description'
            className='font-semibold text-foreground'
          >
            Description
          </Label>
          <Textarea
            id='collection-description'
            value={form.description ?? ''}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            placeholder='Write a short, compelling description that will appear on the homepage hero and collection page'
            className='border-border focus:border-border resize-none'
            style={{ '--tw-ring-color': 'var(--ring)' } as React.CSSProperties}
          />
        </div>
        <div className='space-y-3'>
          <Label
            htmlFor='collection-cta'
            className='font-semibold text-foreground'
          >
            Call-to-action text
          </Label>
          <Input
            id='collection-cta'
            value={form.ctaText ?? ''}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, ctaText: e.target.value }))
            }
            maxLength={60}
            placeholder='e.g., Shop now, Explore collection'
            className='border-border focus:border-border'
            style={{ '--tw-ring-color': 'var(--ring)' } as React.CSSProperties}
          />
          <p className='text-xs text-muted-foreground'>
            Leave blank to use the default "Shop now" button text
          </p>
        </div>
      </div>

      <div className='space-y-5 pb-8 border-b border-border'>
        <div className='flex items-center gap-2 mb-2'>
          <div
            className='w-1 h-6 rounded-full'
            style={{ backgroundColor: 'var(--accent)' }}
          ></div>
          <h3 className='text-lg font-bold text-foreground'>Cover Image</h3>
        </div>
        <p className='text-sm text-muted-foreground'>
          Upload a high-quality image (recommended 1920×1080px) to be featured
          in the hero carousel
        </p>
        <CldUploadWidget
          signatureEndpoint='/api/cloudinary/signature'
          options={{
            folder: CLOUDINARY_FOLDER_COLLECTIONS,
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
            const newImage: CollectionImage = {
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
              className='w-full font-semibold py-2.5 hover:opacity-90'
              style={{
                backgroundColor: 'var(--brand)',
                color: 'var(--brand-foreground)',
              }}
            >
              <Image size={18} />
              <span>Upload or change cover image</span>
            </Button>
          )}
        </CldUploadWidget>
        {form.image?.url ? (
          <div
            className='relative rounded-lg overflow-hidden border border-border'
            style={{ backgroundColor: 'var(--surface-2)' }}
          >
            <img
              src={form.image.url}
              alt='Collection cover'
              className='w-full h-48 object-cover'
            />
            <Button
              type='button'
              size='sm'
              variant='destructive'
              className='absolute top-3 right-3 shadow-md'
              onClick={() => setForm((prev) => ({ ...prev, image: undefined }))}
            >
              <X size={14} />
              Remove
            </Button>
          </div>
        ) : null}
      </div>

      <div className='space-y-5 pb-8 border-b border-border'>
        <div className='flex items-center gap-2 mb-4'>
          <div
            className='w-1 h-6 rounded-full'
            style={{ backgroundColor: 'var(--brand)' }}
          ></div>
          <h3 className='text-lg font-bold text-foreground'>
            Homepage Settings
          </h3>
        </div>
        <div
          className='flex items-center justify-between rounded-lg border border-border p-4'
          style={{ backgroundColor: 'var(--surface)' }}
        >
          <div>
            <p className='font-semibold text-sm text-foreground'>
              Feature on homepage carousel
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              When enabled, this collection will appear in the rotating hero
              carousel
            </p>
          </div>
          <Switch
            checked={form.featuredOnHomepage}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, featuredOnHomepage: checked }))
            }
          />
        </div>
        {form.featuredOnHomepage ? (
          <>
            <div
              className='space-y-3 rounded-lg p-4 border'
              style={{
                backgroundColor:
                  'color-mix(in oklch, var(--accent) 8%, transparent)',
                borderColor:
                  'color-mix(in oklch, var(--accent) 30%, transparent)',
              }}
            >
              <div>
                <Label
                  htmlFor='hero-order'
                  className='font-semibold text-foreground'
                >
                  Carousel order
                </Label>
                <Input
                  id='hero-order'
                  type='number'
                  min={0}
                  value={form.heroOrder ?? 0}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      heroOrder: Number(e.target.value) || 0,
                    }))
                  }
                  className='mt-2 border-border focus:border-border'
                  style={
                    { '--tw-ring-color': 'var(--ring)' } as React.CSSProperties
                  }
                />
                <p className='text-xs text-muted-foreground mt-2'>
                  Lower numbers appear first. (0 = first position, 1 = second,
                  etc.)
                </p>
              </div>
              <div>
                <Label
                  htmlFor='hero-position'
                  className='font-semibold text-foreground'
                >
                  Text position on image
                </Label>
                <select
                  id='hero-position'
                  value={form.position ?? DEFAULT_HERO_TEXT_POSITION}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      position: e.target.value as HeroTextPosition,
                    }))
                  }
                  className='w-full mt-2 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-border'
                  style={
                    { '--tw-ring-color': 'var(--ring)' } as React.CSSProperties
                  }
                >
                  {HERO_TEXT_POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {HERO_TEXT_POSITION_LABELS[pos]}
                    </option>
                  ))}
                </select>
                <p className='text-xs text-muted-foreground mt-2'>
                  Choose where the title, description, and CTA button will
                  appear
                </p>
              </div>
            </div>
          </>
        ) : null}
        <div
          className='flex items-center justify-between rounded-lg border border-border p-4'
          style={{ backgroundColor: 'var(--surface)' }}
        >
          <div>
            <p className='font-semibold text-sm text-foreground'>Visibility</p>
            <p className='text-xs text-muted-foreground mt-1'>
              Inactive collections are hidden from the storefront
            </p>
          </div>
          <Switch
            checked={form.isActive ?? true}
            className='data-[state=checked]:bg-brand'
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, isActive: checked }))
            }
          />
        </div>
      </div>

      <div className='space-y-5'>
        <div className='flex items-center gap-2 mb-4'>
          <div
            className='w-1 h-6 rounded-full'
            style={{ backgroundColor: 'var(--accent)' }}
          ></div>
          <h3 className='text-lg font-bold text-foreground'>Products</h3>
        </div>
        <p className='text-sm text-muted-foreground'>
          Add up to 12 products to showcase in this collection (
          {form.productIds.length} selected).
        </p>
        {selectedProducts.length > 0 ? (
          <div
            className='flex flex-wrap gap-2 p-3 rounded-lg border border-border'
            style={{ backgroundColor: 'var(--surface)' }}
          >
            {selectedProducts.map((product: Product) => (
              <span
                key={product._id}
                className='inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium'
                style={{
                  backgroundColor:
                    'color-mix(in oklch, var(--brand) 15%, transparent)',
                  borderColor:
                    'color-mix(in oklch, var(--brand) 30%, transparent)',
                  color: 'var(--brand)',
                }}
              >
                {product.name}
                <button
                  type='button'
                  onClick={() => toggleProduct(product._id)}
                  className='transition-opacity hover:opacity-70'
                  style={{ color: 'var(--brand)', opacity: 0.7 }}
                  aria-label={`Remove ${product.name}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <div
          className='max-h-64 overflow-y-auto rounded-lg border border-border divide-y divide-border'
          style={{ backgroundColor: 'var(--surface)' }}
        >
          {products.length === 0 ? (
            <div className='p-8 text-center'>
              <p className='text-sm text-muted-foreground'>
                No products available yet.
              </p>
            </div>
          ) : (
            products.map((product) => {
              const checked = form.productIds.includes(product._id);
              return (
                <label
                  key={product._id}
                  className='flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors'
                  style={
                    {
                      '--hover-bg':
                        'color-mix(in oklch, var(--brand) 5%, transparent)',
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      'color-mix(in oklch, var(--brand) 5%, transparent)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <input
                    type='checkbox'
                    checked={checked}
                    onChange={() => toggleProduct(product._id)}
                    className='rounded border-border cursor-pointer'
                    style={{ accentColor: 'var(--brand)' }}
                  />
                  <div className='flex-1 min-w-0'>
                    <span className='text-sm font-medium text-foreground truncate block'>
                      {product.name}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {product.sku}
                    </span>
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>

      <Button
        type='submit'
        disabled={isLoading}
        className='w-full font-semibold py-2.5 mt-8 hover:opacity-90'
        style={{
          backgroundColor: 'var(--brand)',
          color: 'var(--brand-foreground)',
        }}
      >
        {isLoading
          ? mode === 'create'
            ? 'Creating…'
            : 'Updating…'
          : mode === 'create'
            ? 'Create collection'
            : 'Update collection'}
      </Button>
    </form>
  );
}
