import mongoose from 'mongoose';
import { Order, IOrder } from '../models/Order';

class OrderService {
  async getUserOrders(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const orders = await Order.find({ user: userObjectId })
      .sort({ createdAt: -1 })
      .lean<IOrder[]>();
    return orders;
  }

  async getUserOrderById(userId: string, orderId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const order = await Order.findOne({
      _id: orderId,
      user: userObjectId,
    }).lean<IOrder | null>();
    return order;
  }

  async getAllOrders() {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'email name')
      .lean<IOrder[]>();
    return orders;
  }

  async getOrderById(orderId: string) {
    const order = await Order.findById(orderId)
      .populate('user', 'email name')
      .lean<IOrder | null>();
    return order;
  }

  async updateOrderStatus(orderId: string, status: IOrder['status']) {
    const order = await Order.findById(orderId);
    if (!order) {
      return null;
    }

    order.status = status;
    await order.save();

    return order;
  }
}

export default new OrderService();

