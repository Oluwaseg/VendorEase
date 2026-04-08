import { NextFunction, Request, Response } from 'express';
import checkoutService from '../services/checkout.service';

import { UserAddress } from '../models/UserAddress';

class CheckoutController {
  // GET /checkout - return user addresses and default address
  async getCheckoutInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );
      }

      // Find all addresses for the user
      const addresses = await UserAddress.find({ user: user.userId }).lean();
      let defaultAddressId = null;
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        defaultAddressId = defaultAddress._id;
      }

      return (res as any).success(
        { addresses, defaultAddressId },
        'Checkout info loaded',
        null,
        200
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to load checkout info',
        'CHECKOUT_INFO_ERROR',
        400
      );
    }
  }
  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );
      }

      const { addressId, shipping, couponCode } = req.body || {};
      let shippingInfo = shipping;

      if (addressId) {
        // Use saved address
        const address =
          await require('../models/UserAddress').UserAddress.findById(
            addressId
          );
        if (!address || String(address.user) !== String(user.userId)) {
          return (res as any).error(
            'Address not found or not yours',
            'ADDRESS_NOT_FOUND',
            404
          );
        }
        if (!shipping || !shipping.method) {
          return (res as any).error(
            'Shipping method required with addressId',
            'CHECKOUT_VALIDATION_ERROR',
            400
          );
        }
        shippingInfo = {
          addressLine: address.addressLine,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postalCode,
          method: shipping.method,
        };
      }

      if (!shippingInfo) {
        return (res as any).error(
          'Shipping information is required',
          'CHECKOUT_VALIDATION_ERROR',
          400
        );
      }

      const { addressLine, city, country, method } = shippingInfo;
      if (!addressLine || !city || !country || !method) {
        return (res as any).error(
          'Missing required shipping fields',
          'CHECKOUT_VALIDATION_ERROR',
          400
        );
      }

      const allowedMethods = ['standard', 'express', 'pickup'];
      if (!allowedMethods.includes(method)) {
        return (res as any).error(
          'Invalid shipping method',
          'CHECKOUT_VALIDATION_ERROR',
          400
        );
      }

      const order = await checkoutService.checkout(user.userId, {
        shipping: shippingInfo,
        couponCode,
      });

      // Auto-save new address if not using addressId
      if (!addressId && shippingInfo) {
        const { UserAddress } = require('../models/UserAddress');
        const exists = await UserAddress.findOne({
          user: user.userId,
          addressLine: shippingInfo.addressLine,
          city: shippingInfo.city,
          country: shippingInfo.country,
          postalCode: shippingInfo.postalCode,
        });
        if (!exists) {
          // If this is the user's first address, set as default
          const count = await UserAddress.countDocuments({ user: user.userId });
          await UserAddress.create({
            user: user.userId,
            addressLine: shippingInfo.addressLine,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            postalCode: shippingInfo.postalCode,
            isDefault: count === 0,
          });
        }
      }

      return (res as any).success(
        order,
        'Checkout completed successfully',
        null,
        201
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Checkout failed',
        'CHECKOUT_ERROR',
        400
      );
    }
  }
}

export default new CheckoutController();
