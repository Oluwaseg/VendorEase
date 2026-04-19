import { NextFunction, Request, Response } from 'express';
import adminService from '../services/admin.service';
import { editUserSchema } from '../validations/user.validation';

class AdminController {
  // Admin Dashboard: stats and metrics
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const [
        userCount,
        productCount,
        categoryCount,
        orderStats,
        reviewCount,
        bestSellers,
        topCategories,
        recentOrders,
        recentUsers,
      ] = await Promise.all([
        require('../models/User').User.countDocuments(),
        require('../models/Product').Product.countDocuments(),
        require('../models/Category').Category.countDocuments(),
        (async () => {
          const Order = require('../models/Order').Order;
          const paidOrders = await Order.find({ paymentStatus: 'paid' }).lean();
          const totalOrders = await Order.countDocuments();
          const totalSales = paidOrders.reduce(
            (sum: number, o: any) => sum + (o.total || 0),
            0
          );
          return { totalOrders, totalSales };
        })(),
        require('../models/Review').Review.countDocuments(),
        // Best sellers: top 5 by ratingCount
        require('../models/Product')
          .Product.find({ isPublished: true })
          .sort({ ratingCount: -1 })
          .limit(5)
          .select('name averageRating ratingCount basePrice stock')
          .lean(),
        // Top categories: by product count
        require('../models/Product').Product.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'categories',
              localField: '_id',
              foreignField: '_id',
              as: 'category',
            },
          },
          { $unwind: '$category' },
          { $project: { _id: 0, name: '$category.name', count: 1 } },
        ]),
        // Recent orders: last 5
        require('../models/Order')
          .Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('user total paymentStatus shippingStatus createdAt')
          .populate('user', 'email name')
          .lean(),
        // Recent users: last 5
        require('../models/User')
          .User.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name email createdAt')
          .lean(),
      ]);

      return (res as any).success(
        {
          userCount,
          productCount,
          categoryCount,
          orderStats,
          reviewCount,
          bestSellers,
          topCategories,
          recentOrders,
          recentUsers,
        },
        'Admin dashboard stats fetched'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch dashboard stats',
        'ADMIN_DASHBOARD_ERROR',
        500
      );
    }
  }
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const role = req.query.role as string | undefined;
      const users = await adminService.getAllUsers(role);
      return (res as any).success(users, 'User list fetched successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch users',
        'ADMIN_USER_LIST_ERROR',
        400
      );
    }
  }

  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      id = Array.isArray(id) ? id[0] : id;
      const { error, value } = editUserSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return (res as any).error(
          error.details.map((d) => d.message).join(', '),
          'ADMIN_USER_EDIT_VALIDATION_ERROR',
          422
        );
      }
      const user = await adminService.editUser(id, value);
      if (!user) {
        return (res as any).error(
          'User not found',
          'ADMIN_USER_EDIT_NOT_FOUND',
          404
        );
      }
      return (res as any).success(user, 'User updated successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to update user',
        'ADMIN_USER_EDIT_ERROR',
        400
      );
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      id = Array.isArray(id) ? id[0] : id;
      const user = await adminService.deleteUser(id);
      if (!user) {
        return (res as any).error(
          'User not found',
          'ADMIN_USER_DELETE_NOT_FOUND',
          404
        );
      }
      return (res as any).success(null, 'User deleted successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to delete user',
        'ADMIN_USER_DELETE_ERROR',
        400
      );
    }
  }
}

export default new AdminController();
