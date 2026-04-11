import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTourBookingSchema } from '../validators/tourBooking.js';

const router = Router();

function firstString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
}

// GET /api/tour-bookings - User's tour bookings
router.get(
  '/',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await prisma.tourBooking.findMany({
        where: { userId: req.user!.id },
        include: { participants: true },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: { bookings },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/tour-bookings - Create an instant tour booking
router.post(
  '/',
  auth,
  validate(createTourBookingSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tourId, numberOfPeople, specialRequests, participants } = req.body;

      if (participants.length !== numberOfPeople) {
        throw new AppError(400, 'Number of participants must match numberOfPeople');
      }

      const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const tour = await tx.tour.findUnique({ where: { id: tourId } });

        if (!tour || !tour.isActive) {
          throw new AppError(404, 'Tour not found or inactive');
        }

        if (tour.departureDate <= new Date()) {
          throw new AppError(400, 'Cannot book a past tour departure');
        }

        const newBooking = await tx.tourBooking.create({
          data: {
            userId: req.user!.id,
            tourId: tour.id,
            tourSlug: tour.slug,
            tourTitle: tour.title,
            tourImageUrl: tour.imageUrl,
            departureDate: tour.departureDate,
            numberOfPeople,
            pricePerPerson: tour.price,
            totalAmount: tour.price * numberOfPeople,
            status: 'CONFIRMED',
            specialRequests,
            participants: {
              create: participants.map((participant: {
                fullName: string;
                age: number;
                phone: string;
                emergencyName?: string;
                emergencyPhone?: string;
                medicalNotes?: string;
              }) => ({
                fullName: participant.fullName,
                age: participant.age,
                phone: participant.phone,
                emergencyName: participant.emergencyName,
                emergencyPhone: participant.emergencyPhone,
                medicalNotes: participant.medicalNotes,
              })),
            },
          },
          include: { participants: true },
        });

        await tx.tour.update({
          where: { id: tour.id },
          data: { totalBookings: { increment: 1 } },
        });

        return newBooking;
      });

      res.status(201).json({
        success: true,
        message: 'Tour booked successfully',
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/tour-bookings/:id/cancel - Cancel a tour booking
router.post(
  '/:id/cancel',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = firstString(req.params.id);
      if (!id) throw new AppError(400, 'Invalid booking ID');

      const booking = await prisma.tourBooking.findUnique({
        where: { id },
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
        await tx.tourBooking.update({
          where: { id },
          data: { status: 'CANCELLED' },
        });

        if (booking.tourId) {
          await tx.tour.updateMany({
            where: { id: booking.tourId, totalBookings: { gt: 0 } },
            data: { totalBookings: { decrement: 1 } },
          });
        }
      });

      res.json({
        success: true,
        message: 'Tour booking cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
