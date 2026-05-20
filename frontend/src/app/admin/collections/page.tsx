'use client';

import { CollectionForm } from '@/components/admin/collection/collection-form';
import { useCollectionActions } from '@/components/admin/collection/use-collection-actions';
import { Button } from '@/components/ui/button';
import {
  useCollections,
  useDeleteCollection,
} from '@/hooks/use-collection';
import { Collection } from '@/types/collection';
import {
  Edit2,
  ImageIcon,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminCollectionsPage() {
  const { data: collections, isLoading, error } = useCollections();
  const { mutate: deleteCollection, isPending: isDeleting } =
    useDeleteCollection();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { createCollection, updateCollection, isCreating, isUpdating } =
    useCollectionActions();

  if (error) {
    return (
      <div className='p-8 text-red-500'>Error: {error.message}</div>
    );
  }

  const list = collections ?? [];

  return (
    <div>
      <div className='bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h1 className='text-4xl lg:text-5xl font-bold text-foreground'>
                Collections
              </h1>
              <p className='text-foreground/60 mt-2'>
                {list.length} collection{list.length === 1 ? '' : 's'} — hero,
                landing, and curated product groups
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg'
            >
              <Plus size={20} />
              Add collection
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {isLoading ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className='h-48 rounded-2xl bg-muted animate-pulse'
              />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-border p-12 text-center'>
            <ImageIcon className='mx-auto size-12 text-muted-foreground/50' />
            <p className='mt-4 text-lg font-semibold'>No collections yet</p>
            <p className='text-sm text-muted-foreground mt-2'>
              Create a collection with a cover image to power the homepage hero.
            </p>
            <Button className='mt-6' onClick={() => setIsCreateOpen(true)}>
              <Plus size={18} />
              Create first collection
            </Button>
          </div>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {list.map((collection) => {
              const productCount = Array.isArray(collection.productIds)
                ? collection.productIds.length
                : 0;
              return (
                <article
                  key={collection._id}
                  className='rounded-2xl border border-border bg-card overflow-hidden flex flex-col'
                >
                  <div className='relative h-36 bg-muted'>
                    {collection.image?.url ? (
                      <Image
                        src={collection.image.url}
                        alt={collection.name}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center text-muted-foreground'>
                        <ImageIcon className='size-10 opacity-40' />
                      </div>
                    )}
                    {collection.featuredOnHomepage ? (
                      <span className='absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground'>
                        <Sparkles className='size-3' />
                        Hero
                      </span>
                    ) : null}
                  </div>
                  <div className='p-4 flex-1 flex flex-col'>
                    <h2 className='font-bold text-lg truncate'>
                      {collection.name}
                    </h2>
                    <p className='text-xs text-muted-foreground mt-1'>
                      /{collection.slug} · {productCount} product
                      {productCount === 1 ? '' : 's'}
                    </p>
                    <p className='text-sm text-foreground/70 mt-2 line-clamp-2 flex-1'>
                      {collection.description || 'No description'}
                    </p>
                    <div className='flex flex-wrap gap-2 mt-3'>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          collection.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {collection.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 mt-4 pt-4 border-t border-border'>
                      <Button
                        size='sm'
                        variant='outline'
                        className='flex-1'
                        onClick={() => setEditingCollection(collection)}
                      >
                        <Edit2 size={14} />
                        Edit
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        asChild
                      >
                        <Link href={`/collections/${collection.slug}`} target='_blank'>
                          View
                        </Link>
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        disabled={isDeleting && deletingId === collection._id}
                        onClick={() => {
                          setDeletingId(collection._id);
                          deleteCollection(collection._id, {
                            onSettled: () => setDeletingId(null),
                          });
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {isCreateOpen ? (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-background border-2 border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>
            <div className='sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 px-8 py-6 flex items-center justify-between z-10'>
              <h2 className='text-2xl font-bold'>Create collection</h2>
              <button
                type='button'
                onClick={() => setIsCreateOpen(false)}
                className='p-2 hover:bg-muted rounded-lg'
              >
                <X size={24} />
              </button>
            </div>
            <div className='px-8 py-6'>
              <CollectionForm
                mode='create'
                isLoading={isCreating}
                onSubmit={(data) =>
                  createCollection(data, {
                    onSuccess: () => setIsCreateOpen(false),
                  })
                }
              />
            </div>
          </div>
        </div>
      ) : null}

      {editingCollection ? (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-background border-2 border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>
            <div className='sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 px-8 py-6 flex items-center justify-between z-10'>
              <h2 className='text-2xl font-bold'>Edit collection</h2>
              <button
                type='button'
                onClick={() => setEditingCollection(null)}
                className='p-2 hover:bg-muted rounded-lg'
              >
                <X size={24} />
              </button>
            </div>
            <div className='px-8 py-6'>
              <CollectionForm
                mode='edit'
                initialData={editingCollection}
                isLoading={isUpdating}
                onSubmit={(data) =>
                  updateCollection(
                    { id: editingCollection._id, data },
                    { onSuccess: () => setEditingCollection(null) }
                  )
                }
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
