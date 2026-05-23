'use client';

import { ProductForm } from '@/components/admin/product/product-form';
import { useProductActions } from '@/components/admin/product/use-product-actions';
import { Button } from '@/components/ui/button';
import {
  useDeleteProduct,
  useLowStockProducts,
  useProducts,
} from '@/hooks/use-product';
import { Product } from '@/types/product';
import {
  AlertTriangle,
  Box,
  ChevronLeft,
  ChevronRight,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const limit = 10;
  const { data, isLoading, error } = useProducts({ page, limit });
  const { data: lowStockData, isLoading: isLowStockLoading } =
    useLowStockProducts(10);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { createProduct, updateProduct, isCreating, isUpdating } =
    useProductActions();

  if (error)
    return <div className='p-8 text-red-500'>Error: {error.message}</div>;

  const totalPages = data?.pages ?? 1;
  let filteredProducts =
    data?.products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

  if (showLowStockOnly && lowStockData) {
    const lowStockIds = new Set(lowStockData.map((p) => p._id));
    filteredProducts = filteredProducts.filter((p) => lowStockIds.has(p._id));
  }

  return (
    <div className='min-h-screen bg-surface'>
      {/* Header */}
      <div className='border-b border-border bg-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-foreground'>
                Product Management
              </h1>
              <p className='text-foreground/60 mt-2 text-sm sm:text-base'>
                Manage and organize {data?.total ?? 0} products
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className='bg-brand hover:bg-brand/90 text-brand-foreground font-semibold px-6 py-3 rounded-[0.5rem] flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center sm:justify-start'
            >
              <Plus size={20} />
              New Product
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Low Stock Alert */}
        {lowStockData && lowStockData.length > 0 && (
          <div className='mb-8 p-4 sm:p-6 rounded-[0.5rem] bg-warning/10 border border-warning/30 flex flex-col sm:flex-row sm:items-start gap-4'>
            <AlertTriangle
              size={24}
              className='text-warning flex-shrink-0 mt-0.5'
            />
            <div className='flex-1 min-w-0'>
              <p className='font-semibold text-foreground'>
                {lowStockData.length} product(s) with low inventory
              </p>
              <p className='text-sm text-foreground/70 mt-1'>
                {lowStockData.length} item(s) have stock levels at or below 10
                units. Consider restocking soon.
              </p>
            </div>
            <Button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              variant='outline'
              className='flex-shrink-0 border-warning text-warning hover:bg-warning/5 w-full sm:w-auto'
            >
              {showLowStockOnly ? 'Show All' : 'Filter'}
            </Button>
          </div>
        )}

        {/* Search Bar */}
        <div className='mb-8'>
          <div className='relative'>
            <Search
              className='absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40'
              size={20}
            />
            <input
              type='text'
              placeholder='Search products by name or SKU...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-12 pr-4 py-3 border border-border rounded-[0.5rem] bg-card text-foreground placeholder:text-foreground/40 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
            />
          </div>
        </div>

        {/* Table */}
        <div className='rounded-[0.5rem] border border-border overflow-hidden bg-card shadow-sm'>
          {isLoading ? (
            <div className='p-12 text-center'>
              <div className='inline-block'>
                <div className='w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin' />
                <p className='text-foreground/60 mt-4 text-sm'>
                  Loading products...
                </p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='p-12 text-center'>
              <Package size={48} className='mx-auto text-foreground/20 mb-4' />
              <p className='text-foreground/60 text-sm'>No products found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-border bg-surface-2'>
                    <th className='px-6 py-4 text-left'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-wider'>
                        Product
                      </span>
                    </th>
                    <th className='px-6 py-4 text-left'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-wider'>
                        SKU
                      </span>
                    </th>
                    <th className='px-6 py-4 text-right'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-wider'>
                        Price
                      </span>
                    </th>
                    <th className='px-6 py-4 text-center'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-wider'>
                        Stock
                      </span>
                    </th>
                    <th className='px-6 py-4 text-center'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-wider'>
                        Status
                      </span>
                    </th>
                    <th className='px-6 py-4 text-center'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-wider'>
                        Rating
                      </span>
                    </th>
                    <th className='px-6 py-4 text-right'>
                      <span className='text-xs font-bold text-foreground/70 uppercase tracking-wider'>
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => (
                    <tr
                      key={product._id}
                      className={`border-b border-border hover:bg-surface-2/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-card' : 'bg-surface/50'
                      }`}
                    >
                      {/* Product Name */}
                      <td className='px-6 py-4'>
                        <div className='flex items-start gap-3'>
                          <div className='p-2 rounded-[0.375rem] bg-brand/10'>
                            <Package size={18} className='text-brand' />
                          </div>
                          <div className='min-w-0'>
                            <p className='font-semibold text-foreground text-sm truncate'>
                              {product.name}
                            </p>
                            <p className='text-xs text-foreground/50 mt-1'>
                              {product.category?.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className='px-6 py-4'>
                        <code className='px-2.5 py-1 rounded-[0.375rem] bg-surface-2 text-xs font-mono text-foreground/70 whitespace-nowrap'>
                          {product.sku}
                        </code>
                      </td>

                      {/* Price */}
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          <span className='text-accent font-bold text-sm'>
                            ₦
                          </span>
                          <span className='font-bold text-foreground text-sm'>
                            {product.basePrice.toFixed(2)}
                          </span>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className='px-6 py-4 text-center'>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            product.stock > 10
                              ? 'bg-success/10 text-success'
                              : product.stock > 0
                                ? 'bg-warning/10 text-warning'
                                : 'bg-danger/10 text-danger'
                          }`}
                        >
                          <Box size={12} />
                          {product.stock}
                        </span>
                      </td>

                      {/* Status */}
                      <td className='px-6 py-4 text-center'>
                        {product.isPublished ? (
                          <div className='flex justify-center'>
                            <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success'>
                              <Eye size={12} />
                              Published
                            </div>
                          </div>
                        ) : (
                          <div className='flex justify-center'>
                            <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-3 text-foreground/60'>
                              <EyeOff size={12} />
                              Draft
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Rating */}
                      <td className='px-6 py-4 text-center'>
                        <div className='flex items-center justify-center gap-1'>
                          <Star
                            size={14}
                            className={
                              product.averageRating > 0
                                ? 'fill-accent stroke-accent'
                                : 'stroke-foreground/20'
                            }
                          />
                          <span className='text-xs font-semibold text-foreground'>
                            {product.averageRating > 0
                              ? product.averageRating.toFixed(1)
                              : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            onClick={() => {
                              window.open(
                                `/products/${product.slug}`,
                                '_blank'
                              );
                            }}
                            size='sm'
                            variant='outline'
                            className='border border-brand/30 hover:bg-brand/5 text-brand rounded-[0.375rem] text-xs'
                            title='View product details'
                          >
                            <ExternalLink size={14} />
                            <span className='hidden sm:inline ml-1'>View</span>
                          </Button>
                          <Button
                            onClick={() => setEditingProduct(product)}
                            size='sm'
                            variant='outline'
                            className='border border-brand/30 hover:bg-brand/5 text-brand rounded-[0.375rem]'
                            title='Edit product'
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            size='sm'
                            variant='destructive'
                            disabled={isDeleting && selectedId === product._id}
                            onClick={() => {
                              setSelectedId(product._id);
                              deleteProduct(product._id, {
                                onSettled: () => setSelectedId(null),
                              });
                            }}
                            className='bg-danger/10 hover:bg-danger/20 text-danger rounded-[0.375rem] border border-danger/20'
                            title='Delete product'
                          >
                            {isDeleting && selectedId === product._id ? (
                              <div className='w-3.5 h-3.5 border-2 border-danger/20 border-t-danger rounded-full animate-spin' />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10 pt-6 border-t border-border'>
          <p className='text-xs sm:text-sm text-foreground/60 font-medium'>
            Page {data?.page ?? page} of {totalPages} • {data?.total ?? 0} total
            products
          </p>
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className='border border-border hover:bg-surface rounded-[0.375rem]'
            >
              <ChevronLeft size={16} />
              <span className='hidden sm:inline ml-1'>Previous</span>
            </Button>
            <div className='px-3 py-2 bg-surface-2 rounded-[0.375rem] flex items-center justify-center min-w-[44px]'>
              <span className='text-xs font-semibold text-foreground'>
                {data?.page ?? page}
              </span>
            </div>
            <Button
              size='sm'
              variant='outline'
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className='border border-border hover:bg-surface rounded-[0.375rem]'
            >
              <span className='hidden sm:inline mr-1'>Next</span>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-card border border-border rounded-[0.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>
            <div className='sticky top-0 bg-surface-2 border-b border-border px-8 py-6 flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-foreground'>
                Create New Product
              </h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className='p-2 hover:bg-surface rounded-[0.375rem] transition-colors'
              >
                <X size={20} className='text-foreground' />
              </button>
            </div>
            <div className='px-8 py-6'>
              <ProductForm
                mode='create'
                isLoading={isCreating}
                onSubmit={(data) =>
                  createProduct(data, {
                    onSuccess: () => setIsCreateOpen(false),
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-card border border-border rounded-[0.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>
            <div className='sticky top-0 bg-surface-2 border-b border-border px-8 py-6 flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-foreground'>
                Edit Product
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className='p-2 hover:bg-surface rounded-[0.375rem] transition-colors'
              >
                <X size={20} className='text-foreground' />
              </button>
            </div>
            <div className='px-8 py-6'>
              <ProductForm
                mode='edit'
                initialData={editingProduct}
                isLoading={isUpdating}
                onSubmit={(data) =>
                  updateProduct(
                    { id: editingProduct._id, data },
                    { onSuccess: () => setEditingProduct(null) }
                  )
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
