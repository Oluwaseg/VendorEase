import mongoose from 'mongoose';
import { Cart } from '../models/Cart';
import { Coupon } from '../models/Coupon';
import { IShippingInfo, Order } from '../models/Order';

export interface CheckoutPayload {
  shipping: Pick<
    IShippingInfo,
    'addressLine' | 'city' | 'state' | 'country' | 'postalCode' | 'method'
  >;
  couponCode?: string;
}

class CheckoutService {
  /**
   * Computes shipping fee in Naira (₦):
   * - pickup: ₦0 (free)
   * - standard: ₦6000
   * - express: ₦12500
   * The fee is the same for all states.
   */
  private computeShippingFee(shipping: CheckoutPayload['shipping']): number {
    if (shipping.method === 'pickup') return 0;
    if (shipping.method === 'express') return 12500;
    if (shipping.method === 'standard') return 6000;
    return 0;
  }

  async checkout(userId: string, payload: CheckoutPayload) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const cart = await Cart.findOne({ user: userObjectId }).populate(
      'items.product'
    );
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const subtotal = cart.total;
    if (subtotal <= 0) {
      throw new Error('Cart total must be greater than zero');
    }

    let appliedCoupon: any = null;
    let discount = 0;

    if (payload.couponCode) {
      const code = payload.couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({
        code,
        issuedTo: userObjectId,
        isActive: true,
      });

      if (!coupon) {
        throw new Error('Invalid or inactive coupon');
      }

      if (!(coupon as any).isUsable || !(coupon as any).isUsable()) {
        throw new Error('Coupon is no longer usable');
      }

      discount = (subtotal * coupon.discountPercent) / 100;
      if (discount < 0) discount = 0;

      appliedCoupon = coupon;
    }

    const shippingFee = this.computeShippingFee(payload.shipping);
    const total = Math.max(0, subtotal - discount + shippingFee);

    const orderItems = cart.items.map((item) => ({
      product: item.product as any,
      name: (item as any).product?.name ?? '',
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: userObjectId,
      items: orderItems,
      subtotal,
      discount,
      shippingFee,
      total,
      coupon: appliedCoupon ? appliedCoupon._id : undefined,
      paymentStatus: 'payment_pending',
      shippingStatus: 'processing',
      shipping: payload.shipping,
    });

    // Mark coupon used (single-use semantics enforced by maxUses/usedCount)
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      if (appliedCoupon.usedCount >= appliedCoupon.maxUses) {
        appliedCoupon.isActive = false;
      }
      await appliedCoupon.save();
    }

    // Clear cart after successful order creation
    cart.items = [];
    cart.total = 0;
    await cart.save();

    return order;
  }
}

export default new CheckoutService();
