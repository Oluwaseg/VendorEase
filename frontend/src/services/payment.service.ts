import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import {
  InitializePaymentRequest,
  InitializePaymentResponse,
  PaystackVerifyResponse,
} from '@/types/payment';

// ---------------- PAYMENT ----------------
export const initializePayment = async (
  data: InitializePaymentRequest
): Promise<InitializePaymentResponse> => {
  const res = (await axiosInstance.post<ApiResponse<InitializePaymentResponse>>(
    ApiRoutes.payment.initialize,
    data
  )) as unknown as ApiResponse<InitializePaymentResponse>;

  return unwrap(res);
};

export const verifyPayment = async (
  reference: string
): Promise<PaystackVerifyResponse> => {
  const res = (await axiosInstance.get<ApiResponse<PaystackVerifyResponse>>(
    ApiRoutes.payment.verify,
    { params: { reference } }
  )) as unknown as ApiResponse<PaystackVerifyResponse>;

  return unwrap(res);
};
