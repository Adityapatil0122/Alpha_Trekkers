import { useCallback, useEffect, useRef, useState } from 'react';
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
type BookingKind = 'TREK' | 'TOUR';

interface BookingRow {
  id: string;
  kind: BookingKind;
  status: BookingStatus;
  numberOfPeople: number;
  totalAmount: number;
  specialRequests?: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string; phone?: string };
  trip?: { title: string; region?: string; slug?: string };
  schedule?: { date: string };
  participants?: Array<{ fullName: string; age: number; phone?: string }>;
  payment?: { status?: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoney(amount: number) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
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
    <div className="admin-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/40 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-8">
      <div ref={ref} className="admin-modal-panel relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-2xl flex-col rounded-[1.6rem] border border-white/80 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.18)] sm:max-h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between gap-3 border-b border-ink-900/8 px-4 py-4 sm:px-6">
          <h3 className="text-lg font-bold text-ink-900">{title}</h3>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-100 text-ink-500 hover:bg-sand-200 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status, compact = false }: { status: BookingStatus; compact?: boolean }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase ${compact ? 'gap-1 px-2 py-0.5 text-[9px] tracking-[0.12em]' : 'gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.14em]'} ${cfg.cls}`}
    >
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

  const loadBookings = useCallback(async (pg = page) => {
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
  }, [filterStatus, page, search]);

  useEffect(() => {
    setPage(1);
    void loadBookings(1);
  }, [filterStatus, loadBookings, search]);

  useEffect(() => { void loadBookings(page); }, [loadBookings, page]);

  const openDetail = (booking: BookingRow) => {
    setSelected(booking);
    setNewStatus(booking.status);
    setStatusModal(false);
  };

  const updateStatus = async () => {
    if (!selected) return;
    setUpdatingStatus(true);
    try {
      await api.put<ApiResponse<unknown>>(`/admin/bookings/${selected.id}/status`, {
        status: newStatus,
        kind: selected.kind,
      });
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
    <section className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
            className={`admin-card flex items-center gap-3 rounded-xl p-4 text-left transition hover:shadow-sm ${filterStatus === key ? 'ring-2 ring-forest-500/30' : ''}`}
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

      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
             Bookings
            {total > 0 && <span className="ml-2 text-base font-normal text-ink-400">({total})</span>}
          </h1>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full sm:w-auto">
            <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search traveler or trip…"
              className="h-10 w-full rounded-full border border-ink-900/12 bg-white pl-9 pr-4 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20 sm:w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as BookingStatus | '')}
            className="h-10 w-full rounded-full border border-ink-900/12 bg-white px-4 text-sm text-ink-700 transition focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20 sm:w-auto"
          >
            <option value="">All statuses</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden rounded-xl">
        <div className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center text-sm text-ink-400">No bookings found.</div>
          ) : (
            <table className="admin-table admin-table--compact admin-table--head-center admin-bookings-table w-full table-fixed text-left text-sm">
              <colgroup>
                <col style={{ width: '5%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '21%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '4%' }} />
              </colgroup>
              <thead className="bg-sand-50/95">
                <tr className="border-b border-ink-900/14">
                  {['No.', 'Traveler', 'Trek / Tour', 'Departure', 'People', 'Status', 'Payment', 'Total', 'Booked on', ''].map((h) => (
                    <th key={h} className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id} className="group border-b border-ink-900/6 last:border-b-0 hover:bg-sand-50/60 transition-colors">
                    <td className="px-3 py-3 text-center font-semibold text-ink-500">
                      {(page - 1) * 15 + index + 1}
                    </td>
                    <td className="px-3 py-3">
                      <div className="mx-auto min-w-0 max-w-[170px] text-center">
                          <p className="truncate font-semibold text-ink-900">
                            {booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Unknown'}
                          </p>
                          <p className="truncate text-xs text-ink-400">{booking.user?.email ?? '—'}</p>
                        </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="mx-auto min-w-0 max-w-[220px] text-center">
                        <div className="flex items-center justify-center gap-2">
                          <p className="truncate font-medium text-ink-700">{booking.trip?.title ?? '—'}</p>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
                            booking.kind === 'TOUR'
                              ? 'bg-sea-500/10 text-sea-600'
                              : 'bg-forest-500/10 text-forest-600'
                          }`}>
                            {booking.kind === 'TOUR' ? 'Tour' : 'Trek'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-ink-600">
                      {booking.schedule?.date ? formatDate(booking.schedule.date) : '—'}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-700">
                        <Users className="h-3 w-3" />{booking.numberOfPeople}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center"><StatusBadge status={booking.status} compact /></td>
                    <td className="px-3 py-3 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-ink-500">{booking.payment?.status ?? 'N/A'}</td>
                    <td className="px-3 py-3 text-center text-sm font-semibold text-forest-600">{formatMoney(booking.totalAmount)}</td>
                    <td className="px-3 py-3 text-center text-xs text-ink-500">{formatDate(booking.createdAt)}</td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => openDetail(booking)}
                        className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-ink-400 hover:bg-forest-500/10 hover:text-forest-600 transition"
                        title="View details"
                      >
                        <SuitcaseRolling className="h-4 w-4" />
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
          <div className="flex flex-col gap-3 border-t border-ink-900/6 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-500">Page {page} of {totalPages}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" size="sm" variant="secondary" className="w-full sm:w-auto" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button type="button" size="sm" variant="secondary" className="w-full sm:w-auto" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Booking Detail Modal ── */}
      {selected && !statusModal && (
        <Modal title={`${selected.kind === 'TOUR' ? 'Tour' : 'Trek'} booking — ${selected.user?.firstName ?? ''} ${selected.user?.lastName ?? ''}`} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            {/* Status + action */}
            <div className="flex flex-col gap-3 rounded-xl border border-ink-900/6 bg-sand-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={selected.status} />
                <span className="text-sm font-semibold text-ink-900">{formatMoney(selected.totalAmount)}</span>
              </div>
              <Button type="button" size="sm" variant="secondary" className="w-full sm:w-auto" onClick={() => setStatusModal(true)}>
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
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">{selected.kind === 'TOUR' ? 'Tour' : 'Trek'}</p>
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
                      <span className="font-medium text-ink-900">{p.fullName}</span>
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

            <div className="flex flex-col-reverse gap-3 border-t border-ink-900/8 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setSelected(null)}>Close</Button>
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

            <div className="flex flex-col-reverse gap-3 border-t border-ink-900/8 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setStatusModal(false)}>Cancel</Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
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
    </section>
  );
}
