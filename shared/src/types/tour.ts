export type TourType = 'HILL_STATION' | 'BEACH' | 'SPIRITUAL' | 'NATURE' | 'ADVENTURE';

export interface Tour {
  id: string;
  title: string;
  slug: string;
  typeLabel: TourType;
  departureDate: string;
  groupSize: string;
  distance: string;
  driveTime: string;
  price: number;
  comparePrice?: number | null;
  summary: string;
  highlights: string[];
  bestSeason: string;
  tip: string;
  imageUrl: string;
  isActive: boolean;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}
