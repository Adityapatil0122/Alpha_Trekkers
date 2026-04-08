import { useEffect, useRef, useState } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  ClockCounterClockwise,
  MagnifyingGlass,
  SuitcaseRolling,
  Users,
  X,
  XCircle,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import type { ApiResponse, PaginatedResponse } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED';

interface BookingRow {
  id: string;
  status: BookingStatus;
  numberOfPeople: number;
  totalAmount: number;
  specialRequests?: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string; phone?: string };
  trip?: { title: string; region?: string };
  schedule?: { date: string };
  participants?: Array<{ name: string; age: number }>;
  payment?: { status?: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoney(amount: number) {
  return `INR ${Math.round(amount).toLocaleString('en-IN')}`;
}
function formatDate(v: string) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(v));
}
function getErrorMessage(error: unknown) {
  const e = error as { response?: { data?: { message?: string } } };
  return e.response?.data?.message ?? 'Request failed';
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<BookingStatus, { label: string; cls: string; dot: string }> = {
  CONFIRMED:  { label: 'Confirmed',  cls: 'bg-forest-500/10 text-forest-600', dot: 'bg-forest-500' },
  PENDING:    { label: 'Pending',    cls: 'bg-gold-500/12 text-gold-700',     dot: 'bg-gold-500' },
  COMPLETED:  { label: 'Completed',  cls: 'bg-sea-500/10 text-sea-600',       dot: 'bg-sea-500' },
  CANCELLED:  { label: 'Cancelled',  cls: 'bg-coral-500/10 text-coral-600',   dot: 'bg-coral-500' },
  REFUNDED:   { label: 'Refunded',   cls: 'bg-ink-900/8 text-ink-600',        dot: 'bg-ink-400' },
};

const ALL_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REFUNDED'];

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="admin-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/40 px-4 py-8 backdrop-blur-sm">
      <div ref={ref} className="admin-modal-panel relative w-full max-w-2xl rounded-[1.6rem] border border-white/80 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-ink-900/8 px-6 py-4">
          <h3 className="text-lg font-bold text-ink-900">{title}</h3>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-100 text-ink-500 hover:bg-sand-200 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${cfg.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<BookingStatus | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Detail modal
  const [selected, setSelected] = useState<BookingRow | null>(null);

  // Status update modal
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus>('CONFIRMED');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadBookings = async (pg = page) => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse<{ bookings: BookingRow[] }>>('/admin/bookings', {
        params: { page: pg, limit: 15, status: filterStatus || undefined, search: search || undefined },
      });
      const data = res.data;
      setBookings(data.data.bookings ?? []);
      setTotal(data.pagination?.total ?? 0);
      setTotalPages(data.pagination?.pages ?? 1);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    void loadBookings(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterStatus]);

  useEffect(() => { void loadBookings(page); }, [page]);

  const openDetail = (booking: BookingRow) => {
    setSelected(booking);
    setNewStatus(booking.status);
    setStatusModal(false);
  };

  const updateStatus = async () => {
    if (!selected) return;
    setUpdatingStatus(true);
    try {
      await api.put<ApiResponse<unknown>>(`/admin/bookings/${selected.id}/status`, { status: newStatus });
      toast.success('Booking status updated');
      setSelected((cur) => cur ? { ...cur, status: newStatus } : cur);
      setBookings((cur) => cur.map((b) => b.id === selected.id ? { ...b, status: newStatus } : b));
      setStatusModal(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Summary counts
  const statusCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { key: 'CONFIRMED',  label: 'Confirmed',  Icon: CheckCircle,          cls: 'bg-forest-500/10 text-forest-600' },
          { key: 'PENDING',    label: 'Pending',    Icon: ClockCounterClockwise, cls: 'bg-gold-500/12 text-gold-700' },
          { key: 'COMPLETED',  label: 'Completed',  Icon: CalendarCheck,         cls: 'bg-sea-500/10 text-sea-600' },
          { key: 'CANCELLED',  label: 'Cancelled',  Icon: XCircle,               cls: 'bg-coral-500/10 text-coral-600' },
        ].map(({ key, label, Icon, cls }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilterStatus((cur) => cur === key ? '' : key as BookingStatus)}
            className={`flex items-center gap-3 rounded-[1.4rem] border border-white/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] text-left ${filterStatus === key ? 'ring-2 ring-forest-500/30' : ''}`}
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cls}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-extrabold text-ink-900">{statusCounts[key] ?? 0}</p>
              <p className="text-xs text-ink-500">{label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-[1.8rem] border border-white/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-ink-900/8 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-400">Reservation Hub</p>
            <h3 className="mt-0.5 text-xl font-extrabold text-ink-900">
              Bookings table
              {total > 0 && <span className="ml-2 text-sm font-normal text-ink-400">({total} total)</span>}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search traveler or trip…"
                className="w-56 rounded-full border border-ink-900/10 bg-sand-50 py-2 pl-9 pr-4 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as BookingStatus | '')}
              className="rounded-full border border-ink-900/10 bg-sand-50 px-4 py-2 text-sm focus:outline-none"
            >
              <option value="">All statuses</option>
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16"><LoadingSpinner text="Loading bookings…" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-900/6 bg-sand-50/60">
                  {['TRAVELER', 'TRIP', 'DEPARTURE', 'PEOPLE', 'STATUS', 'PAYMENT', 'TOTAL', 'BOOKED ON', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {bookings.length === 0 ? (
                  <tr><td colSpan={9} className="py-14 text-center text-sm text-ink-400">No bookings found.</td></tr>
                ) : bookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-sand-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="min-w-[12rem]">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sea-500 to-forest-500 text-xs font-bold text-white">
                            {booking.user ? `${booking.user.firstName[0]}${booking.user.lastName[0]}` : '??'}
                          </div>
                          <div>
                            <p className="font-semibold text-ink-900 leading-tight">
                              {booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Unknown'}
                            </p>
                            <p className="text-xs text-ink-500">{booking.user?.email ?? '—'}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="min-w-[12rem] font-medium text-ink-700 leading-tight">{booking.trip?.title ?? '—'}</p>
                      {booking.trip?.region && <p className="mt-0.5 text-xs text-ink-400">{booking.trip.region}</p>}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-ink-600">
                      {booking.schedule?.date ? formatDate(booking.schedule.date) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-2.5 py-1 text-xs font-semibold text-ink-700">
                        <Users className="h-3 w-3" />{booking.numberOfPeople}
                      </span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={booking.status} /></td>
                    <td className="px-5 py-4 text-xs text-ink-500 whitespace-nowrap">{booking.payment?.status ?? 'N/A'}</td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-ink-900">{formatMoney(booking.totalAmount)}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-ink-500">{formatDate(booking.createdAt)}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => openDetail(booking)}
                        className="flex h-8 items-center gap-1.5 rounded-lg bg-forest-500/10 px-3 text-xs font-semibold text-forest-600 opacity-0 group-hover:opacity-100 hover:bg-forest-500/20 transition"
                      >
                        <SuitcaseRolling className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-ink-900/6 px-6 py-4">
            <p className="text-sm text-ink-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button type="button" size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Booking Detail Modal ── */}
      {selected && !statusModal && (
        <Modal title={`Booking — ${selected.user?.firstName ?? ''} ${selected.user?.lastName ?? ''}`} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            {/* Status + action */}
            <div className="flex items-center justify-between rounded-xl border border-ink-900/6 bg-sand-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={selected.status} />
                <span className="text-sm font-semibold text-ink-900">{formatMoney(selected.totalAmount)}</span>
              </div>
              <Button type="button" size="sm" variant="secondary" onClick={() => setStatusModal(true)}>
                Change status
              </Button>
            </div>

            {/* Info grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-ink-900/6 bg-sand-50 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">Traveler</p>
                <p className="font-semibold text-ink-900">{selected.user ? `${selected.user.firstName} ${selected.user.lastName}` : '—'}</p>
                <p className="mt-0.5 text-sm text-ink-500">{selected.user?.email ?? '—'}</p>
                {selected.user?.phone && <p className="mt-0.5 text-sm text-ink-500">{selected.user.phone}</p>}
              </div>
              <div className="rounded-xl border border-ink-900/6 bg-sand-50 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">Trip</p>
                <p className="font-semibold text-ink-900">{selected.trip?.title ?? '—'}</p>
                {selected.trip?.region && <p className="mt-0.5 text-sm text-ink-500">{selected.trip.region}</p>}
                {selected.schedule?.date && <p className="mt-0.5 text-sm text-ink-500">Departure: {formatDate(selected.schedule.date)}</p>}
              </div>
              <div className="rounded-xl border border-ink-900/6 bg-sand-50 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">Payment</p>
                <p className="font-semibold text-ink-900">{formatMoney(selected.totalAmount)}</p>
                <p className="mt-0.5 text-sm text-ink-500">Status: {selected.payment?.status ?? 'N/A'}</p>
              </div>
              <div className="rounded-xl border border-ink-900/6 bg-sand-50 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">Group</p>
                <p className="font-semibold text-ink-900">{selected.numberOfPeople} {selected.numberOfPeople === 1 ? 'person' : 'people'}</p>
                <p className="mt-0.5 text-sm text-ink-500">Booked: {formatDate(selected.createdAt)}</p>
              </div>
            </div>

            {/* Participants */}
            {selected.participants && selected.participants.length > 0 && (
              <div className="rounded-xl border border-ink-900/6 bg-sand-50 p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">Participants</p>
                <div className="space-y-2">
                  {selected.participants.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sea-500/10 text-[10px] font-bold text-sea-600">{i + 1}</span>
                      <span className="font-medium text-ink-900">{p.name}</span>
                      <span className="ml-auto text-ink-500">Age {p.age}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special requests */}
            {selected.specialRequests && (
              <div className="rounded-xl border border-ink-900/6 bg-sand-50 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">Special requests</p>
                <p className="text-sm text-ink-700">{selected.specialRequests}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-ink-900/8 pt-4">
              <Button type="button" variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Status Update Modal ── */}
      {statusModal && selected && (
        <Modal title="Update booking status" onClose={() => setStatusModal(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-ink-900/6 bg-sand-50 p-4">
              <span className="text-sm text-ink-600">Current status:</span>
              <StatusBadge status={selected.status} />
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Select new status</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ALL_STATUSES.map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${newStatus === s ? 'border-forest-500 bg-forest-500/5 ring-1 ring-forest-500/30' : 'border-ink-900/8 bg-sand-50 hover:border-ink-900/16'}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                      <span className={`text-sm font-semibold ${newStatus === s ? 'text-forest-700' : 'text-ink-700'}`}>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-ink-900/8 pt-4">
              <Button type="button" variant="secondary" onClick={() => setStatusModal(false)}>Cancel</Button>
              <Button
                type="button"
                variant="primary"
                isLoading={updatingStatus}
                disabled={newStatus === selected.status}
                onClick={() => void updateStatus()}
              >
                Update to {STATUS_CONFIG[newStatus].label}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
