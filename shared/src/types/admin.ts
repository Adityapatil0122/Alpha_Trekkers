import type { Difficulty, ItineraryStep, TripCategory, TripImage, TripSchedule } from './trip.js';

export interface DashboardStats {
  totalUsers: number;
  totalTrips: number;
  totalBookings: number;
  totalRevenue: number;
  unreadMessages: number;
}

export interface RevenueData {
  date: string;
  amount: number;
}

export interface BookingChartData {
  category: string;
  count: number;
}

export interface HeroImage {
  id: string;
  url: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminTripInput {
  title: string;
  description: string;
  shortDescription: string;
  difficulty: Difficulty;
  category: TripCategory;
  durationHours: number;
  distanceKm: number;
  elevationM: number;
  maxAltitudeM: number;
  region: string;
  fortName?: string;
  startLocation: string;
  endLocation: string;
  meetingPoint: string;
  meetingTime: string;
  basePrice: number;
  discountPrice?: number;
  maxGroupSize: number;
  minAge?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  itinerary: ItineraryStep[];
  routeMapUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface AdminTripSummary {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  difficulty: Difficulty;
  category: TripCategory;
  region: string;
  basePrice: number;
  discountPrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  updatedAt: string;
  images: TripImage[];
  schedules: TripSchedule[];
  _count: {
    bookings: number;
    images: number;
    schedules: number;
  };
}

export interface AdminTripDetail extends AdminTripInput {
  id: string;
  slug: string;
  minAge: number;
  isFeatured: boolean;
  isActive: boolean;
  avgRating: number;
  totalReviews: number;
  totalBookings: number;
  images: TripImage[];
  schedules: (TripSchedule & {
    _count?: {
      bookings: number;
    };
  })[];
  createdAt: string;
  updatedAt: string;
  _count: {
    bookings: number;
    reviews: number;
  };
}

export interface AdminTripScheduleInput {
  date: string;
  availableSpots: number;
  priceOverride?: number | null;
  status: 'OPEN' | 'FULL' | 'CANCELLED';
}

export interface AdminTripImageInput {
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
