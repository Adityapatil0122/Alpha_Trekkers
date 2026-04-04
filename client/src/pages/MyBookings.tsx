import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarBlank,
  Compass,
  Hourglass,
  Mountains,
  XCircle,
  CheckCircle,
  Clock,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { ApiResponse, Booking, BookingStatus } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const statusConfig: Record<
  BookingStatus,
  { label: string; Icon: typeof CheckCircle; className: string }
> = {
  PENDING: { label: 'Pending', Icon: Hourglass, className: 'bg-gold-500/12 text-gold-600' },
  CONFIRMED: { label: 'Confirmed', Icon: CheckCircle, className: 'bg-forest-500/12 text-forest-500' },
  CANCELLED: { label: 'Cancelled', Icon: XCircle, className: 'bg-coral-500/12 text-coral-600' },
  COMPLETED: { label: 'Completed', Icon: CheckCircle, className: 'bg-ink-900/10 text-ink-800' },
  REFUNDED: { label: 'Refunded', Icon: Clock, className: 'bg-sand-200 text-ink-700' },
};

const tabs: { key: 'all' | BookingStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');

  useEffect(() => {
    api
      .get<ApiResponse<{ bookings: Booking[] }>>('/bookings')
      .then((response) => setBookings(response.data.data.bookings))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter);

  return (
    <>
      <section className="travel-dark relative overflow-hidden pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-18"
          style={{ backgroundImage: `url(${MAHARASHTRA_MONSOON_IMAGES.heroes.myBookings})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/88 via-ink-900/74 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-[4.5rem] sm:px-6 lg:px-8">
          <span className="section-label !bg-white/10 !text-sand-100 before:!bg-gold-400">
            Traveler dashboard
          </span>
          <h1 className="mt-6 font-heading text-5xl text-white sm:text-6xl">My bookings</h1>
          <p className="playful-text text-xl text-gold-400 mt-2">~ your trail diary ~</p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-sand-100/76">
            Manage confirmations, review pending reservations, and keep track of every departure in the redesigned interface.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-full px-5 py-3 text-sm font-medium ${
                filter === tab.key
                  ? 'bg-forest-500 text-white'
                  : 'travel-panel text-ink-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your departures..." />
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-5">
            {filteredBookings.map((booking) => {
              const status = statusConfig[booking.status];
              return (
                <div key={booking.id} className="travel-panel overflow-hidden rounded-[2rem]">
                  <div className="grid gap-0 md:grid-cols-[240px_1fr]">
                    <img
                      src={booking.trip?.images?.[0]?.url ?? MAHARASHTRA_MONSOON_IMAGES.fallback.tripCard}
                      alt={booking.trip?.title || 'Trek booking'}
                      className="h-full min-h-[15rem] w-full object-cover"
                    />
                    <div className="p-6 sm:p-7">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-forest-500">Booking ID</p>
                          <h2 className="mt-2 font-heading text-4xl text-ink-900">
                            {booking.trip?.title || 'Departure reservation'}
                          </h2>
                        </div>
                        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${status.className}`}>
                          <status.Icon className="h-4 w-4" weight="fill" />
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm text-ink-700">
                        <div className="rounded-[1.4rem] bg-sand-100 px-4 py-3">
                          <p className="inline-flex items-center gap-2"><CalendarBlank className="h-4 w-4 text-forest-500" /> Departure</p>
                          <p className="mt-2 font-medium text-ink-900">
                            {booking.schedule?.date
                              ? new Date(booking.schedule.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'TBD'}
                          </p>
                        </div>
                        <div className="rounded-[1.4rem] bg-sand-100 px-4 py-3">
                          <p className="inline-flex items-center gap-2"><Compass className="h-4 w-4 text-forest-500" /> Travelers</p>
                          <p className="mt-2 font-medium text-ink-900">{booking.numberOfPeople}</p>
                        </div>
                        <div className="rounded-[1.4rem] bg-sand-100 px-4 py-3">
                          <p className="inline-flex items-center gap-2"><Mountains className="h-4 w-4 text-forest-500" /> Total</p>
                          <p className="mt-2 font-medium text-ink-900">INR {booking.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-sm text-ink-700/68">Created on {new Date(booking.createdAt).toLocaleDateString('en-IN')}</p>
                        {booking.trip?.slug ? (
                          <Link to={`/trips/${booking.trip.slug}`}>
                            <Button variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                              View trek detail
                            </Button>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="travel-panel rounded-[2rem] px-8 py-16 text-center">
            <h2 className="font-heading text-5xl text-ink-900">No bookings yet</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink-700/72">
              Start with the redesigned tour archive and book your first fort experience.
            </p>
            <div className="mt-6">
              <Link to="/trips">
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Explore tours</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
