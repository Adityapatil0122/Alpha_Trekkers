import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CalendarDots,
  CloudArrowUp,
  FloppyDisk,
  ImageSquare,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Star,
  Trash,
  X,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import {
  CATEGORIES,
  DIFFICULTIES,
  type AdminTripDetail,
  type AdminTripSummary,
  type ApiResponse,
  type Difficulty,
  type PaginatedResponse,
  type TripCategory,
} from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// ─── Types ───────────────────────────────────────────────────────────────────

type TripFormState = {
  title: string;
  shortDescription: string;
  description: string;
  difficulty: Difficulty;
  category: TripCategory;
  region: string;
  fortName: string;
  startLocation: string;
  endLocation: string;
  meetingPoint: string;
  meetingTime: string;
  durationHours: string;
  distanceKm: string;
  elevationM: string;
  maxAltitudeM: string;
  basePrice: string;
  discountPrice: string;
  maxGroupSize: string;
  minAge: string;
  highlights: string;
  inclusions: string;
  exclusions: string;
  thingsToCarry: string;
  isActive: boolean;
  isFeatured: boolean;
};

type ScheduleDraft = {
  date: string;
  availableSpots: string;
  priceOverride: string;
  status: 'OPEN' | 'FULL' | 'CANCELLED';
};

type ImageDraft = {
  url: string;
  altText: string;
  sortOrder: string;
  isPrimary: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const emptyForm: TripFormState = {
  title: '', shortDescription: '', description: '',
  difficulty: 'MODERATE', category: 'WEEKEND',
  region: '', fortName: '', startLocation: '', endLocation: '',
  meetingPoint: '', meetingTime: '',
  durationHours: '', distanceKm: '', elevationM: '', maxAltitudeM: '',
  basePrice: '', discountPrice: '', maxGroupSize: '', minAge: '',
  highlights: '', inclusions: '', exclusions: '', thingsToCarry: '',
  isActive: true, isFeatured: false,
};

const emptySchedule: ScheduleDraft = { date: '', availableSpots: '20', priceOverride: '', status: 'OPEN' };
const emptyImage: ImageDraft = { url: '', altText: '', sortOrder: '0', isPrimary: false };

function linesToText(lines: string[] | undefined) { return (lines ?? []).join('\n'); }
function textToLines(value: string) { return value.split('\n').map((s) => s.trim()).filter(Boolean); }

function toDateTimeLocal(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
function toIsoString(value: string) { return new Date(value).toISOString(); }

function formatDate(v: string) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(v));
}

function getErrorMessage(error: unknown) {
  const e = error as { response?: { data?: { message?: string; errors?: Array<{ message?: string }> } } };
  return e.response?.data?.errors?.[0]?.message ?? e.response?.data?.message ?? 'Request failed';
}

function normalizeTrip(trip: AdminTripDetail): TripFormState {
  return {
    title: trip.title, shortDescription: trip.shortDescription, description: trip.description,
    difficulty: trip.difficulty, category: trip.category,
    region: trip.region, fortName: trip.fortName ?? '',
    startLocation: trip.startLocation, endLocation: trip.endLocation,
    meetingPoint: trip.meetingPoint, meetingTime: trip.meetingTime,
    durationHours: String(trip.durationHours), distanceKm: String(trip.distanceKm),
    elevationM: String(trip.elevationM), maxAltitudeM: String(trip.maxAltitudeM),
    basePrice: String(trip.basePrice), discountPrice: trip.discountPrice ? String(trip.discountPrice) : '',
    maxGroupSize: String(trip.maxGroupSize), minAge: String(trip.minAge),
    highlights: linesToText(trip.highlights), inclusions: linesToText(trip.inclusions),
    exclusions: linesToText(trip.exclusions), thingsToCarry: linesToText(trip.thingsToCarry),
    isActive: trip.isActive, isFeatured: trip.isFeatured,
  };
}

// ─── Reusable field ───────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">{label}</span>
      {children}
    </label>
  );
}

const inputCls = 'w-full rounded-xl border border-ink-900/12 bg-sand-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-forest-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 transition';

