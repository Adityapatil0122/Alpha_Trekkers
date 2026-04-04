import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarBlank,
  Clock,
  Crown,
  MapPinLine,
  Star,
  UsersThree,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { Difficulty, Trip } from '@alpha-trekkers/shared';
import { DIFFICULTIES } from '@alpha-trekkers/shared';

interface TripCardProps {
  trip: Trip;
}

const difficultyTone: Record<Difficulty, string> = {
  EASY: 'bg-sea-500/12 text-sea-600',
  MODERATE: 'bg-gold-500/12 text-gold-600',
  DIFFICULT: 'bg-coral-500/12 text-coral-600',
  EXTREME: 'bg-ink-900/12 text-ink-900',
};

export default function TripCard({ trip }: TripCardProps) {
  const hero = trip.images.find((image) => image.isPrimary) ?? trip.images[0];
  const price = trip.discountPrice ?? trip.basePrice;
  const earliestDate = trip.schedules?.[0]?.date;
  const isBestseller = trip.avgRating >= 4.5;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="monsoon-card travel-panel overflow-hidden rounded-[2rem]"
    >
      <Link to={`/trips/${trip.slug}`} className="block">
        <div className="relative h-72 overflow-hidden">
          <img
            src={hero?.url ?? MAHARASHTRA_MONSOON_IMAGES.fallback.tripCard}
            alt={hero?.altText || trip.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {/* Subtle rain pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(105deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, transparent 4px)',
              backgroundSize: '8px 20px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/82 via-ink-950/15 to-transparent" />
          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyTone[trip.difficulty]}`}>
              {DIFFICULTIES[trip.difficulty].label}
            </span>
            <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-ink-800">
              {trip.category.replace('_', ' ')}
            </span>
          </div>
          {isBestseller && (
            <div className="absolute right-5 top-5">
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/90 px-3 py-1 text-xs font-bold text-ink-950 shadow-lg">
                <Crown className="h-3.5 w-3.5" weight="fill" />
                Bestseller
              </span>
            </div>
          )}
          <div className="absolute inset-x-5 bottom-5">
            <p className="text-sm font-medium text-gold-400">{trip.region}</p>
            <h3 className="font-heading text-3xl font-semibold text-white">{trip.title}</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-ink-700">
              <Star className="h-4 w-4 text-gold-500" weight="fill" />
              <span>{trip.avgRating > 0 ? trip.avgRating.toFixed(1) : 'New'}</span>
              <span className="text-ink-600/60">({trip.totalReviews} reviews)</span>
            </div>
            <div className="rounded-full bg-forest-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-forest-500">
              Trending
            </div>
          </div>

          <p className="mt-4 line-clamp-2 text-sm leading-7 text-ink-700/74">
            {trip.shortDescription}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-ink-700">
            <span className="flex items-center gap-2 rounded-2xl bg-sand-100 px-3 py-2">
              <Clock className="h-4 w-4 text-forest-600" />
              {trip.durationHours} hours
            </span>
            <span className="flex items-center gap-2 rounded-2xl bg-sand-100 px-3 py-2">
              <UsersThree className="h-4 w-4 text-forest-600" />
              Up to {trip.maxGroupSize}
            </span>
            <span className="flex items-center gap-2 rounded-2xl bg-sand-100 px-3 py-2">
              <MapPinLine className="h-4 w-4 text-forest-600" />
              {trip.startLocation}
            </span>
            <span className="flex items-center gap-2 rounded-2xl bg-sand-100 px-3 py-2">
              <CalendarBlank className="h-4 w-4 text-forest-600" />
              {earliestDate
                ? new Date(earliestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                : 'On request'}
            </span>
          </div>

          <div className="mt-6 flex items-end justify-between border-t border-ink-900/8 pt-5">
            <div>
              {trip.discountPrice ? (
                <p className="relative inline-block text-sm text-ink-600/55">
                  <span>INR {trip.basePrice.toLocaleString('en-IN')}</span>
                  <span
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <span className="h-[1.5px] w-full origin-center -rotate-12 bg-coral-500/70" />
                  </span>
                </p>
              ) : null}
              <p className="font-heading text-3xl font-semibold text-ink-900">
                INR {price.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-ink-600/68">per traveler</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-forest-500">
              View journey
              <ArrowRight className="h-4 w-4" weight="bold" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
