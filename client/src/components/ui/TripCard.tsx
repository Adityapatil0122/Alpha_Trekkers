import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Star,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { Trip } from '@alpha-trekkers/shared';

interface TripCardProps {
  trip: Trip;
  variant?: 'default' | 'featuredCompact';
  revealOnScroll?: boolean;
  revealIndex?: number;
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
  const rating = trip.avgRating > 0 ? trip.avgRating : 5;
  const reviewCount = trip.totalReviews > 0 ? trip.totalReviews : 1;
  const filledStars = Math.max(1, Math.min(5, Math.round(rating)));
  const isCompact = variant === 'featuredCompact';
  const hoverAnimation = isCompact ? { scale: 1.015 } : { y: -8 };

  return (
    <motion.article
      initial={revealOnScroll ? { opacity: 0, y: 42, scale: 0.97 } : undefined}
      whileInView={revealOnScroll ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={revealOnScroll ? { once: true, amount: 0.2 } : undefined}
      whileHover={hoverAnimation}
      transition={
        revealOnScroll
          ? {
              duration: 0.55,
              delay: revealIndex * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }
          : { duration: 0.28, ease: 'easeOut' }
      }
      className={`group h-full overflow-hidden border border-slate-200/70 bg-white ${
        isCompact
          ? 'rounded-[1.5rem] shadow-[0_10px_28px_rgba(15,23,42,0.045)]'
          : 'rounded-[1.35rem] shadow-[0_18px_50px_rgba(15,23,42,0.08)]'
      }`}
    >
      <Link to={`/trips/${trip.slug}`} className="flex h-full flex-col">
        <div className={`relative overflow-hidden ${isCompact ? 'h-52 sm:h-56' : 'h-56 sm:h-64'}`}>
          <img
            src={hero?.url ?? MAHARASHTRA_MONSOON_IMAGES.fallback.tripCard}
            alt={hero?.altText || trip.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,14,24,0.03)_0%,rgba(7,14,24,0.12)_48%,rgba(7,14,24,0.68)_100%)]" />
        </div>

        <div className={`relative flex flex-1 flex-col bg-white ${isCompact ? 'px-5 pb-5 pt-4 sm:px-6' : 'rounded-t-[1.35rem] px-5 pb-6 pt-5 sm:px-7 sm:pb-7'}`}>
          <div className="flex items-center gap-2 text-[0.92rem] text-slate-500">
            <MapPin className="h-4 w-4 shrink-0 text-lime-500" weight="fill" />
            <span className="line-clamp-1">{formatLocation(trip)}</span>
          </div>

          <h3 className={`mt-2.5 line-clamp-2 font-semibold leading-tight tracking-[-0.03em] text-slate-950 ${isCompact ? 'min-h-[3.5rem] text-[1.45rem] sm:min-h-[3.9rem] sm:text-[1.65rem]' : 'text-[1.7rem] sm:text-[2rem]'}`}>
            {trip.title}
          </h3>

          <div className={`${isCompact ? 'min-h-[2.2rem]' : ''}`}>
            <div className={`flex flex-wrap items-center gap-2 text-sm text-slate-600 ${isCompact ? 'mt-2' : 'mt-4'}`}>
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
          </div>

          <div className={`mt-auto border-t border-slate-200 ${isCompact ? 'pt-4' : 'mt-6 pt-5'}`}>
            <div className="flex items-end gap-2">
              <p className="text-[1.05rem] text-slate-500">From</p>
              <p className={`font-semibold leading-none text-lime-600 ${isCompact ? 'text-[1.45rem] sm:text-[1.65rem]' : 'text-[1.6rem] sm:text-[1.9rem]'}`}>
                INR {price.toLocaleString('en-IN')}
              </p>
              {trip.discountPrice ? (
                <p className="pb-0.5 text-base text-slate-400 line-through">
                  INR {trip.basePrice.toLocaleString('en-IN')}
                </p>
              ) : null}
            </div>

            <span className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-primary-600 ${isCompact ? 'mt-3' : 'mt-5'}`}>
              Book Now
              <ArrowRight className="h-4 w-4" weight="bold" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
