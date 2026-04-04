import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Clock,
  MapPin,
  Mountains,
  Lightning,
} from '@phosphor-icons/react';
import type { Trip, Difficulty } from '@alpha-trekkers/shared';
import { DIFFICULTIES } from '@alpha-trekkers/shared';

interface TripCardProps {
  trip: Trip;
}

const difficultyBgColors: Record<Difficulty, string> = {
  EASY: 'bg-green-500/90',
  MODERATE: 'bg-amber-500/90',
  DIFFICULT: 'bg-orange-500/90',
  EXTREME: 'bg-red-500/90',
};

export default function TripCard({ trip }: TripCardProps) {
  const primaryImage = trip.images.find((img) => img.isPrimary) ?? trip.images[0];
  const imageUrl = primaryImage?.url ?? '/placeholder-trek.jpg';
  const hasDiscount = trip.discountPrice != null && trip.discountPrice < trip.basePrice;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group overflow-hidden rounded-2xl bg-white shadow-md shadow-forest-900/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-forest-900/10"
    >
      <Link to={`/trips/${trip.slug}`} className="block">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageUrl}
            alt={trip.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${difficultyBgColors[trip.difficulty]}`}
            >
              {DIFFICULTIES[trip.difficulty].label}
            </span>
          </div>

          {/* Category badge */}
          <div className="absolute right-3 top-3">
            <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white">
              {trip.category.replace('_', ' ')}
            </span>
          </div>

          {/* Rating on image */}
          {trip.avgRating > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 text-amber-400" weight="fill" />
              <span className="text-xs font-semibold text-white">
                {trip.avgRating.toFixed(1)}
              </span>
              <span className="text-xs text-white/70">
                ({trip.totalReviews})
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="mb-1.5 font-heading text-lg font-bold text-forest-900 transition-colors group-hover:text-forest-700">
            {trip.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-forest-600/70">
            {trip.shortDescription}
          </p>

          {/* Stats row */}
          <div className="mb-4 flex items-center gap-4 text-xs text-forest-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{trip.durationHours}h</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{trip.distanceKm} km</span>
            </div>
            <div className="flex items-center gap-1">
              <Mountains className="h-3.5 w-3.5" />
              <span>{trip.elevationM}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Lightning className="h-3.5 w-3.5" />
              <span>{trip.region}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between border-t border-forest-100 pt-4">
            <div>
              {hasDiscount && (
                <span className="text-xs text-forest-400 line-through">
                  &#8377;{trip.basePrice.toLocaleString('en-IN')}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-forest-800">
                  &#8377;
                  {(hasDiscount ? trip.discountPrice! : trip.basePrice).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-forest-500">/person</span>
              </div>
            </div>
            <span className="rounded-lg bg-forest-50 px-3 py-1.5 text-xs font-semibold text-forest-700 transition-colors group-hover:bg-forest-500 group-hover:text-white">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
