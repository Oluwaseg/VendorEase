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

  // Filter to low stock only if toggle is on
  if (showLowStockOnly && lowStockData) {
    const lowStockIds = new Set(lowStockData.map((p) => p._id));
    filteredProducts = filteredProducts.filter((p) => lowStockIds.has(p._id));
  }

  return (
    <div>
      {/* Header */}
      <div className='bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h1 className='text-4xl lg:text-5xl font-bold text-foreground'>
                Product Management
              </h1>
              <p className='text-foreground/60 mt-2'>
                {data?.total ?? 0} total products
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg'
            >
              <Plus size={20} />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Low Stock Alert */}
        {lowStockData && lowStockData.length > 0 && (
          <div className='mb-8 p-4 rounded-lg bg-yellow-950/20 border border-yellow-800/30 flex items-start gap-4'>
            <AlertTriangle
              size={24}
              className='text-yellow-600 flex-shrink-0 mt-0.5'
            />
            <div className='flex-1'>
              <p className='font-semibold text-yellow-700'>
                {lowStockData.length} product(s) with low inventory
              </p>
              <p className='text-sm text-yellow-700/70 mt-1'>
                {lowStockData.length} item(s) have stock levels at or below 10
                units.
              </p>
            </div>
            <Button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              variant='outline'
              className='flex-shrink-0 border-yellow-700 text-yellow-700 hover:bg-yellow-950/20'
            >
              {showLowStockOnly ? 'Show All' : 'Filter Low Stock'}
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
              placeholder='Search by name or SKU...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-12 pr-4 py-3 border-2 border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
            />
          </div>
        </div>

        {/* Table */}
        <div className='rounded-2xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm shadow-lg'>
          {isLoading ? (
            <div className='p-12 text-center'>
              <div className='inline-block'>
                <div className='w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin' />
                <p className='text-foreground/60 mt-4'>Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='p-12 text-center'>
              <Package size={48} className='mx-auto text-foreground/30 mb-4' />
              <p className='text-foreground/60'>No products found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-border/50 bg-muted/50'>
                    <th className='px-6 py-4 text-left'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        Product
                      </span>
                    </th>
                    <th className='px-6 py-4 text-left'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        SKU
                      </span>
                    </th>
                    <th className='px-6 py-4 text-right'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        Price
                      </span>
                    </th>
                    <th className='px-6 py-4 text-center'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        Stock
                      </span>
                    </th>
                    <th className='px-6 py-4 text-center'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        Status
                      </span>
                    </th>
                    <th className='px-6 py-4 text-center'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        Rating
                      </span>
                    </th>
                    <th className='px-6 py-4 text-right'>
                      <span className='text-sm font-bold text-foreground/70 uppercase tracking-wider'>
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => (
                    <tr
                      key={product._id}
                      className={`border-b border-border/30 hover:bg-primary/5 transition-colors ${
                        idx % 2 === 0 ? 'bg-background/50' : 'bg-background'
                      }`}
                    >
                      {/* Product Name */}
                      <td className='px-6 py-4'>
                        <div className='flex items-start gap-3'>
                          <div className='p-2 rounded-lg bg-accent/10'>
                            <Package size={20} className='text-accent' />
                          </div>
                          <div>
                            <p className='font-semibold text-foreground text-sm'>
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
                        <code className='px-3 py-1 rounded bg-muted text-xs font-mono text-foreground/70'>
                          {product.sku}
                        </code>
                      </td>

                      {/* Price */}
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <span className='text-accent font-bold'>₦</span>
                          <span className='font-bold text-foreground'>
                            {product.basePrice.toFixed(2)}
                          </span>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className='px-6 py-4 text-center'>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                            product.stock > 10
                              ? 'bg-green-100 text-green-700'
                              : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <Box size={14} />
                          {product.stock}
                        </span>
                      </td>

                      {/* Status */}
                      <td className='px-6 py-4 text-center'>
                        {product.isPublished ? (
                          <div className='flex justify-center'>
                            <div className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700'>
                              <Eye size={14} />
                              Published
                            </div>
                          </div>
                        ) : (
                          <div className='flex justify-center'>
                            <div className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700'>
                              <EyeOff size={14} />
                              Draft
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Rating */}
                      <td className='px-6 py-4 text-center'>
                        <div className='flex items-center justify-center gap-1'>
                          <Star
                            size={16}
                            className={
                              product.averageRating > 0
                                ? 'fill-accent stroke-accent'
                                : 'stroke-foreground/20'
                            }
                          />
                          <span className='text-sm font-semibold text-foreground'>
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
                            onClick={() => setEditingProduct(product)}
                            size='sm'
                            variant='outline'
                            className='border-2 border-primary/30 hover:bg-primary/10 text-primary rounded-lg'
                          >
                            <Edit2 size={16} />
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
                            className='bg-red-100 hover:bg-red-200 text-red-700 rounded-lg border-2 border-red-200'
                          >
                            {isDeleting && selectedId === product._id ? (
                              <div className='w-4 h-4 border-2 border-red-700/20 border-t-red-700 rounded-full animate-spin' />
                            ) : (
                              <Trash2 size={16} />
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
        <div className='flex items-center justify-between mt-8'>
          <p className='text-sm text-foreground/60 font-medium'>
            Page {data?.page ?? page} of {totalPages} ({data?.total ?? 0} total
            products)
          </p>
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className='border-2 rounded-lg'
            >
              <ChevronLeft size={18} />
              Previous
            </Button>
            <div className='px-4 py-2 bg-muted rounded-lg'>
              <span className='text-sm font-semibold text-foreground'>
                {data?.page ?? page}
              </span>
            </div>
            <Button
              size='sm'
              variant='outline'
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className='border-2 rounded-lg'
            >
              Next
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-background border-2 border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>
            <div className='sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 px-8 py-6 flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-foreground'>
                Create New Product
              </h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className='p-2 hover:bg-muted rounded-lg transition-colors'
              >
                <X size={24} className='text-foreground' />
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
          <div className='bg-background border-2 border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>
            <div className='sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 px-8 py-6 flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-foreground'>
                Edit Product
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className='p-2 hover:bg-muted rounded-lg transition-colors'
              >
                <X size={24} className='text-foreground' />
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
