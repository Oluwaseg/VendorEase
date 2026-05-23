'use client';

import { CollectionForm } from '@/components/admin/collection/collection-form';
import { useCollectionActions } from '@/components/admin/collection/use-collection-actions';
import { Button } from '@/components/ui/button';
import { useCollections, useDeleteCollection } from '@/hooks/use-collection';
import { Collection } from '@/types/collection';
import { Edit2, ImageIcon, Plus, Sparkles, Trash2, X } from 'lucide-react';
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
    return <div className='p-8 text-destructive'>Error: {error.message}</div>;
  }

  const list = collections ?? [];

  return (
    <div>
      <div
        className='border-b border-border'
        style={{
          background:
            'linear-gradient(to bottom right, var(--surface-2), var(--surface-3))',
        }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='flex items-center justify-between gap-8'>
            <div className='flex-1'>
              <h1 className='text-5xl lg:text-6xl font-bold text-foreground'>
                Collections
              </h1>
              <p className='text-foreground/60 mt-3 text-lg'>
                {list.length} collection{list.length === 1 ? '' : 's'} — curate
                hero slides and product groups
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              style={{
                backgroundColor: 'var(--brand)',
                color: 'var(--brand-foreground)',
              }}
              className='hover:opacity-90 font-semibold px-8 py-3 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all'
            >
              <Plus size={20} />
              <span>Create</span>
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {isLoading ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='rounded-xl bg-muted animate-pulse h-96' />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div
            className='rounded-xl border border-dashed border-border p-16 text-center'
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <div
              className='inline-block p-3 rounded-lg mb-4'
              style={{
                backgroundColor: 'var(--brand)',
                color: 'var(--brand-foreground)',
              }}
            >
              <ImageIcon className='size-8 opacity-60' />
            </div>
            <p className='text-xl font-semibold text-foreground mt-4'>
              No collections yet
            </p>
            <p className='text-muted-foreground mt-2 max-w-xs mx-auto'>
              Create your first collection with a cover image to feature on the
              homepage hero carousel.
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              style={{
                backgroundColor: 'var(--brand)',
                color: 'var(--brand-foreground)',
              }}
              className='mt-8 hover:opacity-90'
            >
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
                  className='group rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300'
                >
                  <div
                    className='relative h-40 overflow-hidden'
                    style={{ backgroundColor: 'var(--surface-2)' }}
                  >
                    {collection.image?.url ? (
                      <Image
                        src={collection.image.url}
                        alt={collection.name}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    ) : (
                      <div
                        className='flex h-full items-center justify-center'
                        style={{
                          background: `linear-gradient(135deg, color-mix(in oklch, var(--brand) 10%, transparent), color-mix(in oklch, var(--accent) 10%, transparent))`,
                        }}
                      >
                        <ImageIcon
                          className='size-12'
                          style={{ color: 'var(--brand)', opacity: 0.15 }}
                        />
                      </div>
                    )}
                    {collection.featuredOnHomepage ? (
                      <div
                        className='absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full backdrop-blur-sm px-3 py-1.5 text-xs font-semibold shadow-sm'
                        style={{
                          backgroundColor: 'var(--brand)',
                          color: 'var(--brand-foreground)',
                        }}
                      >
                        <Sparkles className='size-3.5' />
                        Featured
                      </div>
                    ) : null}
                  </div>
                  <div className='p-5 flex-1 flex flex-col'>
                    <div className='mb-3'>
                      <h2 className='font-bold text-base text-foreground truncate transition-colors'>
                        {collection.name}
                      </h2>
                      <p className='text-xs text-muted-foreground mt-1'>
                        <code style={{ color: 'var(--brand)' }}>
                          /{collection.slug}
                        </code>{' '}
                        ·{' '}
                        <span className='text-muted-foreground'>
                          {productCount} product{productCount === 1 ? '' : 's'}
                        </span>
                      </p>
                    </div>
                    <p className='text-sm text-foreground/70 line-clamp-2 flex-1 mb-3'>
                      {collection.description || (
                        <span className='italic text-muted-foreground'>
                          No description
                        </span>
                      )}
                    </p>
                    <div className='flex gap-2 mb-4'>
                      <span
                        className='text-xs font-medium px-2.5 py-1 rounded-full transition-colors'
                        style={{
                          backgroundColor: collection.isActive
                            ? 'color-mix(in oklch, var(--brand) 15%, transparent)'
                            : 'var(--muted)',
                          color: collection.isActive
                            ? 'var(--brand)'
                            : 'var(--muted-foreground)',
                        }}
                      >
                        {collection.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 pt-4 border-t border-border'>
                      <Button
                        size='sm'
                        variant='outline'
                        className='flex-1 text-xs'
                        onClick={() => setEditingCollection(collection)}
                      >
                        <Edit2 size={14} />
                        Edit
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        className='flex-1 text-xs'
                        asChild
                      >
                        <Link
                          href={`/collections/${collection.slug}`}
                          target='_blank'
                        >
                          View
                        </Link>
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        className='text-xs'
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
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
          <div className='bg-background border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95 duration-200'>
            <div
              className='sticky top-0 border-b border-border px-8 py-6 flex items-center justify-between z-10'
              style={{
                background: `linear-gradient(to right, color-mix(in oklch, var(--brand) 5%, transparent), color-mix(in oklch, var(--accent) 5%, transparent))`,
              }}
            >
              <div>
                <h2 className='text-2xl font-bold text-foreground'>
                  Create collection
                </h2>
                <p className='text-sm text-muted-foreground mt-1'>
                  Add a new collection with cover image and products
                </p>
              </div>
              <button
                type='button'
                onClick={() => setIsCreateOpen(false)}
                className='p-2 hover:bg-muted rounded-lg transition-colors ml-4'
              >
                <X
                  size={24}
                  className='text-muted-foreground hover:text-foreground'
                />
              </button>
            </div>
            <div className='px-8 py-8'>
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
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
          <div className='bg-background border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95 duration-200'>
            <div
              className='sticky top-0 border-b border-border px-8 py-6 flex items-center justify-between z-10'
              style={{
                background: `linear-gradient(to right, color-mix(in oklch, var(--brand) 5%, transparent), color-mix(in oklch, var(--accent) 5%, transparent))`,
              }}
            >
              <div>
                <h2 className='text-2xl font-bold text-foreground'>
                  Edit collection
                </h2>
                <p className='text-sm text-muted-foreground mt-1'>
                  Update collection details and products
                </p>
              </div>
              <button
                type='button'
                onClick={() => setEditingCollection(null)}
                className='p-2 hover:bg-muted rounded-lg transition-colors ml-4'
              >
                <X
                  size={24}
                  className='text-muted-foreground hover:text-foreground'
                />
              </button>
            </div>
            <div className='px-8 py-8'>
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
