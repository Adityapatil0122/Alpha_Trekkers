import { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  ClockCounterClockwise,
  Mountains,
  SuitcaseRolling,
  TrendUp,
  Users,
  XCircle,
  Compass,
  ChatCircleDots,
} from '@phosphor-icons/react';
import type { ApiResponse } from '@alpha-trekkers/shared';
import api from '@/lib/axios';

/* ── Types ── */
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
  stats: { totalUsers: 0, totalTrips: 0, totalBookings: 0, totalRevenue: 0, unreadMessages: 0 },
  bookingsByStatus: {},
  monthlyRevenue: {},
  recentBookings: [],
};

/* ── Helpers ── */
function fmt(n: number) {
  return n.toLocaleString('en-IN');
}
function fmtMoney(n: number) {
  return `INR ${Math.round(n).toLocaleString('en-IN')}`;
}
function fmtDate(v: string) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(v));
}
function fmtMonth(v: string) {
  const [y, m] = v.split('-');
  return new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(new Date(Number(y), Number(m) - 1, 1));
}
function initials(f?: string, l?: string) {
  return `${f?.[0] ?? 'A'}${l?.[0] ?? 'T'}`.toUpperCase();
}
function linePath(vals: number[], w: number, h: number) {
  if (!vals.length) return '';
  const mx = Math.max(...vals, 1);
  const s = vals.length === 1 ? w : w / (vals.length - 1);
  return vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(s * i).toFixed(1)} ${(h - (v / mx) * h).toFixed(1)}`).join(' ');
}
function areaPath(vals: number[], w: number, h: number) {
  if (!vals.length) return '';
  return `${linePath(vals, w, h)} L ${w} ${h} L 0 ${h} Z`;
}

const statusMeta: Record<string, { label: string; Icon: typeof CheckCircle; cls: string }> = {
  CONFIRMED: { label: 'Confirmed', Icon: CheckCircle, cls: 'text-forest-600 bg-forest-500/10' },
  PENDING: { label: 'Pending', Icon: ClockCounterClockwise, cls: 'text-amber-600 bg-amber-500/10' },
  COMPLETED: { label: 'Completed', Icon: CalendarCheck, cls: 'text-sea-600 bg-sea-500/10' },
  CANCELLED: { label: 'Cancelled', Icon: XCircle, cls: 'text-coral-600 bg-coral-500/10' },
};

/* ── Component ── */
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
    <div className="space-y-5">
      {/* ── Quick stats row ── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Revenue', value: fmtMoney(data.stats.totalRevenue), Icon: TrendUp, accent: 'text-forest-600 bg-forest-500/10' },
          { label: 'Travelers', value: fmt(data.stats.totalUsers), Icon: Users, accent: 'text-sea-600 bg-sea-500/10' },
          { label: 'Trips', value: fmt(data.stats.totalTrips), Icon: Mountains, accent: 'text-forest-700 bg-forest-500/8' },
          { label: 'Bookings', value: fmt(data.stats.totalBookings), Icon: SuitcaseRolling, accent: 'text-primary-700 bg-primary-100' },
          { label: 'Messages', value: fmt(data.stats.unreadMessages), Icon: ChatCircleDots, accent: 'text-amber-600 bg-amber-500/10' },
        ].map(({ label, value, Icon, accent }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5"
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">{label}</p>
              <p className="text-lg font-bold text-ink-900 leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue chart + Booking breakdown ── */}
      <div className="grid gap-4 xl:grid-cols-[1fr_18rem]">
        {/* Chart */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <div className="flex items-center justify-between gap-3 pb-4">
            <div>
              <h3 className="text-lg font-bold text-ink-900">Revenue</h3>
              <p className="text-xs text-ink-400">Last {revEntries.length} months</p>
            </div>
            {delta !== 0 && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${delta >= 0 ? 'bg-forest-500/10 text-forest-700' : 'bg-coral-500/10 text-coral-600'}`}>
                <TrendUp className={`h-3.5 w-3.5 ${delta < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(delta).toFixed(1)}%
              </span>
            )}
          </div>

          {revEntries.length > 0 ? (
            <div className="rounded-xl border border-black/[0.04] bg-gradient-to-b from-forest-500/[0.03] to-transparent p-4">
              <svg viewBox="0 0 500 120" className="h-32 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="rv-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath(revVals, 500, 110)} fill="url(#rv-area)" transform="translate(0,5)" />
                <path d={linePath(revVals, 500, 110)} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,5)" />
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
            <div className="rounded-xl border border-dashed border-black/10 py-10 text-center text-sm text-ink-400">
              No revenue data yet.
            </div>
          )}
        </div>

        {/* Booking breakdown */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <div className="flex items-center justify-between gap-2 pb-4">
            <h3 className="text-lg font-bold text-ink-900">Bookings</h3>
            <span className="text-xs font-semibold text-ink-400">{fmt(bookTotal)} total</span>
          </div>
          <div className="space-y-2.5">
            {Object.entries(statusMeta).map(([key, { label, Icon, cls }]) => {
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
                    <div className="mt-1 h-1.5 rounded-full bg-black/[0.04]">
                      <div
                        className="h-1.5 rounded-full bg-current transition-all"
                        style={{ width: `${pct}%`, color: cls.includes('forest') ? '#16a34a' : cls.includes('amber') ? '#d97706' : cls.includes('sea') ? '#0284c7' : '#ef4444' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent bookings table ── */}
      <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
        <div className="flex items-center justify-between gap-3 pb-4">
          <h3 className="text-lg font-bold text-ink-900">Recent bookings</h3>
          <span className="text-xs text-ink-400">{data.recentBookings.length} latest</span>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-table admin-table--compact min-w-full">
            <thead>
              <tr>
                <th>Traveler</th>
                <th>Trip</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.length > 0 ? (
                data.recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest-400 to-forest-600 text-[10px] font-bold text-white">
                          {initials(b.user?.firstName, b.user?.lastName)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink-900">
                            {b.user ? `${b.user.firstName} ${b.user.lastName}` : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[14rem] truncate text-sm text-ink-600">
                      {b.trip?.title ?? '—'}
                    </td>
                    <td>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          statusMeta[b.status]?.cls ?? 'bg-sand-100 text-ink-500'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="text-sm font-semibold text-ink-900">{fmtMoney(b.totalAmount)}</td>
                    <td className="text-xs text-ink-500">{fmtDate(b.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-ink-400">
                    No recent bookings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
