import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { checkout, getCheckoutInfo } from '@/services/checkout.service';
import { CheckoutRequest } from '@/types/checkout';
import { Order } from '@/types/order';

/* ===============================
   CHECKOUT
================================= */

/* GET CHECKOUT INFO */
export const useCheckoutInfo = () => {
  return useQuery({
    queryKey: ['checkout-info'],
    queryFn: getCheckoutInfo,
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CheckoutRequest>({
    mutationFn: checkout,

    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      toast.success('Checkout completed successfully 🧾');
    },

    onError: (error) => {
      toast.error(error.message || 'Checkout failed');
    },
  });
};
