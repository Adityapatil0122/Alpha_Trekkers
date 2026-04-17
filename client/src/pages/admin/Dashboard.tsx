import { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  ClockCounterClockwise,
  Compass,
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
  totalTours: number;
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
  user?: { firstName: string; lastName: string; email: string };
  trip?: { title: string };
  payment?: { status?: string };
}

interface DashboardPayload {
  stats: DashboardStats;
  bookingsByStatus: Record<string, number>;
  monthlyRevenue: Record<string, number>;
  recentBookings: RecentBooking[];
}

const emptyPayload: DashboardPayload = {
  stats: { totalUsers: 0, totalTrips: 0, totalTours: 0, totalBookings: 0, totalRevenue: 0, unreadMessages: 0 },
  bookingsByStatus: {},
  monthlyRevenue: {},
  recentBookings: [],
};

function fmt(n: number) {
  return n.toLocaleString('en-IN');
}

function fmtMoney(n: number) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function fmtDate(v: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(v));
}

function fmtMonth(v: string) {
  const [y, m] = v.split('-');
  return new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(
    new Date(Number(y), Number(m) - 1, 1),
  );
}

function linePath(vals: number[], w: number, h: number) {
  if (!vals.length) return '';
  const mx = Math.max(...vals, 1);
  const s = vals.length === 1 ? w : w / (vals.length - 1);
  return vals
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${(s * i).toFixed(1)} ${(h - (v / mx) * h).toFixed(1)}`)
    .join(' ');
}

function areaPath(vals: number[], w: number, h: number) {
  if (!vals.length) return '';
  return `${linePath(vals, w, h)} L ${w} ${h} L 0 ${h} Z`;
}

const statusMeta: Record<string, { label: string; Icon: typeof CheckCircle; cls: string; bar: string }> = {
  CONFIRMED: {
    label: 'Confirmed',
    Icon: CheckCircle,
    cls: 'text-forest-600 bg-forest-500/10',
    bar: '#16a34a',
  },
  PENDING: {
    label: 'Pending',
    Icon: ClockCounterClockwise,
    cls: 'text-amber-600 bg-amber-500/10',
    bar: '#d97706',
  },
  COMPLETED: {
    label: 'Completed',
    Icon: CalendarCheck,
    cls: 'text-sea-600 bg-sea-500/10',
    bar: '#0284c7',
  },
  CANCELLED: {
    label: 'Cancelled',
    Icon: XCircle,
    cls: 'text-coral-600 bg-coral-500/10',
    bar: '#ef4444',
  },
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardPayload>(emptyPayload);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiResponse<DashboardPayload>>('/admin/dashboard')
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const revEntries = useMemo(
    () => Object.entries(data.monthlyRevenue).sort(([a], [b]) => a.localeCompare(b)),
    [data.monthlyRevenue],
  );
  const revVals = revEntries.map(([, v]) => v);
  const bookTotal = Object.values(data.bookingsByStatus).reduce((s, c) => s + c, 0);
  const latestRev = revEntries[revEntries.length - 1]?.[1] ?? 0;
  const prevRev = revEntries[revEntries.length - 2]?.[1] ?? 0;
  const delta = prevRev > 0 ? ((latestRev - prevRev) / prevRev) * 100 : 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-forest-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Revenue', value: fmtMoney(data.stats.totalRevenue), Icon: TrendUp, accent: 'text-forest-600 bg-forest-500/10' },
          { label: 'Total Travellers', value: fmt(data.stats.totalUsers), Icon: Users, accent: 'text-forest-600 bg-forest-500/10' },
          { label: 'Featured Treks', value: fmt(data.stats.totalTrips), Icon: Mountains, accent: 'text-forest-700 bg-forest-500/8' },
          { label: 'Featured Tours', value: fmt(data.stats.totalTours), Icon: Compass, accent: 'text-forest-600 bg-forest-500/10' },
          { label: 'Bookings', value: fmt(data.stats.totalBookings), Icon: SuitcaseRolling, accent: 'text-primary-700 bg-primary-100' },
        ].map(({ label, value, Icon, accent }) => (
          <div key={label} className="admin-card flex items-center gap-3 rounded-xl px-4 py-3.5">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">{label}</p>
              <p className="text-lg leading-tight font-bold text-ink-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="admin-card rounded-xl p-5">
          <div className="flex items-center justify-between gap-3 pb-4">
            <div>
              <h3 className="text-lg font-bold text-ink-900">Revenue</h3>
              <p className="text-xs text-ink-400">Last {revEntries.length} months</p>
            </div>
            {delta !== 0 && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  delta >= 0 ? 'bg-forest-500/10 text-forest-700' : 'bg-coral-500/10 text-coral-600'
                }`}
              >
                <TrendUp className={`h-3.5 w-3.5 ${delta < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(delta).toFixed(1)}%
              </span>
            )}
          </div>

          {revEntries.length > 0 ? (
            <div className="rounded-xl bg-forest-500/[0.03] p-4">
              <svg viewBox="0 0 500 120" className="h-32 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="rv-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath(revVals, 500, 110)} fill="url(#rv-area)" transform="translate(0,5)" />
                <path
                  d={linePath(revVals, 500, 110)}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(0,5)"
                />
                {revVals.map((v, i) => {
                  const x = revVals.length === 1 ? 0 : (500 / (revVals.length - 1)) * i;
                  const mx = Math.max(...revVals, 1);
                  const y = 5 + 110 - (v / mx) * 110;
                  return <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#22c55e" strokeWidth="2" />;
                })}
              </svg>
              <div className="mt-2 flex justify-between text-[10px] font-medium text-ink-400">
                {revEntries.map(([m]) => (
                  <span key={m}>{fmtMonth(m)}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-ink-900/10 py-10 text-center text-sm text-ink-400">
              No revenue data yet.
            </div>
          )}
        </div>

        <div className="admin-card rounded-xl p-5">
          <div className="flex items-center justify-between gap-2 pb-4">
            <h3 className="text-lg font-bold text-ink-900">Bookings</h3>
            <span className="text-xs font-semibold text-ink-400">{fmt(bookTotal)} total</span>
          </div>
          <div className="space-y-2.5">
            {Object.entries(statusMeta).map(([key, { label, Icon, cls, bar }]) => {
              const count = data.bookingsByStatus[key] ?? 0;
              const pct = bookTotal === 0 ? 0 : Math.max((count / bookTotal) * 100, 3);
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cls}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-ink-700">{label}</span>
                      <span className="font-bold text-ink-900">{count}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-ink-900/[0.04]">
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: bar }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h2 className="font-heading text-2xl text-ink-900 sm:text-3xl">Recent bookings</h2>
        <span className="text-sm font-medium text-ink-500">{data.recentBookings.length} latest</span>
      </div>

      <div className="admin-card overflow-hidden rounded-xl">
        <div className="admin-table-scroll overflow-x-auto">
          <table className="admin-table admin-table--compact admin-table--head-center min-w-[720px] w-full text-left text-sm">
            <thead className="bg-sand-50/95">
              <tr className="border-b border-ink-900/14">
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">No.</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Traveler</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Trek</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Status</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Amount</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.length > 0 ? (
                data.recentBookings.map((b, index) => (
                  <tr key={b.id} className="border-b border-ink-900/6 last:border-b-0 transition-colors hover:bg-sand-50/60">
                    <td className="px-4 py-3 text-center font-semibold text-ink-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="mx-auto min-w-0 max-w-[190px] text-center">
                        <p className="truncate font-semibold text-ink-900">
                          {b.user ? `${b.user.firstName} ${b.user.lastName}` : 'Unknown'}
                        </p>
                        <p className="truncate text-xs text-ink-400">{b.user?.email ?? '—'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="mx-auto max-w-[14rem] truncate text-center text-ink-600">
                        {b.trip?.title ?? '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                          statusMeta[b.status]?.cls ?? 'bg-sand-100 text-ink-500'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center font-semibold text-forest-600">
                      {fmtMoney(b.totalAmount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-xs text-ink-500">
                      {fmtDate(b.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-ink-400">
                    No recent bookings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
