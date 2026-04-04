import { z } from 'zod';

export const tripFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  search: z.string().optional(),
  difficulty: z.enum(['EASY', 'MODERATE', 'DIFFICULT', 'EXTREME']).optional(),
  category: z
    .enum(['WEEKEND', 'WEEKDAY', 'NIGHT_TREK', 'MONSOON', 'WINTER_SPECIAL', 'CAMPING'])
    .optional(),
  region: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sortBy: z
    .enum([
      'basePrice',
      'avgRating',
      'createdAt',
      'title',
      'difficulty',
      'durationHours',
      'popular',
      'rating',
      'newest',
      'price_asc',
      'price_desc',
    ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  isFeatured: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

const itineraryStepSchema = z.object({
  time: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const scheduleInputSchema = z.object({
  date: z.string().datetime({ offset: true }).or(z.string().date()),
  availableSpots: z.number().int().positive(),
  priceOverride: z.number().positive().optional(),
  status: z.enum(['OPEN', 'FULL', 'CANCELLED']).default('OPEN'),
});

export const createTripSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150).trim(),
  description: z.string().min(20, 'Description must be at least 20 characters').trim(),
  shortDescription: z.string().min(10).max(300).trim(),
  difficulty: z.enum(['EASY', 'MODERATE', 'DIFFICULT', 'EXTREME']),
  category: z.enum(['WEEKEND', 'WEEKDAY', 'NIGHT_TREK', 'MONSOON', 'WINTER_SPECIAL', 'CAMPING']),
  durationHours: z.number().int().positive(),
  distanceKm: z.number().positive(),
  elevationM: z.number().int().nonnegative(),
  maxAltitudeM: z.number().int().nonnegative(),
  region: z.string().min(2).trim(),
  fortName: z.string().optional(),
  startLocation: z.string().min(2).trim(),
  endLocation: z.string().min(2).trim(),
  meetingPoint: z.string().min(2).trim(),
  meetingTime: z.string().min(1).trim(),
  basePrice: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  maxGroupSize: z.number().int().positive().max(100),
  minAge: z.number().int().min(5).max(21).default(12),
  isFeatured: z.boolean().default(false),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  highlights: z.array(z.string().min(1)).min(1, 'At least one highlight is required'),
  inclusions: z.array(z.string().min(1)).min(1, 'At least one inclusion is required'),
  exclusions: z.array(z.string().min(1)).default([]),
  thingsToCarry: z.array(z.string().min(1)).default([]),
  itinerary: z.array(itineraryStepSchema).min(1, 'At least one itinerary step is required'),
  routeMapUrl: z.string().url().optional(),
  schedules: z.array(scheduleInputSchema).optional(),
});

export const updateTripSchema = createTripSchema.partial().extend({
  isActive: z.boolean().optional(),
  schedules: z.array(scheduleInputSchema).optional(),
});
