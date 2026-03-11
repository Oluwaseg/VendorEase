import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  AdminOrder,
  getAllOrdersAdmin,
  getMyOrderById,
  getMyOrders,
  getOrderByIdAdmin,
  updateOrderStatusAdmin,
} from "@/services/order.service";
import { Order } from "@/types/order";

/* ===============================
   USER ORDERS
================================= */

export const useMyOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: getMyOrders,
  });
};

export const useMyOrder = (id?: string) => {
  return useQuery<Order, Error>({
    queryKey: ["orders", id],
    queryFn: () => getMyOrderById(id as string),
    enabled: Boolean(id),
  });
};

/* ===============================
   ADMIN ORDERS
================================= */

export const useAdminOrders = () => {
  return useQuery<AdminOrder[], Error>({
    queryKey: ["admin", "orders"],
    queryFn: getAllOrdersAdmin,
  });
};

export const useAdminOrder = (id?: string) => {
  return useQuery<AdminOrder, Error>({
    queryKey: ["admin", "orders", id],
    queryFn: () => getOrderByIdAdmin(id as string),
    enabled: Boolean(id),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AdminOrder,
    Error,
    {
      id: string;
      status: string;
    }
  >({
    mutationFn: updateOrderStatusAdmin,
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order status");
    },
  });
};

