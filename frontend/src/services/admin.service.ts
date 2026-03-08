import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import { User } from '@/types/user';

// ---------------- GET ALL USERS ----------------
export const getAllUsers = async (): Promise<User[]> => {
  const res = (await axiosInstance.get<ApiResponse<User[]>>(
    ApiRoutes.admin.users
  )) as unknown as ApiResponse<User[]>;
  return unwrap(res);
};
