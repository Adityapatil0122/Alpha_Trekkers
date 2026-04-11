import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  UsersThree,
  Star,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { ApiResponse, Tour, TourType } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type TripFilter = 'All' | TourType;

const tripsHeroBackground = MAHARASHTRA_MONSOON_IMAGES.trips.torna[3];

const TOUR_FILTERS: TripFilter[] = [
  'All',
  'HILL_STATION',
  'BEACH',
  'SPIRITUAL',
  'NATURE',
  'ADVENTURE',
];

const typeLabels: Record<TourType, string> = {
  HILL_STATION: 'Hill Station',
  BEACH: 'Beach',
  SPIRITUAL: 'Spiritual',
  NATURE: 'Nature',
  ADVENTURE: 'Adventure',
};

const typeCopy: Record<TourType, string> = {
  HILL_STATION: 'cool-weather escapes',
  BEACH: 'coastal breaks',
  SPIRITUAL: 'temple-led routes',
  NATURE: 'scenic ghat loops',
  ADVENTURE: 'action-first outings',
};

const tourBenefits = [
  {
    title: 'Quick Route Clarity',
    copy: 'Dates, group size, and starting price are visible right away, so choosing a trip stays fast and stress-free.',
  },
  {
    title: 'Picked For Pune Starts',
    copy: 'These routes are chosen for real early-morning departures, scenic value, and smoother same-day planning.',
  },
  {
    title: 'Booking Support That Helps',
    copy: 'Every card goes straight into a guided booking flow, making it easier to confirm traveler details and keep reservations tidy.',
  },
];

function getBookingHref(tour: Tour) {
  return `/tours/${tour.slug}`;
}

