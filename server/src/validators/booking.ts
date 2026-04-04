import { z } from 'zod';

const participantSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  age: z.number().int().min(5, 'Minimum age is 5').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  emergencyName: z.string().min(2).max(100).trim().optional(),
  emergencyPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid emergency phone number')
    .optional(),
  medicalNotes: z.string().max(500).optional(),
});

export const createBookingSchema = z.object({
  tripId: z.string().uuid('Invalid trip ID'),
  scheduleId: z.string().uuid('Invalid schedule ID'),
  numberOfPeople: z.number().int().min(1, 'At least 1 person required').max(20),
  specialRequests: z.string().max(1000).optional(),
  participants: z
    .array(participantSchema)
    .min(1, 'At least one participant is required'),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, 'Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Payment ID is required'),
  razorpaySignature: z.string().min(1, 'Signature is required'),
});
