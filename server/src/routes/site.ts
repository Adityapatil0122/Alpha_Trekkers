import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';

const router = Router();

router.get(
  '/hero-images',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const heroImages = await prisma.heroImage.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      res.json({
        success: true,
        data: { heroImages },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
