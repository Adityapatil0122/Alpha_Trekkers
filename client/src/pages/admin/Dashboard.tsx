import { useEffect, useState } from 'react';
import {
  CalendarCheck,
  ChatCircleDots,
  CheckCircle,
  ClockCounterClockwise,
  CurrencyInr,
  Mountains,
  SuitcaseRolling,
  TrendUp,
  Users,
  XCircle,
} from '@phosphor-icons/react';
import type { ApiResponse } from '@alpha-trekkers/shared';
import api from '@/lib/axios';

interface DashboardStats {
  totalUsers: number;
  totalTrips: number;
  totalBookings: number;
  totalRevenue: number;
  unreadMessages: number;
}

interface RecentBooking {
  id: string;
  status: string;
  numberOfPeople: number;
  totalAmount: number;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  trip?: {
    title: string;
  };
  payment?: {
    status?: string;
  };
}

interface DashboardPayload {
  stats: DashboardStats;
  bookingsByStatus: Record<string, number>;
  monthlyRevenue: Record<string, number>;
  recentBookings: RecentBooking[];
}

const emptyPayload: DashboardPayload = {
  stats: {
    totalUsers: 0,
    totalTrips: 0,
    totalBookings: 0,
    totalRevenue: 0,
    unreadMessages: 0,
  },
  bookingsByStatus: {},
  monthlyRevenue: {},
  recentBookings: [],
};

const statCards = [
  {
    key: 'totalUsers',
    label: 'Users',
    description: 'Registered trekkers',
    Icon: Users,
  },
  {
    key: 'totalTrips',
    label: 'Active Trips',
    description: 'Live itineraries',
    Icon: Mountains,
  },
  {
    key: 'totalBookings',
    label: 'Bookings',
    description: 'Reservations recorded',
    Icon: SuitcaseRolling,
  },
  {
    key: 'totalRevenue',
    label: 'Revenue',
    description: 'Completed payments',
    Icon: CurrencyInr,
  },
] as const;

const statusCards = [
  {
    key: 'CONFIRMED',
    label: 'Confirmed',
    Icon: CheckCircle,
    className: 'bg-forest-500/10 text-forest-600',
  },
  {
    key: 'PENDING',
    label: 'Pending',
    Icon: ClockCounterClockwise,
    className: 'bg-gold-500/12 text-gold-600',
  },
  {
    key: 'COMPLETED',
    label: 'Completed',
    Icon: CalendarCheck,
    className: 'bg-sea-500/12 text-sea-600',
  },
  {
    key: 'CANCELLED',
    label: 'Cancelled',
    Icon: XCircle,
    className: 'bg-coral-500/10 text-coral-600',
  },
] as const;

