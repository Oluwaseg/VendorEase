import mongoose from 'mongoose';
import { IOrder, Order, ShippingStatus } from '../models/Order';
import emailService from './email.service';

class OrderService {
  async getUserOrders(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const orders = await Order.find({ user: userObjectId })
      .sort({ createdAt: -1 })
      .lean<IOrder[]>();

    // Stats
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalPaid = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const totalPending = orders
      .filter((o) => o.paymentStatus !== 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      orders,
      stats: {
        totalOrders,
        totalAmount,
        totalPaid,
        totalPending,
      },
    };
  }

  async getUserOrderById(userId: string, orderId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const order = await Order.findOne({
      _id: orderId,
      user: userObjectId,
    }).lean<IOrder | null>();
    return order;
  }

  async getAllOrdersWithStats() {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'email name')
      .lean<IOrder[]>();

    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalPaid = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const totalPending = orders
      .filter((o) => o.paymentStatus !== 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      orders,
      stats: {
        totalOrders,
        totalAmount,
        totalPaid,
        totalPending,
      },
    };
  }

  async getOrderById(orderId: string) {
    const order = await Order.findById(orderId)
      .populate('user', 'email name')
      .lean<IOrder | null>();
    return order;
  }

  async updateOrderShippingStatus(orderId: string, status: ShippingStatus) {
    const order = await Order.findById(orderId);
    if (!order) {
      return null;
    }

    order.shippingStatus = status;
    await order.save();

    return order;
  }

  async sendOrderConfirmationEmail(orderId: string) {
    const order = await Order.findById(orderId).populate('user', 'email name');
    if (!order) return;

    const user = order.user as any as { email?: string; name?: string };
    if (!user?.email) return;

    await emailService.sendEmail({
      to: user.email,
      subject: 'Your SOSTECH Store order is confirmed',
      template: 'order-confirmation',
      context: {
        name: user.name || 'Customer',
        orderId: order._id.toString(),
        total: order.total,
        paymentStatus: order.paymentStatus,
        shippingStatus: order.shippingStatus,
        items: order.items,
        shipping: order.shipping,
        createdAt: order.createdAt,
      },
    });
  }

  async sendOrderStatusEmail(orderId: string) {
    const order = await Order.findById(orderId).populate('user', 'email name');
    if (!order) return;

    const user = order.user as any as { email?: string; name?: string };
    if (!user?.email) return;

    await emailService.sendEmail({
      to: user.email,
      subject: 'Your SOSTECH Store order status updated',
      template: 'order-status-update',
      context: {
        name: user.name || 'Customer',
        orderId: order._id.toString(),
        paymentStatus: order.paymentStatus,
        shippingStatus: order.shippingStatus,
        updatedAt: order.updatedAt,
      },
    });
  }
}

export default new OrderService();
