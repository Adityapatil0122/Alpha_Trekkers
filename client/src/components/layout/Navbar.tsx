import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarBlank,
  CaretDown,
  EnvelopeSimple,
  List,
  Mountains,
  PhoneCall,
  SignOut,
  X,
} from '@phosphor-icons/react';
import { MAHARASHTRA_MONSOON_IMAGES, type PaginatedResponse, type Trip } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [treksMenuOpen, setTreksMenuOpen] = useState(false);
  const [activeTrekCategory, setActiveTrekCategory] = useState<'WEEKEND' | 'WEEKDAY'>('WEEKEND');
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);
  const [featuredTripsLoading, setFeaturedTripsLoading] = useState(true);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<'treks' | null>(null);
  const [mobileTrekCategory, setMobileTrekCategory] = useState<'WEEKEND' | 'WEEKDAY'>('WEEKEND');
  const treksMenuRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setTreksMenuOpen(false);
    setExpandedMobileMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTreksMenu = treksMenuRef.current?.contains(target);

      if (!clickedTreksMenu) {
        setTreksMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    setFeaturedTripsLoading(true);
    api
      .get<PaginatedResponse<{ trips: Trip[] }>>('/trips', {
        params: { isFeatured: true, limit: 18, sortBy: 'avgRating', sortOrder: 'desc' },
      })
      .then((response) => setFeaturedTrips(response.data.data.trips))
      .catch(() => setFeaturedTrips([]))
      .finally(() => setFeaturedTripsLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTreksMenu = () => setTreksMenuOpen((open) => !open);
  const featuredWeekendTrips = featuredTrips.filter((trip) => trip.category === 'WEEKEND').slice(0, 6);
  const featuredWeekdayTrips = featuredTrips.filter((trip) => trip.category === 'WEEKDAY').slice(0, 6);
  const activeFeaturedTrips = activeTrekCategory === 'WEEKEND' ? featuredWeekendTrips : featuredWeekdayTrips;
  const mobileFeaturedTrips = mobileTrekCategory === 'WEEKEND' ? featuredWeekendTrips : featuredWeekdayTrips;
  const activeCategoryLabel = activeTrekCategory === 'WEEKEND' ? 'Weekend' : 'Weekday';
  const mobileCategoryLabel = mobileTrekCategory === 'WEEKEND' ? 'Weekend' : 'Weekday';

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        <motion.header
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`border-b transition-all duration-300 ${
            scrolled
              ? 'border-dark-200 bg-white shadow-lg'
              : 'border-transparent bg-white/95 backdrop-blur-sm'
          }`}
        >
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 text-white">
                <Mountains className="h-6 w-6" weight="bold" />
              </div>
              <div>
                <p className="text-xl font-bold text-dark-900">
                  Alpha <span className="text-primary-500">Trekkers</span>
                </p>
                <p className="text-[0.65rem] font-medium uppercase tracking-wider text-dark-400">
                  Adventure & Travel
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-1 xl:flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 text-[0.9rem] font-medium transition ${
                    isActive
                      ? 'text-primary-500'
                      : 'text-dark-700 hover:text-primary-500'
                  }`
                }
              >
                Home
              </NavLink>

              <div className="relative" ref={treksMenuRef}>
                <button
                  type="button"
                  onClick={toggleTreksMenu}
                  aria-expanded={treksMenuOpen}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[0.9rem] font-medium text-dark-700 transition hover:text-primary-500"
                >
                  Treks
                  <CaretDown className={`h-3.5 w-3.5 transition-transform ${treksMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {treksMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full mt-8 w-[min(92vw,1040px)] -translate-x-1/2 rounded-[1.45rem] border border-dark-200 bg-white p-4 shadow-[0_24px_72px_rgba(12,23,41,0.14)]"
                    >
                      <div className="absolute left-1/2 top-0 z-10 h-5 w-5 -translate-x-1/2 -translate-y-[72%] rotate-45 rounded-[0.35rem] border-l border-t border-dark-200 bg-white shadow-[-8px_-8px_22px_rgba(12,23,41,0.08)]" />
                      <div className="grid min-h-[20rem] gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
                        <div className="rounded-[1.15rem] border border-dark-200/70 bg-sand-50/70 p-4">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-dark-400">
                            Trek Types
                          </p>
                          <div className="mt-4 space-y-2">
                            {[
                              { key: 'WEEKEND' as const, label: 'Weekend Trips', description: 'Longer fort circuits and full-day routes' },
                              { key: 'WEEKDAY' as const, label: 'Weekdays Trips', description: 'Faster escapes and same-day plans' },
                            ].map((item) => (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() => setActiveTrekCategory(item.key)}
                                className={`w-full rounded-[1rem] border px-4 py-3 text-left transition ${
                                  activeTrekCategory === item.key
                                    ? 'border-primary-500 bg-white text-dark-900 shadow-[0_14px_32px_rgba(12,23,41,0.08)]'
                                    : 'border-transparent bg-transparent text-dark-600 hover:border-dark-200 hover:bg-white/80'
                                }`}
                              >
                                <p className="text-sm font-semibold">{item.label}</p>
                                <p className="mt-1 text-xs leading-5 text-dark-400">{item.description}</p>
                              </button>
                            ))}
                          </div>
                          <Link
                            to={`/trips?category=${activeTrekCategory}`}
                            className="mt-5 block rounded-full border border-dark-200 bg-white px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-dark-700 transition hover:border-primary-500 hover:text-primary-500"
                          >
                            Browse All
                          </Link>
                        </div>

                        <div className="p-2 lg:px-5 lg:py-3">
                          <div className="flex items-end justify-between gap-4 border-b border-dashed border-dark-300 pb-3">
                            <div>
                              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary-500">
                                Featured Trips
                              </p>
                              <h3 className="mt-1 text-[1.35rem] font-semibold text-dark-900">
                                {activeCategoryLabel} Treks
                              </h3>
                            </div>
                          </div>

                          {featuredTripsLoading ? (
                            <div className="flex h-[14rem] items-center justify-center text-sm text-dark-400">
                              Loading featured treks...
                            </div>
                          ) : activeFeaturedTrips.length > 0 ? (
                            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                              {activeFeaturedTrips.map((trip) => {
                                return (
                                  <Link
                                    key={trip.id}
                                    to={`/trips/${trip.slug}`}
                                    title={trip.title}
                                    className="group block overflow-hidden rounded-[1.1rem] border border-dark-200/70 bg-white transition hover:border-primary-500"
                                  >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-sand-100">
                                      <img
                                        src={trip.images[0]?.url ?? MAHARASHTRA_MONSOON_IMAGES.fallback.tripCard}
                                        alt={trip.images[0]?.altText || trip.title}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                      />
                                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-900/84 via-dark-900/45 to-transparent px-3.5 pb-3 pt-8">
                                        <div className="flex items-center justify-between gap-3">
                                          <span className="text-sm font-semibold text-white">
                                            INR {(trip.discountPrice ?? trip.basePrice).toLocaleString('en-IN')}
                                          </span>
                                          <span className="max-w-[58%] truncate text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-primary-300">
                                            {trip.title}
                                          </span>
                                        </div>
                                      </div>
                                      <span className="sr-only">{trip.title}</span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex h-[11rem] items-center justify-center rounded-[1.1rem] bg-sand-50 text-center text-sm text-dark-400">
                              No featured {activeCategoryLabel.toLowerCase()} trips are set in the admin panel yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <NavLink
                to="/trips"
                className={({ isActive }) =>
                  `px-4 py-2 text-[0.9rem] font-medium transition ${
                    isActive
                      ? 'text-primary-500'
                      : 'text-dark-700 hover:text-primary-500'
                  }`
                }
              >
                Tours
              </NavLink>

              <NavLink
                to="/corporate-treks"
                className={({ isActive }) =>
                  `px-4 py-2 text-[0.9rem] font-medium transition ${
                    isActive
                      ? 'text-primary-500'
                      : 'text-dark-700 hover:text-primary-500'
                  }`
                }
              >
                Corporate Treks
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-4 py-2 text-[0.9rem] font-medium transition ${
                    isActive
                      ? 'text-primary-500'
                      : 'text-dark-700 hover:text-primary-500'
                  }`
                }
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-4 py-2 text-[0.9rem] font-medium transition ${
                    isActive
                      ? 'text-primary-500'
                      : 'text-dark-700 hover:text-primary-500'
                  }`
                }
              >
                Contact
              </NavLink>
            </div>

            <div className="hidden items-center gap-3 xl:flex">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((open) => !open)}
                    className="flex items-center gap-3 rounded-lg border border-dark-200 px-4 py-2.5 text-dark-700 transition hover:border-primary-500"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                    <span className="text-sm font-medium">{user.firstName}</span>
                    <CaretDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-52 rounded-lg border border-dark-200 bg-white p-2 shadow-xl"
                      >
                        <Link
                          to="/my-bookings"
                          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-dark-700 hover:bg-primary-50 hover:text-primary-500"
                        >
                          <CalendarBlank className="h-4 w-4" />
                          My Bookings
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
                        >
                          <SignOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-dark-700 hover:text-primary-500"
                  >
                    Sign In
                  </Link>
                  <Link to="/trips">
                    <Button size="md" variant="primary">
                      Book Now
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="rounded-lg border border-dark-200 p-2.5 text-dark-700 xl:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
            </button>
          </nav>
        </motion.header>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-dark-900/40 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              className="fixed right-0 top-0 z-50 flex h-full w-80 max-w-[88vw] flex-col border-l border-dark-200 bg-white p-6 xl:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-dark-900">
                    Alpha <span className="text-primary-500">Trekkers</span>
                  </p>
                </div>
                <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg border border-dark-200 p-2 text-dark-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1 overflow-y-auto pr-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-sm font-medium ${
                      isActive ? 'bg-primary-500 text-white' : 'text-dark-700 hover:bg-primary-50'
                    }`
                  }
                >
                  Home
                </NavLink>

                <div className="rounded-2xl border border-dark-200/70">
                  <div className="flex items-center">
                    <div className="flex-1 rounded-l-2xl px-4 py-3 text-sm font-medium text-dark-700">
                      Treks
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedMobileMenu((current) =>
                          current === 'treks' ? null : 'treks',
                        )
                      }
                      className="rounded-r-2xl px-4 py-3 text-dark-600"
                    >
                      <CaretDown className={`h-4 w-4 transition-transform ${expandedMobileMenu === 'treks' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {expandedMobileMenu === 'treks' ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-dark-200/70 px-4 py-3"
                      >
                        <div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setMobileTrekCategory('WEEKEND')}
                              className={`rounded-xl px-3 py-3 text-sm font-medium ${
                                mobileTrekCategory === 'WEEKEND'
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-sand-50 text-dark-700'
                              }`}
                            >
                              Weekend
                            </button>
                            <button
                              type="button"
                              onClick={() => setMobileTrekCategory('WEEKDAY')}
                              className={`rounded-xl px-3 py-3 text-sm font-medium ${
                                mobileTrekCategory === 'WEEKDAY'
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-sand-50 text-dark-700'
                              }`}
                            >
                              Weekdays
                            </button>
                          </div>

                          <div className="mt-4">
                            {featuredTripsLoading ? (
                              <p className="text-sm text-dark-400">Loading featured treks...</p>
                            ) : mobileFeaturedTrips.length > 0 ? (
                              <div className="grid grid-cols-2 gap-2.5">
                                {mobileFeaturedTrips.map((trip) => (
                                  <Link
                                    key={trip.id}
                                    to={`/trips/${trip.slug}`}
                                    title={trip.title}
                                    className="group block overflow-hidden rounded-[1rem] border border-dark-200/70 bg-white"
                                  >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
                                      <img
                                        src={trip.images[0]?.url ?? MAHARASHTRA_MONSOON_IMAGES.fallback.tripCard}
                                        alt={trip.images[0]?.altText || trip.title}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                      />
                                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-900/84 via-dark-900/45 to-transparent px-3 pb-2.5 pt-8">
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="text-xs font-semibold text-white">
                                            INR {(trip.discountPrice ?? trip.basePrice).toLocaleString('en-IN')}
                                          </span>
                                          <span className="max-w-[58%] truncate text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-primary-300">
                                            {trip.title}
                                          </span>
                                        </div>
                                      </div>
                                      <span className="sr-only">{trip.title}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-dark-400">
                                No featured {mobileCategoryLabel.toLowerCase()} treks are configured yet.
                              </p>
                            )}
                          </div>

                          <Link
                            to={`/trips?category=${mobileTrekCategory}`}
                            className="mt-4 block rounded-xl border border-dark-200 px-3 py-3 text-center text-sm font-medium text-dark-700"
                          >
                            Browse all {mobileCategoryLabel.toLowerCase()} treks
                          </Link>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <NavLink
                  to="/trips"
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-sm font-medium ${
                      isActive ? 'bg-primary-500 text-white' : 'text-dark-700 hover:bg-primary-50'
                    }`
                  }
                >
                  Tours
                </NavLink>

                <NavLink
                  to="/corporate-treks"
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-sm font-medium ${
                      isActive ? 'bg-primary-500 text-white' : 'text-dark-700 hover:bg-primary-50'
                    }`
                  }
                >
                  Corporate Treks
                </NavLink>

                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-sm font-medium ${
                      isActive ? 'bg-primary-500 text-white' : 'text-dark-700 hover:bg-primary-50'
                    }`
                  }
                >
                  About
                </NavLink>

                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-sm font-medium ${
                      isActive ? 'bg-primary-500 text-white' : 'text-dark-700 hover:bg-primary-50'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </div>

              <div className="mt-6 rounded-lg bg-dark-900 px-5 py-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-400">Contact</p>
                <div className="mt-3 space-y-2.5 text-sm text-dark-300">
                  <p className="flex items-center gap-2"><PhoneCall className="h-4 w-4 text-primary-400" /> +91 98765 43210</p>
                  <p className="flex items-center gap-2"><EnvelopeSimple className="h-4 w-4 text-primary-400" /> hello@alphatrekkers.com</p>
                </div>
              </div>

              <div className="mt-auto space-y-3 pt-6">
                {isAuthenticated && user ? (
                  <>
                    <Link to="/my-bookings" className="block rounded-lg border border-dark-200 px-4 py-3 text-center text-sm font-medium text-dark-700">
                      My Bookings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg border border-red-200 px-4 py-3 text-sm font-medium text-red-500"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="secondary" size="md" fullWidth>
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/trips">
                      <Button variant="primary" size="md" fullWidth>
                        Book Now
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
