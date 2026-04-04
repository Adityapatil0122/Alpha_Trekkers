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
                      INR {(trip.discountPrice ?? trip.basePrice).toLocaleString('en-IN')} · {trip.region}
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
        </div>
      </div>
    </div>
  );
}
