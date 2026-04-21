import { Router } from 'express';
import adminRoutes from './admin.route';
import authRoutes from './auth.route';
import cartRoutes from './cart.route';
import categoryRoutes from './category.route';
import chatRoutes from './chat.route';
import checkoutRoutes from './checkout.route';
import cloudinaryRoutes from './cloudinary.route';
import couponRoutes from './coupon.route';
import orderRoutes from './order.route';
import paymentRoutes from './payment.route';
import productRoutes from './product.route';
import referralRoutes from './referral.route';
import reviewRoutes from './review.route';
import subcategoryRoutes from './subcategory.route';
import webhookRoutes from './webhook.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/referrals', referralRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/chat', chatRoutes);
router.use('/reviews', reviewRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/coupons', couponRoutes);

router.use('/payment', paymentRoutes);
router.use('/orders', orderRoutes);

router.use('/webhook', webhookRoutes);
router.use('/admin', adminRoutes);
router.use('/cloudinary', cloudinaryRoutes);

export default router;
