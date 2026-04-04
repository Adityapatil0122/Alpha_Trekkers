import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FunnelSimple,
  SortAscending,
  X,
  MagnifyingGlass,
  Mountains,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';
import type {
  PaginatedResponse,
  Trip,
  TripFilters,
  TripCategory,
  Difficulty,
} from '@alpha-trekkers/shared';
import { DIFFICULTIES, CATEGORIES, REGIONS } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import TripCard from '@/components/ui/TripCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
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
    case 'newest':
    default:
      return { sortBy: 'createdAt', sortOrder: 'desc' };
  }
}

export default function Trips() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Derive category from route
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

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<TripCategory | ''>(routeCategory || '');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>(
    (searchParams.get('difficulty') as Difficulty) || '',
  );
  const [region, setRegion] = useState(searchParams.get('region') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popular');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const { sortBy: apiSortBy, sortOrder } = mapSortParams(sortBy);
      const params: TripFilters = {
        page,
        limit: 12,
        sortBy: apiSortBy,
      };
      if (sortOrder) params.sortOrder = sortOrder;
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty;
      if (region) params.region = region;
      if (search) params.search = search;

      const { data } = await api.get<PaginatedResponse<{ trips: Trip[] }>>('/trips', { params });
      setTrips(data.data.trips);
      setPagination(data.pagination);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, category, difficulty, region, search]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Sync URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category && !routeCategory) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    if (region) params.region = region;
    if (sortBy !== 'popular') params.sortBy = sortBy;
    if (page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
  }, [search, category, difficulty, region, sortBy, page, setSearchParams, routeCategory]);

  // Update category when route changes
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

  const hasActiveFilters = search || (!routeCategory && category) || difficulty || region;

  const pageTitle =
    routeCategory === 'WEEKEND'
      ? 'Weekend Treks'
      : routeCategory === 'WEEKDAY'
        ? 'Weekday Treks'
        : 'All Treks';

  return (
    <>
      {/* Hero Banner */}
      <section className="relative flex h-64 items-end overflow-hidden bg-gradient-to-r from-forest-900 to-forest-800 sm:h-72">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            {pageTitle}
          </h1>
          <p className="mt-2 text-forest-300/70">
            Discover your next adventure across Maharashtra&apos;s majestic forts and trails
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* ── Sidebar Filters (Desktop) ── */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <FilterPanel
              search={search}
              setSearch={(v) => { setSearch(v); setPage(1); }}
              category={category}
              setCategory={(v) => { setCategory(v); setPage(1); }}
              difficulty={difficulty}
              setDifficulty={(v) => { setDifficulty(v); setPage(1); }}
              region={region}
              setRegion={(v) => { setRegion(v); setPage(1); }}
              clearFilters={clearFilters}
              hasActiveFilters={!!hasActiveFilters}
              routeCategory={routeCategory}
            />
          </aside>

          {/* ── Mobile Sidebar ── */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                  className="fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto bg-white p-6 shadow-xl lg:hidden"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-heading text-lg font-semibold text-forest-900">Filters</h3>
                    <button onClick={() => setSidebarOpen(false)}>
                      <X className="h-5 w-5 text-forest-600" />
                    </button>
                  </div>
                  <FilterPanel
                    search={search}
                    setSearch={(v) => { setSearch(v); setPage(1); }}
                    category={category}
                    setCategory={(v) => { setCategory(v); setPage(1); }}
                    difficulty={difficulty}
                    setDifficulty={(v) => { setDifficulty(v); setPage(1); }}
                    region={region}
                    setRegion={(v) => { setRegion(v); setPage(1); }}
                    clearFilters={clearFilters}
                    hasActiveFilters={!!hasActiveFilters}
                    routeCategory={routeCategory}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* ── Main Content ── */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-forest-200 px-4 py-2.5 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-50 lg:hidden"
                >
                  <FunnelSimple className="h-4 w-4" />
                  Filters
                </button>
                <p className="text-sm text-forest-500">
                  {pagination.total} trek{pagination.total !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SortAscending className="h-4 w-4 text-forest-400" />
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm text-forest-700 focus:border-forest-500 focus:outline-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trip Grid */}
            {loading ? (
              <LoadingSpinner text="Loading treks..." />
            ) : trips.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {trips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="rounded-lg border border-forest-200 p-2 text-forest-600 transition-colors hover:bg-forest-50 disabled:opacity-40"
                    >
                      <CaretLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-forest-500 text-white'
                            : 'border border-forest-200 text-forest-600 hover:bg-forest-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={page >= pagination.pages}
                      onClick={() => setPage(page + 1)}
                      className="rounded-lg border border-forest-200 p-2 text-forest-600 transition-colors hover:bg-forest-50 disabled:opacity-40"
                    >
                      <CaretRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center py-20 text-center">
                <Mountains className="mb-4 h-16 w-16 text-forest-300" weight="duotone" />
                <h3 className="mb-2 font-heading text-xl font-semibold text-forest-800">
                  No treks found
                </h3>
                <p className="mb-6 max-w-sm text-sm text-forest-500">
                  Try adjusting your filters or search terms to discover more adventures.
                </p>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────── Filter Panel Component ─────────────── */
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
  hasActiveFilters,
  routeCategory,
}: {
  search: string;
  setSearch: (v: string) => void;
  category: TripCategory | '';
  setCategory: (v: TripCategory | '') => void;
  difficulty: Difficulty | '';
  setDifficulty: (v: Difficulty | '') => void;
  region: string;
  setRegion: (v: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  routeCategory?: TripCategory;
}) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-forest-800">Search</label>
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search treks..."
            className="w-full rounded-xl border border-forest-200 bg-white py-2.5 pl-10 pr-4 text-sm text-forest-800 placeholder:text-forest-400 focus:border-forest-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category */}
      {!routeCategory && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-forest-800">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TripCategory | '')}
            className="w-full rounded-xl border border-forest-200 bg-white px-4 py-2.5 text-sm text-forest-700 focus:border-forest-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Difficulty */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-forest-800">Difficulty</label>
        <div className="space-y-2">
          {Object.entries(DIFFICULTIES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setDifficulty(difficulty === key ? '' : (key as Difficulty))}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                difficulty === key
                  ? 'bg-forest-500/10 text-forest-700'
                  : 'text-forest-600 hover:bg-forest-50'
              }`}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: val.color }}
              />
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Region */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-forest-800">Region</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full rounded-xl border border-forest-200 bg-white px-4 py-2.5 text-sm text-forest-700 focus:border-forest-500 focus:outline-none"
        >
          <option value="">All Regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" fullWidth onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
