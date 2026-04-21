import { Request, Response } from 'express';
import cloudinary from '../configs/cloudinary.config';

class CloudinaryController {
  async getSignature(req: Request, res: Response) {
    try {
      const { paramsToSign } = req.body;

      if (!paramsToSign) {
        return res.status(400).json({ error: 'paramsToSign is required' });
      }

      // Ensure images are stored in the VendorEase folder
      const paramsWithFolder = {
        ...paramsToSign,
        folder: 'VendorEase',
      };

      const signature = cloudinary.utils.api_sign_request(
        paramsWithFolder,
        process.env.CLOUDINARY_API_SECRET!
      );

      res.json({
        signature,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CloudinaryController();
