import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { contactMessageSchema } from '../validators/contact.js';

const router = Router();

// POST /api/contact - Submit contact message (public)
router.post(
  '/',
  authLimiter,
  validate(contactMessageSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, phone, subject, message } = req.body;

      await prisma.contactMessage.create({
        data: { name, email, phone, subject, message },
      });

      // TODO: Send notification email to admin using nodemailer
      // await sendAdminNotification({ name, email, subject, message });

      res.status(201).json({
        success: true,
        message: 'Your message has been sent. We will get back to you shortly.',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
