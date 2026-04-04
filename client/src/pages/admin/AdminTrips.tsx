import { useEffect, useState } from 'react';
import {
  CalendarDots,
  CloudArrowUp,
  FloppyDisk,
  ImageSquare,
  Trash,
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
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

const emptyForm: TripFormState = {
  title: '',
  shortDescription: '',
  description: '',
  difficulty: 'MODERATE',
  category: 'WEEKEND',
  region: '',
  fortName: '',
  startLocation: '',
  endLocation: '',
  meetingPoint: '',
  meetingTime: '',
  durationHours: '',
  distanceKm: '',
  elevationM: '',
  maxAltitudeM: '',
  basePrice: '',
  discountPrice: '',
  maxGroupSize: '',
  minAge: '',
  highlights: '',
  inclusions: '',
  exclusions: '',
  thingsToCarry: '',
  isActive: true,
  isFeatured: false,
};

function linesToText(lines: string[] | undefined) {
  return (lines ?? []).join('\n');
}

function textToLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toIsoString(value: string) {
  return new Date(value).toISOString();
}

function getErrorMessage(error: unknown) {
  const maybeAxiosError = error as {
    response?: { data?: { message?: string; errors?: Array<{ message?: string }> } };
  };

  return (
    maybeAxiosError.response?.data?.errors?.[0]?.message ??
    maybeAxiosError.response?.data?.message ??
    'Request failed'
  );
}

function normalizeTrip(trip: AdminTripDetail): TripFormState {
  return {
    title: trip.title,
    shortDescription: trip.shortDescription,
    description: trip.description,
    difficulty: trip.difficulty,
    category: trip.category,
    region: trip.region,
    fortName: trip.fortName ?? '',
    startLocation: trip.startLocation,
    endLocation: trip.endLocation,
    meetingPoint: trip.meetingPoint,
    meetingTime: trip.meetingTime,
    durationHours: String(trip.durationHours),
    distanceKm: String(trip.distanceKm),
    elevationM: String(trip.elevationM),
    maxAltitudeM: String(trip.maxAltitudeM),
    basePrice: String(trip.basePrice),
    discountPrice: trip.discountPrice ? String(trip.discountPrice) : '',
    maxGroupSize: String(trip.maxGroupSize),
    minAge: String(trip.minAge),
    highlights: linesToText(trip.highlights),
    inclusions: linesToText(trip.inclusions),
    exclusions: linesToText(trip.exclusions),
    thingsToCarry: linesToText(trip.thingsToCarry),
    isActive: trip.isActive,
    isFeatured: trip.isFeatured,
  };
}

export default function AdminTrips() {
  const [tripList, setTripList] = useState<AdminTripSummary[]>([]);
  const [tripSearch, setTripSearch] = useState('');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<AdminTripDetail | null>(null);
  const [tripForm, setTripForm] = useState<TripFormState>(emptyForm);
  const [scheduleDrafts, setScheduleDrafts] = useState<Record<string, ScheduleDraft>>({});
  const [imageDrafts, setImageDrafts] = useState<Record<string, ImageDraft>>({});
  const [newSchedule, setNewSchedule] = useState<ScheduleDraft>({
    date: '',
    availableSpots: '20',
    priceOverride: '',
    status: 'OPEN',
  });
  const [newImage, setNewImage] = useState<ImageDraft>({
    url: '',
    altText: '',
    sortOrder: '0',
    isPrimary: false,
  });
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const loadTrips = async (preferredTripId?: string | null) => {
    setListLoading(true);

    try {
      const response = await api.get<PaginatedResponse<{ trips: AdminTripSummary[] }>>(
        '/admin/trips',
        { params: { search: tripSearch || undefined, limit: 50 } },
      );

      const trips = response.data.data.trips;
      setTripList(trips);

      if (preferredTripId && trips.some((trip) => trip.id === preferredTripId)) {
        setSelectedTripId(preferredTripId);
      } else if (!selectedTripId && trips[0]) {
        setSelectedTripId(trips[0].id);
      } else if (selectedTripId && !trips.some((trip) => trip.id === selectedTripId)) {
        setSelectedTripId(trips[0]?.id ?? null);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      setTripList([]);
    } finally {
      setListLoading(false);
    }
  };

  const loadTripDetail = async (tripId: string) => {
    setDetailLoading(true);

    try {
      const response = await api.get<ApiResponse<{ trip: AdminTripDetail }>>(`/admin/trips/${tripId}`);
      const trip = response.data.data.trip;
      setSelectedTrip(trip);
      setTripForm(normalizeTrip(trip));
      setScheduleDrafts(
        Object.fromEntries(
          trip.schedules.map((schedule) => [
            schedule.id,
            {
              date: toDateTimeLocal(schedule.date),
              availableSpots: String(schedule.availableSpots),
              priceOverride: schedule.priceOverride ? String(schedule.priceOverride) : '',
              status: schedule.status as ScheduleDraft['status'],
            },
          ]),
        ),
      );
      setImageDrafts(
        Object.fromEntries(
          trip.images.map((image) => [
            image.id,
            {
              url: image.url,
              altText: image.altText ?? '',
              sortOrder: String(image.sortOrder),
              isPrimary: image.isPrimary,
            },
          ]),
        ),
      );
      setNewImage((current) => ({ ...current, sortOrder: String(trip.images.length) }));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setSelectedTrip(null);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    void loadTrips(selectedTripId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripSearch]);

  useEffect(() => {
    if (selectedTripId) {
      void loadTripDetail(selectedTripId);
    }
  }, [selectedTripId]);

  const updateForm = (field: keyof TripFormState, value: string | boolean) => {
    setTripForm((current) => ({ ...current, [field]: value }));
  };

  const saveTrip = async () => {
    if (!selectedTripId) return;
    setSavingTrip(true);

    try {
      await api.put(`/trips/${selectedTripId}`, {
        title: tripForm.title.trim(),
        shortDescription: tripForm.shortDescription.trim(),
        description: tripForm.description.trim(),
        difficulty: tripForm.difficulty,
        category: tripForm.category,
        region: tripForm.region.trim(),
        fortName: tripForm.fortName.trim() || undefined,
        startLocation: tripForm.startLocation.trim(),
        endLocation: tripForm.endLocation.trim(),
        meetingPoint: tripForm.meetingPoint.trim(),
        meetingTime: tripForm.meetingTime.trim(),
        durationHours: Number(tripForm.durationHours),
        distanceKm: Number(tripForm.distanceKm),
        elevationM: Number(tripForm.elevationM),
        maxAltitudeM: Number(tripForm.maxAltitudeM),
        basePrice: Number(tripForm.basePrice),
        discountPrice: tripForm.discountPrice.trim()
          ? Number(tripForm.discountPrice)
          : undefined,
        maxGroupSize: Number(tripForm.maxGroupSize),
        minAge: Number(tripForm.minAge),
        highlights: textToLines(tripForm.highlights),
        inclusions: textToLines(tripForm.inclusions),
        exclusions: textToLines(tripForm.exclusions),
        thingsToCarry: textToLines(tripForm.thingsToCarry),
        isActive: tripForm.isActive,
        isFeatured: tripForm.isFeatured,
      });

      toast.success('Trip updated');
      await loadTrips(selectedTripId);
      await loadTripDetail(selectedTripId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingTrip(false);
    }
  };

  const addSchedule = async () => {
    if (!selectedTripId) return;
    if (!newSchedule.date) {
      toast.error('Select a departure date first');
      return;
    }
    setSavingSchedule(true);

    try {
      await api.post(`/admin/trips/${selectedTripId}/schedules`, {
        date: toIsoString(newSchedule.date),
        availableSpots: Number(newSchedule.availableSpots),
        priceOverride: newSchedule.priceOverride.trim() ? Number(newSchedule.priceOverride) : null,
        status: newSchedule.status,
      });

      toast.success('Departure added');
      setNewSchedule({ date: '', availableSpots: '20', priceOverride: '', status: 'OPEN' });
      await loadTrips(selectedTripId);
      await loadTripDetail(selectedTripId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingSchedule(false);
    }
  };

  const saveExistingSchedule = async (scheduleId: string) => {
    const draft = scheduleDrafts[scheduleId];
    if (!draft) return;
    if (!draft.date) {
      toast.error('Select a valid departure date');
      return;
    }

    try {
      await api.put(`/admin/trip-schedules/${scheduleId}`, {
        date: toIsoString(draft.date),
        availableSpots: Number(draft.availableSpots),
        priceOverride: draft.priceOverride.trim() ? Number(draft.priceOverride) : null,
        status: draft.status,
      });

      toast.success('Schedule updated');
      if (selectedTripId) {
        await loadTrips(selectedTripId);
        await loadTripDetail(selectedTripId);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      await api.delete(`/admin/trip-schedules/${scheduleId}`);
      toast.success('Schedule deleted');
      if (selectedTripId) {
        await loadTrips(selectedTripId);
        await loadTripDetail(selectedTripId);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const addImageByUrl = async () => {
    if (!selectedTripId) return;
    setSavingImage(true);

    try {
      await api.post(`/admin/trips/${selectedTripId}/images/url`, {
        url: newImage.url.trim(),
        altText: newImage.altText.trim() || null,
        sortOrder: Number(newImage.sortOrder),
        isPrimary: newImage.isPrimary,
      });

      toast.success('Trip image added');
      setNewImage({ url: '', altText: '', sortOrder: '0', isPrimary: false });
      await loadTrips(selectedTripId);
      await loadTripDetail(selectedTripId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingImage(false);
    }
  };

  const saveExistingImage = async (imageId: string) => {
    const draft = imageDrafts[imageId];
    if (!draft) return;

    try {
      await api.put(`/admin/trip-images/${imageId}`, {
        url: draft.url.trim(),
        altText: draft.altText.trim() || null,
        sortOrder: Number(draft.sortOrder),
        isPrimary: draft.isPrimary,
      });

      toast.success('Image updated');
      if (selectedTripId) {
        await loadTrips(selectedTripId);
        await loadTripDetail(selectedTripId);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      await api.delete(`/trips/images/${imageId}`);
      toast.success('Image deleted');
      if (selectedTripId) {
        await loadTrips(selectedTripId);
        await loadTripDetail(selectedTripId);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const uploadTripImages = async (files: FileList) => {
    if (!selectedTripId || files.length === 0) return;
    setUploadingImages(true);

    try {
      const payload = new FormData();
      Array.from(files).forEach((file) => payload.append('images', file));
      await api.post(`/trips/${selectedTripId}/images`, payload);

      toast.success('Images uploaded');
      await loadTrips(selectedTripId);
      await loadTripDetail(selectedTripId);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-4xl font-bold text-ink-900">Trip Administration</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-ink-700/72">
          Separate admin page for editing trip content, changing prices, scheduling departures, and
          managing trip images.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="travel-panel rounded-[2rem] p-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink-700">Search trips</span>
              <input
                value={tripSearch}
                onChange={(event) => setTripSearch(event.target.value)}
                className="travel-input"
                placeholder="Title, fort, or region"
              />
            </label>
          </div>

          <div className="travel-panel rounded-[2rem] p-3">
            {listLoading ? (
              <LoadingSpinner text="Loading trips..." />
            ) : (
              <div className="space-y-3">
                {tripList.map((trip) => (
                  <button
                    key={trip.id}
                    type="button"
                    onClick={() => setSelectedTripId(trip.id)}
                    className={`w-full rounded-[1.5rem] p-4 text-left transition ${
                      trip.id === selectedTripId
                        ? 'bg-sea-500 text-white'
                        : 'bg-white hover:bg-sand-100'
                    }`}
                  >
                    <p className={`text-xs uppercase tracking-[0.18em] ${trip.id === selectedTripId ? 'text-white/74' : 'text-sea-600'}`}>
                      {trip.category.replace('_', ' ')}
                    </p>
                    <h3 className="mt-2 font-heading text-3xl">{trip.title}</h3>
                    <p className={`mt-3 text-sm ${trip.id === selectedTripId ? 'text-white/78' : 'text-ink-600'}`}>
                      INR {(trip.discountPrice ?? trip.basePrice).toLocaleString('en-IN')} | {trip.region}
                    </p>
                  </button>
                ))}
                {tripList.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-ink-600">No trips found.</div>
                ) : null}
              </div>
            )}
          </div>
        </aside>

        <div className="space-y-6">
          {detailLoading ? <LoadingSpinner text="Loading trip detail..." /> : null}
          {!selectedTrip && !detailLoading ? (
            <div className="travel-panel rounded-[2rem] p-8 text-sm text-ink-600">
              Select a trip from the left to begin editing.
            </div>
          ) : null}

          {selectedTrip ? (
            <>
              <section className="travel-panel rounded-[2rem] p-6">
                <div className="flex flex-col gap-3 border-b border-ink-900/8 pb-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea-600">
                      Trip details
                    </p>
                    <h3 className="mt-2 font-heading text-4xl text-ink-900">{selectedTrip.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-ink-600">
                    <span className="rounded-full bg-sand-100 px-4 py-2">
                      {selectedTrip._count.bookings.toLocaleString('en-IN')} bookings
                    </span>
                    <span className="rounded-full bg-sand-100 px-4 py-2">
                      {selectedTrip.images.length} images
                    </span>
                    <span className="rounded-full bg-sand-100 px-4 py-2">
                      {selectedTrip.schedules.length} schedules
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="block xl:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Title</span>
                  <input
                    value={tripForm.title}
                    onChange={(event) => updateForm('title', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Category</span>
                  <select
                    value={tripForm.category}
                    onChange={(event) =>
                      updateForm('category', event.target.value as TripCategory)
                    }
                    className="travel-input"
                  >
                    {Object.entries(CATEGORIES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Difficulty</span>
                  <select
                    value={tripForm.difficulty}
                    onChange={(event) =>
                      updateForm('difficulty', event.target.value as Difficulty)
                    }
                    className="travel-input"
                  >
                    {Object.entries(DIFFICULTIES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block md:col-span-2 xl:col-span-4">
                  <span className="mb-2 block text-sm font-medium text-ink-700">
                    Short description
                  </span>
                  <textarea
                    rows={3}
                    value={tripForm.shortDescription}
                    onChange={(event) => updateForm('shortDescription', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block md:col-span-2 xl:col-span-4">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Description</span>
                  <textarea
                    rows={7}
                    value={tripForm.description}
                    onChange={(event) => updateForm('description', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Region</span>
                  <input
                    value={tripForm.region}
                    onChange={(event) => updateForm('region', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Fort name</span>
                  <input
                    value={tripForm.fortName}
                    onChange={(event) => updateForm('fortName', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Start location</span>
                  <input
                    value={tripForm.startLocation}
                    onChange={(event) => updateForm('startLocation', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">End location</span>
                  <input
                    value={tripForm.endLocation}
                    onChange={(event) => updateForm('endLocation', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Meeting point</span>
                  <input
                    value={tripForm.meetingPoint}
                    onChange={(event) => updateForm('meetingPoint', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Meeting time</span>
                  <input
                    value={tripForm.meetingTime}
                    onChange={(event) => updateForm('meetingTime', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Duration (hrs)</span>
                  <input
                    type="number"
                    min="1"
                    value={tripForm.durationHours}
                    onChange={(event) => updateForm('durationHours', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Distance (km)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={tripForm.distanceKm}
                    onChange={(event) => updateForm('distanceKm', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Elevation (m)</span>
                  <input
                    type="number"
                    min="0"
                    value={tripForm.elevationM}
                    onChange={(event) => updateForm('elevationM', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Max altitude (m)</span>
                  <input
                    type="number"
                    min="0"
                    value={tripForm.maxAltitudeM}
                    onChange={(event) => updateForm('maxAltitudeM', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Base price</span>
                  <input
                    type="number"
                    min="0"
                    value={tripForm.basePrice}
                    onChange={(event) => updateForm('basePrice', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Discount price</span>
                  <input
                    type="number"
                    min="0"
                    value={tripForm.discountPrice}
                    onChange={(event) => updateForm('discountPrice', event.target.value)}
                    className="travel-input"
                    placeholder="Optional"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Max group size</span>
                  <input
                    type="number"
                    min="1"
                    value={tripForm.maxGroupSize}
                    onChange={(event) => updateForm('maxGroupSize', event.target.value)}
                    className="travel-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Minimum age</span>
                  <input
                    type="number"
                    min="5"
                    value={tripForm.minAge}
                    onChange={(event) => updateForm('minAge', event.target.value)}
                    className="travel-input"
                  />
                </label>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Highlights</span>
                  <textarea rows={6} value={tripForm.highlights} onChange={(event) => updateForm('highlights', event.target.value)} className="travel-input" placeholder="One item per line" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Inclusions</span>
                  <textarea rows={6} value={tripForm.inclusions} onChange={(event) => updateForm('inclusions', event.target.value)} className="travel-input" placeholder="One item per line" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Exclusions</span>
                  <textarea rows={6} value={tripForm.exclusions} onChange={(event) => updateForm('exclusions', event.target.value)} className="travel-input" placeholder="One item per line" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink-700">Things to carry</span>
                  <textarea rows={6} value={tripForm.thingsToCarry} onChange={(event) => updateForm('thingsToCarry', event.target.value)} className="travel-input" placeholder="One item per line" />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-6 border-t border-ink-900/8 pt-5">
                <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
                  <input type="checkbox" checked={tripForm.isActive} onChange={(event) => updateForm('isActive', event.target.checked)} className="h-4 w-4 rounded border-ink-900/18" />
                  Visible on the public site
                </label>
                <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
                  <input type="checkbox" checked={tripForm.isFeatured} onChange={(event) => updateForm('isFeatured', event.target.checked)} className="h-4 w-4 rounded border-ink-900/18" />
                  Mark as featured
                </label>
              </div>

                <div className="mt-5">
                  <Button type="button" variant="primary" isLoading={savingTrip} leftIcon={<FloppyDisk className="h-4 w-4" />} onClick={() => void saveTrip()}>
                    Save trip changes
                  </Button>
                </div>
              </section>

              <section className="travel-panel rounded-[2rem] p-6">
                <div className="border-b border-ink-900/8 pb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea-600">
                    Scheduled departures
                  </p>
                  <h3 className="mt-2 font-heading text-4xl text-ink-900">
                    Add or update trip dates
                  </h3>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink-700">Departure</span>
                    <input type="datetime-local" value={newSchedule.date} onChange={(event) => setNewSchedule((current) => ({ ...current, date: event.target.value }))} className="travel-input" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink-700">Spots</span>
                    <input type="number" min="1" value={newSchedule.availableSpots} onChange={(event) => setNewSchedule((current) => ({ ...current, availableSpots: event.target.value }))} className="travel-input" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink-700">Override price</span>
                    <input type="number" min="0" value={newSchedule.priceOverride} onChange={(event) => setNewSchedule((current) => ({ ...current, priceOverride: event.target.value }))} className="travel-input" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink-700">Status</span>
                    <select value={newSchedule.status} onChange={(event) => setNewSchedule((current) => ({ ...current, status: event.target.value as ScheduleDraft['status'] }))} className="travel-input">
                      <option value="OPEN">OPEN</option>
                      <option value="FULL">FULL</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </label>
                  <div className="flex items-end">
                    <Button type="button" variant="accent" fullWidth isLoading={savingSchedule} leftIcon={<CalendarDots className="h-4 w-4" />} onClick={() => void addSchedule()}>
                      Add departure
                    </Button>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {selectedTrip.schedules.map((schedule) => {
                    const draft = scheduleDrafts[schedule.id];
                    if (!draft) return null;

                    return (
                      <div key={schedule.id} className="travel-panel rounded-[1.6rem] p-5">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-ink-700">Departure</span>
                            <input type="datetime-local" value={draft.date} onChange={(event) => setScheduleDrafts((current) => ({ ...current, [schedule.id]: { ...draft, date: event.target.value } }))} className="travel-input" />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-ink-700">Spots</span>
                            <input type="number" min="1" value={draft.availableSpots} onChange={(event) => setScheduleDrafts((current) => ({ ...current, [schedule.id]: { ...draft, availableSpots: event.target.value } }))} className="travel-input" />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-ink-700">Override price</span>
                            <input type="number" min="0" value={draft.priceOverride} onChange={(event) => setScheduleDrafts((current) => ({ ...current, [schedule.id]: { ...draft, priceOverride: event.target.value } }))} className="travel-input" />
                          </label>
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium text-ink-700">Status</span>
                            <select value={draft.status} onChange={(event) => setScheduleDrafts((current) => ({ ...current, [schedule.id]: { ...draft, status: event.target.value as ScheduleDraft['status'] } }))} className="travel-input">
                              <option value="OPEN">OPEN</option>
                              <option value="FULL">FULL</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </label>
                          <div className="flex flex-col justify-end gap-3">
                            <div className="text-xs uppercase tracking-[0.16em] text-ink-500">
                              Bookings: {(schedule._count?.bookings ?? 0).toLocaleString('en-IN')}
                            </div>
                            <div className="flex gap-3">
                              <Button type="button" size="sm" onClick={() => void saveExistingSchedule(schedule.id)}>Save</Button>
                              <Button type="button" size="sm" variant="danger" onClick={() => void deleteSchedule(schedule.id)}>Delete</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="travel-panel rounded-[2rem] p-6">
                <div className="border-b border-ink-900/8 pb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sea-600">
                    Trip images
                  </p>
                  <h3 className="mt-2 font-heading text-4xl text-ink-900">
                    Change the trip gallery
                  </h3>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="travel-panel rounded-[1.7rem] p-5">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_12rem_10rem_auto]">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink-700">Image URL</span>
                        <input value={newImage.url} onChange={(event) => setNewImage((current) => ({ ...current, url: event.target.value }))} className="travel-input" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink-700">Alt text</span>
                        <input value={newImage.altText} onChange={(event) => setNewImage((current) => ({ ...current, altText: event.target.value }))} className="travel-input" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink-700">Sort order</span>
                        <input type="number" min="0" value={newImage.sortOrder} onChange={(event) => setNewImage((current) => ({ ...current, sortOrder: event.target.value }))} className="travel-input" />
                      </label>
                      <div className="flex items-end">
                        <Button type="button" variant="accent" isLoading={savingImage} onClick={() => void addImageByUrl()}>
                          Add image
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
                        <input type="checkbox" checked={newImage.isPrimary} onChange={(event) => setNewImage((current) => ({ ...current, isPrimary: event.target.checked }))} className="h-4 w-4 rounded border-ink-900/18" />
                        Set as primary image
                      </label>
                      <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-dashed border-sea-500/35 px-4 py-3 text-sm font-medium text-sea-600">
                        <CloudArrowUp className="h-5 w-5" />
                        {uploadingImages ? 'Uploading...' : 'Upload image files'}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            if (event.target.files?.length) {
                              void uploadTripImages(event.target.files);
                            }
                            event.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedTrip.images.map((image) => {
                      const draft = imageDrafts[image.id];
                      if (!draft) return null;

                      return (
                        <div key={image.id} className="travel-panel rounded-[1.6rem] p-5">
                          <div className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
                            <div className="overflow-hidden rounded-[1.2rem] bg-sand-100">
                              <img src={draft.url} alt={draft.altText || selectedTrip.title} className="h-44 w-full object-cover" />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="block md:col-span-2">
                                <span className="mb-2 block text-sm font-medium text-ink-700">Image URL</span>
                                <input value={draft.url} onChange={(event) => setImageDrafts((current) => ({ ...current, [image.id]: { ...draft, url: event.target.value } }))} className="travel-input" />
                              </label>
                              <label className="block">
                                <span className="mb-2 block text-sm font-medium text-ink-700">Alt text</span>
                                <input value={draft.altText} onChange={(event) => setImageDrafts((current) => ({ ...current, [image.id]: { ...draft, altText: event.target.value } }))} className="travel-input" />
                              </label>
                              <label className="block">
                                <span className="mb-2 block text-sm font-medium text-ink-700">Sort order</span>
                                <input type="number" min="0" value={draft.sortOrder} onChange={(event) => setImageDrafts((current) => ({ ...current, [image.id]: { ...draft, sortOrder: event.target.value } }))} className="travel-input" />
                              </label>
                              <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
                                <input type="checkbox" checked={draft.isPrimary} onChange={(event) => setImageDrafts((current) => ({ ...current, [image.id]: { ...draft, isPrimary: event.target.checked } }))} className="h-4 w-4 rounded border-ink-900/18" />
                                Primary image
                              </label>
                              <div className="md:col-span-2 flex gap-3">
                                <Button type="button" size="sm" leftIcon={<ImageSquare className="h-4 w-4" />} onClick={() => void saveExistingImage(image.id)}>
                                  Save image
                                </Button>
                                <Button type="button" size="sm" variant="danger" leftIcon={<Trash className="h-4 w-4" />} onClick={() => void deleteImage(image.id)}>
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
