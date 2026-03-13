import { User } from './user';

export interface OrderStats {
  totalOrders: number;
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
}

export interface OrdersWithStats {
  orders: Order[];
  stats: OrderStats;
}
export type PaymentStatus =
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'cancelled'
  | 'refunded';

export type ShippingStatus =
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type ShippingMethod = 'standard' | 'express' | 'pickup';

export interface OrderItem {
  product: string; // product ID (or populated object if you later allow it)
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingInfo {
  addressLine: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  method: ShippingMethod;
}

export interface Order {
  _id: string;
  user: string;

  items: OrderItem[];

  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;

  coupon?: string;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;

  shipping: ShippingInfo;

  createdAt: string;
  updatedAt: string;
}

// -------- Admin orders --------

export interface AdminOrder extends Omit<Order, 'user'> {
  user: User;
}
export interface AdminOrdersWithStats {
  orders: AdminOrder[];
  stats: OrderStats;
}
