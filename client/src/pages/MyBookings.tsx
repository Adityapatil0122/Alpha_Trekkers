import { useCallback, useEffect, useState } from 'react';
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
  X,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { ApiResponse, Booking, BookingStatus, TourBooking } from '@alpha-trekkers/shared';
import toast from 'react-hot-toast';
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

function getErrorMessage(error: unknown) {
  const apiError = error as { response?: { data?: { message?: string } } };
  return apiError.response?.data?.message ?? 'Unable to update the booking right now.';
}

function canCancelBooking(status: BookingStatus) {
  return status === 'PENDING' || status === 'CONFIRMED';
}

type Reservation = {
  id: string;
  kind: 'TREK' | 'TOUR';
  status: BookingStatus;
  title: string;
  imageUrl: string;
  departureDate?: string;
  numberOfPeople: number;
  totalAmount: number;
  createdAt: string;
  detailHref?: string;
};

function normalizeTrekBooking(booking: Booking): Reservation {
  return {
    id: booking.id,
    kind: 'TREK',
    status: booking.status,
    title: booking.trip?.title || 'Departure reservation',
    imageUrl: booking.trip?.images?.[0]?.url ?? MAHARASHTRA_MONSOON_IMAGES.fallback.tripCard,
    departureDate: booking.schedule?.date,
    numberOfPeople: booking.numberOfPeople,
    totalAmount: booking.totalAmount,
    createdAt: booking.createdAt,
    detailHref: booking.trip?.slug ? `/trips/${booking.trip.slug}` : undefined,
  };
}

function normalizeTourBooking(booking: TourBooking): Reservation {
  return {
    id: booking.id,
    kind: 'TOUR',
    status: booking.status,
    title: booking.tourTitle,
    imageUrl: booking.tourImageUrl || MAHARASHTRA_MONSOON_IMAGES.fallback.tripCard,
    departureDate: booking.departureDate,
    numberOfPeople: booking.numberOfPeople,
    totalAmount: booking.totalAmount,
    createdAt: booking.createdAt,
    detailHref: booking.tourSlug ? `/tours/${booking.tourSlug}` : undefined,
  };
}

