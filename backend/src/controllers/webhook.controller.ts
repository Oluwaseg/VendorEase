import { Request, Response } from 'express';
import paymentService from '../services/payment.service';

class WebhookController {
  async paystackWebhook(req: Request, res: Response) {
    try {
      // Paystack sends JSON, verify signature if needed
      const event = req.body;
      // Optionally verify Paystack signature here
      if (!event || !event.data || !event.data.reference) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid webhook payload' });
      }
      // Process payment verification
      await paymentService.handlePaystackWebhook(event);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new WebhookController();
