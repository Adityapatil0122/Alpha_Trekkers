import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  UsersThree,
  Star,
} from '@phosphor-icons/react';
import {
  ONE_DAY_TRIP_FILTERS,
  oneDayTrips,
  type OneDayTrip,
  type OneDayTripType,
} from '@/content/oneDayTrips';

type TripFilter = 'All' | OneDayTripType;

const tripsHeroBackground = '/destinations/rajmachi.png';

const typeCopy: Record<OneDayTripType, string> = {
  'Hill Station': 'cool-weather escapes',
  Beach: 'coastal breaks',
  Spiritual: 'temple-led routes',
  Nature: 'scenic ghat loops',
  Adventure: 'action-first outings',
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
    copy: 'Every card goes straight to our team, making it easier to confirm availability, pickup points, and final pricing.',
  },
];

function getBookingHref(trip: OneDayTrip) {
  const params = new URLSearchParams({
    trip: trip.slug,
    source: 'one-day-trips',
  });

  return `/contact?${params.toString()}`;
}

function TripCard({
  trip,
  index,
}: {
  trip: OneDayTrip;
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
      <div className="relative h-[13.5rem] overflow-hidden">
        <img
          src={trip.imageUrl}
          alt={trip.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-[0.8rem] bg-[#57b94f] px-3.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_24px_rgba(87,185,79,0.24)]">
            {trip.dateLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-7 pb-6 pt-5">
        <h2 className="min-h-[3.9rem] font-heading text-[1.7rem] leading-[1.08] text-[#0f2540]">
          {trip.title}
        </h2>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <Star
                key={`${trip.slug}-star-${starIndex}`}
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
            <span>{trip.groupSizeLabel}</span>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-200 pt-5">
          <div className="flex flex-wrap items-end gap-2">
            <p className="text-[1.05rem] text-slate-500">From</p>
            <p className="font-heading text-[2.15rem] leading-none text-lime-600">
              {trip.priceLabel}
            </p>
            <p className="pb-1 text-sm text-slate-400 line-through">{trip.comparePriceLabel}</p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to={getBookingHref(trip)}
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

  const filteredTrips = useMemo(() => {
    if (activeFilter === 'All') return oneDayTrips;
    return oneDayTrips.filter((trip) => trip.typeLabel === activeFilter);
  }, [activeFilter]);

  const eyebrowCopy =
    activeFilter === 'All'
      ? 'Pick a route and book the right one-day escape.'
      : `${filteredTrips.length} ${typeCopy[activeFilter]} ready to compare.`;

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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,23,18,0.64)_0%,rgba(9,28,22,0.46)_36%,rgba(8,26,23,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,71,47,0.18)_0%,rgba(8,28,23,0.08)_34%,rgba(5,17,23,0.38)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(149,233,157,0.18),transparent_22%),radial-gradient(circle_at_82%_16%,rgba(216,241,150,0.1),transparent_18%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-24">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-white/14 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sand-100 backdrop-blur-md">
              Curated day trips
            </span>

            <h1 className="mt-7 max-w-3xl font-heading text-5xl leading-[0.92] !text-white drop-shadow-[0_12px_34px_rgba(0,0,0,0.38)] sm:text-6xl lg:text-[4.6rem]">
              Scenic escapes around Pune worth planning next.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-sand-100/82 sm:text-lg">
              Clean, destination-led getaways for quick resets, scenic drives, temple mornings, hill air,
              rafting bursts, and coastal breaks. Pick a mood, compare the route, and book the one that fits.
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-[linear-gradient(180deg,#f7fbf8_0%,#ffffff_28%,#f7faf8_100%)] py-14 sm:py-16">
        <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-[#dff0de] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#f5ecd0] blur-3xl" />

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
                {ONE_DAY_TRIP_FILTERS.map((filter) => (
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
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {filteredTrips.map((trip, index) => (
              <TripCard key={trip.slug} trip={trip} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
