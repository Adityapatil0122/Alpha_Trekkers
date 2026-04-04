import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { auth, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { paginate, paginationMeta } from '../utils/pagination.js';
import { generateSlug } from '../utils/slug.js';
import { tripFiltersSchema, createTripSchema, updateTripSchema } from '../validators/trip.js';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

function resolveTripSort(sortBy: string, sortOrder: 'asc' | 'desc') {
  switch (sortBy) {
    case 'popular':
    case 'rating':
      return { avgRating: 'desc' as const };
    case 'newest':
      return { createdAt: 'desc' as const };
    case 'price_asc':
      return { basePrice: 'asc' as const };
    case 'price_desc':
      return { basePrice: 'desc' as const };
    default:
      return { [sortBy]: sortOrder };
  }
}

const tripListSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  difficulty: true,
  category: true,
  durationHours: true,
  distanceKm: true,
  elevationM: true,
  region: true,
  fortName: true,
  basePrice: true,
  discountPrice: true,
  maxGroupSize: true,
  isFeatured: true,
  avgRating: true,
  totalReviews: true,
  isActive: true,
  images: {
    where: { isPrimary: true },
    take: 1,
    select: { id: true, url: true, altText: true },
  },
  schedules: {
    where: { status: 'OPEN' as const, date: { gte: new Date() } },
    orderBy: { date: 'asc' as const },
    take: 3,
    select: { id: true, date: true, availableSpots: true, priceOverride: true, status: true },
  },
};

