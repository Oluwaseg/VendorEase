import { NextFunction, Request, Response } from 'express';
import PDFDocument from 'pdfkit';
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

  async downloadInvoice(req: Request, res: Response, next: NextFunction) {
    try {
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

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="invoice-${order._id}.pdf"`
      );

      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      doc.pipe(res);

      this.generateInvoicePdf(doc, order);
      doc.end();
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to generate invoice',
        'ORDER_INVOICE_ERROR',
        400
      );
    }
  }

  private generateInvoicePdf(doc: typeof PDFDocument, order: any) {
    const formatCurrency = (value: number) => `₦${value.toFixed(2)}`;

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

    doc.fontSize(20).text('SOSTECH Store', { align: 'left' });
    doc.fontSize(10).text('Invoice', { align: 'right' });
    doc.moveDown();

    doc
      .fontSize(10)
      .text(`Order ID: ${order._id}`, 40, 110)
      .text(`Date: ${formatDate(order.createdAt)}`, 40, 125)
      .text(`Status: ${order.shippingStatus}`, 40, 140);

    doc
      .fontSize(10)
      .text('Bill To:', 300, 110)
      .text(order.shipping?.addressLine || '', 300, 125)
      .text(
        `${order.shipping?.city || ''}, ${order.shipping?.state || ''}`.trim(),
        300,
        140
      )
      .text(order.shipping?.country || '', 300, 155);

    doc.moveTo(40, 180).lineTo(555, 180).stroke();

    doc.fontSize(12).text('Items', 40, 190);
    let y = 215;

    doc
      .fontSize(10)
      .text('Product', 40, y)
      .text('Qty', 280, y, { width: 60, align: 'right' })
      .text('Price', 340, y, { width: 90, align: 'right' })
      .text('Total', 450, y, { width: 90, align: 'right' });

    y += 20;
    doc
      .moveTo(40, y - 5)
      .lineTo(555, y - 5)
      .stroke();

    order.items.forEach((item: any) => {
      const itemTotal = item.price * item.quantity;
      doc
        .fontSize(10)
        .text(item.name, 40, y)
        .text(item.quantity.toString(), 280, y, { width: 60, align: 'right' })
        .text(formatCurrency(item.price), 340, y, { width: 90, align: 'right' })
        .text(formatCurrency(itemTotal), 450, y, { width: 90, align: 'right' });
      y += 20;
    });

    y += 10;
    doc.moveTo(40, y).lineTo(555, y).stroke();
    y += 10;

    doc
      .fontSize(10)
      .text('Subtotal', 350, y, { width: 150, align: 'right' })
      .text(formatCurrency(order.subtotal), 500, y, {
        width: 90,
        align: 'right',
      });
    y += 15;

    if (order.shippingFee) {
      doc
        .text('Shipping', 350, y, { width: 150, align: 'right' })
        .text(formatCurrency(order.shippingFee), 500, y, {
          width: 90,
          align: 'right',
        });
      y += 15;
    }

    if (order.discount) {
      doc
        .text('Discount', 350, y, { width: 150, align: 'right' })
        .text(`- ${formatCurrency(order.discount)}`, 500, y, {
          width: 90,
          align: 'right',
        });
      y += 15;
    }

    if (tax > 0) {
      doc
        .text('Tax', 350, y, { width: 150, align: 'right' })
        .text(formatCurrency(tax), 500, y, { width: 90, align: 'right' });
      y += 15;
    }

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Total', 350, y, { width: 150, align: 'right' })
      .text(formatCurrency(order.total), 500, y, {
        width: 90,
        align: 'right',
      });

    doc.font('Helvetica').fontSize(10);
    doc
      .moveTo(40, y + 30)
      .lineTo(555, y + 30)
      .stroke();

    doc
      .fontSize(10)
      .text('Thank you for your purchase!', 40, y + 50)
      .text('Contact us at support@sostechstore.com', 40, y + 65);
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
