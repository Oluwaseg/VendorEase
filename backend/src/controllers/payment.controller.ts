import { NextFunction, Request, Response } from 'express';
import paymentService from '../services/payment.service';

class PaymentController {
  async initialize(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'PAYMENT_INIT_ERROR',
          401
        );
      }
      // Optionally allow callbackUrl override from frontend
      const callbackUrl =
        req.body.callbackUrl || process.env.PAYSTACK_CALLBACK_URL || '';
      const { paystack, order } = await paymentService.initializeTransaction(
        user._id,
        callbackUrl
      );
      return (res as any).success(
        { paystack, order },
        'Paystack transaction initialized'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to initialize payment',
        'PAYMENT_INIT_ERROR',
        400
      );
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { reference } = req.query;
      if (!reference) {
        return (res as any).error(
          'Reference required',
          'PAYMENT_VERIFY_ERROR',
          400
        );
      }
      const result = await paymentService.verifyTransaction(
        reference as string
      );
      return (res as any).success(result, 'Paystack transaction verified');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to verify payment',
        'PAYMENT_VERIFY_ERROR',
        400
      );
    }
  }
}

export default new PaymentController();
