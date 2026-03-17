import { Router } from 'express';
import passport from '../configs/passport';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation';
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post(
  '/forget-password',
  validate(forgetPasswordSchema),
  authController.forgetPassword
);
router.post(
  '/verify-email',
  validate(verifyEmailSchema),
  authController.verifyEmail
);
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

// Resend email verification
router.post(
  '/resend-verification',
  validate(forgetPasswordSchema),
  authController.resendVerification
);

// User dashboard
router.get('/dashboard', authMiddleware, authController.getDashboard);

// Current authenticated user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Logout current user
router.post('/logout', authMiddleware, authController.logout);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/google/error',
  }),
  authController.googleCallback
);

router.get('/google/error', (_req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(
    `${frontendUrl}/auth/error?message=Google authentication failed`
  );
});

export default router;
