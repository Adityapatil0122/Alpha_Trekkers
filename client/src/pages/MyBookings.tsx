import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarBlank,
  Compass,
  Clock,
  CheckCircle,
  XCircle,
  Hourglass,
  ArrowRight,
  Mountains,
} from '@phosphor-icons/react';
import type { ApiResponse, Booking, BookingStatus } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';

const statusConfig: Record<
  BookingStatus,
  { label: string; color: string; bgColor: string; Icon: typeof CheckCircle }
> = {
  PENDING: { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-50', Icon: Hourglass },
  CONFIRMED: { label: 'Confirmed', color: 'text-green-600', bgColor: 'bg-green-50', Icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-50', Icon: XCircle },
  COMPLETED: { label: 'Completed', color: 'text-blue-600', bgColor: 'bg-blue-50', Icon: CheckCircle },
  REFUNDED: { label: 'Refunded', color: 'text-gray-600', bgColor: 'bg-gray-50', Icon: Clock },
};

const filterTabs: { key: 'all' | BookingStatus; label: string }[] = [
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
      .then((res) => setBookings(res.data.data.bookings))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <>
      {/* Hero */}
      <section className="bg-forest-900 pt-20">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-3xl font-bold text-white">My Bookings</h1>
            <p className="mt-2 text-forest-300/70">
              Track and manage all your trek bookings
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-forest-500 text-white'
                  : 'border border-forest-200 text-forest-600 hover:bg-forest-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your bookings..." />
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((booking, i) => {
              const config = statusConfig[booking.status];
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative h-40 w-full sm:h-auto sm:w-48">
                      <img
                        src={
                          booking.trip?.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1585409677983-0f6c41128c45?w=300'
                        }
                        alt={booking.trip?.title || 'Trek'}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="font-heading text-lg font-bold text-forest-900">
                            {booking.trip?.title || 'Trek Booking'}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.bgColor} ${config.color}`}
                          >
                            <config.Icon className="h-3.5 w-3.5" weight="fill" />
                            {config.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-forest-500">
                          <div className="flex items-center gap-1">
                            <CalendarBlank className="h-4 w-4" />
                            {booking.schedule?.date
                              ? new Date(booking.schedule.date).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Date TBD'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Compass className="h-4 w-4" />
                            {booking.numberOfPeople} participant{booking.numberOfPeople > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="font-heading text-lg font-bold text-forest-800">
                          &#8377;{booking.totalAmount.toLocaleString('en-IN')}
                        </p>
                        {booking.trip?.slug && (
                          <Link
                            to={`/trips/${booking.trip.slug}`}
                            className="flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-800"
                          >
                            View Trek <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center py-20 text-center">
            <Mountains className="mb-4 h-16 w-16 text-forest-300" weight="duotone" />
            <h3 className="mb-2 font-heading text-xl font-semibold text-forest-800">
              No bookings yet
            </h3>
            <p className="mb-6 max-w-sm text-sm text-forest-500">
              Your adventure awaits! Browse our treks and book your first experience.
            </p>
            <Link to="/trips">
              <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Explore Treks</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
