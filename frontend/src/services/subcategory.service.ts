import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import { Subcategory, SubcategoryInput } from '@/types/subcategory';

// ---------------- GET ALL SUBCATEGORIES ----------------
export const getSubcategories = async (): Promise<Subcategory[]> => {
  const res = (await axiosInstance.get<ApiResponse<Subcategory[]>>(
    ApiRoutes.subcategories.list
  )) as unknown as ApiResponse<Subcategory[]>;

  return unwrap(res);
};

// ---------------- GET SUBCATEGORY BY SLUG ----------------
export const getSubcategoryBySlug = async (
  slug: string
): Promise<Subcategory> => {
  const res = (await axiosInstance.get<ApiResponse<Subcategory>>(
    ApiRoutes.subcategories.details(slug)
  )) as unknown as ApiResponse<Subcategory>;

  return unwrap(res);
};

// ---------------- GET SUBCATEGORY BY ID ----------------
export const getSubcategoryById = async (id: string): Promise<Subcategory> => {
  const res = (await axiosInstance.get<ApiResponse<Subcategory>>(
    ApiRoutes.subcategories.byId(id)
  )) as unknown as ApiResponse<Subcategory>;

  return unwrap(res);
};

// ---------------- CREATE SUBCATEGORY (Moderator/Admin) ----------------
export const createSubcategory = async (
  data: SubcategoryInput
): Promise<Subcategory> => {
  const res = (await axiosInstance.post<ApiResponse<Subcategory>>(
    ApiRoutes.subcategories.list,
    data
  )) as unknown as ApiResponse<Subcategory>;

  return unwrap(res);
};

// ---------------- UPDATE SUBCATEGORY (Moderator/Admin) ----------------
export const updateSubcategory = async (
  id: string,
  data: SubcategoryInput
): Promise<Subcategory> => {
  const res = (await axiosInstance.patch<ApiResponse<Subcategory>>(
    ApiRoutes.subcategories.byId(id),
    data
  )) as unknown as ApiResponse<Subcategory>;

  return unwrap(res);
};

// ---------------- DELETE SUBCATEGORY (Moderator/Admin) ----------------
export const deleteSubcategory = async (id: string): Promise<null> => {
  const res = (await axiosInstance.delete<ApiResponse<null>>(
    ApiRoutes.subcategories.byId(id)
  )) as unknown as ApiResponse<null>;

  return unwrap(res);
};

// ---------------- GET SUBCATEGORIES BY CATEGORY ----------------
export const getSubcategoriesByCategory = async (
  categoryId: string
): Promise<Subcategory[]> => {
  const res = (await axiosInstance.get<ApiResponse<Subcategory[]>>(
    ApiRoutes.subcategories.list + `?category=${categoryId}`
  )) as unknown as ApiResponse<Subcategory[]>;
  return unwrap(res);
};
