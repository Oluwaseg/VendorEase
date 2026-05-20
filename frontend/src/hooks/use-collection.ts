import {
  addProductToCollection,
  createCollection,
  deleteCollection,
  getCollectionById,
  getCollectionBySlug,
  getCollectionProducts,
  getCollections,
  removeProductFromCollection,
  updateCollection,
} from '@/services/collection.service';
import {
  Collection,
  CreateCollectionData,
  UpdateCollectionData,
} from '@/types/collection';
import { Product } from '@/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/* ===============================
   Query Keys
================================= */
const COLLECTION_KEYS = {
  all: ['collections'] as const,
  list: (filters?: { isActive?: boolean; featuredOnHomepage?: boolean }) =>
    [...COLLECTION_KEYS.all, 'list', filters] as const,
  detail: (identifier: string) =>
    [...COLLECTION_KEYS.all, 'detail', identifier] as const,
  products: (id: string) =>
    [...COLLECTION_KEYS.detail(id), 'products'] as const,
};

/* ===============================
   GET ALL COLLECTIONS
================================= */
export const useCollections = (filters?: {
  isActive?: boolean;
  featuredOnHomepage?: boolean;
}) => {
  return useQuery<Collection[], Error>({
    queryKey: COLLECTION_KEYS.list(filters),
    queryFn: () => getCollections(filters),
    staleTime: 1000 * 60 * 5,
  });
};

/* ===============================
   GET COLLECTION BY SLUG
================================= */
export const useCollectionBySlug = (slug: string) => {
  return useQuery<Collection, Error>({
    queryKey: COLLECTION_KEYS.detail(slug),
    queryFn: () => getCollectionBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};

/* ===============================
   GET COLLECTION BY ID
================================= */
export const useCollectionById = (id: string) => {
  return useQuery<Collection, Error>({
    queryKey: COLLECTION_KEYS.detail(id),
    queryFn: () => getCollectionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/* ===============================
   GET COLLECTION PRODUCTS
================================= */
export const useCollectionProducts = (id: string) => {
  return useQuery<Product[], Error>({
    queryKey: COLLECTION_KEYS.products(id),
    queryFn: () => getCollectionProducts(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/* ===============================
   CREATE COLLECTION (Admin/Moderator)
================================= */
export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionData) => createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.all });
      toast.success('Collection created successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to create collection'
      );
    },
  });
};

/* ===============================
   UPDATE COLLECTION (Admin/Moderator)
================================= */
export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectionData }) =>
      updateCollection(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEYS.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.all });
      toast.success('Collection updated successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to update collection'
      );
    },
  });
};

/* ===============================
   DELETE COLLECTION (Admin/Moderator)
================================= */
export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.all });
      toast.success('Collection deleted successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to delete collection'
      );
    },
  });
};

/* ===============================
   ADD PRODUCT TO COLLECTION (Admin/Moderator)
================================= */
export const useAddProductToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      productId,
    }: {
      collectionId: string;
      productId: string;
    }) => addProductToCollection(collectionId, productId),
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEYS.detail(collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEYS.products(collectionId),
      });
      toast.success('Product added to collection');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to add product to collection'
      );
    },
  });
};

/* ===============================
   REMOVE PRODUCT FROM COLLECTION (Admin/Moderator)
================================= */
export const useRemoveProductFromCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      productId,
    }: {
      collectionId: string;
      productId: string;
    }) => removeProductFromCollection(collectionId, productId),
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEYS.detail(collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: COLLECTION_KEYS.products(collectionId),
      });
      toast.success('Product removed from collection');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Failed to remove product from collection'
      );
    },
  });
};
