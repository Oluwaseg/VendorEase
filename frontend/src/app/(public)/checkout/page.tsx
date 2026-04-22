'use client';

import { AddressAutocomplete } from '@/components/address-autocomplete';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCartContext } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { useCheckout, useCheckoutInfo } from '@/hooks/use-checkout';
import { useInitializePayment } from '@/hooks/use-payment';
import { formatPrice } from '@/lib/format-price';
import { parseLocationToAddress } from '@/lib/locationiq';
import { Address, CheckoutRequest } from '@/types/checkout';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Loader2,
  Lock,
  MapPin,
  Tag,
  Truck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 6000,
    icon: Truck,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 12500,
    icon: Truck,
  },
  {
    id: 'pickup',
    name: 'Store Pickup',
    description: 'Ready in 24 hours',
    price: 0,
    icon: Truck,
  },
];

export default function CheckoutPage() {
  const {
    data: checkoutInfo,
    isLoading: isLoadingCheckoutInfo,
    error: checkoutError,
  } = useCheckoutInfo();
  const { mutateAsync: checkout, isPending: isCheckoutPending } = useCheckout();
  const { mutateAsync: initializePayment, isPending: isPaymentPending } =
    useInitializePayment();

  // Cart and currency context
  const { cartItems } = useCartContext();
  const { currency, convert } = useCurrency();

  const [addressType, setAddressType] = useState<'saved' | 'new'>('saved');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<
    'standard' | 'express' | 'pickup'
  >('standard');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  // Set default address on load
  useEffect(() => {
    if (checkoutInfo?.defaultAddressId) {
      setSelectedAddressId(checkoutInfo.defaultAddressId);
      setAddressType('saved');
    }
  }, [checkoutInfo]);

  const getShippingCost = () => {
    const method = SHIPPING_METHODS.find((m) => m.id === shippingMethod);
    return method?.price || 0;
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmApply = async () => {
    setIsApplyingCoupon(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setCouponApplied(true);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      toast.error('Failed to apply coupon. Please try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleLocationSelect = (location: any) => {
    const addressData = parseLocationToAddress(location);
    setNewAddress({
      addressLine: addressData.addressLine,
      city: addressData.city,
      state: addressData.state,
      country: addressData.country,
      postalCode: addressData.postalCode,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let checkoutData: CheckoutRequest;

      if (addressType === 'saved') {
        if (!selectedAddressId) {
          toast.error('Please select a shipping address');
          return;
        }
        checkoutData = {
          addressId: selectedAddressId,
          shipping: { method: shippingMethod },
          couponCode: couponApplied ? couponCode : undefined,
        };
      } else {
        if (
          !newAddress.addressLine ||
          !newAddress.city ||
          !newAddress.country
        ) {
          toast.error('Please fill in all required address fields');
          return;
        }
        checkoutData = {
          shipping: {
            addressLine: newAddress.addressLine,
            city: newAddress.city,
            state: newAddress.state,
            country: newAddress.country,
            postalCode: newAddress.postalCode,
            method: shippingMethod,
          },
          couponCode: couponApplied ? couponCode : undefined,
        };
      }

      // First, checkout the order
      await checkout(checkoutData);

      // Then initialize payment
      const callbackUrl = `${window.location.origin}/payment-success`;
      const init = await initializePayment({ callbackUrl });

      const authorizationUrl = init?.paystack?.data?.authorization_url;
      if (!authorizationUrl) {
        throw new Error('Paystack authorization URL not returned');
      }

      // Redirect to Paystack payment
      window.location.href = authorizationUrl;
    } catch (error: any) {
      toast.error(error?.message || 'Checkout/payment initialization failed');
    }
  };

  if (isLoadingCheckoutInfo) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 animate-spin mx-auto mb-4 text-primary' />
          <p className='text-foreground/60'>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (checkoutError) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center px-4'>
        <Card className='max-w-md w-full border-destructive/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <AlertCircle className='w-6 h-6 text-destructive' />
              <CardTitle>Error Loading Checkout</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className='text-foreground/60 mb-4'>
              We encountered an error loading your checkout information. Please
              try again later.
            </p>
            <Button className='w-full' onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((total, item) => {
    const price =
      typeof item.price === 'number'
        ? item.price
        : parseFloat(String(item.price));
    return total + price * item.quantity;
  }, 0);

  const shippingCost = getShippingCost();
  const discount = couponApplied ? subtotal * 0.1 : 0; // 10% discount if coupon applied
  const total = subtotal + shippingCost - discount;

  return (
    <>
      {/* Coupon Confirmation Modal - Before Apply */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex items-center justify-center mb-4'>
              <div className='p-3 bg-amber-500/10 rounded-full'>
                <AlertCircle className='w-6 h-6 text-amber-600' />
              </div>
            </div>
            <DialogTitle className='text-center'>
              Apply Coupon Code?
            </DialogTitle>
            <DialogDescription className='text-center'>
              Review the details before applying this coupon.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='bg-primary/5 border border-primary/20 rounded-lg p-4'>
              <p className='text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wider'>
                Coupon Code
              </p>
              <p className='text-lg font-bold text-foreground font-mono tracking-wider'>
                {couponCode.toUpperCase()}
              </p>
            </div>
            <div className='bg-amber-500/10 border border-amber-500/30 rounded-lg p-4'>
              <div className='flex gap-3'>
                <AlertCircle className='w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='font-semibold text-amber-900 mb-1 text-sm'>
                    One-Time Use Only
                  </p>
                  <p className='text-xs text-amber-800 leading-relaxed'>
                    Once applied and your purchase is complete, this coupon code
                    will become invalid and cannot be reused. Please confirm you
                    want to proceed.
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-4'>
              <p className='text-xs font-semibold text-foreground/60 mb-2 uppercase tracking-wider'>
                Your Discount
              </p>
              <p className='text-xl font-bold text-green-600'>10% Off</p>
              <p className='text-xs text-foreground/60 mt-1'>
                Estimated savings:{' '}
                {formatPrice(convert(subtotal * 0.1), currency)}
              </p>
            </div>
          </div>
          <DialogFooter className='gap-3 sm:gap-2'>
            <Button
              onClick={handleCancelConfirm}
              variant='outline'
              className='flex-1'
              disabled={isApplyingCoupon}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmApply}
              className='flex-1 bg-primary hover:bg-primary/90'
              disabled={isApplyingCoupon}
            >
              {isApplyingCoupon ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Applying...
                </>
              ) : (
                <>
                  <Check className='w-4 h-4 mr-2' />
                  Apply Coupon
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coupon Success Modal - After Apply */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex items-center justify-center mb-4'>
              <div className='p-3 bg-green-500/10 rounded-full'>
                <Check className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <DialogTitle className='text-center'>Coupon Applied!</DialogTitle>
            <DialogDescription className='text-center'>
              Your coupon code &quot;{couponCode}&quot; has been successfully
              applied.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
              <p className='text-sm font-semibold text-destructive mb-2'>
                Important: One-Time Use
              </p>
              <p className='text-sm text-foreground/70'>
                This code will become invalid after you complete this purchase.
                It cannot be reused on future orders.
              </p>
            </div>
            <div className='bg-primary/5 border border-primary/20 rounded-lg p-4'>
              <p className='text-sm font-semibold text-foreground mb-2'>
                Your Discount
              </p>
              <p className='text-lg font-bold text-primary'>
                10% off your order
              </p>
              <p className='text-xs text-foreground/60 mt-1'>
                Savings: {formatPrice(convert(discount), currency)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseSuccessModal} className='w-full'>
              Continue Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className='min-h-screen bg-gradient-to-b from-background to-background/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          {/* Header */}
          <div className='mb-12'>
            <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-3'>
              Checkout
            </h1>
            <p className='text-lg text-foreground/60'>
              Secure payment • Free returns • Money-back guarantee
            </p>
          </div>

          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Main Form */}
            <div className='lg:col-span-2 space-y-6'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Shipping Address Section */}
                <Card>
                  <CardHeader>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-primary/10 rounded-lg'>
                        <MapPin className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <CardTitle>Shipping Address</CardTitle>
                        <CardDescription>
                          Where should we deliver your order?
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* Address Type Tabs */}
                    <div className='flex gap-4 border-b'>
                      <button
                        type='button'
                        onClick={() => setAddressType('saved')}
                        className={`pb-3 px-4 font-medium transition-colors ${
                          addressType === 'saved'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-foreground/60 hover:text-foreground'
                        }`}
                      >
                        Saved Addresses
                      </button>
                      <button
                        type='button'
                        onClick={() => setAddressType('new')}
                        className={`pb-3 px-4 font-medium transition-colors ${
                          addressType === 'new'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-foreground/60 hover:text-foreground'
                        }`}
                      >
                        New Address
                      </button>
                    </div>

                    {addressType === 'saved' ? (
                      <div className='space-y-3'>
                        {checkoutInfo?.addresses &&
                        checkoutInfo.addresses.length > 0 ? (
                          checkoutInfo.addresses.map((address: Address) => (
                            <label
                              key={address._id}
                              className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedAddressId === address._id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <input
                                type='radio'
                                name='address'
                                value={address._id}
                                checked={selectedAddressId === address._id}
                                onChange={(e) =>
                                  setSelectedAddressId(e.target.value)
                                }
                                className='w-5 h-5 mt-1 accent-primary'
                              />
                              <div className='flex-1'>
                                <p className='font-semibold text-foreground'>
                                  {address.addressLine}
                                </p>
                                <p className='text-sm text-foreground/60'>
                                  {address.city}, {address.state}{' '}
                                  {address.postalCode}
                                </p>
                                <p className='text-sm text-foreground/60'>
                                  {address.country}
                                </p>
                                {address.isDefault && (
                                  <span className='inline-block mt-2 px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded'>
                                    Default
                                  </span>
                                )}
                              </div>
                            </label>
                          ))
                        ) : (
                          <p className='text-center py-4 text-foreground/60'>
                            No saved addresses found. Add a new address below.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        <AddressAutocomplete
                          value={newAddress.addressLine}
                          onChange={(value) =>
                            setNewAddress({
                              ...newAddress,
                              addressLine: value,
                            })
                          }
                          onLocationSelect={handleLocationSelect}
                          placeholder='e.g., 123 Main Street, New York'
                          label='Street Address'
                        />

                        <div className='grid sm:grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-semibold text-foreground mb-2'>
                              City *
                            </label>
                            <input
                              type='text'
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  city: e.target.value,
                                })
                              }
                              placeholder='New York'
                              className='w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                              required
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-semibold text-foreground mb-2'>
                              State/Province
                            </label>
                            <input
                              type='text'
                              value={newAddress.state}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  state: e.target.value,
                                })
                              }
                              placeholder='NY'
                              className='w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                            />
                          </div>
                        </div>

                        <div className='grid sm:grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-semibold text-foreground mb-2'>
                              Postal Code
                            </label>
                            <input
                              type='text'
                              value={newAddress.postalCode}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  postalCode: e.target.value,
                                })
                              }
                              placeholder='10001'
                              className='w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-semibold text-foreground mb-2'>
                              Country *
                            </label>
                            <input
                              type='text'
                              value={newAddress.country}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  country: e.target.value,
                                })
                              }
                              placeholder='United States'
                              className='w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Shipping Method Section */}
                <Card>
                  <CardHeader>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-primary/10 rounded-lg'>
                        <Truck className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <CardTitle>Shipping Method</CardTitle>
                        <CardDescription>
                          Choose your preferred delivery speed
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    {SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          shippingMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type='radio'
                          name='shipping'
                          value={method.id}
                          checked={shippingMethod === method.id}
                          onChange={(e) =>
                            setShippingMethod(e.target.value as any)
                          }
                          className='w-5 h-5 accent-primary'
                        />
                        <div className='flex-1'>
                          <p className='font-semibold text-foreground'>
                            {method.name}
                          </p>
                          <p className='text-sm text-foreground/60'>
                            {method.description}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-bold text-foreground'>
                            {method.price === 0
                              ? 'FREE'
                              : formatPrice(convert(method.price), currency)}
                          </p>
                        </div>
                      </label>
                    ))}
                  </CardContent>
                </Card>
                <Card className='mt-6 border-dashed'>
                  <CardContent className='py-4 text-center text-sm text-foreground/60'>
                    🚚 More delivery options (GIG, DHL, FedEx, UPS) coming soon.
                  </CardContent>
                </Card>
                {/* Coupon Section */}
                <Card>
                  <CardHeader>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-primary/10 rounded-lg'>
                        <Tag className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <CardTitle>Promo Code</CardTitle>
                        <CardDescription>Have a discount code?</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='flex gap-3'>
                      <input
                        type='text'
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder='Enter coupon code'
                        disabled={couponApplied}
                        className='flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-foreground/5'
                      />
                      <Button
                        type='button'
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || !couponCode.trim()}
                        variant='outline'
                        className='whitespace-nowrap'
                      >
                        {couponApplied ? (
                          <>
                            <Check className='w-4 h-4 mr-2' />
                            Applied
                          </>
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                  type='submit'
                  disabled={isCheckoutPending || isPaymentPending}
                  size='lg'
                  className='w-full'
                >
                  {isCheckoutPending || isPaymentPending ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      {isPaymentPending
                        ? 'Redirecting to payment...'
                        : 'Processing...'}
                    </>
                  ) : (
                    <>
                      Complete Purchase
                      <ArrowRight className='w-4 h-4 ml-2' />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className='lg:col-span-1'>
              <div className='sticky top-20 space-y-6'>
                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className='text-2xl'>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* Cart Items Preview */}
                    <div className='space-y-2 pb-4 border-b max-h-48 overflow-y-auto'>
                      {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                          <div
                            key={item.id}
                            className='flex justify-between text-sm text-foreground/70'
                          >
                            <span>
                              {item.name}{' '}
                              <span className='text-xs'>x{item.quantity}</span>
                            </span>
                            <span className='font-medium'>
                              {formatPrice(
                                convert(
                                  (typeof item.price === 'number'
                                    ? item.price
                                    : parseFloat(String(item.price))) *
                                    item.quantity
                                ),
                                currency
                              )}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className='text-center text-foreground/60 py-4'>
                          Your cart is empty
                        </p>
                      )}
                    </div>

                    <div className='space-y-3 pb-4 border-b'>
                      <div className='flex justify-between text-foreground/70'>
                        <span>Subtotal</span>
                        <span className='font-semibold'>
                          {formatPrice(convert(subtotal), currency)}
                        </span>
                      </div>
                      <div className='flex justify-between text-foreground/70'>
                        <span>Shipping</span>
                        <span className='font-semibold'>
                          {shippingCost === 0
                            ? 'FREE'
                            : formatPrice(convert(shippingCost), currency)}
                        </span>
                      </div>
                      {couponApplied && (
                        <div className='flex justify-between text-green-600'>
                          <span className='font-semibold'>Discount (10%)</span>
                          <span className='font-bold'>
                            -{formatPrice(convert(discount), currency)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className='pt-4'>
                      <div className='flex justify-between items-center'>
                        <span className='text-lg font-bold text-foreground'>
                          Total
                        </span>
                        <span className='text-3xl font-bold text-primary'>
                          {formatPrice(convert(total), currency)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <Card>
                  <CardContent className='pt-6 space-y-3'>
                    <div className='flex items-center gap-3 text-sm'>
                      <Lock className='w-5 h-5 text-green-600 flex-shrink-0' />
                      <span className='text-foreground/70'>
                        Secure SSL encrypted payment
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-sm'>
                      <Check className='w-5 h-5 text-green-600 flex-shrink-0' />
                      <span className='text-foreground/70'>
                        30-day money back guarantee
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-sm'>
                      <Check className='w-5 h-5 text-green-600 flex-shrink-0' />
                      <span className='text-foreground/70'>
                        Free returns on all orders
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
