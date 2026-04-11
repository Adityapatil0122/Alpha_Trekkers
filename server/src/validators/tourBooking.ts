import { z } from 'zod';

const indianPhonePattern = /^[6-9]\d{9}$/;

const optionalTextField = z
  .string()
  .transform((value) => value.trim())
  .optional();

const participantSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').trim(),
  age: z.coerce.number().min(1, 'Age must be at least 1').max(100),
  phone: z.string().regex(indianPhonePattern, 'Valid 10-digit Indian phone required').trim(),
  emergencyName: optionalTextField.refine((value) => !value || value.length >= 2, 'Emergency contact must be at least 2 characters'),
  emergencyPhone: optionalTextField.refine((value) => !value || indianPhonePattern.test(value), 'Valid emergency phone required'),
  medicalNotes: optionalTextField,
});

export const createTourBookingSchema = z.object({
  tourId: z.string().uuid('Invalid tour ID'),
  numberOfPeople: z.coerce.number().int().positive('At least one traveler is required'),
  specialRequests: optionalTextField,
  participants: z.array(participantSchema).min(1, 'At least one participant is required'),
});
