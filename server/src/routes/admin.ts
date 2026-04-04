import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { auth, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { paginate, paginationMeta } from '../utils/pagination.js';
import { z } from 'zod';

const router = Router();

// All admin routes require auth + admin
router.use(auth, adminOnly);

// ---------- DASHBOARD ----------

// GET /api/admin/dashboard - Admin stats
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

      // Monthly revenue for the last 6 months
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

// GET /api/admin/bookings - All bookings with filters
router.get(
  '/bookings',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const tripId = req.query.tripId as string;
      const search = req.query.search as string;

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

// PUT /api/admin/bookings/:id/status - Update booking status
router.put(
  '/bookings/:id/status',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED'];
      if (!status || !validStatuses.includes(status)) {
        throw new AppError(400, `Status must be one of: ${validStatuses.join(', ')}`);
      }

      const booking = await prisma.booking.findUnique({ where: { id } });
      if (!booking) {
        throw new AppError(404, 'Booking not found');
      }

      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { status },
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

// GET /api/admin/users - List all users
router.get(
  '/users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const role = req.query.role as string;

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

// ---------- HERO IMAGES ----------

const heroImageSchema = z.object({
  url: z.string().url('Invalid URL'),
  title: z.string().max(150).optional(),
  subtitle: z.string().max(300).optional(),
  ctaText: z.string().max(50).optional(),
  ctaLink: z.string().max(300).optional(),
  sortOrder: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

// GET /api/admin/hero-images - List hero images
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

// POST /api/admin/hero-images - Create hero image
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

// PUT /api/admin/hero-images/:id - Update hero image
router.put(
  '/hero-images/:id',
  validate(heroImageSchema.partial()),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

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

// DELETE /api/admin/hero-images/:id - Delete hero image
router.delete(
  '/hero-images/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

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

// GET /api/admin/contact-messages - List contact messages
router.get(
  '/contact-messages',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const isRead = req.query.isRead as string;

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

// PUT /api/admin/contact-messages/:id/read - Mark message as read
router.put(
  '/contact-messages/:id/read',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

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
