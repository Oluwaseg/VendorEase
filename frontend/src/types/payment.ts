import { Order } from '@/types/order';

export interface InitializePaymentRequest {
  orderId?: string;
  callbackUrl?: string;
}

export interface PaystackInitializeData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: PaystackInitializeData;
}

export interface InitializePaymentResponse {
  paystack: PaystackInitializeResponse;
  order: Order;
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at?: string | null;
    created_at?: string | null;
    gateway_response?: string | null;
    customer?: {
      email?: string;
    };
    metadata?: Record<string, unknown>;
  };
}
