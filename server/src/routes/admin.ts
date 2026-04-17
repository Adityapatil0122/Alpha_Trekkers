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

const validBookingStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED'] as const;
const validBookingKinds = ['TREK', 'TOUR'] as const;

type AdminBookingKind = (typeof validBookingKinds)[number];

function normalizeTrekAdminBooking(booking: any) {
  return {
    id: booking.id,
    kind: 'TREK' as const,
    status: booking.status,
    numberOfPeople: booking.numberOfPeople,
    totalAmount: booking.totalAmount,
    specialRequests: booking.specialRequests,
    createdAt: booking.createdAt,
    user: booking.user,
    trip: booking.trip,
    schedule: booking.schedule,
    participants: (booking.participants ?? []).map((participant: any) => ({
      id: participant.id,
      fullName: participant.fullName,
      age: participant.age,
      phone: participant.phone,
      emergencyName: participant.emergencyName,
      emergencyPhone: participant.emergencyPhone,
      medicalNotes: participant.medicalNotes,
    })),
    payment: booking.payment,
  };
}

function normalizeTourAdminBooking(booking: any) {
  return {
    id: booking.id,
    kind: 'TOUR' as const,
    status: booking.status,
    numberOfPeople: booking.numberOfPeople,
    totalAmount: booking.totalAmount,
    specialRequests: booking.specialRequests,
    createdAt: booking.createdAt,
    user: booking.user,
    trip: {
      id: booking.tourId,
      title: booking.tourTitle,
      slug: booking.tourSlug,
    },
    schedule: { date: booking.departureDate },
    participants: (booking.participants ?? []).map((participant: any) => ({
      id: participant.id,
      fullName: participant.fullName,
      age: participant.age,
      phone: participant.phone,
      emergencyName: participant.emergencyName,
      emergencyPhone: participant.emergencyPhone,
      medicalNotes: participant.medicalNotes,
    })),
    payment: undefined,
  };
}

