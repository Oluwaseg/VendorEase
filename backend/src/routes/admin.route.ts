import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import orderController from '../controllers/order.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Dashboard
router.get('/dashboard', authMiddleware, adminController.getDashboard);

// Users
router.get('/users', authMiddleware, adminController.getUsers);
router.patch('/users/:id', authMiddleware, adminController.editUser);
router.delete('/users/:id', authMiddleware, adminController.deleteUser);

// Orders
router.get('/orders', authMiddleware, orderController.listAllOrders);
router.get('/orders/:id', authMiddleware, orderController.getOrderById);
router.patch(
  '/orders/:id/status',
  authMiddleware,
  orderController.updateOrderStatus
);

export default router;
