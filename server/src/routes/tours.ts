import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

function firstString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
}

// GET / - List all active tours
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const typeLabel = firstString(req.query.type);

      const where: any = { isActive: true };
      if (typeLabel) {
        where.typeLabel = typeLabel.toUpperCase();
      }

      const tours = await prisma.tour.findMany({
        where,
        orderBy: { departureDate: 'asc' },
      });

      res.json({
        success: true,
        data: { tours },
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /:slug - Get tour by slug
router.get(
  '/:slug',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = firstString(req.params.slug);
      if (!slug) throw new AppError(400, 'Invalid tour slug');

      const tour = await prisma.tour.findUnique({
        where: { slug, isActive: true },
      });

      if (!tour) {
        throw new AppError(404, 'Tour not found');
      }

      res.json({
        success: true,
        data: { tour },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
