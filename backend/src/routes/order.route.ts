import { Router } from 'express';
import orderController from '../controllers/order.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// User routes (authenticated)
router.get('/', authMiddleware, orderController.listMyOrders);
router.get('/:id', authMiddleware, orderController.getMyOrder);

export default router;