// GET /api/trips - List trips with filters
router.get(
  '/',
  validate(tripFiltersSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        page,
        limit,
        search,
        difficulty,
        category,
        region,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        isFeatured,
      } = req.query as any;

      const where: any = { isActive: true };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { fortName: { contains: search, mode: 'insensitive' } },
          { region: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (difficulty) where.difficulty = difficulty;
      if (category) where.category = category;
      if (region) where.region = { contains: region, mode: 'insensitive' };
      if (isFeatured !== undefined) where.isFeatured = isFeatured;

      if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) where.basePrice.gte = minPrice;
        if (maxPrice) where.basePrice.lte = maxPrice;
      }

      const [trips, total] = await Promise.all([
        prisma.trip.findMany({
          where,
          select: tripListSelect,
          orderBy: resolveTripSort(sortBy, sortOrder),
          ...paginate(page, limit),
        }),
        prisma.trip.count({ where }),
      ]);

      res.json({
        success: true,
        data: { trips },
        pagination: paginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/trips/id/:id - Single trip by id
router.get(
  '/id/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trip = await prisma.trip.findUnique({
        where: { id: req.params.id },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          schedules: {
            where: { status: 'OPEN', date: { gte: new Date() } },
            orderBy: { date: 'asc' },
          },
          reviews: {
            where: { isApproved: true },
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, avatarUrl: true },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!trip || !trip.isActive) {
        throw new AppError(404, 'Trip not found');
      }

      res.json({
        success: true,
        data: { trip },
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/trips/featured - Featured trips
router.get(
  '/featured',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const trips = await prisma.trip.findMany({
        where: { isActive: true, isFeatured: true },
        select: tripListSelect,
        orderBy: { avgRating: 'desc' },
        take: 6,
      });

      res.json({
        success: true,
        data: { trips },
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/trips/:slug - Single trip by slug
router.get(
  '/:slug',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trip = await prisma.trip.findUnique({
        where: { slug: req.params.slug },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          schedules: {
            where: { status: 'OPEN', date: { gte: new Date() } },
            orderBy: { date: 'asc' },
          },
          reviews: {
            where: { isApproved: true },
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, avatarUrl: true },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!trip || !trip.isActive) {
        throw new AppError(404, 'Trip not found');
      }

      res.json({
        success: true,
        data: { trip },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/trips - Create trip (admin only)
router.post(
  '/',
  auth,
  adminOnly,
  validate(createTripSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { schedules, ...tripData } = req.body;

      const slug = await generateSlug(tripData.title);

      const trip = await prisma.trip.create({
        data: {
          ...tripData,
          slug,
          ...(schedules && {
            schedules: {
              create: schedules.map((s: any) => ({
                date: new Date(s.date),
                availableSpots: s.availableSpots,
                priceOverride: s.priceOverride,
                status: s.status,
              })),
            },
          }),
        },
        include: {
          images: true,
          schedules: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: { trip },
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/trips/:id - Update trip (admin only)
router.put(
  '/:id',
  auth,
  adminOnly,
  validate(updateTripSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { schedules, ...tripData } = req.body;

      const existing = await prisma.trip.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError(404, 'Trip not found');
      }

      // If title is changing, regenerate slug
      if (tripData.title && tripData.title !== existing.title) {
        tripData.slug = await generateSlug(tripData.title);
      }

      const trip = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Update schedules if provided
        if (schedules) {
          // Remove old future schedules without bookings and add new ones
          await tx.tripSchedule.deleteMany({
            where: {
              tripId: id,
              date: { gte: new Date() },
              bookings: { none: {} },
            },
          });

          for (const s of schedules) {
            await tx.tripSchedule.create({
              data: {
                tripId: id,
                date: new Date(s.date),
                availableSpots: s.availableSpots,
                priceOverride: s.priceOverride,
                status: s.status,
              },
            });
          }
        }

        return tx.trip.update({
          where: { id },
          data: tripData,
          include: { images: true, schedules: true },
        });
      });

      res.json({
        success: true,
        message: 'Trip updated successfully',
        data: { trip },
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/trips/:id - Delete trip (admin only)
router.delete(
  '/:id',
  auth,
  adminOnly,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const trip = await prisma.trip.findUnique({
        where: { id },
        include: { bookings: { where: { status: { in: ['PENDING', 'CONFIRMED'] } } } },
      });

      if (!trip) {
        throw new AppError(404, 'Trip not found');
      }

      if (trip.bookings.length > 0) {
        throw new AppError(
          400,
          'Cannot delete trip with active bookings. Deactivate it instead.'
        );
      }

      await prisma.trip.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Trip deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/trips/:id/images - Upload trip images (admin only)
router.post(
  '/:id/images',
  auth,
  adminOnly,
  upload.array('images', 10),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const trip = await prisma.trip.findUnique({ where: { id } });
      if (!trip) {
        throw new AppError(404, 'Trip not found');
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new AppError(400, 'No images uploaded');
      }

      const existingCount = await prisma.tripImage.count({ where: { tripId: id } });

      const images = await prisma.$transaction(
        files.map((file, index) =>
          prisma.tripImage.create({
            data: {
              tripId: id,
              url: `/uploads/${file.filename}`,
              altText: req.body.altText?.[index] || trip.title,
              isPrimary: existingCount === 0 && index === 0,
              sortOrder: existingCount + index,
            },
          })
        )
      );

      res.status(201).json({
        success: true,
        message: `${images.length} image(s) uploaded successfully`,
        data: { images },
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/trips/images/:imageId - Delete trip image (admin only)
router.delete(
  '/images/:imageId',
  auth,
  adminOnly,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageId } = req.params;

      const image = await prisma.tripImage.findUnique({ where: { id: imageId } });
      if (!image) {
        throw new AppError(404, 'Image not found');
      }

      // Delete file from disk if it's a local upload
      if (image.url.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), image.url);
        try {
          await fs.unlink(filePath);
        } catch {
          // File may already be deleted, continue
        }
      }

      await prisma.tripImage.delete({ where: { id: imageId } });

      // If deleted image was primary, make the next one primary
      if (image.isPrimary) {
        const nextImage = await prisma.tripImage.findFirst({
          where: { tripId: image.tripId },
          orderBy: { sortOrder: 'asc' },
        });
        if (nextImage) {
          await prisma.tripImage.update({
            where: { id: nextImage.id },
            data: { isPrimary: true },
          });
        }
      }

      res.json({
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