function CancelBookingDialog({
  booking,
  isLoading,
  onClose,
  onConfirm,
}: {
  booking: Reservation;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isLoading, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 px-4 py-8 backdrop-blur-sm"
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        className="travel-panel relative w-full max-w-lg rounded-[2rem] border border-white/80 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.2)] sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-sand-100 text-ink-500 transition hover:bg-sand-200 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Close cancel booking dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-coral-500/12 text-coral-600">
          <XCircle className="h-7 w-7" weight="fill" />
        </span>
        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-coral-600">Cancel booking</p>
        <h2 className="mt-2 font-heading text-3xl text-ink-900 sm:text-4xl">Are you sure?</h2>
        <p className="mt-3 text-sm leading-7 text-ink-700/78 sm:text-[0.95rem]">
          This will cancel your booking for{' '}
          <span className="font-semibold text-ink-900">{booking.title || 'this departure'}</span>.
          {booking.kind === 'TOUR' ? ' This booking will be removed from your active tour plans.' : ' Paid bookings will be marked for refund in the system.'}
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Keep booking
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Cancel booking
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const loadBookings = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);

    try {
      const [trekBookings, tourBookings] = await Promise.allSettled([
        api.get<ApiResponse<{ bookings: Booking[] }>>('/bookings'),
        api.get<ApiResponse<{ bookings: TourBooking[] }>>('/tour-bookings'),
      ]);

      const normalizedTrekBookings =
        trekBookings.status === 'fulfilled'
          ? trekBookings.value.data.data.bookings.map(normalizeTrekBooking)
          : [];

      const normalizedTourBookings =
        tourBookings.status === 'fulfilled'
          ? tourBookings.value.data.data.bookings.map(normalizeTourBooking)
          : [];

      setBookings(
        [...normalizedTrekBookings, ...normalizedTourBookings].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch {
      setBookings([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const handleCancelBooking = useCallback(async () => {
    if (!cancelTarget) return;

    setCancelingId(cancelTarget.id);

    try {
      const endpoint =
        cancelTarget.kind === 'TOUR'
          ? `/tour-bookings/${cancelTarget.id}/cancel`
          : `/bookings/${cancelTarget.id}/cancel`;
      await api.post(endpoint);
      toast.success('Booking cancelled successfully');
      setCancelTarget(null);
      await loadBookings(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setCancelingId(null);
    }
  }, [cancelTarget, loadBookings]);

  const filteredBookings = filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter);

  return (
    <>
      <section className="travel-dark relative overflow-hidden pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${MAHARASHTRA_MONSOON_IMAGES.heroes.myBookings})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/78 via-dark-900/52 to-dark-900/18" />
        <div className="hero-copy relative mx-auto flex min-h-[22rem] max-w-7xl flex-col items-start justify-end px-4 pb-16 pt-[4.5rem] sm:min-h-[26rem] sm:px-6 sm:pb-20 lg:min-h-[30rem] lg:px-8 lg:pb-24">
          <span className="playful-text text-2xl !text-primary-300 sm:text-3xl">
            your trail story
          </span>
          <div>
            <h1 className="mt-6 font-heading text-4xl !text-white drop-shadow-[0_12px_34px_rgba(0,0,0,0.42)] sm:text-5xl lg:text-6xl">
              My bookings
            </h1>
            <p className="playful-text mt-2 text-xl !text-primary-300">~ your trail story ~</p>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-sand-100/86">
              Manage confirmations, review pending reservations, and keep track of every departure in the redesigned interface.
            </p>
          </div>
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
                      src={booking.imageUrl}
                      alt={booking.title || 'Booking'}
                      className="h-full min-h-[15rem] w-full object-cover"
                    />
                    <div className="p-6 sm:p-7">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-forest-500">Booking ID</p>
                          <h2 className="mt-2 font-heading text-3xl text-ink-900 sm:text-4xl">
                            {booking.title}
                          </h2>
                        </div>
                        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${status.className}`}>
                          <status.Icon className="h-4 w-4" weight="fill" />
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-3 md:grid-cols-3 text-sm text-ink-700">
                        <div className="rounded-[1.4rem] bg-sand-100 px-4 py-3">
                          <p className="inline-flex items-center gap-2"><CalendarBlank className="h-4 w-4 text-forest-500" /> Departure</p>
                          <p className="mt-2 font-medium text-ink-900">
                            {booking.departureDate
                              ? new Date(booking.departureDate).toLocaleDateString('en-IN', {
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
                        <div className="flex flex-wrap items-center gap-3">
                          {canCancelBooking(booking.status) ? (
                            <Button variant="danger" onClick={() => setCancelTarget(booking)}>
                              Cancel booking
                            </Button>
                          ) : null}
                          {booking.detailHref ? (
                            <Link to={booking.detailHref}>
                              <Button variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                {booking.kind === 'TOUR' ? 'View tour detail' : 'View trek detail'}
                              </Button>
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="travel-panel rounded-[2rem] px-8 py-16 text-center">
            <p className="section-script">Start your trail diary</p>
            <h2 className="mt-2 font-heading text-4xl text-ink-900 sm:text-5xl">No bookings yet</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink-700/72">
              Start with the one-day trips page or reach out when you want help shaping the next getaway.
            </p>
            <div className="mt-6">
              <Link to="/trips">
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Explore day trips</Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {cancelTarget ? (
        <CancelBookingDialog
          booking={cancelTarget}
          isLoading={cancelingId === cancelTarget.id}
          onClose={() => setCancelTarget(null)}
          onConfirm={() => {
            void handleCancelBooking();
          }}
        />
      ) : null}
    </>
  );
}
