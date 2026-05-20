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
import { CldUploadWidget } from 'next-cloudinary';
import { Image, Plus, X } from 'lucide-react';
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
  return productIds.map((item) =>
    typeof item === 'string' ? item : item._id
  );
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
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4 pb-6 border-b border-border'>
        <h3 className='text-lg font-bold text-foreground'>Basic details</h3>
        <div className='space-y-2'>
          <Label htmlFor='collection-name'>Name *</Label>
          <Input
            id='collection-name'
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder='Summer Essentials'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='collection-slug'>Slug *</Label>
          <Input
            id='collection-slug'
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
            placeholder='summer-essentials'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='collection-description'>Description</Label>
          <Textarea
            id='collection-description'
            value={form.description ?? ''}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            placeholder='Short copy shown on the homepage hero and collection page'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='collection-cta'>CTA button text</Label>
          <Input
            id='collection-cta'
            value={form.ctaText ?? ''}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, ctaText: e.target.value }))
            }
            maxLength={60}
            placeholder='e.g. Shop summer picks, Explore deals'
          />
          <p className='text-xs text-muted-foreground'>
            Label for the hero and collection page button. Defaults to &quot;Shop
            now&quot; if empty.
          </p>
        </div>
      </div>

      <div className='space-y-4 pb-6 border-b border-border'>
        <div className='flex items-center gap-2'>
          <Image size={20} className='text-primary' />
          <h3 className='text-lg font-bold text-foreground'>Cover image</h3>
        </div>
        <p className='text-sm text-muted-foreground'>
          Uploaded to Cloudinary folder:{' '}
          <code className='text-xs'>{CLOUDINARY_FOLDER_COLLECTIONS}</code>
        </p>
        <CldUploadWidget
          signatureEndpoint='/api/cloudinary/signature'
          options={{
            folder: CLOUDINARY_FOLDER_COLLECTIONS,
            multiple: false,
          }}
          onSuccess={(result: { info?: { secure_url?: string; public_id?: string } }) => {
            const info = result.info;
            if (!info?.secure_url || !info?.public_id) return;
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
              className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
            >
              <Plus size={20} />
              Upload cover image
            </Button>
          )}
        </CldUploadWidget>
        {form.image?.url ? (
          <div className='relative rounded-lg overflow-hidden border border-border'>
            <img
              src={form.image.url}
              alt='Collection cover'
              className='w-full h-40 object-cover'
            />
            <Button
              type='button'
              size='sm'
              variant='destructive'
              className='absolute top-2 right-2'
              onClick={() => setForm((prev) => ({ ...prev, image: undefined }))}
            >
              Remove
            </Button>
          </div>
        ) : null}
      </div>

      <div className='space-y-4 pb-6 border-b border-border'>
        <h3 className='text-lg font-bold text-foreground'>Homepage hero</h3>
        <div className='flex items-center justify-between rounded-lg border border-border p-4'>
          <div>
            <p className='font-semibold text-sm'>Feature on homepage carousel</p>
            <p className='text-xs text-muted-foreground mt-1'>
              Requires a cover image. Shown in the hero when active.
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
            <div className='space-y-2'>
              <Label htmlFor='hero-order'>Hero order</Label>
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
              />
              <p className='text-xs text-muted-foreground'>
                Lower numbers appear first in the carousel.
              </p>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='hero-position'>Hero text position</Label>
              <select
                id='hero-position'
                value={form.position ?? DEFAULT_HERO_TEXT_POSITION}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    position: e.target.value as HeroTextPosition,
                  }))
                }
                className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm'
              >
                {HERO_TEXT_POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {HERO_TEXT_POSITION_LABELS[pos]}
                  </option>
                ))}
              </select>
              <p className='text-xs text-muted-foreground'>
                Where the title, subtitle, and CTA appear on the slide image.
              </p>
            </div>
          </>
        ) : null}
        <div className='flex items-center justify-between rounded-lg border border-border p-4'>
          <div>
            <p className='font-semibold text-sm'>Active</p>
            <p className='text-xs text-muted-foreground mt-1'>
              Inactive collections are hidden from the storefront.
            </p>
          </div>
          <Switch
            checked={form.isActive ?? true}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, isActive: checked }))
            }
          />
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-bold text-foreground'>Products</h3>
        <p className='text-sm text-muted-foreground'>
          Select products included in this collection ({form.productIds.length}{' '}
          selected).
        </p>
        {selectedProducts.length > 0 ? (
          <div className='flex flex-wrap gap-2'>
            {selectedProducts.map((product: Product) => (
              <span
                key={product._id}
                className='inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium'
              >
                {product.name}
                <button
                  type='button'
                  onClick={() => toggleProduct(product._id)}
                  className='text-muted-foreground hover:text-foreground'
                  aria-label={`Remove ${product.name}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <div className='max-h-48 overflow-y-auto rounded-lg border border-border divide-y'>
          {products.length === 0 ? (
            <p className='p-4 text-sm text-muted-foreground'>
              No products available.
            </p>
          ) : (
            products.map((product) => {
              const checked = form.productIds.includes(product._id);
              return (
                <label
                  key={product._id}
                  className='flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-muted/50'
                >
                  <input
                    type='checkbox'
                    checked={checked}
                    onChange={() => toggleProduct(product._id)}
                    className='rounded border-border'
                  />
                  <span className='text-sm truncate'>{product.name}</span>
                  <span className='text-xs text-muted-foreground ml-auto'>
                    {product.sku}
                  </span>
                </label>
              );
            })
          )}
        </div>
      </div>

      <Button
        type='submit'
        disabled={isLoading}
        className='w-full bg-primary hover:bg-primary/90'
      >
        {isLoading
          ? 'Saving…'
          : mode === 'create'
            ? 'Create collection'
            : 'Update collection'}
      </Button>
    </form>
  );
};
