'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/use-category';
import {
  useCreateSubcategory,
  useDeleteSubcategory,
  useSubcategories,
  useUpdateSubcategory,
} from '@/hooks/use-subcategory';
import { Subcategory } from '@/types/subcategory';
import { format } from 'date-fns/format';
import {
  Calendar,
  Edit2,
  FolderOpen,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SubcategoriesPage() {
  const { data: subcategories = [], isLoading } = useSubcategories();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateSubcategory();
  const updateMutation = useUpdateSubcategory();
  const deleteMutation = useDeleteSubcategory();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    description: '',
    isPublished: true,
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        isPublished: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Open modal for create
  const handleOpenCreateModal = () => {
    setSelectedSubcategory(null);
    setFormData({
      name: '',
      slug: '',
      category: '',
      description: '',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      slug: subcategory.slug,
      category: subcategory.category._id,
      description: subcategory.description || '',
      isPublished: subcategory.isPublished,
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Subcategory name is required');
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Category is required');
      return;
    }

    const submitData = {
      ...formData,
      category: formData.category, // send only the category ID
    };

    if (selectedSubcategory) {
      updateMutation.mutate(
        {
          id: selectedSubcategory._id,
          data: submitData,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter subcategories based on search
  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header Section */}
      <header className='sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 bg-brand/10 rounded-xl border border-brand/20'>
                  <FolderOpen className='w-5 h-5 text-brand' />
                </div>
                <div>
                  <h1 className='text-4xl font-bold tracking-tight text-foreground font-display'>
                    Subcategories
                  </h1>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Organize and manage your product subcategories
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleOpenCreateModal}
              className='bg-brand hover:bg-brand/90 text-brand-foreground gap-2 w-fit shadow-lg shadow-brand/20 h-11'
            >
              <Plus className='w-4 h-4' />
              New Subcategory
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-6 py-12'>
        {/* Search Bar */}
        <div className='mb-10'>
          <div className='relative max-w-md'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none' />
            <Input
              placeholder='Search by name...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-11 h-11 bg-surface border-border/40 text-foreground placeholder:text-muted-foreground focus:border-brand/40 transition-colors'
            />
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          // Loading State
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className='h-48 bg-card border border-border/40 rounded-xl animate-pulse'
              />
            ))}
          </div>
        ) : filteredSubcategories.length === 0 ? (
          // Empty State
          <div className='flex flex-col items-center justify-center min-h-96 rounded-2xl border border-dashed border-border/60 bg-surface/50 backdrop-blur-sm'>
            <div className='p-4 bg-muted/30 rounded-full mb-4'>
              <FolderOpen className='w-12 h-12 text-muted-foreground/50' />
            </div>
            <h3 className='text-xl font-semibold text-foreground mb-2 font-display'>
              {searchQuery ? 'No results found' : 'No subcategories yet'}
            </h3>
            <p className='text-sm text-muted-foreground text-center max-w-xs mb-6'>
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first subcategory to organize your products'}
            </p>
            {!searchQuery && (
              <Button
                onClick={handleOpenCreateModal}
                className='bg-brand hover:bg-brand/90 text-brand-foreground gap-2'
              >
                <Plus className='w-4 h-4' />
                Create Subcategory
              </Button>
            )}
          </div>
        ) : (
          // Grid of Subcategories
          <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              {filteredSubcategories.map((subcategory) => (
                <div
                  key={subcategory._id}
                  className='group relative h-full bg-card border border-border/40 rounded-xl overflow-hidden hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 flex flex-col'
                >
                  {/* Header with gradient background */}
                  <div className='relative h-20 bg-gradient-to-br from-brand/10 via-accent/5 to-transparent border-b border-border/40 px-5 py-4 flex items-center justify-between'>
                    <Badge
                      variant='secondary'
                      className='bg-brand/15 text-brand border-brand/20 font-medium'
                    >
                      {subcategory.category.name}
                    </Badge>
                    <div className='flex items-center gap-1'>
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${
                          subcategory.isPublished ? 'bg-success' : 'bg-warning'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className='flex-1 p-5 space-y-4'>
                    {/* Title */}
                    <div>
                      <h3 className='text-lg font-bold text-foreground group-hover:text-brand transition-colors line-clamp-2 font-display'>
                        {subcategory.name}
                      </h3>
                      <p className='text-xs text-muted-foreground font-mono mt-2 break-all opacity-75'>
                        /{subcategory.slug}
                      </p>
                    </div>

                    {/* Description */}
                    {subcategory.description && (
                      <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
                        {subcategory.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Section */}
                  <div className='px-5 py-4 border-t border-border/40 space-y-4'>
                    {/* Metadata */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-3.5 h-3.5 text-muted-foreground' />
                        <span className='text-xs text-muted-foreground'>
                          {formatDate(subcategory.createdAt)}
                        </span>
                      </div>
                      <Badge
                        variant={
                          subcategory.isPublished ? 'default' : 'secondary'
                        }
                        className={
                          subcategory.isPublished
                            ? 'bg-success/15 text-success border-success/20'
                            : 'bg-warning/15 text-warning border-warning/20'
                        }
                      >
                        {subcategory.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-2 pt-2'>
                      <Button
                        onClick={() => handleOpenEditModal(subcategory)}
                        size='sm'
                        variant='ghost'
                        className='flex-1 h-9 text-muted-foreground hover:text-brand hover:bg-brand/10 transition-colors'
                      >
                        <Edit2 className='w-4 h-4 mr-1.5' />
                        <span className='text-xs font-medium'>Edit</span>
                      </Button>
                      <Button
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDelete(subcategory._id)}
                        size='sm'
                        variant='ghost'
                        className='flex-1 h-9 text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors'
                      >
                        <Trash2 className='w-4 h-4 mr-1.5' />
                        <span className='text-xs font-medium'>Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Count */}
            {filteredSubcategories.length > 0 && (
              <div className='text-center pt-4'>
                <p className='text-sm text-muted-foreground'>
                  Showing{' '}
                  <span className='font-semibold text-foreground'>
                    {filteredSubcategories.length}
                  </span>{' '}
                  of{' '}
                  <span className='font-semibold text-foreground'>
                    {subcategories.length}
                  </span>{' '}
                  subcategories
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='w-full max-w-2xl rounded-2xl bg-card border border-border/40 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden'>
            {/* Modal Header */}
            <div className='flex items-center justify-between p-8 border-b border-border/40 flex-shrink-0 bg-gradient-to-r from-brand/10 via-accent/5 to-transparent'>
              <div>
                <h2 className='text-2xl font-bold text-foreground font-display'>
                  {selectedSubcategory
                    ? 'Edit Subcategory'
                    : 'Create New Subcategory'}
                </h2>
                <p className='text-sm text-muted-foreground mt-1'>
                  {selectedSubcategory
                    ? 'Update subcategory details and settings'
                    : 'Add a new subcategory to organize your products'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className='p-2 hover:bg-muted/50 rounded-lg transition-colors flex-shrink-0 -mr-2'
                aria-label='Close'
              >
                <X className='w-5 h-5 text-muted-foreground hover:text-foreground' />
              </button>
            </div>

            {/* Modal Form - Scrollable */}
            <form
              onSubmit={handleSubmit}
              className='flex flex-col overflow-hidden flex-1'
            >
              <div className='overflow-y-auto flex-1 px-8 py-6 space-y-6'>
                {/* Category Selection */}
                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-foreground'>
                    Category <span className='text-danger'>*</span>
                  </label>
                  <select
                    name='category'
                    value={formData.category}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 bg-surface border border-border/40 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-transparent transition-all'
                    required
                  >
                    <option value=''>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-foreground'>
                    Subcategory Name <span className='text-danger'>*</span>
                  </label>
                  <Input
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='e.g., Premium T-Shirts'
                    className='h-11 bg-surface border-border/40 text-sm focus:ring-brand/40'
                    required
                  />
                </div>

                {/* Slug */}
                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-foreground'>
                    URL Slug
                  </label>
                  <div className='flex items-center gap-0'>
                    <div className='px-4 h-11 bg-surface/50 border border-r-0 border-border/40 rounded-l-xl flex items-center'>
                      <span className='text-sm text-muted-foreground'>/</span>
                    </div>
                    <Input
                      name='slug'
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder='auto-generated'
                      className='h-11 bg-surface border-border/40 text-sm rounded-l-none focus:ring-brand/40'
                      readOnly
                    />
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Automatically generated from the name
                  </p>
                </div>

                {/* Description */}
                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-foreground'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder='Provide a brief description of this subcategory...'
                    className='w-full px-4 py-3 bg-surface border border-border/40 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-transparent transition-all resize-none'
                    rows={4}
                  />
                </div>

                {/* Publish Toggle */}
                <div className='flex items-start gap-4 p-4 bg-surface/50 rounded-xl border border-brand/10'>
                  <input
                    type='checkbox'
                    id='isPublished'
                    name='isPublished'
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className='w-5 h-5 rounded border border-border/40 cursor-pointer accent-brand mt-0.5'
                  />
                  <div className='flex-1 min-w-0'>
                    <label
                      htmlFor='isPublished'
                      className='text-sm font-semibold text-foreground cursor-pointer block'
                    >
                      Publish immediately
                    </label>
                    <p className='text-xs text-muted-foreground mt-1'>
                      Make this subcategory visible in your store
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className='flex items-center justify-end gap-3 p-8 border-t border-border/40 flex-shrink-0 bg-surface/30'>
                <Button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  variant='outline'
                  className='border-border/40 h-11 text-sm font-medium'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='bg-brand hover:bg-brand/90 text-brand-foreground h-11 text-sm font-medium shadow-lg shadow-brand/20'
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : selectedSubcategory
                      ? 'Update Subcategory'
                      : 'Create Subcategory'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
