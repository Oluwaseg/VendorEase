import { NextFunction, Request, Response } from 'express';
import orderService from '../services/order.service';

class OrderController {
  async listMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'ORDER_LIST_AUTH_ERROR',
          401
        );
      }

      const orders = await orderService.getUserOrders(user._id);
      return (res as any).success(orders, 'Orders fetched successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch orders',
        'ORDER_LIST_ERROR',
        400
      );
    }
  }

  async getMyOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'ORDER_DETAIL_AUTH_ERROR',
          401
        );
      }

      let { id } = req.params;
      id = Array.isArray(id) ? id[0] : id;

      const order = await orderService.getUserOrderById(user._id, id);
      if (!order) {
        return (res as any).error(
          'Order not found',
          'ORDER_DETAIL_NOT_FOUND',
          404
        );
      }

      return (res as any).success(order, 'Order fetched successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch order',
        'ORDER_DETAIL_ERROR',
        400
      );
    }
  }

  // ----- Admin-side -----

  async listAllOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getAllOrders();
      return (res as any).success(orders, 'All orders fetched successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch orders',
        'ADMIN_ORDER_LIST_ERROR',
        400
      );
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      id = Array.isArray(id) ? id[0] : id;

      const order = await orderService.getOrderById(id);
      if (!order) {
        return (res as any).error(
          'Order not found',
          'ADMIN_ORDER_DETAIL_NOT_FOUND',
          404
        );
      }

      return (res as any).success(order, 'Order fetched successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch order',
        'ADMIN_ORDER_DETAIL_ERROR',
        400
      );
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      id = Array.isArray(id) ? id[0] : id;

      const { status } = req.body as { status?: string };
      const allowedStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];

      if (!status || !allowedStatuses.includes(status)) {
        return (res as any).error(
          'Invalid shipping status',
          'ADMIN_ORDER_STATUS_INVALID',
          422
        );
      }

      const order = await orderService.updateOrderShippingStatus(
        id,
        status as any
      );
      if (!order) {
        return (res as any).error(
          'Order not found',
          'ADMIN_ORDER_STATUS_NOT_FOUND',
          404
        );
      }

      // Send email notification for shipping status change
      await orderService.sendOrderStatusEmail(id);

      return (res as any).success(order, 'Order status updated successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to update order status',
        'ADMIN_ORDER_STATUS_ERROR',
        400
      );
    }
  }
}

export default new OrderController();

