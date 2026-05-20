'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/contexts/currency-context';
import { useCategories } from '@/hooks/use-category';
import { useSubcategories } from '@/hooks/use-subcategory';
import { formatPrice } from '@/lib/format-price';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  maxPrice?: number;
  initialFilters?: FilterState;
}

export interface FilterState {
  search: string;
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  isBestSeller: boolean;
  flashSaleActive: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: '',
  subcategory: '',
  minPrice: 0,
  maxPrice: 10000,
  isBestSeller: false,
  flashSaleActive: false,
};

export function ProductFilters({
  onFilterChange,
  maxPrice = 10000,
  initialFilters = DEFAULT_FILTERS,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: subcategoriesData = [], isLoading: subcategoriesLoading } =
    useSubcategories();
  const { currency, convert } = useCurrency();

  // Type-safe subcategories array
  const safeSubcategories = Array.isArray(subcategoriesData)
    ? subcategoriesData
    : [];

  // Filter subcategories by selected category
  const filteredSubcategories = filters.category
    ? safeSubcategories.filter((sub: any) => {
        // Handle both string and object category formats
        const subCategoryId =
          typeof sub.category === 'string' ? sub.category : sub.category?._id;
        return subCategoryId === filters.category;
      })
    : [];

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    // Reset subcategory when category changes
    if (newFilters.category !== undefined) {
      updated.subcategory = '';
    }
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.subcategory ||
    filters.minPrice > 0 ||
    filters.maxPrice < maxPrice ||
    filters.isBestSeller ||
    filters.flashSaleActive;

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden mb-6 w-full px-4 py-3 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-between'
      >
        <span>Filters</span>
        <span className='text-xs bg-primary text-primary-foreground px-2 py-1 rounded'>
          {hasActiveFilters ? '1+' : '0'}
        </span>
      </button>

      {/* Filter Panel */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-card border-l border-border z-50 lg:relative lg:w-full lg:h-auto lg:bg-transparent lg:border-0 lg:p-0 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button - Mobile Only */}
        <button
          onClick={() => setIsOpen(false)}
          className='lg:hidden absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors'
        >
          <X size={20} />
        </button>

        {/* Filters Header */}
        <div className='sticky top-0 bg-card border-b border-border p-4 lg:p-0 lg:mb-6 lg:border-0'>
          <h3 className='text-lg font-semibold text-foreground'>Filters</h3>
        </div>

        {/* Filters Content */}
        <div className='overflow-y-auto h-[calc(100vh-120px)] lg:h-auto p-4 lg:p-0 space-y-6'>
          {/* Search */}
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Search
            </label>
            <Input
              type='text'
              placeholder='Search products...'
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className='w-full'
            />
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm font-semibold text-foreground mb-3'>
              Category
            </label>
            <div className='space-y-2'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='radio'
                  name='category'
                  value=''
                  checked={filters.category === ''}
                  onChange={(e) =>
                    handleFilterChange({ category: e.target.value })
                  }
                  className='w-4 h-4'
                />
                <span className='text-sm text-foreground/70'>
                  All Categories
                </span>
              </label>
              {categoriesLoading ? (
                <div className='text-xs text-foreground/50 py-2'>
                  Loading categories...
                </div>
              ) : (
                categories.map((cat) => (
                  <label
                    key={cat._id}
                    className='flex items-center gap-3 cursor-pointer'
                  >
                    <input
                      type='radio'
                      name='category'
                      value={cat._id}
                      checked={filters.category === cat._id}
                      onChange={(e) =>
                        handleFilterChange({ category: e.target.value })
                      }
                      className='w-4 h-4'
                    />
                    <span className='text-sm text-foreground/70'>
                      {cat.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Subcategory */}
          {filters.category && (
            <div>
              <label className='block text-sm font-semibold text-foreground mb-3'>
                Subcategory
              </label>
              <div className='space-y-2'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type='radio'
                    name='subcategory'
                    value=''
                    checked={filters.subcategory === ''}
                    onChange={(e) =>
                      handleFilterChange({ subcategory: e.target.value })
                    }
                    className='w-4 h-4'
                  />
                  <span className='text-sm text-foreground/70'>
                    All Subcategories
                  </span>
                </label>
                {subcategoriesLoading ? (
                  <div className='text-xs text-foreground/50 py-2'>
                    Loading subcategories...
                  </div>
                ) : subcategoriesLoading === false &&
                  filteredSubcategories.length === 0 ? (
                  <div className='text-xs text-foreground/50 py-2'>
                    {safeSubcategories.length === 0
                      ? 'No subcategories found in system'
                      : 'No subcategories for this category'}
                  </div>
                ) : (
                  filteredSubcategories.map((sub) => (
                    <label
                      key={sub._id}
                      className='flex items-center gap-3 cursor-pointer'
                    >
                      <input
                        type='radio'
                        name='subcategory'
                        value={sub._id}
                        checked={filters.subcategory === sub._id}
                        onChange={(e) =>
                          handleFilterChange({ subcategory: e.target.value })
                        }
                        className='w-4 h-4'
                      />
                      <span className='text-sm text-foreground/70'>
                        {sub.name}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div>
            <label className='block text-sm font-semibold text-foreground mb-4'>
              Price Range ({currency})
            </label>
            <div className='space-y-3'>
              <div>
                <label className='text-xs text-foreground/60 mb-1 block'>
                  Min Price: {formatPrice(convert(filters.minPrice), currency)}
                </label>
                <input
                  type='range'
                  min='0'
                  max={maxPrice}
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange({ minPrice: Number(e.target.value) })
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='text-xs text-foreground/60 mb-1 block'>
                  Max Price: {formatPrice(convert(filters.maxPrice), currency)}
                </label>
                <input
                  type='range'
                  min='0'
                  max={maxPrice}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange({ maxPrice: Number(e.target.value) })
                  }
                  className='w-full'
                />
              </div>
            </div>
          </div>

          {/* Best Sellers */}
          <div>
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={filters.isBestSeller}
                onChange={(e) =>
                  handleFilterChange({ isBestSeller: e.target.checked })
                }
                className='w-4 h-4'
              />
              <span className='text-sm font-medium text-foreground'>
                Best Sellers Only
              </span>
            </label>
          </div>

          {/* Flash Sale */}
          <div>
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={filters.flashSaleActive}
                onChange={(e) =>
                  handleFilterChange({ flashSaleActive: e.target.checked })
                }
                className='w-4 h-4'
              />
              <span className='text-sm font-medium text-foreground'>
                Flash Sale Active
              </span>
            </label>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              onClick={handleReset}
              variant='outline'
              className='w-full mt-6'
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
