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
  variant?: 'default' | 'featuredCompact';
  revealOnScroll?: boolean;
  revealIndex?: number;
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

export default function TripCard({
  trip,
  variant = 'default',
  revealOnScroll = false,
  revealIndex = 0,
}: TripCardProps) {
  const hero = trip.images.find((image) => image.isPrimary) ?? trip.images[0];
  const price = trip.discountPrice ?? trip.basePrice;
  const galleryCount = trip.images.length;
  const departureCount = trip.schedules?.length ?? 0;
  const rating = trip.avgRating > 0 ? trip.avgRating : 5;
  const reviewCount = trip.totalReviews > 0 ? trip.totalReviews : 1;
  const filledStars = Math.max(1, Math.min(5, Math.round(rating)));
  const isCompact = variant === 'featuredCompact';

  return (
    <motion.article
      initial={revealOnScroll ? { opacity: 0, y: 42, scale: 0.97 } : undefined}
      whileInView={revealOnScroll ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={revealOnScroll ? { once: true, amount: 0.2 } : undefined}
      whileHover={{ y: -8 }}
      transition={
        revealOnScroll
          ? {
              duration: 0.55,
              delay: revealIndex * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }
          : { duration: 0.28, ease: 'easeOut' }
      }
      className={`group overflow-hidden bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] ${
        isCompact ? 'rounded-[1.2rem]' : 'rounded-[1.35rem]'
      }`}
    >
      <Link to={`/trips/${trip.slug}`} className="block">
        <div className={`relative overflow-hidden ${isCompact ? 'h-52' : 'h-64'}`}>
          <img
            src={hero?.url ?? MAHARASHTRA_MONSOON_IMAGES.fallback.tripCard}
            alt={hero?.altText || trip.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/28 via-transparent to-white/10" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className={`rounded-md bg-cyan-500 font-semibold text-white shadow-sm ${isCompact ? 'px-3 py-1.5 text-[0.8rem]' : 'px-4 py-2 text-sm'}`}>
              Featured
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-md bg-slate-900/72 font-medium text-white backdrop-blur-sm ${isCompact ? 'px-2.5 py-1.5 text-[0.8rem]' : 'px-3 py-2 text-sm'}`}>
              <Camera className="h-4 w-4" weight="fill" />
              {galleryCount}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-md bg-slate-900/72 font-medium text-white backdrop-blur-sm ${isCompact ? 'px-2.5 py-1.5 text-[0.8rem]' : 'px-3 py-2 text-sm'}`}>
              <CalendarDots className="h-4 w-4" weight="fill" />
              {departureCount}
            </span>
          </div>
        </div>

        <div className={`bg-white ${isCompact ? 'px-6 pb-6 pt-4' : 'rounded-t-[1.35rem] px-7 pb-7 pt-5'}`}>
          <div className="flex items-center gap-2 text-[0.95rem] text-slate-600">
            <MapPin className="h-4 w-4 text-lime-500" weight="fill" />
            <span className="line-clamp-1">{formatLocation(trip)}</span>
          </div>

          <h3 className={`mt-3 line-clamp-2 font-semibold leading-tight tracking-[-0.03em] text-slate-950 ${isCompact ? 'text-[1.65rem]' : 'text-[2rem]'}`}>
            {trip.title}
          </h3>

          <div className={`flex flex-wrap items-center gap-2 text-sm text-slate-600 ${isCompact ? 'mt-3' : 'mt-4'}`}>
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

          <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.95rem] text-slate-500 ${isCompact ? 'mt-4' : 'mt-6'}`}>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-5 w-5 text-lime-500" />
              {formatDuration(trip.durationHours)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-5 w-5 text-lime-500" />
              {trip.maxGroupSize} Person
            </span>
          </div>

          <div className={`border-t border-slate-200 ${isCompact ? 'mt-4 pt-4' : 'mt-6 pt-5'}`}>
            <div className="flex items-end justify-between gap-4">
              <div className="flex items-end gap-2">
                <p className="text-[1.05rem] text-slate-500">From</p>
                <p className={`font-semibold leading-none text-lime-600 ${isCompact ? 'text-[1.65rem]' : 'text-[1.9rem]'}`}>
                  INR {price.toLocaleString('en-IN')}
                </p>
                {trip.discountPrice ? (
                  <p className="pb-0.5 text-base text-slate-400 line-through">
                    INR {trip.basePrice.toLocaleString('en-IN')}
                  </p>
                ) : null}
              </div>

              <span className={`inline-flex items-center justify-center rounded-full border border-lime-500 text-lime-500 transition duration-200 group-hover:bg-lime-500 group-hover:text-white ${isCompact ? 'h-10 w-10' : 'h-11 w-11'}`}>
                <BookmarkSimple className="h-5 w-5" />
              </span>
            </div>

            <span className={`inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-600 ${isCompact ? 'mt-3' : 'mt-4'}`}>
              View Journey
              <ArrowRight className="h-4 w-4" weight="bold" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
