import { getAllUsers } from '@/services/admin.service';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

// ---------------- GET ALL USERS (ADMIN) ----------------
export const useGetAllUsers = () => {
  return useQuery<User[]>({
    queryKey: ['allUsers'],
    queryFn: getAllUsers,
  });
};