function formatMoney(amount: number) {
  return `INR ${Math.round(amount).toLocaleString('en-IN')}`;
}

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function TripCard({
  tour,
  index,
}: {
  tour: Tour;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.42,
        delay: Math.min(index, 5) * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="flex h-full flex-col overflow-hidden rounded-[2.2rem] border border-[#dbe4de] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.07)]"
    >
      <div className="relative h-[12.5rem] overflow-hidden sm:h-[13.5rem]">
        <img
          src={tour.imageUrl}
          alt={tour.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-[0.8rem] bg-[#57b94f] px-3.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_24px_rgba(87,185,79,0.24)]">
            {formatDateLabel(tour.departureDate)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-7">
        <div className="mb-3">
          <span className="rounded-full bg-forest-500/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-forest-600">
            {typeLabels[tour.typeLabel]}
          </span>
        </div>
        <h2 className="min-h-[3.3rem] font-heading text-[1.45rem] leading-[1.08] text-[#0f2540] sm:min-h-[3.9rem] sm:text-[1.7rem]">
          {tour.title}
        </h2>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <Star
                key={`${tour.slug}-star-${starIndex}`}
                className="h-4 w-4"
                weight="fill"
              />
            ))}
          </div>
          <span className="text-slate-700">(1 Review)</span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-6 text-[0.95rem] text-slate-500">
          <div className="flex items-center gap-2">
            <UsersThree className="h-5 w-5 text-lime-500" weight="fill" />
            <span>{tour.groupSize}</span>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-200 pt-5">
          <div className="flex flex-wrap items-end gap-2">
            <p className="text-[1.05rem] text-slate-500">From</p>
            <p className="font-heading text-[1.8rem] leading-none text-lime-600 sm:text-[2.15rem]">
              {formatMoney(tour.price)}
            </p>
            {tour.comparePrice && tour.comparePrice > tour.price ? (
              <p className="pb-1 text-sm text-slate-400 line-through">{formatMoney(tour.comparePrice)}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6">
          <Link
            to={getBookingHref(tour)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5dbb59] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#51ae4d]"
          >
            Book Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Trips() {
  const [activeFilter, setActiveFilter] = useState<TripFilter>('All');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<ApiResponse<{ tours: Tour[] }>>('/tours')
      .then((response) => {
        setTours(response.data.data.tours);
        setLoadFailed(false);
      })
      .catch(() => {
        setTours([]);
        setLoadFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTours = useMemo(() => {
    if (activeFilter === 'All') return tours;
    return tours.filter((tour) => tour.typeLabel === activeFilter);
  }, [activeFilter, tours]);

  const eyebrowCopy =
    activeFilter === 'All'
      ? 'Pick a route and book the right one-day escape.'
      : `${filteredTours.length} ${typeCopy[activeFilter]} ready to compare.`;

  return (
    <>
      <section className="relative overflow-hidden bg-[#07131f] pt-24 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={tripsHeroBackground}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-[1.04] object-cover object-center saturate-[1.05]"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,23,18,0.54)_0%,rgba(9,28,22,0.36)_36%,rgba(8,26,23,0.16)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,71,47,0.18)_0%,rgba(8,28,23,0.08)_34%,rgba(5,17,23,0.38)_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24">
          <div className="max-w-4xl">
            <span className="playful-text text-2xl !text-primary-300 sm:text-3xl">
              Curated day trips
            </span>

            <h1 className="mt-7 max-w-3xl font-heading text-4xl leading-[0.92] !text-white drop-shadow-[0_12px_34px_rgba(0,0,0,0.38)] sm:text-5xl lg:text-[4.6rem]">
              Scenic escapes around Pune worth planning next.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-sand-100/82 sm:text-lg">
              Clean, destination-led getaways for quick resets, scenic drives, temple mornings, hill air,
              rafting bursts, and coastal breaks. Pick a mood, compare the route, and book the one that fits.
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-white py-14 sm:py-16">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="section-script">Why choose us</p>
            <h2 className="mt-3 text-4xl font-bold text-dark-900 sm:text-5xl">
              What Makes <span className="playful-text text-primary-500">Alpha Trekkers</span> Better For Quick Escapes
            </h2>
            <p className="mt-5 text-base leading-8 text-ink-700/72 sm:text-lg">
              Clean routes, easy comparison, and simple booking support for hill air, beach breaks,
              spiritual mornings, and short adventure plans around Pune.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {tourBenefits.map((benefit, benefitIndex) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="rounded-[2rem] border border-[#dbe4de] bg-white p-7 shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-600">
                  0{benefitIndex + 1}
                </div>
                <h3 className="mt-5 text-[1.35rem] font-semibold text-dark-900">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-dark-500">
                  {benefit.copy}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start gap-5 border-t border-[#dbe4de] pt-10">
            <div>
              <p className="text-sm leading-7 text-ink-700/72">{eyebrowCopy}</p>
              <h3 className="mt-1 text-2xl font-semibold text-dark-900 sm:text-[2rem]">
                Trips to compare
              </h3>
            </div>

            <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 pb-1">
              <div className="flex min-w-max gap-2.5">
                {TOUR_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                      activeFilter === filter
                        ? 'border-forest-500 bg-forest-500 text-white shadow-[0_18px_42px_rgba(58,138,74,0.22)]'
                        : 'border-[#d8e4dc] bg-white text-slate-700 hover:border-forest-300 hover:text-forest-600'
                    }`}
                  >
                    {filter === 'All' ? 'All' : typeLabels[filter]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-16">
              <LoadingSpinner text="Loading tours..." />
            </div>
          ) : loadFailed ? (
            <div className="mt-8 rounded-[1.6rem] border border-coral-500/16 bg-coral-500/5 px-6 py-10 text-center">
              <h3 className="text-xl font-semibold text-ink-900">Tours are unavailable right now</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-700/72">
                We could not load the latest tour departures. Please try again in a moment.
              </p>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="mt-8 rounded-[1.6rem] border border-ink-900/8 bg-sand-50 px-6 py-10 text-center">
              <h3 className="text-xl font-semibold text-ink-900">No tours found</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-700/72">
                New one-day departures will appear here once they are active in the admin panel.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {filteredTours.map((tour, index) => (
                <TripCard key={tour.id} tour={tour} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
