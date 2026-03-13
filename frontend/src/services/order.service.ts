import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import {
  AdminOrder,
  AdminOrdersWithStats,
  Order,
  OrdersWithStats,
  ShippingStatus,
} from '@/types/order';

// -------- User orders --------

export const getMyOrders = async (): Promise<OrdersWithStats> => {
  const res = (await axiosInstance.get<ApiResponse<OrdersWithStats>>(
    ApiRoutes.orders.list
  )) as unknown as ApiResponse<OrdersWithStats>;
  return unwrap(res);
};

export const getMyOrderById = async (id: string): Promise<Order> => {
  const res = (await axiosInstance.get<ApiResponse<Order>>(
    ApiRoutes.orders.details(id)
  )) as unknown as ApiResponse<Order>;

  return unwrap(res);
};

export const getAllOrdersAdmin = async (): Promise<AdminOrdersWithStats> => {
  const res = (await axiosInstance.get<ApiResponse<AdminOrdersWithStats>>(
    ApiRoutes.admin.orders
  )) as unknown as ApiResponse<AdminOrdersWithStats>;
  return unwrap(res);
};

export const getOrderByIdAdmin = async (id: string): Promise<AdminOrder> => {
  const res = (await axiosInstance.get<ApiResponse<AdminOrder>>(
    ApiRoutes.admin.orderDetails(id)
  )) as unknown as ApiResponse<AdminOrder>;

  return unwrap(res);
};

export const updateOrderStatusAdmin = async (params: {
  id: string;
  status: ShippingStatus;
}): Promise<AdminOrder> => {
  const res = (await axiosInstance.patch<ApiResponse<AdminOrder>>(
    ApiRoutes.admin.updateOrderStatus(params.id),
    { status: params.status }
  )) as unknown as ApiResponse<AdminOrder>;

  return unwrap(res);
};
