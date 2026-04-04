export type Difficulty = 'EASY' | 'MODERATE' | 'DIFFICULT' | 'EXTREME';
export type TripCategory = 'WEEKEND' | 'WEEKDAY' | 'NIGHT_TREK' | 'MONSOON' | 'WINTER_SPECIAL' | 'CAMPING';

export interface TripImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface TripSchedule {
  id: string;
  tripId: string;
  date: string;
  availableSpots: number;
  priceOverride?: number;
  status: string;
}

export interface Trip {
  id: string;
  title: string;
  slug: string;
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
  minAge: number;
  isActive: boolean;
  isFeatured: boolean;
  avgRating: number;
  totalReviews: number;
  totalBookings: number;
  latitude?: number;
  longitude?: number;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  itinerary: ItineraryStep[];
  routeMapUrl?: string;
  images: TripImage[];
  schedules?: TripSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryStep {
  time: string;
  title: string;
  description: string;
}

export interface TripFilters {
  page?: number;
  limit?: number;
  category?: TripCategory;
  difficulty?: Difficulty;
  minPrice?: number;
  maxPrice?: number;
  region?: string;
  search?: string;
  sortBy?:
    | 'price_asc'
    | 'price_desc'
    | 'rating'
    | 'newest'
    | 'popular'
    | 'basePrice'
    | 'avgRating'
    | 'createdAt'
    | 'title'
    | 'difficulty'
    | 'durationHours';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

export interface TripListResponse {
  trips: Trip[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
