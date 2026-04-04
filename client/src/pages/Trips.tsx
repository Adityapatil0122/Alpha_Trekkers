import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarBlank,
  FunnelSimple,
  MagnifyingGlass,
  MapPinLine,
  SlidersHorizontal,
  SortAscending,
  Star,
  UsersThree,
  X,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type {
  Difficulty,
  PaginatedResponse,
  Trip,
  TripCategory,
  TripFilters,
} from '@alpha-trekkers/shared';
import { CATEGORIES, DIFFICULTIES, REGIONS } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TripCard from '@/components/ui/TripCard';

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest Departures' },
  { value: 'price_asc', label: 'Price Low to High' },
  { value: 'price_desc', label: 'Price High to Low' },
];

function mapSortParams(sortBy: string): Pick<TripFilters, 'sortBy'> & {
  sortOrder?: 'asc' | 'desc';
} {
  switch (sortBy) {
    case 'price_asc':
      return { sortBy: 'basePrice', sortOrder: 'asc' };
    case 'price_desc':
      return { sortBy: 'basePrice', sortOrder: 'desc' };
    case 'rating':
    case 'popular':
      return { sortBy: 'avgRating', sortOrder: 'desc' };
    default:
      return { sortBy: 'createdAt', sortOrder: 'desc' };
  }
}

const tripRouteTabs = [
  { to: '/trips', label: 'All Trips' },
  { to: '/weekend-trips', label: 'Weekend Trips' },
  { to: '/weekday-trips', label: 'Weekday Trips' },
];

function getEarliestSchedule(trip: Trip) {
  return trip.schedules?.[0];
}

function formatScheduleDate(date: string, includeWeekday = true) {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: includeWeekday ? 'short' : undefined,
    day: 'numeric',
    month: 'short',
  });
}

function getDepartureLabel(date: string) {
  const now = new Date();
  const target = new Date(date);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) return 'Leaving today';
  if (diffDays === 1) return 'Leaving tomorrow';
  if (diffDays <= 4) return `Leaving in ${diffDays} days`;
  return 'Scheduled now';
}

