import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookmarkSimple,
  CalendarDots,
  Camera,
  Clock,
  MapPin,
  Star,
  Users,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { Trip } from '@alpha-trekkers/shared';

interface TripCardProps {
  trip: Trip;
}

function formatDuration(durationHours: number) {
  if (durationHours >= 24) {
    const days = Math.round(durationHours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  return `${durationHours} hour${durationHours > 1 ? 's' : ''}`;
}

function formatLocation(trip: Trip) {
  return [trip.startLocation, trip.region].filter(Boolean).join(', ');
}

export default function TripCard({ trip }: TripCardProps) {
  const hero = trip.images.find((image) => image.isPrimary) ?? trip.images[0];
  const price = trip.discountPrice ?? trip.basePrice;
  const galleryCount = trip.images.length;
  const departureCount = trip.schedules?.length ?? 0;
  const rating = trip.avgRating > 0 ? trip.avgRating : 5;
  const reviewCount = trip.totalReviews > 0 ? trip.totalReviews : 1;
  const filledStars = Math.max(1, Math.min(5, Math.round(rating)));

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="group overflow-hidden rounded-[1.35rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
    >
      <Link to={`/trips/${trip.slug}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={hero?.url ?? MAHARASHTRA_MONSOON_IMAGES.fallback.tripCard}
            alt={hero?.altText || trip.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/28 via-transparent to-white/10" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              Featured
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900/72 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Camera className="h-4 w-4" weight="fill" />
              {galleryCount}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900/72 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <CalendarDots className="h-4 w-4" weight="fill" />
              {departureCount}
            </span>
          </div>
        </div>

        <div className="rounded-t-[1.35rem] bg-white px-7 pb-7 pt-5">
          <div className="flex items-center gap-2 text-[0.95rem] text-slate-600">
            <MapPin className="h-4 w-4 text-lime-500" weight="fill" />
            <span className="line-clamp-1">{formatLocation(trip)}</span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-slate-950">
            {trip.title}
          </h3>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`${trip.id}-star-${index}`}
                  className="h-4 w-4"
                  weight={index < filledStars ? 'fill' : 'regular'}
                />
              ))}
            </div>
            <span className="text-slate-700">
              ({reviewCount} Review{reviewCount > 1 ? 's' : ''})
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.95rem] text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-5 w-5 text-lime-500" />
              {formatDuration(trip.durationHours)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-5 w-5 text-lime-500" />
              {trip.maxGroupSize} Person
            </span>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex items-end justify-between gap-4">
              <div className="flex items-end gap-2">
                <p className="text-[1.05rem] text-slate-500">From</p>
                <p className="text-[1.9rem] font-semibold leading-none text-lime-600">
                  INR {price.toLocaleString('en-IN')}
                </p>
                {trip.discountPrice ? (
                  <p className="pb-0.5 text-base text-slate-400 line-through">
                    INR {trip.basePrice.toLocaleString('en-IN')}
                  </p>
                ) : null}
              </div>

              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-lime-500 text-lime-500 transition duration-200 group-hover:bg-lime-500 group-hover:text-white">
                <BookmarkSimple className="h-5 w-5" />
              </span>
            </div>

            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-600">
              View Journey
              <ArrowRight className="h-4 w-4" weight="bold" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
