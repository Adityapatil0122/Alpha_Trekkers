import { z } from 'zod';

export const createReviewSchema = z.object({
  tripId: z.string().uuid('Invalid trip ID'),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(3).max(150).trim().optional(),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review must not exceed 2000 characters')
    .trim(),
});
