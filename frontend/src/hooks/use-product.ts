import {
  createProduct,
  deleteProduct,
  getOtherProducts,
  getProductById,
  getProductBySku,
  getProductBySlug,
  getProducts,
  updateProduct,
} from '@/services/product.service';
import {
  CreateProduct,
  Product,
  ProductListPayload,
  ProductQueryParams,
  UpdateProduct,
} from '@/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/* ===============================
   Query Keys
================================= */

const PRODUCT_KEYS = {
  all: ['products'] as const,
  lists: (params?: ProductQueryParams) =>
    [
      ...PRODUCT_KEYS.all,
      'list',
      params ? JSON.stringify(params) : '',
    ] as const,
  detail: (identifier: string) =>
    [...PRODUCT_KEYS.all, 'detail', identifier] as const,
};

/* ===============================
   GET ALL PRODUCTS
================================= */

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery<ProductListPayload, Error>({
    queryKey: PRODUCT_KEYS.lists(params),
    queryFn: () => getProducts(params),
    staleTime: 1000 * 60 * 5, // cache 5 mins
  });
};

/* ===============================
   GET PRODUCT BY SLUG
================================= */

export const useProductBySlug = (slug: string) => {
  return useQuery<Product, Error>({
    queryKey: PRODUCT_KEYS.detail(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
};

/* ===============================
   GET PRODUCT BY SKU
================================= */

export const useProductBySku = (sku: string) => {
  return useQuery<Product, Error>({
    queryKey: PRODUCT_KEYS.detail(sku),
    queryFn: () => getProductBySku(sku),
    enabled: !!sku,
  });
};

/* ===============================
   GET PRODUCT BY ID
================================= */

export const useProductById = (id: string) => {
  return useQuery<Product, Error>({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

/* ===============================
   CREATE PRODUCT (Admin/Moderator)
================================= */

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProduct>({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.all,
      });

      toast.success('Product created successfully');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
};

/* ===============================
   UPDATE PRODUCT
================================= */

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, { id: string; data: UpdateProduct }>({
    mutationFn: ({ id, data }) => updateProduct(id, data),

    onSuccess: (data) => {
      queryClient.setQueryData(PRODUCT_KEYS.detail(data._id), data);

      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.all,
      });

      toast.success('Product updated successfully');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
};

/* ===============================
   DELETE PRODUCT
================================= */

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.all,
      });

      toast.success('Product deleted successfully');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
};

/* ===============================
   GET OTHER PRODUCTS
================================= */
export const useOtherProducts = (slug: string) => {
  return useQuery<Product[], Error>({
    queryKey: [...PRODUCT_KEYS.detail(slug), 'others'],
    queryFn: () => getOtherProducts(slug),
    enabled: !!slug,
  });
};
