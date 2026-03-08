import { Router } from 'express';
import adminRoutes from './admin.route';
import authRoutes from './auth.route';
import cartRoutes from './cart.route';
import categoryRoutes from './category.route';
import checkoutRoutes from './checkout.route';
import couponRoutes from './coupon.route';
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
router.use('/reviews', reviewRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/coupons', couponRoutes);

router.use('/payment', paymentRoutes);

router.use('/webhook', webhookRoutes);
router.use('/admin', adminRoutes);

export default router;
