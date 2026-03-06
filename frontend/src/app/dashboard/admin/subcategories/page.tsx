'use client';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
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
import {
  Calendar,
  Edit2,
  FolderOpen,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react';
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
      category: subcategory.category,
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

    if (selectedSubcategory) {
      // Update
      updateMutation.mutate(
        {
          id: selectedSubcategory._id,
          data: formData,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        }
      );
    } else {
      // Create
      createMutation.mutate(formData, {
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

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat._id === categoryId)?.name || 'Unknown';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-background/80'>
      <Navbar />
      {/* Header Section */}
      <div className='sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60'>
        <div className='max-w-7xl mx-auto px-6 py-6'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-col gap-1'>
              <h1 className='text-3xl font-bold tracking-tight text-foreground'>
                Subcategories
              </h1>
              <p className='text-sm text-muted-foreground'>
                Manage your product subcategories
              </p>
            </div>

            <Button
              onClick={handleOpenCreateModal}
              className='bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-fit'
              size='lg'
            >
              <Plus className='w-4 h-4' />
              Create Subcategory
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Search Bar */}
        <div className='mb-8'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              placeholder='Search subcategories...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 h-11 bg-card border-border/50 text-foreground placeholder:text-muted-foreground'
            />
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          // Loading State
          <div className='space-y-4'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-24 bg-card border border-border/40 rounded-xl animate-pulse'
              />
            ))}
          </div>
        ) : filteredSubcategories.length === 0 ? (
          // Empty State
          <div className='flex flex-col items-center justify-center min-h-96 rounded-2xl border border-dashed border-border/60 bg-card/50 backdrop-blur-sm'>
            <FolderOpen className='w-16 h-16 text-muted-foreground/40 mb-4' />
            <h3 className='text-lg font-semibold text-foreground mb-1'>
              {searchQuery ? 'No results found' : 'No subcategories yet'}
            </h3>
            <p className='text-sm text-muted-foreground text-center max-w-xs'>
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first subcategory to get started'}
            </p>
            {!searchQuery && (
              <Button
                onClick={handleOpenCreateModal}
                className='mt-6 gap-2'
                variant='default'
              >
                <Plus className='w-4 h-4' />
                Create Subcategory
              </Button>
            )}
          </div>
        ) : (
          // Grid of Subcategories
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {filteredSubcategories.map((subcategory) => (
              <div
                key={subcategory._id}
                className='group relative h-full bg-card border border-border/40 rounded-xl p-5 hover:border-border/80 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm flex flex-col'
              >
                {/* Top Section */}
                <div className='mb-4 flex-1'>
                  {/* Category Badge */}
                  <div className='mb-3'>
                    <Badge
                      variant='secondary'
                      className='bg-accent/10 text-accent hover:bg-accent/15'
                    >
                      {getCategoryName(subcategory.category)}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className='text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2'>
                    {subcategory.name}
                  </h3>

                  {/* Slug */}
                  <p className='text-xs text-muted-foreground font-mono mb-3 break-all'>
                    {subcategory.slug}
                  </p>

                  {/* Description */}
                  {subcategory.description && (
                    <p className='text-sm text-muted-foreground line-clamp-2 mb-4'>
                      {subcategory.description}
                    </p>
                  )}
                </div>

                {/* Footer Section */}
                <div className='flex items-center justify-between pt-4 border-t border-border/40'>
                  <div className='flex items-center gap-3'>
                    {/* Published Badge */}
                    <Badge
                      variant={
                        subcategory.isPublished ? 'default' : 'secondary'
                      }
                      className={
                        subcategory.isPublished
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                      }
                    >
                      {subcategory.isPublished ? 'Published' : 'Draft'}
                    </Badge>

                    {/* Date */}
                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                      <Calendar className='w-3 h-3' />
                      {formatDate(subcategory.createdAt)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-2'>
                    <Button
                      onClick={() => handleOpenEditModal(subcategory)}
                      size='sm'
                      variant='ghost'
                      className='text-muted-foreground hover:text-foreground hover:bg-accent/10'
                    >
                      <Edit2 className='w-4 h-4' />
                      <span className='sr-only'>Edit</span>
                    </Button>
                    <Button
                      onClick={() => handleDelete(subcategory._id)}
                      size='sm'
                      variant='ghost'
                      className='text-destructive/70 hover:text-destructive hover:bg-destructive/10'
                    >
                      <Trash2 className='w-4 h-4' />
                      <span className='sr-only'>Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Count */}
        {!isLoading && filteredSubcategories.length > 0 && (
          <div className='mt-8 text-center text-sm text-muted-foreground'>
            Showing {filteredSubcategories.length} of {subcategories.length}{' '}
            subcategories
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl bg-card border border-border/40 shadow-xl flex flex-col max-h-[90vh]'>
            {/* Modal Header */}
            <div className='flex items-center justify-between p-6 border-b border-border/40 flex-shrink-0'>
              <div>
                <h2 className='text-xl font-bold text-foreground'>
                  {selectedSubcategory
                    ? 'Edit Subcategory'
                    : 'Create Subcategory'}
                </h2>
                <p className='text-xs text-muted-foreground mt-1'>
                  {selectedSubcategory
                    ? 'Update subcategory details'
                    : 'Add a new subcategory to your store'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className='p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0'
                aria-label='Close'
              >
                <X className='w-5 h-5 text-muted-foreground' />
              </button>
            </div>

            {/* Modal Form - Scrollable */}
            <form
              onSubmit={handleSubmit}
              className='flex flex-col overflow-hidden flex-1'
            >
              <div className='overflow-y-auto flex-1 px-6 py-5 space-y-4'>
                {/* Category Selection */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>
                    Category *
                  </label>
                  <select
                    name='category'
                    value={formData.category}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 bg-muted border border-border/40 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all'
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
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>
                    Subcategory Name *
                  </label>
                  <Input
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='e.g., T-Shirts, Running Shoes'
                    className='h-9 bg-muted border-border/40 text-sm'
                    required
                  />
                </div>

                {/* Slug */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>
                    URL Slug
                  </label>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-muted-foreground'>/</span>
                    <Input
                      name='slug'
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder='auto-generated'
                      className='h-9 bg-muted border-border/40 text-sm flex-1'
                      readOnly
                    />
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Auto-generated from the name
                  </p>
                </div>

                {/* Description */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder='Brief description of this subcategory'
                    className='w-full px-3 py-2 bg-muted border border-border/40 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all resize-none'
                    rows={3}
                  />
                </div>

                {/* Publish Toggle */}
                <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border/40'>
                  <input
                    type='checkbox'
                    id='isPublished'
                    name='isPublished'
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className='w-4 h-4 rounded border border-border/40 cursor-pointer accent-primary'
                  />
                  <div className='flex-1 min-w-0'>
                    <label
                      htmlFor='isPublished'
                      className='text-sm font-medium text-foreground cursor-pointer block'
                    >
                      Publish immediately
                    </label>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Make this subcategory visible
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className='flex items-center justify-end gap-3 p-6 border-t border-border/40 flex-shrink-0 bg-card'>
                <Button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  variant='outline'
                  className='border-border/40 h-9 text-sm'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-sm'
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : selectedSubcategory
                      ? 'Update'
                      : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
