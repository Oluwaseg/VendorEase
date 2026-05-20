import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import {
  Collection,
  CreateCollectionData,
  UpdateCollectionData,
} from '@/types/collection';
import { Product } from '@/types/product';

// -------------------- GET ALL COLLECTIONS --------------------
export const getCollections = async (filters?: {
  isActive?: boolean;
  featuredOnHomepage?: boolean;
}): Promise<Collection[]> => {
  const params = new URLSearchParams();
  if (filters?.isActive !== undefined) {
    params.append('isActive', String(filters.isActive));
  }
  if (filters?.featuredOnHomepage !== undefined) {
    params.append('featuredOnHomepage', String(filters.featuredOnHomepage));
  }

  const url = params.toString()
    ? `${ApiRoutes.collections.list}?${params.toString()}`
    : ApiRoutes.collections.list;

  const res = (await axiosInstance.get<ApiResponse<Collection[]>>(
    url
  )) as unknown as ApiResponse<Collection[]>;

  return unwrap(res);
};

// -------------------- GET COLLECTION BY SLUG --------------------
export const getCollectionBySlug = async (
  slug: string
): Promise<Collection> => {
  const res = (await axiosInstance.get<ApiResponse<Collection>>(
    ApiRoutes.collections.details(slug)
  )) as unknown as ApiResponse<Collection>;

  return unwrap(res);
};

// -------------------- GET COLLECTION BY ID --------------------
export const getCollectionById = async (id: string): Promise<Collection> => {
  const res = (await axiosInstance.get<ApiResponse<Collection>>(
    ApiRoutes.collections.byId(id)
  )) as unknown as ApiResponse<Collection>;

  return unwrap(res);
};

// -------------------- GET COLLECTION PRODUCTS --------------------
export const getCollectionProducts = async (id: string): Promise<Product[]> => {
  const res = (await axiosInstance.get<ApiResponse<Product[]>>(
    ApiRoutes.collections.products(id)
  )) as unknown as ApiResponse<Product[]>;

  return unwrap(res);
};

// -------------------- CREATE COLLECTION (Moderator/Admin) --------------------
export const createCollection = async (
  data: CreateCollectionData
): Promise<Collection> => {
  const res = (await axiosInstance.post<ApiResponse<Collection>>(
    ApiRoutes.collections.list,
    data
  )) as unknown as ApiResponse<Collection>;

  return unwrap(res);
};

// -------------------- UPDATE COLLECTION (Moderator/Admin) --------------------
export const updateCollection = async (
  id: string,
  data: UpdateCollectionData
): Promise<Collection> => {
  const res = (await axiosInstance.patch<ApiResponse<Collection>>(
    ApiRoutes.collections.byId(id),
    data
  )) as unknown as ApiResponse<Collection>;

  return unwrap(res);
};

// -------------------- DELETE COLLECTION (Moderator/Admin) --------------------
export const deleteCollection = async (id: string): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.collections.byId(id));
};

// -------------------- ADD PRODUCT TO COLLECTION (Admin/Moderator) --------------------
export const addProductToCollection = async (
  collectionId: string,
  productId: string
): Promise<Collection> => {
  const res = (await axiosInstance.post<ApiResponse<Collection>>(
    ApiRoutes.collections.products(collectionId),
    { productId }
  )) as unknown as ApiResponse<Collection>;

  return unwrap(res);
};

// -------------------- REMOVE PRODUCT FROM COLLECTION (Admin/Moderator) --------------------
export const removeProductFromCollection = async (
  collectionId: string,
  productId: string
): Promise<Collection> => {
  const res = (await axiosInstance.delete<ApiResponse<Collection>>(
    ApiRoutes.collections.products(collectionId),
    { data: { productId } }
  )) as unknown as ApiResponse<Collection>;

  return unwrap(res);
};
