import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { auth, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { paginate, paginationMeta } from '../utils/pagination.js';
import { z } from 'zod';

const router = Router();

function firstString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
}

function parseDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new AppError(400, 'Invalid date value');
  }

  return parsed;
}

const scheduleSchema = z.object({
  date: z
    .string()
    .min(1, 'Schedule date is required')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Invalid schedule date'),
  availableSpots: z.coerce.number().int().positive(),
  priceOverride: z.union([z.coerce.number().positive(), z.null()]).optional(),
  status: z.enum(['OPEN', 'FULL', 'CANCELLED']).default('OPEN'),
});

const heroImageSchema = z.object({
  url: z.string().url('Invalid URL'),
  title: z.string().max(150).optional(),
  subtitle: z.string().max(300).optional(),
  ctaText: z.string().max(50).optional(),
  ctaLink: z.string().max(300).optional(),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

const tripImageCreateSchema = z.object({
  url: z.string().url('Invalid image URL'),
  altText: z.string().max(160).optional().nullable(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const tripImageUpdateSchema = z.object({
  url: z.string().url('Invalid image URL').optional(),
  altText: z.string().max(160).optional().nullable(),
  isPrimary: z.boolean().optional(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const adminTripListSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  difficulty: true,
  category: true,
  region: true,
  basePrice: true,
  discountPrice: true,
  isActive: true,
  isFeatured: true,
  updatedAt: true,
  images: {
    orderBy: { sortOrder: 'asc' as const },
    take: 1,
    select: {
      id: true,
      url: true,
      altText: true,
      isPrimary: true,
      sortOrder: true,
    },
  },
  schedules: {
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' as const },
    take: 1,
    select: {
      id: true,
      date: true,
      availableSpots: true,
      priceOverride: true,
      status: true,
    },
  },
  _count: {
    select: {
      bookings: true,
      images: true,
      schedules: true,
    },
  },
};

// All admin routes require auth + admin
router.use(auth, adminOnly);

// ---------- ASSET UPLOADS ----------

router.post(
  '/uploads',
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError(400, 'No image uploaded');
      }

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          file: {
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`,
            mimetype: req.file.mimetype,
            size: req.file.size,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ---------- DASHBOARD ----------

router.get(
  '/dashboard',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [
        totalUsers,
        totalTrips,
        totalBookings,
        totalRevenue,
        recentBookings,
        bookingsByStatus,
        unreadMessages,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.trip.count({ where: { isActive: true } }),
        prisma.booking.count(),
        prisma.payment.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true },
        }),
        prisma.booking.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            trip: { select: { title: true } },
            payment: { select: { status: true } },
          },
        }),
        prisma.booking.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        prisma.contactMessage.count({ where: { isRead: false } }),
      ]);

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyPayments = await prisma.payment.findMany({
        where: { status: 'COMPLETED', paidAt: { gte: sixMonthsAgo } },
        select: { amount: true, paidAt: true },
      });

      const monthlyRevenue: Record<string, number> = {};
      monthlyPayments.forEach((payment: { amount: number; paidAt: Date | null }) => {
        if (payment.paidAt) {
          const key = `${payment.paidAt.getFullYear()}-${String(payment.paidAt.getMonth() + 1).padStart(2, '0')}`;
          monthlyRevenue[key] = (monthlyRevenue[key] || 0) + payment.amount;
        }
      });

      const statusMap: Record<string, number> = {};
      bookingsByStatus.forEach((bookingGroup: { status: string; _count: { status: number } }) => {
        statusMap[bookingGroup.status] = bookingGroup._count.status;
      });

      res.json({
        success: true,
        data: {
          stats: {
            totalUsers,
            totalTrips,
            totalBookings,
            totalRevenue: totalRevenue._sum.amount || 0,
            unreadMessages,
          },
          bookingsByStatus: statusMap,
          monthlyRevenue,
          recentBookings,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ---------- BOOKINGS ----------

router.get(
  '/bookings',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = firstString(req.query.status);
      const tripId = firstString(req.query.tripId);
      const search = firstString(req.query.search);

      const where: any = {};
      if (status) where.status = status.toUpperCase();
      if (tripId) where.tripId = tripId;
      if (search) {
        where.OR = [
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { id: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
          where,
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, phone: true },
            },
            trip: { select: { id: true, title: true, slug: true } },
            schedule: { select: { date: true } },
            payment: { select: { status: true, amount: true, paidAt: true } },
            _count: { select: { participants: true } },
          },
          orderBy: { createdAt: 'desc' },
          ...paginate(page, limit),
        }),
        prisma.booking.count({ where }),
      ]);

      res.json({
        success: true,
        data: { bookings },
        pagination: paginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/bookings/:id/status',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      const status = firstString(req.body.status)?.toUpperCase();
      if (!id) throw new AppError(400, 'Invalid booking ID');

      const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED'] as const;
      if (!status || !(validStatuses as readonly string[]).includes(status)) {
        throw new AppError(400, `Status must be one of: ${validStatuses.join(', ')}`);
      }

      const booking = await prisma.booking.findUnique({ where: { id } });
      if (!booking) {
        throw new AppError(404, 'Booking not found');
      }

      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { status: status as (typeof validStatuses)[number] },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          trip: { select: { title: true } },
        },
      });

      res.json({
        success: true,
        message: `Booking status updated to ${status}`,
        data: { booking: updatedBooking },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ---------- USERS ----------

router.get(
  '/users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = firstString(req.query.search);
      const role = firstString(req.query.role);

      const where: any = {};
      if (role) where.role = role.toUpperCase();
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            emailVerified: true,
            createdAt: true,
            _count: { select: { bookings: true, reviews: true } },
          },
          orderBy: { createdAt: 'desc' },
          ...paginate(page, limit),
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        success: true,
        data: { users },
        pagination: paginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  }
);

// ---------- TRIPS ----------

router.get(
  '/trips',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = firstString(req.query.search);
      const status = firstString(req.query.status);
      const category = firstString(req.query.category);

      const where: any = {};

      if (status === 'active') where.isActive = true;
      if (status === 'inactive') where.isActive = false;
      if (category) where.category = category;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } },
          { region: { contains: search, mode: 'insensitive' } },
          { fortName: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [trips, total] = await Promise.all([
        prisma.trip.findMany({
          where,
          select: adminTripListSelect,
          orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
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

router.get(
  '/trips/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid trip ID');

      const trip = await prisma.trip.findUnique({
        where: { id },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          schedules: {
            orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
            include: {
              _count: {
                select: { bookings: true },
              },
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
      });

      if (!trip) {
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

router.post(
  '/trips/:id/schedules',
  validate(scheduleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid trip ID');

      const trip = await prisma.trip.findUnique({ where: { id } });
      if (!trip) {
        throw new AppError(404, 'Trip not found');
      }

      const schedule = await prisma.tripSchedule.create({
        data: {
          tripId: id,
          date: parseDate(req.body.date),
          availableSpots: req.body.availableSpots,
          priceOverride: req.body.priceOverride ?? null,
          status: req.body.status,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Trip schedule created successfully',
        data: { schedule },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/trip-schedules/:scheduleId',
  validate(scheduleSchema.partial()),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = firstString(req.params.scheduleId);
      if (!scheduleId) throw new AppError(400, 'Invalid schedule ID');

      const schedule = await prisma.tripSchedule.findUnique({ where: { id: scheduleId } });
      if (!schedule) {
        throw new AppError(404, 'Schedule not found');
      }

      const updatedSchedule = await prisma.tripSchedule.update({
        where: { id: scheduleId },
        data: {
          ...(req.body.date ? { date: parseDate(req.body.date) } : {}),
          ...(req.body.availableSpots !== undefined
            ? { availableSpots: req.body.availableSpots }
            : {}),
          ...(req.body.priceOverride !== undefined
            ? { priceOverride: req.body.priceOverride }
            : {}),
          ...(req.body.status ? { status: req.body.status } : {}),
        },
      });

      res.json({
        success: true,
        message: 'Trip schedule updated successfully',
        data: { schedule: updatedSchedule },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/trip-schedules/:scheduleId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = firstString(req.params.scheduleId);
      if (!scheduleId) throw new AppError(400, 'Invalid schedule ID');

      const schedule = await prisma.tripSchedule.findUnique({
        where: { id: scheduleId },
        include: {
          _count: {
            select: { bookings: true },
          },
        },
      });

      if (!schedule) {
        throw new AppError(404, 'Schedule not found');
      }

      if (schedule._count.bookings > 0) {
        throw new AppError(400, 'Cannot delete a schedule that already has bookings. Cancel it instead.');
      }

      await prisma.tripSchedule.delete({ where: { id: scheduleId } });

      res.json({
        success: true,
        message: 'Trip schedule deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/trips/:id/images/url',
  validate(tripImageCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid trip ID');

      const trip = await prisma.trip.findUnique({ where: { id } });
      if (!trip) {
        throw new AppError(404, 'Trip not found');
      }

      const existingCount = await prisma.tripImage.count({ where: { tripId: id } });

      const image = await prisma.$transaction(async (tx) => {
        const shouldBePrimary = req.body.isPrimary || existingCount === 0;

        if (shouldBePrimary) {
          await tx.tripImage.updateMany({
            where: { tripId: id },
            data: { isPrimary: false },
          });
        }

        return tx.tripImage.create({
          data: {
            tripId: id,
            url: req.body.url,
            altText: req.body.altText ?? trip.title,
            isPrimary: shouldBePrimary,
            sortOrder: req.body.sortOrder ?? existingCount,
          },
        });
      });

      res.status(201).json({
        success: true,
        message: 'Trip image saved successfully',
        data: { image },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/trip-images/:imageId',
  validate(tripImageUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imageId = firstString(req.params.imageId);
      if (!imageId) throw new AppError(400, 'Invalid image ID');

      const image = await prisma.tripImage.findUnique({ where: { id: imageId } });
      if (!image) {
        throw new AppError(404, 'Image not found');
      }

      if (req.body.isPrimary === false && image.isPrimary) {
        throw new AppError(400, 'Assign another image as primary before unsetting this one.');
      }

      const updatedImage = await prisma.$transaction(async (tx) => {
        if (req.body.isPrimary) {
          await tx.tripImage.updateMany({
            where: { tripId: image.tripId },
            data: { isPrimary: false },
          });
        }

        return tx.tripImage.update({
          where: { id: imageId },
          data: {
            ...(req.body.url ? { url: req.body.url } : {}),
            ...(req.body.altText !== undefined ? { altText: req.body.altText } : {}),
            ...(req.body.isPrimary !== undefined ? { isPrimary: req.body.isPrimary } : {}),
            ...(req.body.sortOrder !== undefined ? { sortOrder: req.body.sortOrder } : {}),
          },
        });
      });

      res.json({
        success: true,
        message: 'Trip image updated successfully',
        data: { image: updatedImage },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ---------- HERO IMAGES ----------

router.get(
  '/hero-images',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const heroImages = await prisma.heroImage.findMany({
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

router.post(
  '/hero-images',
  validate(heroImageSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const heroImage = await prisma.heroImage.create({
        data: req.body,
      });

      res.status(201).json({
        success: true,
        message: 'Hero image created successfully',
        data: { heroImage },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/hero-images/:id',
  validate(heroImageSchema.partial()),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid hero image ID');

      const existing = await prisma.heroImage.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError(404, 'Hero image not found');
      }

      const heroImage = await prisma.heroImage.update({
        where: { id },
        data: req.body,
      });

      res.json({
        success: true,
        message: 'Hero image updated successfully',
        data: { heroImage },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/hero-images/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid hero image ID');

      const existing = await prisma.heroImage.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError(404, 'Hero image not found');
      }

      await prisma.heroImage.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Hero image deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// ---------- CONTACT MESSAGES ----------

router.get(
  '/contact-messages',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const isRead = firstString(req.query.isRead);

      const where: any = {};
      if (isRead === 'true') where.isRead = true;
      if (isRead === 'false') where.isRead = false;

      const [messages, total] = await Promise.all([
        prisma.contactMessage.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          ...paginate(page, limit),
        }),
        prisma.contactMessage.count({ where }),
      ]);

      res.json({
        success: true,
        data: { messages },
        pagination: paginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/contact-messages/:id/read',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid message ID');

      const message = await prisma.contactMessage.findUnique({ where: { id } });
      if (!message) {
        throw new AppError(404, 'Message not found');
      }

      await prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
      });

      res.json({
        success: true,
        message: 'Message marked as read',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
