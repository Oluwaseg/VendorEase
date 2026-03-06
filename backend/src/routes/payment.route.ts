import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.post('/initialize', authMiddleware, paymentController.initialize);
router.get('/verify', authMiddleware, paymentController.verify);

export default router;
