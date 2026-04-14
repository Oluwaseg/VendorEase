import { NextFunction, Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import orderService from '../services/order.service';
import { InvoiceBuilder } from '../utils/pdf-invoice-builder';

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

      const { orders, stats } = await orderService.getUserOrders(user._id);
      return (res as any).success(
        { orders, stats },
        'Orders and stats fetched successfully'
      );
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

  downloadInvoice = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return (res as any).error(
        'Authentication required',
        'ORDER_INVOICE_AUTH_ERROR',
        401
      );
    }

    let { id } = req.params;
    id = Array.isArray(id) ? id[0] : id;

    const order = await orderService.getUserOrderById(user._id, id);
    if (!order) {
      return (res as any).error(
        'Order not found',
        'ORDER_INVOICE_NOT_FOUND',
        404
      );
    }

    try {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="invoice-${order._id}.pdf"`
      );

      const doc = new PDFDocument({ size: 'A4', margin: 40 });

      doc.on('error', () => {
        res.destroy();
      });

      res.on('error', () => {
        if (typeof (doc as any).destroy === 'function') {
          (doc as any).destroy();
        }
      });

      doc.pipe(res);
      this.generateInvoicePdf(doc, order);
      doc.end();
    } catch (error: any) {
      console.error('Invoice generation error:', error);
      if (!res.headersSent) {
        return (res as any).error(
          error.message || 'Failed to generate invoice',
          'ORDER_INVOICE_ERROR',
          400
        );
      }
      res.destroy();
    }
  };

  private generateInvoicePdf(doc: typeof PDFDocument, order: any) {
    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(date));

    const tax = Math.max(
      0,
      order.total - order.subtotal - order.shippingFee + (order.discount || 0)
    );

    const getStatusLabel = () => {
      if (order.paymentStatus === 'paid') return 'PAID';
      if (order.paymentStatus === 'payment_pending') return 'PAYMENT PENDING';
      if (order.paymentStatus === 'cancelled') return 'CANCELLED';
      if (order.paymentStatus === 'refunded') return 'REFUNDED';
      return order.shippingStatus?.toUpperCase() || 'PENDING';
    };

    const getStatusColor = () => {
      if (order.paymentStatus === 'paid') return '#16a34a';
      if (order.paymentStatus === 'payment_pending') return '#f59e0b';
      if (order.paymentStatus === 'cancelled') return '#ef4444';
      if (order.paymentStatus === 'refunded') return '#6366f1';
      return '#2563eb';
    };

    const builder = new InvoiceBuilder(doc);

    // Build invoice using structured layout system
    builder.header('VendorEase', 'Modern ecommerce orders & invoice');

    builder.metaRow(
      order._id.toString().slice(-8).toUpperCase(),
      formatDate(order.createdAt),
      getStatusLabel(),
      getStatusColor()
    );

    const billingAddress = [
      order.shipping?.addressLine,
      [order.shipping?.city, order.shipping?.state, order.shipping?.country]
        .filter(Boolean)
        .join(', '),
    ]
      .filter(Boolean)
      .join('\n');

    builder.twoColumnSection(
      'Bill To',
      'Invoice Details',
      billingAddress,
      `Status: ${order.shippingStatus}\nPayment: ${order.paymentStatus}`
    );

    builder.itemsTable(order.items);

    builder.summary({
      subtotal: order.subtotal,
      shipping: order.shippingFee,
      discount: order.discount,
      tax: tax,
      total: order.total,
    });

    builder.footer('support@vendorease.com', 'vendorease.com');
  }

  // ----- Admin-side -----

  async listAllOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const { orders, stats } = await orderService.getAllOrdersWithStats();
      return (res as any).success(
        { orders, stats },
        'All orders and stats fetched successfully'
      );
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
      const allowedStatuses = [
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ];

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
