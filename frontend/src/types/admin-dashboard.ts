import { ApiResponse } from './api-response';
import { AdminOrder } from './order';
import { Product } from './product';
import { User } from './user';

/**
 * Dashboard order stats (different from OrderStats)
 */
export interface DashboardOrderStats {
  totalOrders: number;
  totalSales: number;
}

/**
 * Best seller product (subset of Product)
 */
export type BestSellerProduct = Pick<
  Product,
  '_id' | 'name' | 'basePrice' | 'stock' | 'averageRating' | 'ratingCount'
>;

/**
 * Top category stat
 */
export interface TopCategory {
  name: string;
  count: number;
}

/**
 * Recent order (subset of AdminOrder)
 */
export type RecentOrder = Pick<
  AdminOrder,
  '_id' | 'user' | 'total' | 'paymentStatus' | 'shippingStatus' | 'createdAt'
>;

/**
 * Recent user (subset of User)
 */
export type RecentUser = Pick<User, '_id' | 'name' | 'email' | 'createdAt'>;

/**
 * Dashboard payload
 */
export interface AdminDashboardPayload {
  userCount: number;
  productCount: number;
  categoryCount: number;

  orderStats: DashboardOrderStats;

  reviewCount: number;

  bestSellers: BestSellerProduct[];
  topCategories: TopCategory[];

  recentOrders: RecentOrder[];
  recentUsers: RecentUser[];
}

/**
 * API response
 */
export type AdminDashboardResponse = ApiResponse<AdminDashboardPayload>;