function addStatusGroups(
  statusMap: Record<string, number>,
  groups: Array<{ status: string; _count: { status: number } }>,
) {
  groups.forEach((group) => {
    statusMap[group.status] = (statusMap[group.status] ?? 0) + group._count.status;
  });
}

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
        totalTours,
        totalTrekBookings,
        totalTourBookings,
        totalRevenue,
        recentTrekBookings,
        recentTourBookings,
        trekBookingsByStatus,
        tourBookingsByStatus,
        unreadMessages,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.trip.count({ where: { isActive: true } }),
        prisma.tour.count({ where: { isActive: true } }),
        prisma.booking.count(),
        prisma.tourBooking.count(),
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
        prisma.tourBooking.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        }),
        prisma.booking.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        prisma.tourBooking.groupBy({
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
      addStatusGroups(statusMap, trekBookingsByStatus);
      addStatusGroups(statusMap, tourBookingsByStatus);

      const totalBookings = totalTrekBookings + totalTourBookings;
      const recentBookings = [
        ...recentTrekBookings.map((booking) => ({
          ...booking,
          kind: 'TREK' as const,
        })),
        ...recentTourBookings.map((booking) => ({
          id: booking.id,
          kind: 'TOUR' as const,
          status: booking.status,
          numberOfPeople: booking.numberOfPeople,
          totalAmount: booking.totalAmount,
          createdAt: booking.createdAt,
          user: booking.user,
          trip: { title: booking.tourTitle },
          payment: undefined,
        })),
      ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      res.json({
        success: true,
        data: {
          stats: {
            totalUsers,
            totalTrips,
            totalTours,
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
      const page = Math.max(parseInt(req.query.page as string) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit as string) || 20, 1);
      const status = firstString(req.query.status);
      const tripId = firstString(req.query.tripId);
      const search = firstString(req.query.search);

      const trekWhere: any = {};
      const tourWhere: any = {};
      if (status) {
        trekWhere.status = status.toUpperCase();
        tourWhere.status = status.toUpperCase();
      }
      if (tripId) {
        trekWhere.tripId = tripId;
        tourWhere.tourId = tripId;
      }
      if (search) {
        trekWhere.OR = [
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { trip: { title: { contains: search, mode: 'insensitive' } } },
          { id: { contains: search, mode: 'insensitive' } },
        ];
        tourWhere.OR = [
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { tourTitle: { contains: search, mode: 'insensitive' } },
          { tourSlug: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
        ];
      }

      const take = page * limit;
      const [trekBookings, tourBookings, totalTrekBookings, totalTourBookings] = await Promise.all([
        prisma.booking.findMany({
          where: trekWhere,
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, phone: true },
            },
            trip: { select: { id: true, title: true, slug: true, region: true } },
            schedule: { select: { date: true } },
            participants: true,
            payment: { select: { status: true, amount: true, paidAt: true } },
          },
          orderBy: { createdAt: 'desc' },
          take,
        }),
        prisma.tourBooking.findMany({
          where: tourWhere,
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, phone: true },
            },
            participants: true,
          },
          orderBy: { createdAt: 'desc' },
          take,
        }),
        prisma.booking.count({ where: trekWhere }),
        prisma.tourBooking.count({ where: tourWhere }),
      ]);

      const total = totalTrekBookings + totalTourBookings;
      const bookings = [
        ...trekBookings.map(normalizeTrekAdminBooking),
        ...tourBookings.map(normalizeTourAdminBooking),
      ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice((page - 1) * limit, page * limit);

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
      const kind = firstString(req.body.kind)?.toUpperCase() as AdminBookingKind | undefined;
      if (!id) throw new AppError(400, 'Invalid booking ID');

      if (!status || !(validBookingStatuses as readonly string[]).includes(status)) {
        throw new AppError(400, `Status must be one of: ${validBookingStatuses.join(', ')}`);
      }

      if (kind && !(validBookingKinds as readonly string[]).includes(kind)) {
        throw new AppError(400, `Booking kind must be one of: ${validBookingKinds.join(', ')}`);
      }

      const booking = await prisma.booking.findUnique({ where: { id } });
      if (booking && kind !== 'TOUR') {
        const updatedBooking = await prisma.booking.update({
          where: { id },
          data: { status: status as (typeof validBookingStatuses)[number] },
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
        return;
      }

      const tourBooking = await prisma.tourBooking.findUnique({ where: { id } });
      if (!tourBooking || kind === 'TREK') {
        throw new AppError(404, 'Booking not found');
      }

      const updatedBooking = await prisma.tourBooking.update({
        where: { id },
        data: { status: status as (typeof validBookingStatuses)[number] },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          participants: true,
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

// ---------- TOURS ----------

const tourSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  typeLabel: z.enum(['HILL_STATION', 'BEACH', 'SPIRITUAL', 'NATURE', 'ADVENTURE']),
  departureDate: z
    .string()
    .min(1, 'Departure date is required')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Invalid departure date'),
  groupSize: z.string().min(1, 'Group size is required'),
  distance: z.string().min(1, 'Distance is required'),
  driveTime: z.string().min(1, 'Drive time is required'),
  price: z.coerce.number().positive('Price must be positive'),
  comparePrice: z.coerce.number().positive('Compare price must be positive').optional(),
  summary: z.string().min(1, 'Summary is required'),
  highlights: z.array(z.string()),
  bestSeason: z.string().min(1, 'Best season is required'),
  tip: z.string().min(1, 'Tip is required'),
  imageUrl: z.string().url('Invalid image URL'),
  isActive: z.boolean().default(true),
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

router.get(
  '/tours',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = firstString(req.query.search);

      const where: any = {};
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [tours, total] = await Promise.all([
        prisma.tour.findMany({
          where,
          orderBy: { updatedAt: 'desc' },
          ...paginate(page, limit),
        }),
        prisma.tour.count({ where }),
      ]);

      res.json({
        success: true,
        data: { tours },
        pagination: paginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/tours/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid tour ID');

      const tour = await prisma.tour.findUnique({ where: { id } });

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

router.post(
  '/tours',
  validate(tourSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = generateSlug(req.body.title);

      const existing = await prisma.tour.findUnique({ where: { slug } });
      if (existing) {
        throw new AppError(409, 'A tour with a similar title already exists');
      }

      const tour = await prisma.tour.create({
        data: {
          ...req.body,
          slug,
          departureDate: parseDate(req.body.departureDate),
        },
      });

      res.status(201).json({
        success: true,
        message: 'Tour created successfully',
        data: { tour },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/tours/:id',
  validate(tourSchema.partial()),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid tour ID');

      const existing = await prisma.tour.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError(404, 'Tour not found');
      }

      const data: any = { ...req.body };
      if (data.departureDate) {
        data.departureDate = parseDate(data.departureDate);
      }
      if (data.title) {
        data.slug = generateSlug(data.title);
      }

      const tour = await prisma.tour.update({
        where: { id },
        data,
      });

      res.json({
        success: true,
        message: 'Tour updated successfully',
        data: { tour },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/tours/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid tour ID');

      const existing = await prisma.tour.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError(404, 'Tour not found');
      }

      await prisma.tour.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Tour deleted successfully',
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
