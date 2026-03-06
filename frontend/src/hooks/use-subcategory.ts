import {
  createSubcategory,
  deleteSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategoryById,
  getSubcategoryBySlug,
  updateSubcategory,
} from '@/services/subcategory.service';
import { Subcategory, SubcategoryInput } from '@/types/subcategory';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/* ===============================
   Query Keys
================================= */
const SUBCATEGORY_KEYS = {
  all: ['subcategories'] as const,
  detail: (identifier: string) =>
    [...SUBCATEGORY_KEYS.all, 'detail', identifier] as const,
  byCategory: (categoryId: string) =>
    ['subcategories', 'category', categoryId] as const,
};

/* ===============================
   GET ALL SUBCATEGORIES
================================= */
export const useSubcategories = () => {
  return useQuery<Subcategory[], Error>({
    queryKey: SUBCATEGORY_KEYS.all,
    queryFn: getSubcategories,
    staleTime: 1000 * 60 * 5,
  });
};

/* ===============================
   GET SUBCATEGORY BY SLUG
================================= */
export const useSubcategoryBySlug = (slug: string) => {
  return useQuery<Subcategory, Error>({
    queryKey: SUBCATEGORY_KEYS.detail(slug),
    queryFn: () => getSubcategoryBySlug(slug),
    enabled: !!slug,
  });
};

/* ===============================
   GET SUBCATEGORY BY ID
================================= */
export const useSubcategoryById = (id: string) => {
  return useQuery<Subcategory, Error>({
    queryKey: SUBCATEGORY_KEYS.detail(id),
    queryFn: () => getSubcategoryById(id),
    enabled: !!id,
  });
};

/* ===============================
   CREATE SUBCATEGORY (Admin/Moderator)
================================= */
export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Subcategory, Error, SubcategoryInput>({
    mutationFn: createSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBCATEGORY_KEYS.all });
      toast.success('Subcategory created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create subcategory');
    },
  });
};

/* ===============================
   UPDATE SUBCATEGORY
================================= */
export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Subcategory,
    Error,
    { id: string; data: SubcategoryInput }
  >({
    mutationFn: ({ id, data }) => updateSubcategory(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(SUBCATEGORY_KEYS.detail(data._id), data);
      queryClient.invalidateQueries({ queryKey: SUBCATEGORY_KEYS.all });
      toast.success('Subcategory updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update subcategory');
    },
  });
};

/* ===============================
   DELETE SUBCATEGORY
================================= */
export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: deleteSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBCATEGORY_KEYS.all });
      toast.success('Subcategory deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete subcategory');
    },
  });
};

export const useSubcategoriesWithCategory = (categoryId: string) => {
  return useQuery<Subcategory[], Error>({
    queryKey: SUBCATEGORY_KEYS.byCategory(categoryId),
    queryFn: () => getSubcategoriesByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
};
