import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paginate, paginationMeta } from '../utils/pagination.js';
import { createBookingSchema, verifyPaymentSchema } from '../validators/booking.js';
import crypto from 'crypto';

const router = Router();

// GET /api/bookings - User's bookings
router.get(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const where: any = { userId: req.user!.id };
      if (status) {
        where.status = status.toUpperCase();
      }

      const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
          where,
          include: {
            trip: {
              select: {
                id: true,
                title: true,
                slug: true,
                shortDescription: true,
                difficulty: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: { url: true, altText: true },
                },
              },
            },
            schedule: {
              select: { date: true, status: true },
            },
            payment: {
              select: { status: true, paidAt: true, razorpayPaymentId: true },
            },
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

// GET /api/bookings/:id - Single booking
router.get(
  '/:id',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
        include: {
          trip: {
            select: {
              id: true,
              title: true,
              slug: true,
              shortDescription: true,
              difficulty: true,
              meetingPoint: true,
              meetingTime: true,
              startLocation: true,
              thingsToCarry: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true, altText: true },
              },
            },
          },
          schedule: true,
          participants: true,
          payment: true,
        },
      });

      if (!booking) {
        throw new AppError(404, 'Booking not found');
      }

      if (booking.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw new AppError(403, 'Not authorized to view this booking');
      }

      res.json({
        success: true,
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/bookings - Create booking
router.post(
  '/',
  auth,
  validate(createBookingSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tripId, scheduleId, numberOfPeople, specialRequests, participants } = req.body;

      // Validate participants count matches numberOfPeople
      if (participants.length !== numberOfPeople) {
        throw new AppError(400, 'Number of participants must match numberOfPeople');
      }

      const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Get trip and schedule
        const trip = await tx.trip.findUnique({ where: { id: tripId } });
        if (!trip || !trip.isActive) {
          throw new AppError(404, 'Trip not found or inactive');
        }

        const schedule = await tx.tripSchedule.findUnique({
          where: { id: scheduleId },
        });

        if (!schedule || schedule.tripId !== tripId) {
          throw new AppError(404, 'Schedule not found for this trip');
        }

        if (schedule.status !== 'OPEN') {
          throw new AppError(400, 'This schedule is no longer available for booking');
        }

        if (schedule.date <= new Date()) {
          throw new AppError(400, 'Cannot book a past schedule');
        }

        if (schedule.availableSpots < numberOfPeople) {
          throw new AppError(
            400,
            `Only ${schedule.availableSpots} spots available for this date`
          );
        }

        // Check participant ages
        for (const p of participants) {
          if (p.age < trip.minAge) {
            throw new AppError(
              400,
              `Participant "${p.fullName}" does not meet the minimum age of ${trip.minAge}`
            );
          }
        }

        // Calculate price
        const pricePerPerson = schedule.priceOverride ?? trip.discountPrice ?? trip.basePrice;
        const totalAmount = pricePerPerson * numberOfPeople;

        // Create booking with participants
        const newBooking = await tx.booking.create({
          data: {
            userId: req.user!.id,
            tripId,
            scheduleId,
            numberOfPeople,
            totalAmount,
            specialRequests,
            participants: {
              create: participants.map((p: any) => ({
                fullName: p.fullName,
                age: p.age,
                phone: p.phone,
                emergencyName: p.emergencyName,
                emergencyPhone: p.emergencyPhone,
                medicalNotes: p.medicalNotes,
              })),
            },
          },
          include: {
            trip: {
              select: { title: true, slug: true },
            },
            schedule: { select: { date: true } },
            participants: true,
          },
        });

        // Decrement available spots
        await tx.tripSchedule.update({
          where: { id: scheduleId },
          data: {
            availableSpots: { decrement: numberOfPeople },
            ...(schedule.availableSpots - numberOfPeople <= 0 && { status: 'FULL' }),
          },
        });

        // Increment trip total bookings
        await tx.trip.update({
          where: { id: tripId },
          data: { totalBookings: { increment: 1 } },
        });

        return newBooking;
      });

      res.status(201).json({
        success: true,
        message: 'Booking created successfully. Please complete payment.',
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/bookings/:id/cancel - Cancel booking
router.post(
  '/:id/cancel',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { schedule: true, payment: true },
      });

      if (!booking) {
        throw new AppError(404, 'Booking not found');
      }

      if (booking.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw new AppError(403, 'Not authorized to cancel this booking');
      }

      if (booking.status === 'CANCELLED') {
        throw new AppError(400, 'Booking is already cancelled');
      }

      if (booking.status === 'COMPLETED') {
        throw new AppError(400, 'Cannot cancel a completed booking');
      }

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Cancel the booking
        await tx.booking.update({
          where: { id },
          data: { status: 'CANCELLED' },
        });

        // Restore available spots
        await tx.tripSchedule.update({
          where: { id: booking.scheduleId },
          data: {
            availableSpots: { increment: booking.numberOfPeople },
            status: 'OPEN',
          },
        });

        // Decrement total bookings
        await tx.trip.update({
          where: { id: booking.tripId },
          data: { totalBookings: { decrement: 1 } },
        });

        // If payment was completed, mark as refunded
        if (booking.payment?.status === 'COMPLETED') {
          await tx.payment.update({
            where: { id: booking.payment.id },
            data: { status: 'REFUNDED' },
          });

          await tx.booking.update({
            where: { id },
            data: { status: 'REFUNDED' },
          });

          // TODO: Initiate actual refund via Razorpay API
        }
      });

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/bookings/:id/create-order - Create Razorpay order
router.post(
  '/:id/create-order',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const booking = await prisma.booking.findUnique({ where: { id } });

      if (!booking) {
        throw new AppError(404, 'Booking not found');
      }

      if (booking.userId !== req.user!.id) {
        throw new AppError(403, 'Not authorized');
      }

      if (booking.status !== 'PENDING') {
        throw new AppError(400, 'Payment can only be initiated for pending bookings');
      }

      // Check if an order already exists
      const existingPayment = await prisma.payment.findUnique({
        where: { bookingId: id },
      });

      if (existingPayment && existingPayment.status === 'COMPLETED') {
        throw new AppError(400, 'Payment already completed for this booking');
      }

      // TODO: Replace with actual Razorpay integration
      // const Razorpay = (await import('razorpay')).default;
      // const razorpay = new Razorpay({
      //   key_id: env.RAZORPAY_KEY_ID,
      //   key_secret: env.RAZORPAY_KEY_SECRET,
      // });
      // const order = await razorpay.orders.create({
      //   amount: Math.round(booking.totalAmount * 100),
      //   currency: 'INR',
      //   receipt: booking.id,
      // });

      // Mock Razorpay order for development
      const mockOrderId = `order_${crypto.randomBytes(12).toString('hex')}`;

      const payment = existingPayment
        ? await prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
              razorpayOrderId: mockOrderId,
              amount: booking.totalAmount,
              status: 'PENDING',
            },
          })
        : await prisma.payment.create({
            data: {
              bookingId: id,
              razorpayOrderId: mockOrderId,
              amount: booking.totalAmount,
              currency: 'INR',
            },
          });

      res.json({
        success: true,
        data: {
          orderId: payment.razorpayOrderId,
          amount: Math.round(booking.totalAmount * 100),
          currency: 'INR',
          bookingId: id,
          keyId: env.RAZORPAY_KEY_ID,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/bookings/:id/verify-payment - Verify Razorpay payment
router.post(
  '/:id/verify-payment',
  auth,
  validate(verifyPaymentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { payment: true },
      });

      if (!booking) {
        throw new AppError(404, 'Booking not found');
      }

      if (booking.userId !== req.user!.id) {
        throw new AppError(403, 'Not authorized');
      }

      if (!booking.payment || booking.payment.razorpayOrderId !== razorpayOrderId) {
        throw new AppError(400, 'Invalid order ID');
      }

      // Verify Razorpay signature
      // TODO: Use actual Razorpay key_secret in production
      const expectedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        await prisma.payment.update({
          where: { id: booking.payment.id },
          data: { status: 'FAILED' },
        });
        throw new AppError(400, 'Payment verification failed');
      }

      // Mark payment and booking as confirmed
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: booking.payment.id },
          data: {
            razorpayPaymentId,
            razorpaySignature,
            status: 'COMPLETED',
            paidAt: new Date(),
          },
        }),
        prisma.booking.update({
          where: { id },
          data: { status: 'CONFIRMED' },
        }),
      ]);

      res.json({
        success: true,
        message: 'Payment verified and booking confirmed',
        data: { bookingId: id, status: 'CONFIRMED' },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
