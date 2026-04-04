import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paginate, paginationMeta } from '../utils/pagination.js';
import { createReviewSchema } from '../validators/review.js';

const router = Router();

function firstString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
}

// GET /api/reviews/trip/:tripId - Public reviews for a trip
router.get(
  '/trip/:tripId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tripId = firstString(req.params.tripId);
      if (!tripId) throw new AppError(400, 'Invalid trip ID');
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

      const trip = await prisma.trip.findUnique({ where: { id: tripId } });
      if (!trip) {
        throw new AppError(404, 'Trip not found');
      }

      const where = { tripId, isApproved: true };

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where,
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          ...paginate(page, limit),
        }),
        prisma.review.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          reviews,
          stats: {
            avgRating: trip.avgRating,
            totalReviews: trip.totalReviews,
          },
        },
        pagination: paginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/reviews - Create review (auth required)
router.post(
  '/',
  auth,
  validate(createReviewSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tripId, rating, title, comment } = req.body;
      const userId = req.user!.id;

      // Check if the trip exists
      const trip = await prisma.trip.findUnique({ where: { id: tripId } });
      if (!trip) {
        throw new AppError(404, 'Trip not found');
      }

      // Check if user already reviewed this trip
      const existingReview = await prisma.review.findUnique({
        where: { userId_tripId: { userId, tripId } },
      });

      if (existingReview) {
        throw new AppError(409, 'You have already reviewed this trip');
      }

      // Check if user has a completed booking for this trip
      const hasBooking = await prisma.booking.findFirst({
        where: {
          userId,
          tripId,
          status: { in: ['CONFIRMED', 'COMPLETED'] },
        },
      });

      if (!hasBooking) {
        throw new AppError(
          403,
          'You can only review trips you have booked and attended'
        );
      }

      const review = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const newReview = await tx.review.create({
          data: {
            userId,
            tripId,
            rating,
            title,
            comment,
            isApproved: true, // Auto-approve for now
          },
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true },
            },
          },
        });

        // Update trip rating stats
        const stats = await tx.review.aggregate({
          where: { tripId, isApproved: true },
          _avg: { rating: true },
          _count: { rating: true },
        });

        await tx.trip.update({
          where: { id: tripId },
          data: {
            avgRating: Math.round((stats._avg.rating || 0) * 10) / 10,
            totalReviews: stats._count.rating,
          },
        });

        return newReview;
      });

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: { review },
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/reviews/:id - Delete review (owner or admin)
router.delete(
  '/:id',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid review ID');

      const review = await prisma.review.findUnique({ where: { id } });
      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      if (review.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw new AppError(403, 'Not authorized to delete this review');
      }

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.review.delete({ where: { id } });

        // Recalculate trip stats
        const stats = await tx.review.aggregate({
          where: { tripId: review.tripId, isApproved: true },
          _avg: { rating: true },
          _count: { rating: true },
        });

        await tx.trip.update({
          where: { id: review.tripId },
          data: {
            avgRating: Math.round((stats._avg.rating || 0) * 10) / 10,
            totalReviews: stats._count.rating,
          },
        });
      });

      res.json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