function FilterPanel({
  search,
  setSearch,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  region,
  setRegion,
  clearFilters,
  routeCategory,
}: {
  search: string;
  setSearch: (value: string) => void;
  category: TripCategory | '';
  setCategory: (value: TripCategory | '') => void;
  difficulty: Difficulty | '';
  setDifficulty: (value: Difficulty | '') => void;
  region: string;
  setRegion: (value: string) => void;
  clearFilters: () => void;
  routeCategory?: TripCategory;
}) {
  return (
    <div className="travel-panel rounded-[2rem] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-500/10">
          <SlidersHorizontal className="h-5 w-5 text-forest-500" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-forest-500">Filter journeys</p>
          <h3 className="font-heading text-3xl text-ink-900">Find your route</h3>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink-700">Search</span>
          <div className="travel-input flex items-center gap-3">
            <MagnifyingGlass className="h-5 w-5 text-forest-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Fort, region, or vibe"
              className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
        </label>

        {!routeCategory ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink-700">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as TripCategory | '')}
              className="travel-input"
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <div>
          <span className="mb-3 block text-sm font-medium text-ink-700">Difficulty</span>
          <div className="grid gap-2">
            {Object.entries(DIFFICULTIES).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setDifficulty(difficulty === key ? '' : (key as Difficulty))}
                className={`rounded-2xl px-4 py-3 text-left text-sm ${
                  difficulty === key
                    ? 'bg-forest-500 text-white'
                    : 'bg-sand-100 text-ink-700 hover:bg-sand-200'
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink-700">Region</span>
          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="travel-input"
          >
            <option value="">All Regions</option>
            {REGIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6">
        <Button variant="secondary" fullWidth onClick={clearFilters}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}

export default function Trips() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const routeCategory: TripCategory | undefined =
    location.pathname === '/weekend-trips'
      ? 'WEEKEND'
      : location.pathname === '/weekday-trips'
        ? 'WEEKDAY'
        : (searchParams.get('category') as TripCategory) || undefined;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<TripCategory | ''>(routeCategory || '');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>((searchParams.get('difficulty') as Difficulty) || '');
  const [region, setRegion] = useState(searchParams.get('region') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popular');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const { sortBy: apiSortBy, sortOrder } = mapSortParams(sortBy);
      const params: TripFilters = { page, limit: 12, sortBy: apiSortBy };
      if (sortOrder) params.sortOrder = sortOrder;
      if (search) params.search = search;
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty;
      if (region) params.region = region;

      const response = await api.get<PaginatedResponse<{ trips: Trip[] }>>('/trips', { params });
      setTrips(response.data.data.trips);
      setPagination(response.data.pagination);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, search, category, difficulty, region]);

  useEffect(() => {
    void fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category && !routeCategory) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    if (region) params.region = region;
    if (sortBy !== 'popular') params.sortBy = sortBy;
    if (page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
  }, [search, category, difficulty, region, sortBy, page, routeCategory, setSearchParams]);

  useEffect(() => {
    if (routeCategory) setCategory(routeCategory);
  }, [routeCategory]);

  const clearFilters = () => {
    setSearch('');
    setCategory(routeCategory || '');
    setDifficulty('');
    setRegion('');
    setSortBy('popular');
    setPage(1);
  };

  const scheduledTrips = useMemo(
    () =>
      [...trips]
        .filter((trip) => Boolean(getEarliestSchedule(trip)))
        .sort((left, right) => {
          const leftSchedule = getEarliestSchedule(left);
          const rightSchedule = getEarliestSchedule(right);
          if (!leftSchedule || !rightSchedule) return 0;

          const byDate = new Date(leftSchedule.date).getTime() - new Date(rightSchedule.date).getTime();
          if (byDate !== 0) return byDate;

          return leftSchedule.availableSpots - rightSchedule.availableSpots;
        }),
    [trips],
  );

  const scheduledHighlights = scheduledTrips.slice(0, 3);
  const lastChanceTrip = scheduledTrips[0] ?? null;
  const lastChanceSchedule = lastChanceTrip ? getEarliestSchedule(lastChanceTrip) : undefined;

  const pageTitle =
    routeCategory === 'WEEKEND'
      ? 'Weekend Trips'
      : routeCategory === 'WEEKDAY'
        ? 'Weekday Trips'
        : 'Trips';

  const pageCopy =
    routeCategory === 'WEEKEND'
      ? 'Weekend departures with live schedules, faster booking, and high-conversion getaways.'
      : routeCategory === 'WEEKDAY'
        ? 'Midweek departures with lighter crowds, better pacing, and ready-to-book schedules.'
        : 'Browse scheduled fort departures, seasonal journeys, and last-chance trips that are ready to book now.';

  return (
    <>
      <section className="travel-dark relative overflow-hidden pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-28"
          style={{ backgroundImage: `url(${MAHARASHTRA_MONSOON_IMAGES.heroes.trips})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/88 via-ink-900/74 to-ink-900/32" />
        <div className="relative mx-auto max-w-7xl px-4 pb-[4.5rem] pt-20 sm:px-6 lg:px-8">
          <span className="section-label !bg-white/10 !text-sand-100 before:!bg-gold-400">
            Trip collection
          </span>
          <h1 className="mt-6 max-w-3xl font-heading text-5xl leading-[0.95] text-white sm:text-6xl">
            {pageTitle}
          </h1>
          <p className="playful-text text-2xl text-gold-400 mt-2">~ find your perfect monsoon trek ~</p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-sand-100/76">{pageCopy}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {tripRouteTabs.map((tab) => {
              const active = location.pathname === tab.to;

              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                    active
                      ? 'bg-white text-ink-900'
                      : 'border border-white/14 bg-white/8 text-sand-100 hover:bg-white/14'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {scheduledTrips.length > 0 ? (
          <div className="mb-10 grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
            <div className="travel-dark relative overflow-hidden rounded-[2.4rem] p-8 sm:p-10">
              {lastChanceTrip?.images[0]?.url ? (
                <img
                  src={lastChanceTrip.images[0].url}
                  alt={lastChanceTrip.images[0].altText || lastChanceTrip.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-28"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950/88 via-ink-900/78 to-ink-900/58" />
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-forest-500/16 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-gold-500/14 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
                  <Star className="h-4 w-4" weight="fill" />
                  Last Chance Trip
                </div>
                {lastChanceTrip && lastChanceSchedule ? (
                  <>
                    <p className="mt-6 text-sm uppercase tracking-[0.18em] text-sand-200/68">
                      {getDepartureLabel(lastChanceSchedule.date)}
                    </p>
                    <h2 className="mt-3 max-w-2xl font-heading text-5xl leading-tight text-white">
                      {lastChanceTrip.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-sand-100/74">
                      {lastChanceTrip.shortDescription}
                    </p>

                    <div className="mt-7 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.4rem] border border-white/12 bg-white/8 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-gold-400">Scheduled</p>
                        <p className="mt-2 text-base font-medium text-white">
                          {formatScheduleDate(lastChanceSchedule.date)}
                        </p>
                      </div>
                      <div className="rounded-[1.4rem] border border-white/12 bg-white/8 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-gold-400">Region</p>
                        <p className="mt-2 text-base font-medium text-white">{lastChanceTrip.region}</p>
                      </div>
                      <div className="rounded-[1.4rem] border border-white/12 bg-white/8 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-gold-400">Open Spots</p>
                        <p className="mt-2 text-base font-medium text-white">
                          {lastChanceSchedule.availableSpots} seats left
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-sand-200/58">Starting from</p>
                        <p className="font-heading text-4xl text-white">
                          INR {(lastChanceTrip.discountPrice ?? lastChanceTrip.basePrice).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <Link to={`/trips/${lastChanceTrip.slug}`}>
                        <Button
                          variant="accent"
                          size="lg"
                          rightIcon={<ArrowRight className="h-5 w-5" />}
                        >
                          Book this trip
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="travel-panel rounded-[2rem] p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-forest-500">Scheduled Trips</p>
                <h2 className="mt-3 font-heading text-4xl text-ink-900">Next departures open now</h2>
                <p className="mt-3 text-sm leading-7 text-ink-700/70">
                  These upcoming trips already have live schedules and are ready for immediate booking.
                </p>
              </div>

              {scheduledHighlights.map((trip) => {
                const nextSchedule = getEarliestSchedule(trip);
                if (!nextSchedule) return null;

                return (
                  <Link
                    key={trip.id}
                    to={`/trips/${trip.slug}`}
                    className="travel-panel group rounded-[1.8rem] p-5 transition hover:translate-y-[-4px]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-forest-500">
                          {getDepartureLabel(nextSchedule.date)}
                        </p>
                        <h3 className="mt-2 font-heading text-3xl text-ink-900">{trip.title}</h3>
                      </div>
                      <span className="rounded-full bg-gold-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">
                        {trip.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <span className="flex items-center gap-2 rounded-2xl bg-sand-100 px-3 py-3 text-sm text-ink-700">
                        <CalendarBlank className="h-4 w-4 text-forest-500" />
                        {formatScheduleDate(nextSchedule.date)}
                      </span>
                      <span className="flex items-center gap-2 rounded-2xl bg-sand-100 px-3 py-3 text-sm text-ink-700">
                        <MapPinLine className="h-4 w-4 text-forest-500" />
                        {trip.region}
                      </span>
                      <span className="flex items-center gap-2 rounded-2xl bg-sand-100 px-3 py-3 text-sm text-ink-700">
                        <UsersThree className="h-4 w-4 text-forest-500" />
                        {nextSchedule.availableSpots} open
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-ink-900/8 pt-4">
                      <div>
                        <p className="text-sm text-ink-600/58">Starts from</p>
                        <p className="font-heading text-3xl text-ink-900">
                          INR {(trip.discountPrice ?? trip.basePrice).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-forest-500 group-hover:text-forest-500">
                        View trip
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-forest-500">Collection snapshot</p>
            <h2 className="font-heading text-3xl text-ink-900">
              {pagination.total} journeys available
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-full bg-sand-100 px-4 py-3 text-sm font-medium text-ink-800 lg:hidden"
            >
              <span className="inline-flex items-center gap-2">
                <FunnelSimple className="h-4 w-4" />
                Filters
              </span>
            </button>
            <div className="travel-panel flex items-center gap-3 rounded-full px-4 py-3">
              <SortAscending className="h-4 w-4 text-forest-500" />
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-sm text-ink-800 focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-8">
          <aside className="hidden w-80 shrink-0 lg:block">
            <FilterPanel
              search={search}
              setSearch={(value) => {
                setSearch(value);
                setPage(1);
              }}
              category={category}
              setCategory={(value) => {
                setCategory(value);
                setPage(1);
              }}
              difficulty={difficulty}
              setDifficulty={(value) => {
                setDifficulty(value);
                setPage(1);
              }}
              region={region}
              setRegion={(value) => {
                setRegion(value);
                setPage(1);
              }}
              clearFilters={clearFilters}
              routeCategory={routeCategory}
            />
          </aside>

          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-ink-950/45 backdrop-blur-sm lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  className="fixed left-0 top-0 z-50 h-full w-80 max-w-[88vw] overflow-y-auto bg-sand-50 p-5 lg:hidden"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-heading text-3xl text-ink-900">Filters</h3>
                    <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-full bg-sand-100 p-2">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <FilterPanel
                    search={search}
                    setSearch={(value) => {
                      setSearch(value);
                      setPage(1);
                    }}
                    category={category}
                    setCategory={(value) => {
                      setCategory(value);
                      setPage(1);
                    }}
                    difficulty={difficulty}
                    setDifficulty={(value) => {
                      setDifficulty(value);
                      setPage(1);
                    }}
                    region={region}
                    setRegion={(value) => {
                      setRegion(value);
                      setPage(1);
                    }}
                    clearFilters={clearFilters}
                    routeCategory={routeCategory}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <main className="min-w-0 flex-1">
            {loading ? (
              <LoadingSpinner text="Loading tours..." />
            ) : trips.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {trips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
                {pagination.pages > 1 ? (
                  <div className="mt-10 flex flex-wrap justify-center gap-2">
                    {Array.from({ length: pagination.pages }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`h-11 w-11 rounded-full text-sm font-medium ${
                          pageNumber === page
                            ? 'bg-forest-500 text-white'
                            : 'bg-white text-ink-800 shadow-[0_10px_30px_rgba(8,17,28,0.06)]'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="travel-panel rounded-[2rem] px-8 py-16 text-center">
                <h3 className="font-heading text-4xl text-ink-900">No matching departures</h3>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink-700/72">
                  Try broadening the filters or reset the journey criteria to browse the full collection.
                </p>
                <div className="mt-6">
                  <Button variant="secondary" onClick={clearFilters}>
                    Reset and browse all
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