// ─── Modal wrapper ────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide }: {
  title: string; onClose: () => void; children: React.ReactNode; wide?: boolean;
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
        className={`admin-modal-panel relative flex max-h-[calc(100vh-1.5rem)] w-full flex-col rounded-[1.6rem] border border-white/80 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.18)] sm:max-h-[calc(100vh-4rem)] ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}
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

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ active, featured }: { active: boolean; featured: boolean }) {
  if (featured) return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-600">
      <Star className="h-3 w-3" weight="fill" /> Featured
    </span>
  );
  if (active) return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-forest-600">
      <span className="h-1.5 w-1.5 rounded-full bg-forest-500" /> Live
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">
      <span className="h-1.5 w-1.5 rounded-full bg-ink-400" /> Draft
    </span>
  );
}

function DifficultyBadge({ value }: { value: string }) {
  const cls: Record<string, string> = {
    EASY: 'bg-forest-500/10 text-forest-600',
    MODERATE: 'bg-sea-500/10 text-sea-600',
    DIFFICULT: 'bg-gold-500/12 text-gold-700',
    EXTREME: 'bg-coral-500/10 text-coral-600',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${cls[value] ?? 'bg-sand-100 text-ink-600'}`}>
      {value}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminTrips() {
  const [tripList, setTripList] = useState<AdminTripSummary[]>([]);
  const [tripSearch, setTripSearch] = useState('');
  const [listLoading, setListLoading] = useState(true);
  const [trekToDelete, setTrekToDelete] = useState<Pick<AdminTripSummary, 'id' | 'title'> | null>(null);
  const [deletingTrek, setDeletingTrek] = useState(false);

  // Selected trip for detail modal
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<AdminTripDetail | null>(null);
  const [tripForm, setTripForm] = useState<TripFormState>(emptyForm);
  const [detailLoading, setDetailLoading] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);

  // Schedules modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDrafts, setScheduleDrafts] = useState<Record<string, ScheduleDraft>>({});
  const [newSchedule, setNewSchedule] = useState<ScheduleDraft>(emptySchedule);
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Images modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageDrafts, setImageDrafts] = useState<Record<string, ImageDraft>>({});
  const [newImage, setNewImage] = useState<ImageDraft>(emptyImage);
  const [savingImage, setSavingImage] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // ── Data loading ──────────────────────────────────────────────────────

  const loadTrips = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await api.get<PaginatedResponse<{ trips: AdminTripSummary[] }>>(
        '/admin/trips', { params: { search: tripSearch || undefined, limit: 50 } },
      );
      setTripList(res.data.data.trips);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setTripList([]);
    } finally {
      setListLoading(false);
    }
  }, [tripSearch]);

  const loadTripDetail = async (tripId: string) => {
    setDetailLoading(true);
    try {
      const res = await api.get<ApiResponse<{ trip: AdminTripDetail }>>(`/admin/trips/${tripId}`);
      const trip = res.data.data.trip;
      setSelectedTrip(trip);
      setTripForm(normalizeTrip(trip));
      setScheduleDrafts(Object.fromEntries(
        trip.schedules.map((s) => [s.id, {
          date: toDateTimeLocal(s.date),
          availableSpots: String(s.availableSpots),
          priceOverride: s.priceOverride ? String(s.priceOverride) : '',
          status: s.status as ScheduleDraft['status'],
        }]),
      ));
      setImageDrafts(Object.fromEntries(
        trip.images.map((img) => [img.id, {
          url: img.url, altText: img.altText ?? '',
          sortOrder: String(img.sortOrder), isPrimary: img.isPrimary,
        }]),
      ));
      setNewImage((cur) => ({ ...cur, sortOrder: String(trip.images.length) }));
      return trip;
    } catch (error) {
      toast.error(getErrorMessage(error));
      setSelectedTrip(null);
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => { void loadTrips(); }, [loadTrips]);

  const openTripModal = (tripId: string) => {
    setTripModalOpen(true);
    setSelectedTripId(tripId);
    void loadTripDetail(tripId);
  };

  const openScheduleManager = async (tripId: string) => {
    setTripModalOpen(false);
    setImageModalOpen(false);
    setScheduleModalOpen(false);
    setSelectedTripId(tripId);
    const trip = await loadTripDetail(tripId);
    if (trip) {
      setScheduleModalOpen(true);
    }
  };

  const openImageManager = async (tripId: string) => {
    setTripModalOpen(false);
    setScheduleModalOpen(false);
    setImageModalOpen(false);
    setSelectedTripId(tripId);
    const trip = await loadTripDetail(tripId);
    if (trip) {
      setImageModalOpen(true);
    }
  };

  const openCreateTrek = () => {
    setTripModalOpen(true);
    setSelectedTripId(null);
    setSelectedTrip(null);
    setTripForm(emptyForm);
    setDetailLoading(false);
    setScheduleModalOpen(false);
    setImageModalOpen(false);
  };

  const closeTripModal = () => {
    setTripModalOpen(false);
    setScheduleModalOpen(false);
    setImageModalOpen(false);
    setSelectedTripId(null);
    setSelectedTrip(null);
    setTripForm(emptyForm);
    setScheduleDrafts({});
    setImageDrafts({});
    setNewSchedule(emptySchedule);
    setNewImage(emptyImage);
  };

  // ── Mutations ─────────────────────────────────────────────────────────

  const updateForm = (field: keyof TripFormState, value: string | boolean) => {
    setTripForm((cur) => ({ ...cur, [field]: value }));
  };

  const buildDefaultItinerary = () => [
    {
      time: tripForm.meetingTime.trim() || '06:00',
      title: `Start ${tripForm.title.trim() || 'the trek'}`,
      description:
        tripForm.description.trim() ||
        `Meet at ${tripForm.meetingPoint.trim() || 'the meeting point'}, begin from ${
          tripForm.startLocation.trim() || 'the base location'
        }, and finish at ${tripForm.endLocation.trim() || 'the endpoint'}.`,
    },
  ];

  const saveTrip = async () => {
    setSavingTrip(true);
    try {
      const payload = {
        title: tripForm.title.trim(), shortDescription: tripForm.shortDescription.trim(),
        description: tripForm.description.trim(), difficulty: tripForm.difficulty,
        category: tripForm.category, region: tripForm.region.trim(),
        fortName: tripForm.fortName.trim() || undefined,
        startLocation: tripForm.startLocation.trim(), endLocation: tripForm.endLocation.trim(),
        meetingPoint: tripForm.meetingPoint.trim(), meetingTime: tripForm.meetingTime.trim(),
        durationHours: Number(tripForm.durationHours), distanceKm: Number(tripForm.distanceKm),
        elevationM: Number(tripForm.elevationM), maxAltitudeM: Number(tripForm.maxAltitudeM),
        basePrice: Number(tripForm.basePrice),
        discountPrice: tripForm.discountPrice.trim() ? Number(tripForm.discountPrice) : undefined,
        maxGroupSize: Number(tripForm.maxGroupSize), minAge: Number(tripForm.minAge),
        highlights: textToLines(tripForm.highlights), inclusions: textToLines(tripForm.inclusions),
        exclusions: textToLines(tripForm.exclusions), thingsToCarry: textToLines(tripForm.thingsToCarry),
        isActive: tripForm.isActive, isFeatured: tripForm.isFeatured,
      };

      if (selectedTripId) {
        await api.put(`/trips/${selectedTripId}`, payload);
        toast.success('Trek updated');
        await loadTrips();
        await loadTripDetail(selectedTripId);
      } else {
        const res = await api.post<ApiResponse<{ trip: AdminTripDetail }>>('/trips', {
          ...payload,
          itinerary: buildDefaultItinerary(),
        });
        if (!tripForm.isActive) {
          await api.put(`/trips/${res.data.data.trip.id}`, { isActive: false });
        }
        toast.success('Trek created');
        closeTripModal();
        await loadTrips();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingTrip(false);
    }
  };

  const addSchedule = async () => {
    if (!selectedTripId) return;
    if (!newSchedule.date) { toast.error('Select a departure date first'); return; }
    setSavingSchedule(true);
    try {
      await api.post(`/admin/trips/${selectedTripId}/schedules`, {
        date: toIsoString(newSchedule.date),
        availableSpots: Number(newSchedule.availableSpots),
        priceOverride: newSchedule.priceOverride.trim() ? Number(newSchedule.priceOverride) : null,
        status: newSchedule.status,
      });
      toast.success('Departure added');
      setNewSchedule(emptySchedule);
      await loadTripDetail(selectedTripId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingSchedule(false);
    }
  };

  const saveExistingSchedule = async (scheduleId: string) => {
    const draft = scheduleDrafts[scheduleId];
    if (!draft?.date) { toast.error('Select a valid departure date'); return; }
    try {
      await api.put(`/admin/trip-schedules/${scheduleId}`, {
        date: toIsoString(draft.date), availableSpots: Number(draft.availableSpots),
        priceOverride: draft.priceOverride.trim() ? Number(draft.priceOverride) : null,
        status: draft.status,
      });
      toast.success('Schedule updated');
      if (selectedTripId) await loadTripDetail(selectedTripId);
    } catch (error) { toast.error(getErrorMessage(error)); }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      await api.delete(`/admin/trip-schedules/${scheduleId}`);
      toast.success('Schedule deleted');
      if (selectedTripId) await loadTripDetail(selectedTripId);
    } catch (error) { toast.error(getErrorMessage(error)); }
  };

  const addImageByUrl = async () => {
    if (!selectedTripId) return;
    setSavingImage(true);
    try {
      await api.post(`/admin/trips/${selectedTripId}/images/url`, {
        url: newImage.url.trim(), altText: newImage.altText.trim() || null,
        sortOrder: Number(newImage.sortOrder), isPrimary: newImage.isPrimary,
      });
      toast.success('Image added');
      setNewImage(emptyImage);
      await loadTripDetail(selectedTripId);
    } catch (error) { toast.error(getErrorMessage(error)); }
    finally { setSavingImage(false); }
  };

  const saveExistingImage = async (imageId: string) => {
    const draft = imageDrafts[imageId];
    if (!draft) return;
    try {
      await api.put(`/admin/trip-images/${imageId}`, {
        url: draft.url.trim(), altText: draft.altText.trim() || null,
        sortOrder: Number(draft.sortOrder), isPrimary: draft.isPrimary,
      });
      toast.success('Image updated');
      if (selectedTripId) await loadTripDetail(selectedTripId);
    } catch (error) { toast.error(getErrorMessage(error)); }
  };

  const deleteImage = async (imageId: string) => {
    try {
      await api.delete(`/trips/images/${imageId}`);
      toast.success('Image deleted');
      if (selectedTripId) await loadTripDetail(selectedTripId);
    } catch (error) { toast.error(getErrorMessage(error)); }
  };

  const uploadTripImages = async (files: FileList) => {
    if (!selectedTripId || files.length === 0) return;
    setUploadingImages(true);
    try {
      const payload = new FormData();
      Array.from(files).forEach((f) => payload.append('images', f));
      await api.post(`/trips/${selectedTripId}/images`, payload);
      toast.success('Images uploaded');
      await loadTripDetail(selectedTripId);
    } catch (error) { toast.error(getErrorMessage(error)); }
    finally { setUploadingImages(false); }
  };

  const deleteTrek = async () => {
    if (!trekToDelete) return;
    setDeletingTrek(true);
    try {
      await api.delete(`/trips/${trekToDelete.id}`);
      toast.success('Trek deleted');
      if (selectedTripId === trekToDelete.id) closeTripModal();
      setTrekToDelete(null);
      await loadTrips();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingTrek(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">Trek Section</h1>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative w-full sm:w-auto">
            <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search treks..."
              value={tripSearch}
              onChange={(e) => setTripSearch(e.target.value)}
              className="h-10 w-full rounded-full border border-ink-900/12 bg-white pl-9 pr-4 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20 sm:w-56"
            />
          </div>
          <button
            type="button"
            onClick={openCreateTrek}
            className="admin-action-button inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-forest-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97] sm:w-auto"
          >
            <Plus className="h-4 w-4" weight="bold" /> Add Trek
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-ink-900/12 bg-white">
        {listLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : tripList.length === 0 ? (
          <div className="py-20 text-center text-sm text-ink-400">
            {tripSearch ? 'No treks match your search.' : 'No treks found.'}
          </div>
        ) : (
          <div className="admin-table-scroll overflow-x-auto">
            <table className="admin-table admin-table--compact admin-table--head-center min-w-[940px] w-full text-left text-sm">
              <thead className="bg-sand-50/95">
                <tr className="border-b border-ink-900/14">
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">No.</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Trek</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Difficulty</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Region</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Price</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Status</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Updated</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tripList.map((trip, index) => (
                  <tr
                    key={trip.id}
                    className="border-b border-ink-900/6 last:border-b-0 hover:bg-sand-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-center font-semibold text-ink-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <div className="mx-auto min-w-0 max-w-[220px] text-left">
                        <p className="truncate font-semibold text-ink-900">{trip.title}</p>
                        <p className="max-w-[220px] truncate text-xs text-ink-400">{trip.shortDescription}</p>
                      </div>
                    </td>

                    {/* DIFFICULTY */}
                    <td className="px-4 py-3 text-center">
                      <DifficultyBadge value={trip.difficulty} />
                    </td>

                    {/* REGION */}
                    <td className="px-4 py-3 whitespace-nowrap text-center text-ink-600">
                      {trip.region}
                    </td>

                    {/* PRICE */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="font-semibold text-forest-600">
                        ₹{(trip.discountPrice ?? trip.basePrice).toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3 text-center">
                      <StatusBadge active={trip.isActive} featured={trip.isFeatured} />
                    </td>

                    {/* UPDATED */}
                    <td className="px-4 py-3 whitespace-nowrap text-center text-xs text-ink-500">
                      {formatDate(trip.updatedAt)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openTripModal(trip.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-forest-600 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-forest-500"
                          title="Edit trek"
                        >
                          <PencilSimple className="h-4.5 w-4.5" weight="duotone" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void openScheduleManager(trip.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-sea-600 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-sea-500"
                          title="Manage schedules"
                        >
                          <CalendarDots className="h-4.5 w-4.5" weight="duotone" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void openImageManager(trip.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-gold-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-gold-600"
                          title="Manage images"
                        >
                          <ImageSquare className="h-4.5 w-4.5" weight="duotone" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTrekToDelete({ id: trip.id, title: trip.title })}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-coral-600 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-coral-500"
                          title="Delete trek"
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

      {/* ── Edit Trip Modal ── */}
      {tripModalOpen && !scheduleModalOpen && !imageModalOpen && (
        <Modal
          title={
            detailLoading
              ? 'Loading trek…'
              : selectedTripId
                ? `Edit trek — ${selectedTrip?.title ?? ''}`
                : 'Create trek'
          }
          onClose={closeTripModal}
          wide
        >
          {detailLoading ? (
            <LoadingSpinner text="Loading trek details..." />
          ) : (selectedTripId ? selectedTrip : true) ? (
            <div className="space-y-5">
              {/* Status strip */}
              {selectedTrip ? (
                <div className="flex flex-wrap gap-2 rounded-xl border border-ink-900/6 bg-sand-50 p-3">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-700 shadow-sm">
                  {selectedTrip._count.bookings} bookings
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-700 shadow-sm">
                  {selectedTrip.images.length} images
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-700 shadow-sm">
                  {selectedTrip.schedules.length} schedules
                </span>
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(true)}
                  className="rounded-full bg-sea-500/10 px-3 py-1 text-xs font-semibold text-sea-600 transition hover:bg-sea-500/20 sm:ml-auto"
                >
                  Manage schedules →
                </button>
                <button
                  type="button"
                  onClick={() => setImageModalOpen(true)}
                  className="rounded-full bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-600 hover:bg-gold-500/20 transition"
                >
                  Manage images →
                </button>
                </div>
              ) : null}

              {/* Core fields */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-2">
                  <Field label="Title">
                    <input value={tripForm.title} onChange={(e) => updateForm('title', e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <Field label="Category">
                  <select value={tripForm.category} onChange={(e) => updateForm('category', e.target.value as TripCategory)} className={inputCls}>
                    {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </Field>
                <Field label="Difficulty">
                  <select value={tripForm.difficulty} onChange={(e) => updateForm('difficulty', e.target.value as Difficulty)} className={inputCls}>
                    {Object.entries(DIFFICULTIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </Field>

                <div className="sm:col-span-2 lg:col-span-4">
                  <Field label="Short description">
                    <textarea rows={2} value={tripForm.shortDescription} onChange={(e) => updateForm('shortDescription', e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                  <Field label="Full description">
                    <textarea rows={4} value={tripForm.description} onChange={(e) => updateForm('description', e.target.value)} className={inputCls} />
                  </Field>
                </div>

                <Field label="Region"><input value={tripForm.region} onChange={(e) => updateForm('region', e.target.value)} className={inputCls} /></Field>
                <Field label="Fort name"><input value={tripForm.fortName} onChange={(e) => updateForm('fortName', e.target.value)} className={inputCls} /></Field>
                <Field label="Start location"><input value={tripForm.startLocation} onChange={(e) => updateForm('startLocation', e.target.value)} className={inputCls} /></Field>
                <Field label="End location"><input value={tripForm.endLocation} onChange={(e) => updateForm('endLocation', e.target.value)} className={inputCls} /></Field>
                <Field label="Meeting point"><input value={tripForm.meetingPoint} onChange={(e) => updateForm('meetingPoint', e.target.value)} className={inputCls} /></Field>
                <Field label="Meeting time"><input value={tripForm.meetingTime} onChange={(e) => updateForm('meetingTime', e.target.value)} className={inputCls} /></Field>
                <Field label="Duration (hrs)"><input type="number" min="1" value={tripForm.durationHours} onChange={(e) => updateForm('durationHours', e.target.value)} className={inputCls} /></Field>
                <Field label="Distance (km)"><input type="number" min="0" step="0.1" value={tripForm.distanceKm} onChange={(e) => updateForm('distanceKm', e.target.value)} className={inputCls} /></Field>
                <Field label="Elevation (m)"><input type="number" min="0" value={tripForm.elevationM} onChange={(e) => updateForm('elevationM', e.target.value)} className={inputCls} /></Field>
                <Field label="Max altitude (m)"><input type="number" min="0" value={tripForm.maxAltitudeM} onChange={(e) => updateForm('maxAltitudeM', e.target.value)} className={inputCls} /></Field>
                <Field label="Base price"><input type="number" min="0" value={tripForm.basePrice} onChange={(e) => updateForm('basePrice', e.target.value)} className={inputCls} /></Field>
                <Field label="Discount price"><input type="number" min="0" value={tripForm.discountPrice} onChange={(e) => updateForm('discountPrice', e.target.value)} placeholder="Optional" className={inputCls} /></Field>
                <Field label="Max group size"><input type="number" min="1" value={tripForm.maxGroupSize} onChange={(e) => updateForm('maxGroupSize', e.target.value)} className={inputCls} /></Field>
                <Field label="Minimum age"><input type="number" min="5" value={tripForm.minAge} onChange={(e) => updateForm('minAge', e.target.value)} className={inputCls} /></Field>
              </div>

              {/* Lists */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Highlights"><textarea rows={5} value={tripForm.highlights} onChange={(e) => updateForm('highlights', e.target.value)} className={inputCls} placeholder="One item per line" /></Field>
                <Field label="Inclusions"><textarea rows={5} value={tripForm.inclusions} onChange={(e) => updateForm('inclusions', e.target.value)} className={inputCls} placeholder="One item per line" /></Field>
                <Field label="Exclusions"><textarea rows={5} value={tripForm.exclusions} onChange={(e) => updateForm('exclusions', e.target.value)} className={inputCls} placeholder="One item per line" /></Field>
                <Field label="Things to carry"><textarea rows={5} value={tripForm.thingsToCarry} onChange={(e) => updateForm('thingsToCarry', e.target.value)} className={inputCls} placeholder="One item per line" /></Field>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-5 rounded-xl border border-ink-900/6 bg-sand-50 p-4">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-700">
                  <input type="checkbox" checked={tripForm.isActive} onChange={(e) => updateForm('isActive', e.target.checked)} className="h-4 w-4 accent-forest-500 rounded" />
                  Visible on public site
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-700">
                  <input type="checkbox" checked={tripForm.isFeatured} onChange={(e) => updateForm('isFeatured', e.target.checked)} className="h-4 w-4 accent-forest-500 rounded" />
                  Mark as featured
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-ink-900/8 pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={closeTripModal}>Cancel</Button>
                <Button type="button" variant="primary" className="w-full sm:w-auto" isLoading={savingTrip} leftIcon={<FloppyDisk className="h-4 w-4" />} onClick={() => void saveTrip()}>
                  {selectedTripId ? 'Save changes' : 'Create trek'}
                </Button>
              </div>
            </div>
          ) : null}
        </Modal>
      )}

      {/* ── Schedules Modal ── */}
      {scheduleModalOpen && selectedTrip && (
        <Modal title={`Schedules — ${selectedTrip.title}`} onClose={() => setScheduleModalOpen(false)} wide>
          <div className="space-y-5">
            {/* Add new */}
            <div className="rounded-xl border border-ink-900/6 bg-sand-50 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-ink-400">Add new departure</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Field label="Departure">
                  <input type="datetime-local" value={newSchedule.date} onChange={(e) => setNewSchedule((c) => ({ ...c, date: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Spots">
                  <input type="number" min="1" value={newSchedule.availableSpots} onChange={(e) => setNewSchedule((c) => ({ ...c, availableSpots: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Price override">
                  <input type="number" min="0" value={newSchedule.priceOverride} onChange={(e) => setNewSchedule((c) => ({ ...c, priceOverride: e.target.value }))} placeholder="Optional" className={inputCls} />
                </Field>
                <Field label="Status">
                  <select value={newSchedule.status} onChange={(e) => setNewSchedule((c) => ({ ...c, status: e.target.value as ScheduleDraft['status'] }))} className={inputCls}>
                    <option value="OPEN">Open</option>
                    <option value="FULL">Full</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </Field>
                <div className="flex items-end">
                  <Button type="button" variant="primary" fullWidth isLoading={savingSchedule} leftIcon={<Plus className="h-4 w-4" />} onClick={() => void addSchedule()}>
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Existing schedules */}
            <div className="space-y-3">
              {selectedTrip.schedules.length === 0 ? (
                <div className="rounded-xl border border-dashed border-ink-900/10 py-8 text-center text-sm text-ink-400">
                  No departures yet — add the first one above.
                </div>
              ) : selectedTrip.schedules.map((schedule) => {
                const draft = scheduleDrafts[schedule.id];
                if (!draft) return null;
                const statusColor: Record<string, string> = {
                  OPEN: 'bg-forest-500/10 text-forest-600',
                  FULL: 'bg-gold-500/12 text-gold-700',
                  CANCELLED: 'bg-coral-500/10 text-coral-600',
                };
                return (
                  <div key={schedule.id} className="rounded-xl border border-ink-900/8 bg-white p-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      <Field label="Departure">
                        <input type="datetime-local" value={draft.date} onChange={(e) => setScheduleDrafts((c) => ({ ...c, [schedule.id]: { ...draft, date: e.target.value } }))} className={inputCls} />
                      </Field>
                      <Field label="Spots">
                        <input type="number" min="1" value={draft.availableSpots} onChange={(e) => setScheduleDrafts((c) => ({ ...c, [schedule.id]: { ...draft, availableSpots: e.target.value } }))} className={inputCls} />
                      </Field>
                      <Field label="Price override">
                        <input type="number" min="0" value={draft.priceOverride} onChange={(e) => setScheduleDrafts((c) => ({ ...c, [schedule.id]: { ...draft, priceOverride: e.target.value } }))} placeholder="None" className={inputCls} />
                      </Field>
                      <Field label="Status">
                        <select value={draft.status} onChange={(e) => setScheduleDrafts((c) => ({ ...c, [schedule.id]: { ...draft, status: e.target.value as ScheduleDraft['status'] } }))} className={inputCls}>
                          <option value="OPEN">Open</option>
                          <option value="FULL">Full</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </Field>
                      <div className="flex flex-col justify-end gap-2">
                        <div className="flex items-center justify-between">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${statusColor[draft.status] ?? 'bg-sand-100 text-ink-500'}`}>
                            {draft.status}
                          </span>
                          <span className="text-[10px] text-ink-400">{(schedule._count?.bookings ?? 0)} bkgs</span>
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" size="sm" variant="secondary" className="flex-1" onClick={() => void saveExistingSchedule(schedule.id)}>Save</Button>
                          <Button type="button" size="sm" variant="danger" onClick={() => void deleteSchedule(schedule.id)}><Trash className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-ink-900/8 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setScheduleModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Images Modal ── */}
      {imageModalOpen && selectedTrip && (
        <Modal title={`Images — ${selectedTrip.title}`} onClose={() => setImageModalOpen(false)} wide>
          <div className="space-y-5">
            {/* Add new */}
            <div className="rounded-xl border border-ink-900/6 bg-sand-50 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-ink-400">Add image</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2 lg:col-span-2">
                  <Field label="Image URL">
                    <input value={newImage.url} onChange={(e) => setNewImage((c) => ({ ...c, url: e.target.value }))} className={inputCls} placeholder="https://..." />
                  </Field>
                </div>
                <Field label="Alt text">
                  <input value={newImage.altText} onChange={(e) => setNewImage((c) => ({ ...c, altText: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Sort order">
                  <input type="number" min="0" value={newImage.sortOrder} onChange={(e) => setNewImage((c) => ({ ...c, sortOrder: e.target.value }))} className={inputCls} />
                </Field>
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
                  <input type="checkbox" checked={newImage.isPrimary} onChange={(e) => setNewImage((c) => ({ ...c, isPrimary: e.target.checked }))} className="h-4 w-4 accent-forest-500 rounded" />
                  Set as primary image
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-sea-500/40 px-4 py-2 text-sm font-medium text-sea-600 hover:bg-sea-500/5 transition">
                  <CloudArrowUp className="h-4 w-4" />
                  {uploadingImages ? 'Uploading…' : 'Upload files'}
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.length) void uploadTripImages(e.target.files); e.target.value = ''; }} />
                </label>
                <Button type="button" variant="accent" size="sm" className="w-full sm:ml-auto sm:w-auto" isLoading={savingImage} leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => void addImageByUrl()}>
                  Add image
                </Button>
              </div>
            </div>

            {/* Existing images */}
            <div className="space-y-3">
              {selectedTrip.images.length === 0 ? (
                <div className="rounded-xl border border-dashed border-ink-900/10 py-8 text-center text-sm text-ink-400">
                  No images yet.
                </div>
              ) : selectedTrip.images.map((image) => {
                const draft = imageDrafts[image.id];
                if (!draft) return null;
                return (
                  <div key={image.id} className="rounded-xl border border-ink-900/8 bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-sand-100">
                        <img src={draft.url} alt={draft.altText || selectedTrip.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="sm:col-span-2 lg:col-span-2">
                          <Field label="URL">
                            <input value={draft.url} onChange={(e) => setImageDrafts((c) => ({ ...c, [image.id]: { ...draft, url: e.target.value } }))} className={inputCls} />
                          </Field>
                        </div>
                        <Field label="Alt text">
                          <input value={draft.altText} onChange={(e) => setImageDrafts((c) => ({ ...c, [image.id]: { ...draft, altText: e.target.value } }))} className={inputCls} />
                        </Field>
                        <Field label="Sort order">
                          <input type="number" min="0" value={draft.sortOrder} onChange={(e) => setImageDrafts((c) => ({ ...c, [image.id]: { ...draft, sortOrder: e.target.value } }))} className={inputCls} />
                        </Field>
                        <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center gap-4">
                          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
                            <input type="checkbox" checked={draft.isPrimary} onChange={(e) => setImageDrafts((c) => ({ ...c, [image.id]: { ...draft, isPrimary: e.target.checked } }))} className="h-4 w-4 accent-forest-500 rounded" />
                            Primary image
                          </label>
                          {draft.isPrimary && <span className="rounded-full bg-gold-500/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-600">Primary</span>}
                          <div className="ml-0 flex w-full gap-2 sm:ml-auto sm:w-auto">
                            <Button type="button" size="sm" variant="secondary" className="flex-1 sm:flex-none" leftIcon={<ImageSquare className="h-3.5 w-3.5" />} onClick={() => void saveExistingImage(image.id)}>Save</Button>
                            <Button type="button" size="sm" variant="danger" className="flex-1 sm:flex-none" leftIcon={<Trash className="h-3.5 w-3.5" />} onClick={() => void deleteImage(image.id)}>Delete</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-ink-900/8 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setImageModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(trekToDelete)}
        title={trekToDelete ? `Delete ${trekToDelete.title}?` : 'Delete trek?'}
        description={
          trekToDelete ? (
            <>
              <span className="font-semibold text-ink-900">{trekToDelete.title}</span> will be removed from the trek
              directory if deletion is allowed. Schedules and images tied to it will be removed as well. This action
              cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete trek"
        cancelLabel="Keep trek"
        confirmLoading={deletingTrek}
        icon={<Trash className="h-7 w-7" weight="bold" />}
        onClose={() => {
          if (deletingTrek) return;
          setTrekToDelete(null);
        }}
        onConfirm={() => void deleteTrek()}
      />
    </section>
  );
}
