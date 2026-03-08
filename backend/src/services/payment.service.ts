import axios from 'axios';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

import { Order } from '../models/Order';
import { User } from '../models/User';

class PaymentService {
  async initializeTransaction(userId: string, callbackUrl: string) {
    // Fetch user
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Fetch latest payment_pending order for user
    const order = await Order.findOne({
      user: userId,
      status: 'payment_pending',
    }).sort({ createdAt: -1 });
    if (!order)
      throw new Error('No pending order found. Please checkout first.');

    // Use order's shipping info and total
    const shippingInfo = order.shipping;
    const amountInKobo = Math.round(order.total * 100);

    // Prepare Paystack data
    const data = {
      email: user.email,
      amount: amountInKobo,
      callback_url: callbackUrl,
      metadata: {
        userId: user._id,
        orderId: order._id,
        shippingInfo,
      },
    };

    const headers = {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      data,
      { headers }
    );

    return { paystack: response.data, order };
  }

  async verifyTransaction(reference: string) {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  async handlePaystackWebhook(event: any) {
    // event.data.reference, event.data.status, event.data.metadata
    const { reference, status, metadata } = event.data || {};
    if (!reference || !metadata || !metadata.orderId) return;

    const order = await Order.findById(metadata.orderId);
    if (!order) return;

    if (status === 'success' || status === 'completed') {
      order.status = 'paid';
      order.paymentIntentId = reference;
      await order.save();
      // Optionally clear cart, send confirmation, etc.
    } else {
      order.status = 'cancelled'; // Use allowed status value
      order.paymentIntentId = reference;
      await order.save();
    }
  }
}

export default new PaymentService();
