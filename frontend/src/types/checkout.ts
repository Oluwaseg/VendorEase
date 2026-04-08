export interface Address {
  _id: string;
  user: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export interface CheckoutInfo {
  addresses: Address[];
  defaultAddressId: string;
}

type ShippingMethod = 'standard' | 'express' | 'pickup';

interface BaseCheckout {
  shipping: {
    method: ShippingMethod;
  };
  couponCode?: string;
}

// Option 1: Saved address
export interface CheckoutWithAddressId extends BaseCheckout {
  addressId: string;
}

// Option 2: New address
export interface CheckoutWithNewAddress extends BaseCheckout {
  shipping: {
    addressLine: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    method: ShippingMethod;
  };
}

export type CheckoutRequest = CheckoutWithAddressId | CheckoutWithNewAddress;
