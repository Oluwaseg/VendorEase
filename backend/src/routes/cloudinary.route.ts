import { Router } from 'express';
import cloudinaryController from '../controllers/cloudinary.controller';
import auth from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// Protected route for generating Cloudinary signature
router.post(
  '/signature',
  auth,
  authorize('moderator', 'admin'),
  cloudinaryController.getSignature
);

export default router;