function formatMoney(amount: number) {
  return `INR ${Math.round(amount).toLocaleString('en-IN')}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function formatMonthLabel(value: string) {
  const [year, month] = value.split('-');
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(Number(year), Number(month) - 1, 1));
}

export default function Dashboard() {
  const [payload, setPayload] = useState<DashboardPayload>(emptyPayload);

  useEffect(() => {
    api
      .get<ApiResponse<DashboardPayload>>('/admin/dashboard')
      .then((res) => setPayload(res.data.data))
      .catch(() => setPayload(emptyPayload));
  }, []);

  const revenueEntries = Object.entries(payload.monthlyRevenue).sort(([left], [right]) =>
    left.localeCompare(right),
  );
  const highestRevenue = Math.max(...revenueEntries.map(([, amount]) => amount), 1);
  const bookingTotal = Object.values(payload.bookingsByStatus).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="space-y-6">
      <section className="travel-panel overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_22rem]">
          <div className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-ink-950 via-sea-600 to-forest-600 p-6 text-white">
            <div className="absolute -right-14 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-forest-400/25 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Analytics Dashboard
              </p>
              <h3 className="mt-3 max-w-2xl text-4xl font-bold leading-tight">
                Full-layout admin view with the current Alpha Trekkers theme intact.
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76">
                Revenue, bookings, trip operations, and unread message pressure are surfaced in
                one screen so the dashboard feels like a complete control panel instead of a small
                stat strip.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.4rem] border border-white/14 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/65">Revenue</p>
                  <p className="mt-2 text-2xl font-bold">
                    {formatMoney(payload.stats.totalRevenue)}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/14 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/65">Unread</p>
                  <p className="mt-2 text-2xl font-bold">
                    {payload.stats.unreadMessages.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/14 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/65">Trips live</p>
                  <p className="mt-2 text-2xl font-bold">
                    {payload.stats.totalTrips.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.8rem] border border-ink-900/6 bg-sand-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                    Attention
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-ink-900">Inbox pressure</h3>
                </div>
                <span className="rounded-full bg-gold-500/12 p-3 text-gold-600">
                  <ChatCircleDots className="h-6 w-6" />
                </span>
              </div>
              <p className="mt-4 text-4xl font-bold text-ink-900">
                {payload.stats.unreadMessages.toLocaleString('en-IN')}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Unread contact messages currently waiting for admin action.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-ink-900/6 bg-sand-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                    Booking mix
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-ink-900">Status coverage</h3>
                </div>
                <span className="rounded-full bg-sea-500/10 p-3 text-sea-600">
                  <TrendUp className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {statusCards.map(({ key, label }) => {
                  const count = payload.bookingsByStatus[key] ?? 0;
                  const width = bookingTotal === 0 ? 0 : Math.max((count / bookingTotal) * 100, 6);

                  return (
                    <div key={key}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-ink-700">{label}</span>
                        <span className="text-ink-500">{count.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-forest-500 to-sea-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, description, Icon }) => (
          <div
            key={key}
            className="travel-panel rounded-[1.8rem] border border-white/70 bg-white/92 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink-500">{label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-400">
                  {description}
                </p>
              </div>
              <span className="rounded-[1rem] bg-forest-500/10 p-3 text-forest-600">
                <Icon className="h-5 w-5" />
              </span>
            </div>

            <p className="mt-5 text-4xl font-bold text-ink-900">
              {key === 'totalRevenue'
                ? formatMoney(payload.stats[key])
                : payload.stats[key].toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="travel-panel rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4 border-b border-ink-900/8 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea-600">
                Revenue snapshot
              </p>
              <h3 className="mt-2 text-3xl font-bold text-ink-900">Monthly collections</h3>
            </div>
            <p className="text-sm text-ink-500">Last six months of completed payments</p>
          </div>

          <div className="mt-5 space-y-4">
            {revenueEntries.length > 0 ? (
              revenueEntries.map(([month, amount]) => (
                <div key={month} className="rounded-[1.4rem] border border-ink-900/6 bg-sand-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{formatMonthLabel(month)}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-500">
                        Completed collections
                      </p>
                    </div>
                    <p className="text-lg font-bold text-forest-600">{formatMoney(amount)}</p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-gold-500 via-forest-500 to-sea-500"
                      style={{ width: `${Math.max((amount / highestRevenue) * 100, 8)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-ink-900/10 bg-sand-50 px-5 py-10 text-center text-sm text-ink-600">
                No completed payments were returned for the recent six-month window.
              </div>
            )}
          </div>
        </div>

        <div className="travel-panel rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4 border-b border-ink-900/8 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea-600">
                Booking pipeline
              </p>
              <h3 className="mt-2 text-3xl font-bold text-ink-900">Reservation stages</h3>
            </div>
            <p className="text-sm text-ink-500">
              {bookingTotal.toLocaleString('en-IN')} total bookings
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {statusCards.map(({ key, label, Icon, className }) => (
              <div key={key} className="rounded-[1.5rem] border border-ink-900/6 bg-sand-50 p-4">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full p-3 ${className}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{label}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-ink-500">
                      Booking status
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-3xl font-bold text-ink-900">
                  {(payload.bookingsByStatus[key] ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="travel-panel rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 border-b border-ink-900/8 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea-600">
              Recent activity
            </p>
            <h3 className="mt-2 text-3xl font-bold text-ink-900">Latest bookings</h3>
          </div>
          <p className="text-sm text-ink-500">Newest five reservations from the admin API</p>
        </div>

        <div className="admin-table-scroll mt-5">
          <table className="admin-table min-w-full">
            <thead>
              <tr>
                <th>Traveler</th>
                <th>Trip</th>
                <th>People</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Booked on</th>
              </tr>
            </thead>
            <tbody>
              {payload.recentBookings.length > 0 ? (
                payload.recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="min-w-[14rem]">
                        <p className="font-semibold text-ink-900">
                          {booking.user
                            ? `${booking.user.firstName} ${booking.user.lastName}`
                            : 'Unknown traveler'}
                        </p>
                        <p className="mt-1 text-xs text-ink-500">
                          {booking.user?.email ?? 'No email'}
                        </p>
                      </div>
                    </td>
                    <td className="min-w-[14rem] font-medium text-ink-700">
                      {booking.trip?.title ?? 'Trip unavailable'}
                    </td>
                    <td>{booking.numberOfPeople.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="inline-flex rounded-full bg-forest-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-600">
                        {booking.status}
                      </span>
                    </td>
                    <td className="text-sm text-ink-600">{booking.payment?.status ?? 'NA'}</td>
                    <td className="font-semibold text-ink-900">
                      {formatMoney(booking.totalAmount)}
                    </td>
                    <td className="text-sm text-ink-600">{formatDate(booking.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-ink-500">
                    No recent bookings were returned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
