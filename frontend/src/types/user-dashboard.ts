import { ApiResponse } from './api-response';
import { Order } from './order';
import { Product } from './product';

// ---------------- ORDER STATS ----------------
export interface UserOrderStats {
  totalOrders: number;
  totalSpent: number;
}

// ---------------- CART STATS ----------------
export interface CartStats {
  itemCount: number;
  total: number;
}

// ---------------- RECENT ORDER ----------------
export type RecentUserOrder = Pick<
  Order,
  '_id' | 'total' | 'paymentStatus' | 'shippingStatus' | 'createdAt'
>;

// ---------------- RECENT REVIEW ----------------
export interface RecentReview {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;

  product: Pick<Product, '_id' | 'name'>;
}

// ---------------- DASHBOARD PAYLOAD ----------------
export interface UserDashboardPayload {
  orderStats: UserOrderStats;

  reviewCount: number;

  cartStats: CartStats;

  recentOrders: RecentUserOrder[];

  recentReviews: RecentReview[];
}

// ---------------- API RESPONSE ----------------
export type UserDashboardResponse = ApiResponse<UserDashboardPayload>;
