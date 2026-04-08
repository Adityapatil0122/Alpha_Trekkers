import { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  ChatCircleDots,
  CheckCircle,
  ClockCounterClockwise,
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
    label: 'Travelers',
    subtitle: 'Registered accounts',
    Icon: Users,
    accentClass: 'bg-forest-500/10 text-forest-600',
  },
  {
    key: 'totalTrips',
    label: 'Trips live',
    subtitle: 'Published departures',
    Icon: Mountains,
    accentClass: 'bg-forest-500/12 text-forest-700',
  },
  {
    key: 'totalBookings',
    label: 'Bookings',
    subtitle: 'Reservations recorded',
    Icon: SuitcaseRolling,
    accentClass: 'bg-primary-100 text-primary-800',
  },
  {
    key: 'unreadMessages',
    label: 'Inbox',
    subtitle: 'Pending replies',
    Icon: ChatCircleDots,
    accentClass: 'bg-primary-50 text-primary-800',
  },
] as const;

const statusCards = [
  {
    key: 'CONFIRMED',
    label: 'Confirmed',
    Icon: CheckCircle,
    pillClass: 'bg-forest-500/10 text-forest-700',
    barClass: 'from-forest-500 to-forest-600',
  },
  {
    key: 'PENDING',
    label: 'Pending',
    Icon: ClockCounterClockwise,
    pillClass: 'bg-primary-50 text-forest-700',
    barClass: 'from-primary-400 to-forest-500',
  },
  {
    key: 'COMPLETED',
    label: 'Completed',
    Icon: CalendarCheck,
    pillClass: 'bg-forest-500/12 text-forest-700',
    barClass: 'from-forest-400 to-primary-600',
  },
  {
    key: 'CANCELLED',
    label: 'Cancelled',
    Icon: XCircle,
    pillClass: 'bg-coral-500/10 text-coral-600',
    barClass: 'from-coral-400 to-coral-500',
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

function buildLinePath(values: number[], width: number, height: number) {
  if (values.length === 0) return '';

  const max = Math.max(...values, 1);
  const step = values.length === 1 ? width : width / (values.length - 1);

  return values
    .map((value, index) => {
      const x = step * index;
      const y = height - (value / max) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

function buildAreaPath(values: number[], width: number, height: number) {
  if (values.length === 0) return '';

  const line = buildLinePath(values, width, height);
  return `${line} L ${width} ${height} L 0 ${height} Z`;
}

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? 'A'}${lastName?.[0] ?? 'T'}`.toUpperCase();
}

function getBookingStatusClass(status: string) {
  const tones: Record<string, string> = {
    CONFIRMED: 'bg-forest-500/10 text-forest-700',
    PENDING: 'bg-primary-50 text-forest-700',
    COMPLETED: 'bg-forest-500/12 text-forest-700',
    CANCELLED: 'bg-coral-500/10 text-coral-600',
  };

  return tones[status] ?? 'bg-sand-100 text-ink-600';
}

function getPaymentStatusClass(status?: string) {
  const tones: Record<string, string> = {
    PAID: 'bg-forest-500/10 text-forest-700',
    CAPTURED: 'bg-forest-500/10 text-forest-700',
    PENDING: 'bg-primary-50 text-forest-700',
    FAILED: 'bg-coral-500/10 text-coral-600',
  };

  if (!status) return 'bg-sand-100 text-ink-500';
  return tones[status] ?? 'bg-sand-100 text-ink-600';
}

export default function Dashboard() {
  const [payload, setPayload] = useState<DashboardPayload>(emptyPayload);

  useEffect(() => {
    api
      .get<ApiResponse<DashboardPayload>>('/admin/dashboard')
      .then((res) => setPayload(res.data.data))
      .catch(() => setPayload(emptyPayload));
  }, []);

  const revenueEntries = useMemo(
    () => Object.entries(payload.monthlyRevenue).sort(([left], [right]) => left.localeCompare(right)),
    [payload.monthlyRevenue],
  );
  const bookingTotal = Object.values(payload.bookingsByStatus).reduce((sum, count) => sum + count, 0);
  const revenueValues = revenueEntries.map(([, amount]) => amount);
  const revenuePath = buildLinePath(revenueValues, 540, 120);
  const revenueAreaPath = buildAreaPath(revenueValues, 540, 120);
  const latestRevenue = revenueEntries[revenueEntries.length - 1]?.[1] ?? 0;
  const previousRevenue = revenueEntries[revenueEntries.length - 2]?.[1] ?? 0;
  const revenueDelta =
    previousRevenue > 0 ? ((latestRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  const headlineChip =
    revenueEntries.length > 0
      ? `${formatMonthLabel(revenueEntries[revenueEntries.length - 1][0])} closed`
      : 'Live data';

  return (
    <div className="space-y-4">
      <section className="rounded-[1.5rem] border border-forest-500/12 bg-white shadow-[0_14px_36px_rgba(34,120,69,0.08)]">
        <div className="flex flex-col gap-4 border-b border-forest-500/10 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-600">
              Analytics Dashboard
            </p>
            <h3 className="mt-1 text-2xl font-bold text-ink-900">Portfolio performance</h3>
            <p className="mt-1 text-sm text-ink-500">
              Revenue, booking flow, and recent reservations in one compact control surface.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-forest-500/12 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-forest-700">
              {headlineChip}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-forest-500/12 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700">
              <TrendUp className="h-3.5 w-3.5 text-forest-600" />
              {revenueDelta.toFixed(1)}% trend
            </span>
          </div>
        </div>

        <div className="grid gap-0 border-t-0 md:grid-cols-3">
          <div className="border-b border-forest-500/10 px-5 py-4 md:border-b-0 md:border-r">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
              Revenue window
            </p>
            <p className="mt-2 text-3xl font-bold text-ink-900">
              {revenueEntries.length.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs text-ink-500">Months included in the current snapshot</p>
          </div>
          <div className="border-b border-forest-500/10 px-5 py-4 md:border-b-0 md:border-r">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
              Booking pool
            </p>
            <p className="mt-2 text-3xl font-bold text-ink-900">
              {bookingTotal.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs text-ink-500">Reservation statuses currently tracked</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
              Latest collections
            </p>
            <p className="mt-2 text-3xl font-bold text-forest-600">{formatMoney(latestRevenue)}</p>
            <p className="mt-1 text-xs text-ink-500">Most recent completed revenue month</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, subtitle, Icon, accentClass }) => (
          <div
            key={key}
            className="rounded-[1.25rem] border border-forest-500/10 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(34,120,69,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
                  {label}
                </p>
                <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
              </div>
              <span className={`rounded-xl p-2.5 ${accentClass}`}>
                <Icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <p className="mt-5 text-3xl font-bold text-ink-900">
              {payload.stats[key].toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_22rem]">
        <div className="rounded-[1.5rem] border border-forest-500/12 bg-white p-5 shadow-[0_14px_36px_rgba(34,120,69,0.08)]">
          <div className="flex flex-col gap-2 border-b border-forest-500/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600">
                Revenue Snapshot
              </p>
              <h3 className="mt-1 text-2xl font-bold text-ink-900">Monthly collections</h3>
            </div>
            <p className="text-sm text-ink-500">Last six months of completed payments</p>
          </div>

          {revenueEntries.length > 0 ? (
            <>
              <div className="mt-5 rounded-[1.25rem] border border-forest-500/10 bg-[linear-gradient(180deg,#f8fff8_0%,#ffffff_100%)] p-4">
                <svg viewBox="0 0 540 150" className="h-40 w-full">
                  <defs>
                    <linearGradient id="dashboard-revenue-area" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(92,184,92,0.24)" />
                      <stop offset="100%" stopColor="rgba(92,184,92,0)" />
                    </linearGradient>
                  </defs>
                  <path d={revenueAreaPath} fill="url(#dashboard-revenue-area)" transform="translate(0,10)" />
                  <path
                    d={revenuePath}
                    fill="none"
                    stroke="#5cb85c"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(0,10)"
                  />
                  {revenueValues.map((value, index) => {
                    const x = revenueValues.length === 1 ? 0 : (540 / (revenueValues.length - 1)) * index;
                    const max = Math.max(...revenueValues, 1);
                    const y = 10 + 120 - (value / max) * 120;

                    return (
                      <g key={`${index}-${value}`}>
                        <circle cx={x} cy={y} r="4.5" fill="#ffffff" stroke="#5cb85c" strokeWidth="2.5" />
                        <text
                          x={x}
                          y="148"
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize="11"
                          fontWeight="600"
                        >
                          {formatMonthLabel(revenueEntries[index][0]).split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {revenueEntries.map(([month, amount]) => {
                  const max = Math.max(...revenueValues, 1);
                  return (
                    <div
                      key={month}
                      className="rounded-[1rem] border border-forest-500/10 bg-primary-50/60 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-ink-900">{formatMonthLabel(month)}</p>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-400">
                            Completed
                          </p>
                        </div>
                        <p className="text-sm font-bold text-forest-700">{formatMoney(amount)}</p>
                      </div>
                      <div className="mt-3 h-1.5 rounded-full bg-white">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-primary-400 to-forest-600"
                          style={{ width: `${Math.max((amount / max) * 100, 8)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="mt-5 rounded-[1.2rem] border border-dashed border-forest-500/18 bg-primary-50/50 px-5 py-10 text-center text-sm text-ink-500">
              No completed payments were returned for the recent six-month window.
            </div>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-forest-500/12 bg-white p-5 shadow-[0_14px_36px_rgba(34,120,69,0.08)]">
          <div className="flex items-center justify-between gap-3 border-b border-forest-500/10 pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600">
                Reservation Stages
              </p>
              <h3 className="mt-1 text-2xl font-bold text-ink-900">Operational status</h3>
            </div>
            <span className="rounded-full border border-forest-500/12 bg-primary-50 px-3 py-1 text-xs font-semibold text-forest-700">
              {bookingTotal.toLocaleString('en-IN')} total
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {statusCards.map(({ key, label, Icon, pillClass, barClass }) => {
              const count = payload.bookingsByStatus[key] ?? 0;
              const width = bookingTotal === 0 ? 0 : Math.max((count / bookingTotal) * 100, 4);

              return (
                <div key={key} className="rounded-[1rem] border border-forest-500/10 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full p-2.5 ${pillClass}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{label}</p>
                        <p className="text-[11px] text-ink-400">Booking status</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${pillClass}`}>
                      {count.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-sand-100">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${barClass}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-forest-500/12 bg-white p-5 shadow-[0_14px_36px_rgba(34,120,69,0.08)]">
        <div className="flex flex-col gap-2 border-b border-forest-500/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600">
              Recent Activity
            </p>
            <h3 className="mt-1 text-2xl font-bold text-ink-900">Latest bookings</h3>
          </div>
          <span className="rounded-full border border-forest-500/12 bg-primary-50 px-3 py-1 text-xs font-semibold text-forest-700">
            {payload.recentBookings.length.toLocaleString('en-IN')} rows
          </span>
        </div>

        <div className="admin-table-scroll mt-4">
          <table className="admin-table admin-table--compact min-w-full">
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
                payload.recentBookings.map((booking) => {
                  const paymentStatus = booking.payment?.status ?? 'NA';
                  return (
                    <tr key={booking.id}>
                      <td>
                        <div className="flex min-w-[15rem] items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7fd67f_0%,#33a05b_100%)] text-sm font-bold text-white">
                            {getInitials(booking.user?.firstName, booking.user?.lastName)}
                          </span>
                          <div>
                            <p className="font-semibold text-ink-900">
                              {booking.user
                                ? `${booking.user.firstName} ${booking.user.lastName}`
                                : 'Unknown traveler'}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-500">
                              {booking.user?.email ?? 'No email'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="min-w-[15rem] font-medium text-ink-700">
                        {booking.trip?.title ?? 'Trip unavailable'}
                      </td>
                      <td>{booking.numberOfPeople.toLocaleString('en-IN')}</td>
                      <td>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getBookingStatusClass(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getPaymentStatusClass(paymentStatus)}`}
                        >
                          {paymentStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="font-semibold text-ink-900">{formatMoney(booking.totalAmount)}</td>
                      <td className="text-sm text-ink-600">{formatDate(booking.createdAt)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-ink-500">
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
