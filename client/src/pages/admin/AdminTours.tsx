import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CalendarDots,
  ImageSquare,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Trash,
  X,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import type { ApiResponse } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// ─── Types ───────────────────────────────────────────────────────────────────

type TypeLabel = 'HILL_STATION' | 'BEACH' | 'SPIRITUAL' | 'NATURE' | 'ADVENTURE';

interface Tour {
  id: string;
  title: string;
  slug: string;
  typeLabel: TypeLabel;
  departureDate: string;
  groupSize: string;
  distance: string;
  driveTime: string;
  price: number;
  comparePrice: number;
  summary: string;
  highlights: string[];
  bestSeason: string;
  tip: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TourFormState {
  title: string;
  typeLabel: TypeLabel;
  departureDate: string;
  groupSize: string;
  distance: string;
  driveTime: string;
  price: string;
  comparePrice: string;
  summary: string;
  highlights: [string, string, string, string];
  bestSeason: string;
  tip: string;
  imageUrl: string;
  isActive: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  HILL_STATION: 'Hill Station',
  BEACH: 'Beach',
  SPIRITUAL: 'Spiritual',
  NATURE: 'Nature',
  ADVENTURE: 'Adventure',
};

const TYPE_COLORS: Record<string, string> = {
  HILL_STATION: 'bg-forest-500/10 text-forest-700',
  BEACH: 'bg-sea-500/10 text-sea-700',
  SPIRITUAL: 'bg-gold-500/10 text-gold-700',
  NATURE: 'bg-primary-100 text-primary-800',
  ADVENTURE: 'bg-coral-500/10 text-coral-600',
};

const TYPE_OPTIONS: TypeLabel[] = ['HILL_STATION', 'BEACH', 'SPIRITUAL', 'NATURE', 'ADVENTURE'];

const emptyForm: TourFormState = {
  title: '',
  typeLabel: 'HILL_STATION',
  departureDate: '',
  groupSize: '',
  distance: '',
  driveTime: '',
  price: '',
  comparePrice: '',
  summary: '',
  highlights: ['', '', '', ''],
  bestSeason: '',
  tip: '',
  imageUrl: '',
  isActive: true,
};

function formatMoney(amount: number) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  const e = error as { response?: { data?: { message?: string; errors?: Array<{ message?: string }> } } };
  return e.response?.data?.errors?.[0]?.message ?? e.response?.data?.message ?? 'Request failed';
}

function normalizeTour(tour: Tour): TourFormState {
  const h = tour.highlights ?? [];
  return {
    title: tour.title,
    typeLabel: tour.typeLabel,
    departureDate: tour.departureDate ? tour.departureDate.slice(0, 10) : '',
    groupSize: tour.groupSize,
    distance: tour.distance,
    driveTime: tour.driveTime,
    price: String(tour.price),
    comparePrice: String(tour.comparePrice),
    summary: tour.summary,
    highlights: [h[0] ?? '', h[1] ?? '', h[2] ?? '', h[3] ?? ''],
    bestSeason: tour.bestSeason,
    tip: tour.tip,
    imageUrl: tour.imageUrl,
    isActive: tour.isActive,
  };
}

function buildPayload(form: TourFormState) {
  return {
    title: form.title,
    typeLabel: form.typeLabel,
    departureDate: form.departureDate,
    groupSize: form.groupSize,
    distance: form.distance,
    driveTime: form.driveTime,
    price: Number(form.price),
    comparePrice: Number(form.comparePrice),
    summary: form.summary,
    highlights: form.highlights.filter(Boolean),
    bestSeason: form.bestSeason,
    tip: form.tip,
    imageUrl: form.imageUrl,
    isActive: form.isActive,
  };
}

// ─── Reusable field ──────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-xl border border-ink-900/12 bg-sand-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-forest-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 transition';

// ─── Modal wrapper ───────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="admin-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/40 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-8">
      <div
        ref={ref}
        className="admin-modal-panel relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-2xl flex-col rounded-[1.6rem] border border-white/80 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.18)] sm:max-h-[calc(100vh-4rem)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-ink-900/8 px-4 py-4 sm:px-6">
          <h3 className="text-lg font-bold text-ink-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-100 text-ink-500 hover:bg-sand-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({ active }: { active: boolean }) {
  if (active) return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-forest-600">
      <span className="h-1.5 w-1.5 rounded-full bg-forest-500" /> Active
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">
      <span className="h-1.5 w-1.5 rounded-full bg-ink-400" /> Inactive
    </span>
  );
}

