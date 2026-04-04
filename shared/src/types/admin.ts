export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  activeTrips: number;
  revenueChange: number;
  bookingsChange: number;
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
  difficulty: string;
  category: string;
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
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  itinerary: { time: string; title: string; description: string }[];
  routeMapUrl?: string;
  latitude?: number;
  longitude?: number;
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
