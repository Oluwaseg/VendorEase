'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/contexts/currency-context';
import { useCategories } from '@/hooks/use-category';
import { useSubcategories } from '@/hooks/use-subcategory';
import { formatPrice } from '@/lib/format-price';
import { Crown, Search, SlidersHorizontal, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MiniEmpty, MiniLoader } from '../common/loader';

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

  const safeSubcategories = Array.isArray(subcategoriesData)
    ? subcategoriesData
    : [];

  const filteredSubcategories = filters.category
    ? safeSubcategories.filter((sub: any) => {
        const subCategoryId =
          typeof sub.category === 'string' ? sub.category : sub.category?._id;
        return subCategoryId === filters.category;
      })
    : [];

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
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

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.subcategory ? 1 : 0) +
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice < maxPrice ? 1 : 0) +
    (filters.isBestSeller ? 1 : 0) +
    (filters.flashSaleActive ? 1 : 0);

  const hasActiveFilters = activeCount > 0;

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden mb-6 w-full px-4 py-3 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-between'
      >
        <span className='flex items-center gap-2'>
          <SlidersHorizontal size={16} />
          Filters
        </span>
        <span className='text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full min-w-6 text-center'>
          {activeCount}
        </span>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-card border-l border-border z-50 lg:relative lg:w-full lg:h-auto lg:bg-transparent lg:border-0 lg:p-0 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className='lg:hidden absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors'
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className='sticky top-0 bg-card border-b border-border p-4 lg:p-0 lg:mb-6 lg:border-0 lg:bg-transparent flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-foreground flex items-center gap-2'>
            <SlidersHorizontal size={18} className='text-brand' />
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className='hidden lg:inline text-xs font-medium text-brand hover:underline'
            >
              Clear all
            </button>
          )}
        </div>

        <div className='overflow-y-auto h-[calc(100vh-120px)] lg:h-auto p-4 lg:p-0 space-y-6'>
          {/* Search — polished input */}
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              Search
            </label>
            <div className='relative group'>
              <Search
                size={16}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors pointer-events-none'
              />
              <Input
                type='text'
                placeholder='Search products...'
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className='w-full pl-9 pr-9 h-11 rounded-lg bg-background/60 border-border/70 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:border-brand transition-all'
              />
              {filters.search && (
                <button
                  type='button'
                  onClick={() => handleFilterChange({ search: '' })}
                  aria-label='Clear search'
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm font-semibold text-foreground mb-3'>
              Category
            </label>
            <div className='space-y-1.5'>
              <RadioRow
                name='category'
                value=''
                checked={filters.category === ''}
                onChange={(v) => handleFilterChange({ category: v })}
                label='All Categories'
              />
              {categoriesLoading ? (
                <MiniLoader rows={3} message='Loading categories...' />
              ) : (
                categories.map((cat) => (
                  <RadioRow
                    key={cat._id}
                    name='category'
                    value={cat._id}
                    checked={filters.category === cat._id}
                    onChange={(v) => handleFilterChange({ category: v })}
                    label={cat.name}
                  />
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
              <div className='space-y-1.5'>
                <RadioRow
                  name='subcategory'
                  value=''
                  checked={filters.subcategory === ''}
                  onChange={(v) => handleFilterChange({ subcategory: v })}
                  label='All Subcategories'
                />
                {subcategoriesLoading ? (
                  <MiniLoader rows={3} message='Loading subcategories...' />
                ) : filteredSubcategories.length === 0 ? (
                  <MiniEmpty
                    message={
                      safeSubcategories.length === 0
                        ? 'No subcategories found in system'
                        : 'No subcategories for this category'
                    }
                  />
                ) : (
                  filteredSubcategories.map((sub) => (
                    <RadioRow
                      key={sub._id}
                      name='subcategory'
                      value={sub._id}
                      checked={filters.subcategory === sub._id}
                      onChange={(v) => handleFilterChange({ subcategory: v })}
                      label={sub.name}
                    />
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
            <div className='space-y-4'>
              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <span className='text-xs text-muted-foreground'>Min</span>
                  <span className='text-xs font-medium text-foreground tabular-nums'>
                    {formatPrice(convert(filters.minPrice), currency)}
                  </span>
                </div>
                <input
                  type='range'
                  min='0'
                  max={maxPrice}
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange({ minPrice: Number(e.target.value) })
                  }
                  className='w-full accent-brand'
                />
              </div>
              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <span className='text-xs text-muted-foreground'>Max</span>
                  <span className='text-xs font-medium text-foreground tabular-nums'>
                    {formatPrice(convert(filters.maxPrice), currency)}
                  </span>
                </div>
                <input
                  type='range'
                  min='0'
                  max={maxPrice}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange({ maxPrice: Number(e.target.value) })
                  }
                  className='w-full accent-brand'
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className='space-y-2'>
            <ToggleRow
              checked={filters.isBestSeller}
              onChange={(v) => handleFilterChange({ isBestSeller: v })}
              icon={<Crown size={14} className='text-amber-500' />}
              label='Best Sellers Only'
            />
            <ToggleRow
              checked={filters.flashSaleActive}
              onChange={(v) => handleFilterChange({ flashSaleActive: v })}
              icon={<Zap size={14} className='text-rose-500 fill-rose-500' />}
              label='Flash Sale Active'
            />
          </div>

          {hasActiveFilters && (
            <Button
              onClick={handleReset}
              variant='outline'
              className='w-full mt-4'
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function RadioRow({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer px-2.5 py-2 rounded-md transition-colors ${
        checked
          ? 'bg-brand/10 text-foreground'
          : 'hover:bg-muted/60 text-foreground/75'
      }`}
    >
      <input
        type='radio'
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className='w-4 h-4 accent-brand'
      />
      <span className='text-sm'>{label}</span>
    </label>
  );
}

function ToggleRow({
  checked,
  onChange,
  icon,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg border transition-all ${
        checked
          ? 'border-brand/50 bg-brand/5 shadow-sm'
          : 'border-border hover:border-border/80 hover:bg-muted/40'
      }`}
    >
      <input
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className='w-4 h-4 accent-brand'
      />
      <span className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
        {icon}
        {label}
      </span>
    </label>
  );
}