function TypeBadge({ value }: { value: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${TYPE_COLORS[value] ?? 'bg-sand-100 text-ink-600'}`}>
      {TYPE_LABELS[value] ?? value}
    </span>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function AdminTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [search, setSearch] = useState('');
  const [listLoading, setListLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [form, setForm] = useState<TourFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [tourToDelete, setTourToDelete] = useState<Pick<Tour, 'id' | 'title'> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Image modal state
  const [imageModalTour, setImageModalTour] = useState<Tour | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [savingImage, setSavingImage] = useState(false);

  // Schedule modal state
  const [scheduleModalTour, setScheduleModalTour] = useState<Tour | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [savingSchedule, setSavingSchedule] = useState(false);

  // ── Data loading ─────────────────────────────────────────────────────

  const loadTours = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await api.get<ApiResponse<{ tours: Tour[] }>>(
        '/admin/tours', { params: { search: search || undefined, limit: 50 } },
      );
      setTours(res.data.data.tours);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setTours([]);
    } finally {
      setListLoading(false);
    }
  }, [search]);

  useEffect(() => { void loadTours(); }, [loadTours]);

  // ── Modal handlers ───────────────────────────────────────────────────

  const openCreate = () => {
    setEditingTourId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = async (tourId: string) => {
    try {
      const res = await api.get<ApiResponse<{ tour: Tour }>>(`/admin/tours/${tourId}`);
      const tour = res.data.data.tour;
      setEditingTourId(tourId);
      setForm(normalizeTour(tour));
      setModalOpen(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTourId(null);
    setForm(emptyForm);
  };

  const updateField = <K extends keyof TourFormState>(field: K, value: TourFormState[K]) => {
    setForm((cur) => ({ ...cur, [field]: value }));
  };

  const updateHighlight = (index: number, value: string) => {
    setForm((cur) => {
      const next = [...cur.highlights] as [string, string, string, string];
      next[index] = value;
      return { ...cur, highlights: next };
    });
  };

  // ── Save ─────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload(form);
      if (editingTourId) {
        await api.put(`/admin/tours/${editingTourId}`, payload);
        toast.success('Tour updated successfully');
      } else {
        await api.post('/admin/tours', payload);
        toast.success('Tour created successfully');
      }
      closeModal();
      void loadTours();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!tourToDelete) return;
    setDeletingId(tourToDelete.id);
    try {
      await api.delete(`/admin/tours/${tourToDelete.id}`);
      toast.success('Tour deleted');
      setTourToDelete(null);
      void loadTours();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  // ── Image modal ─────────────────────────────────────────────────

  const openImageModal = (tour: Tour) => {
    setImageModalTour(tour);
    setImageUrl(tour.imageUrl ?? '');
  };

  const openScheduleModal = (tour: Tour) => {
    setScheduleModalTour(tour);
    setScheduleDate(tour.departureDate ? tour.departureDate.slice(0, 10) : '');
  };

  const saveSchedule = async () => {
    if (!scheduleModalTour) return;
    if (!scheduleDate) {
      toast.error('Select a departure date');
      return;
    }

    setSavingSchedule(true);
    try {
      await api.put(`/admin/tours/${scheduleModalTour.id}`, { departureDate: scheduleDate });
      toast.success('Tour schedule updated');
      setScheduleModalTour(null);
      void loadTours();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingSchedule(false);
    }
  };

  const saveImage = async () => {
    if (!imageModalTour) return;
    setSavingImage(true);
    try {
      await api.put(`/admin/tours/${imageModalTour.id}`, {
        ...buildPayload(normalizeTour(imageModalTour)),
        imageUrl: imageUrl.trim(),
      });
      toast.success('Tour image updated');
      setImageModalTour(null);
      void loadTours();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingImage(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">Tours Section</h1>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full sm:w-auto">
            <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search tours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-full border border-ink-900/12 bg-white pl-9 pr-4 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20 sm:w-56"
            />
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="admin-action-button inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-forest-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97] sm:w-auto"
          >
            <Plus className="h-4 w-4" weight="bold" /> Add Tour
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-ink-900/12 bg-white">
        {listLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : tours.length === 0 ? (
          <div className="py-20 text-center text-sm text-ink-400">
            {search ? 'No tours match your search.' : 'No tours found. Create your first tour!'}
          </div>
        ) : (
          <div className="admin-table-scroll overflow-x-auto">
            <table className="admin-table admin-table--compact admin-table--head-center min-w-[940px] w-full text-left text-sm">
              <thead className="bg-sand-50/95">
                <tr className="border-b border-ink-900/14">
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">No.</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Tour</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Type</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Departure</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Price</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Status</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Updated</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour, index) => (
                  <tr
                    key={tour.id}
                    className="border-b border-ink-900/6 last:border-b-0 hover:bg-sand-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-center font-semibold text-ink-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <div className="mx-auto min-w-0 max-w-[220px] text-left">
                        <p className="truncate font-semibold text-ink-900">{tour.title}</p>
                        <p className="max-w-[220px] truncate text-xs text-ink-400">{tour.summary}</p>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="px-4 py-3 text-center">
                      <TypeBadge value={tour.typeLabel} />
                    </td>

                    {/* DEPARTURE */}
                    <td className="px-4 py-3 whitespace-nowrap text-center text-ink-600">
                      {tour.departureDate ? formatDate(tour.departureDate) : '—'}
                    </td>

                    {/* PRICE */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="font-semibold text-forest-600">{formatMoney(tour.price)}</span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3 text-center">
                      <StatusBadge active={tour.isActive} />
                    </td>

                    {/* UPDATED */}
                    <td className="px-4 py-3 whitespace-nowrap text-center text-xs text-ink-500">
                      {formatDate(tour.updatedAt)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => void openEdit(tour.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-forest-600 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-forest-500"
                          title="Edit"
                        >
                          <PencilSimple className="h-4.5 w-4.5" weight="duotone" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openScheduleModal(tour)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-sea-600 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-sea-500"
                          title="Manage schedules"
                        >
                          <CalendarDots className="h-4.5 w-4.5" weight="duotone" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openImageModal(tour)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-gold-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-gold-600"
                          title="Manage image"
                        >
                          <ImageSquare className="h-4.5 w-4.5" weight="duotone" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTourToDelete({ id: tour.id, title: tour.title })}
                          disabled={deletingId === tour.id}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-coral-600 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-coral-500 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash className="h-4.5 w-4.5" weight="duotone" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {scheduleModalTour && (
        <Modal
          title={`Manage schedules — ${scheduleModalTour.title}`}
          onClose={() => setScheduleModalTour(null)}
        >
          <div className="space-y-5">
            <div className="rounded-xl border border-ink-900/8 bg-sand-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-400">Departure</p>
              <p className="mt-1 text-sm text-ink-600">
                Tours currently store one departure date. Update it here from the schedules action.
              </p>
            </div>

            <Field label="Departure date">
              <input
                type="date"
                className={inputCls}
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </Field>

            <div className="flex flex-col-reverse gap-3 border-t border-ink-900/8 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setScheduleModalTour(null)}
                className="h-10 w-full rounded-xl border border-ink-900/12 bg-white px-5 text-sm font-semibold text-ink-600 transition hover:bg-sand-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveSchedule()}
                disabled={savingSchedule}
                className="admin-action-button inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-forest-500 px-5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 sm:w-auto"
              >
                {savingSchedule ? 'Saving...' : 'Save schedule'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Image Modal */}
      {imageModalTour && (
        <Modal
          title={`Image — ${imageModalTour.title}`}
          onClose={() => setImageModalTour(null)}
        >
          <div className="space-y-5">
            {/* Preview */}
            {imageUrl.trim() ? (
              <div className="overflow-hidden rounded-xl border border-ink-900/8">
                <img
                  src={imageUrl}
                  alt={imageModalTour.title}
                  className="h-48 w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-ink-900/12 bg-sand-50 text-ink-400 text-sm">
                No image set
              </div>
            )}

            <Field label="Image URL">
              <input
                className={inputCls}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </Field>

            <div className="flex flex-col-reverse gap-3 border-t border-ink-900/8 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setImageModalTour(null)}
                className="h-10 w-full rounded-xl border border-ink-900/12 bg-white px-5 text-sm font-semibold text-ink-600 transition hover:bg-sand-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveImage()}
                disabled={savingImage}
                className="admin-action-button inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-forest-500 px-5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 sm:w-auto"
              >
                {savingImage ? 'Saving...' : 'Save Image'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal
          title={editingTourId ? 'Edit Tour' : 'Create Tour'}
          onClose={closeModal}
        >
          <div className="space-y-5">
            {/* Row 1: Title + Type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input
                  className={inputCls}
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g. Lohagad Fort One-Day Tour"
                />
              </Field>
              <Field label="Type">
                <select
                  className={inputCls}
                  value={form.typeLabel}
                  onChange={(e) => updateField('typeLabel', e.target.value as TypeLabel)}
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Row 2: Departure + Group Size */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Departure Date">
                <input
                  type="date"
                  className={inputCls}
                  value={form.departureDate}
                  onChange={(e) => updateField('departureDate', e.target.value)}
                />
              </Field>
              <Field label="Group Size">
                <input
                  className={inputCls}
                  value={form.groupSize}
                  onChange={(e) => updateField('groupSize', e.target.value)}
                  placeholder="e.g. 15-25"
                />
              </Field>
            </div>

            {/* Row 3: Distance + Drive Time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Distance">
                <input
                  className={inputCls}
                  value={form.distance}
                  onChange={(e) => updateField('distance', e.target.value)}
                  placeholder="e.g. 5 km"
                />
              </Field>
              <Field label="Drive Time">
                <input
                  className={inputCls}
                  value={form.driveTime}
                  onChange={(e) => updateField('driveTime', e.target.value)}
                  placeholder="e.g. 2h 30m"
                />
              </Field>
            </div>

            {/* Row 4: Price + Compare Price */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Price (INR)">
                <input
                  type="number"
                  className={inputCls}
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="e.g. 1200"
                  min="0"
                />
              </Field>
              <Field label="Compare Price (INR)">
                <input
                  type="number"
                  className={inputCls}
                  value={form.comparePrice}
                  onChange={(e) => updateField('comparePrice', e.target.value)}
                  placeholder="e.g. 1800"
                  min="0"
                />
              </Field>
            </div>

            {/* Summary */}
            <Field label="Summary">
              <textarea
                className={`${inputCls} min-h-[80px] resize-y`}
                value={form.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder="Brief tour description..."
                rows={3}
              />
            </Field>

            {/* Highlights */}
            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                Highlights
              </span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {form.highlights.map((h, i) => (
                  <input
                    key={i}
                    className={inputCls}
                    value={h}
                    onChange={(e) => updateHighlight(i, e.target.value)}
                    placeholder={`Highlight ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Row 5: Best Season + Tip */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Best Season">
                <input
                  className={inputCls}
                  value={form.bestSeason}
                  onChange={(e) => updateField('bestSeason', e.target.value)}
                  placeholder="e.g. October to March"
                />
              </Field>
              <Field label="Tip">
                <input
                  className={inputCls}
                  value={form.tip}
                  onChange={(e) => updateField('tip', e.target.value)}
                  placeholder="e.g. Carry extra water"
                />
              </Field>
            </div>

            {/* Image URL */}
            <Field label="Image URL">
              <input
                className={inputCls}
                value={form.imageUrl}
                onChange={(e) => updateField('imageUrl', e.target.value)}
                placeholder="https://..."
              />
            </Field>

            {/* Active toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateField('isActive', e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-ink-200 peer-checked:bg-forest-500 transition" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-medium text-ink-700">Active</span>
            </label>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-ink-900/8 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="h-10 w-full rounded-xl border border-ink-900/12 bg-white px-5 text-sm font-semibold text-ink-600 transition hover:bg-sand-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="admin-action-button inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-forest-500 px-5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 sm:w-auto"
              >
                {saving ? 'Saving...' : 'Save Tour'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(tourToDelete)}
        title={tourToDelete ? `Delete ${tourToDelete.title}?` : 'Delete tour?'}
        description={
          tourToDelete ? (
            <>
              <span className="font-semibold text-ink-900">{tourToDelete.title}</span> will be removed from the tours
              section if deletion is allowed. This action cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete tour"
        cancelLabel="Keep tour"
        confirmLoading={deletingId === tourToDelete?.id}
        icon={<Trash className="h-7 w-7" weight="bold" />}
        onClose={() => {
          if (deletingId === tourToDelete?.id) return;
          setTourToDelete(null);
        }}
        onConfirm={() => void handleDelete()}
      />
    </section>
  );
}
