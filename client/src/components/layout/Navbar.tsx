import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarBlank,
  CaretDown,
  EnvelopeSimple,
  List,
  MapPinLine,
  Mountains,
  PhoneCall,
  SignOut,
  SuitcaseRolling,
  Tree,
  User,
  X,
} from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';

const tripMenuLinks = [
  { to: '/trips', label: 'All Trips' },
  { to: '/weekend-trips', label: 'Weekend Trips' },
  { to: '/weekday-trips', label: 'Weekday Trips' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tripsMenuOpen, setTripsMenuOpen] = useState(false);
  const [mobileTripsOpen, setMobileTripsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isTripsSection = ['/trips', '/weekend-trips', '/weekday-trips'].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setTripsMenuOpen(false);
    setMobileTripsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        <div className="hidden border-b border-white/10 bg-ink-950/94 text-sand-100 lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-sm sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-sand-200/80">
                <PhoneCall className="h-4 w-4 text-gold-400" />
                +91 98765 43210
              </span>
              <span className="flex items-center gap-2 text-sand-200/80">
                <EnvelopeSimple className="h-4 w-4 text-gold-400" />
                hello@alphatrekkers.com
              </span>
              <span className="flex items-center gap-2 text-sand-200/80">
                <MapPinLine className="h-4 w-4 text-gold-400" />
                Pune, Maharashtra
              </span>
            </div>
            <span className="text-sand-200/65">
              Guided fort treks, custom departures, and curated escapes.
            </span>
          </div>
        </div>

        <motion.header
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`border-b transition-all duration-300 ${
            scrolled
              ? 'border-ink-900/8 bg-mist-50/88 shadow-[0_18px_40px_rgba(8,17,28,0.08)] backdrop-blur-xl'
              : 'border-white/10 bg-transparent'
          }`}
        >
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                  scrolled
                    ? 'border-forest-500/20 bg-forest-500/10'
                    : 'border-white/15 bg-white/10 backdrop-blur'
                }`}
              >
                <Mountains
                  className={`h-7 w-7 ${scrolled ? 'text-forest-500' : 'text-gold-400'}`}
                  weight="duotone"
                />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-[0.26em] ${scrolled ? 'text-forest-500' : 'text-sand-200/80'}`}>
                  Alpha Trekkers
                </p>
                <p className={`font-heading text-2xl font-semibold ${scrolled ? 'text-ink-900' : 'text-white'}`}>
                  Monsoon Trail Journeys
                </p>
                <p className={`font-playful-text text-[0.65rem] tracking-wide ${scrolled ? 'text-forest-600/70' : 'text-gold-400/80'}`}>
                  into the wild
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-2 xl:flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium ${
                    isActive
                      ? scrolled
                        ? 'bg-forest-500 text-white'
                        : 'bg-white/14 text-white'
                      : scrolled
                        ? 'text-ink-700 hover:bg-ink-900/5'
                        : 'text-sand-100/82 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Home
              </NavLink>

              <div
                className="relative"
                onMouseEnter={() => setTripsMenuOpen(true)}
                onMouseLeave={() => setTripsMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setTripsMenuOpen((open) => !open)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                    isTripsSection
                      ? scrolled
                        ? 'bg-forest-500 text-white'
                        : 'bg-white/14 text-white'
                      : scrolled
                        ? 'text-ink-700 hover:bg-ink-900/5'
                        : 'text-sand-100/82 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Trips
                  <CaretDown className={`h-4 w-4 transition-transform ${tripsMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {tripsMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="travel-panel absolute left-0 mt-3 w-64 rounded-[1.75rem] p-3"
                    >
                      {tripMenuLinks.map((link) => {
                        const active = location.pathname === link.to;

                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`block rounded-2xl px-4 py-3 text-sm font-medium ${
                              active ? 'bg-forest-500 text-white' : 'text-ink-700 hover:bg-sand-100'
                            }`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium ${
                    isActive
                      ? scrolled
                        ? 'bg-forest-500 text-white'
                        : 'bg-white/14 text-white'
                      : scrolled
                        ? 'text-ink-700 hover:bg-ink-900/5'
                        : 'text-sand-100/82 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium ${
                    isActive
                      ? scrolled
                        ? 'bg-forest-500 text-white'
                        : 'bg-white/14 text-white'
                      : scrolled
                        ? 'text-ink-700 hover:bg-ink-900/5'
                        : 'text-sand-100/82 hover:bg-white/10 hover:text-white'
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
                    className={`flex items-center gap-3 rounded-full px-4 py-2.5 ${
                      scrolled ? 'bg-ink-900/5 text-ink-900' : 'bg-white/10 text-white'
                    }`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-sm font-semibold text-ink-950">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                    <span className="text-sm font-medium">{user.firstName}</span>
                    <CaretDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="travel-panel absolute right-0 mt-3 w-60 rounded-3xl p-3"
                      >
                        <Link
                          to="/my-bookings"
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-ink-700 hover:bg-sand-100"
                        >
                          <CalendarBlank className="h-4 w-4 text-forest-500" />
                          My Bookings
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-ink-700 hover:bg-sand-100"
                          >
                            <User className="h-4 w-4 text-forest-500" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-coral-600 hover:bg-coral-500/8"
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
                    className={`rounded-full px-4 py-2.5 text-sm font-medium ${
                      scrolled ? 'text-ink-700 hover:bg-ink-900/5' : 'text-white/88 hover:bg-white/10'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link to="/trips">
                    <Button size="md" variant="accent" rightIcon={<Tree className="h-4 w-4" weight="duotone" />}>
                      Book Trek
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className={`rounded-2xl p-3 xl:hidden ${
                scrolled ? 'bg-ink-900/5 text-ink-900' : 'bg-white/10 text-white'
              }`}
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
              className="fixed inset-0 z-40 bg-ink-950/45 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              className="travel-panel fixed right-0 top-0 z-50 flex h-full w-80 max-w-[88vw] flex-col rounded-l-[2rem] p-6 xl:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-forest-500">Alpha Trekkers</p>
                  <p className="font-heading text-2xl text-ink-900">Travel Menu</p>
                </div>
                <button type="button" onClick={() => setMobileOpen(false)} className="rounded-2xl bg-sand-100 p-2 text-ink-800">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm font-medium ${
                      isActive ? 'bg-forest-500 text-white' : 'text-ink-700 hover:bg-sand-100'
                    }`
                  }
                >
                  Home
                </NavLink>

                <div className="rounded-[1.5rem] border border-ink-900/8 p-2">
                  <button
                    type="button"
                    onClick={() => setMobileTripsOpen((open) => !open)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium ${
                      isTripsSection ? 'bg-forest-500 text-white' : 'text-ink-700 hover:bg-sand-100'
                    }`}
                  >
                    <span>Trips</span>
                    <CaretDown className={`h-4 w-4 transition-transform ${mobileTripsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {mobileTripsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-2 px-2 pb-2">
                          {tripMenuLinks.map((link) => (
                            <Link
                              key={link.to}
                              to={link.to}
                              className={`block rounded-2xl px-4 py-3 text-sm ${
                                location.pathname === link.to
                                  ? 'bg-forest-500 text-white'
                                  : 'text-ink-700 hover:bg-sand-100'
                              }`}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm font-medium ${
                      isActive ? 'bg-forest-500 text-white' : 'text-ink-700 hover:bg-sand-100'
                    }`
                  }
                >
                  About
                </NavLink>

                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm font-medium ${
                      isActive ? 'bg-forest-500 text-white' : 'text-ink-700 hover:bg-sand-100'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </div>

              <div className="mt-8 rounded-[1.75rem] bg-ink-950 px-5 py-6 text-sand-100">
                <p className="text-xs uppercase tracking-[0.22em] text-gold-400">Direct Contact</p>
                <div className="mt-4 space-y-3 text-sm text-sand-200/80">
                  <p className="flex items-center gap-2"><PhoneCall className="h-4 w-4 text-gold-400" /> +91 98765 43210</p>
                  <p className="flex items-center gap-2"><EnvelopeSimple className="h-4 w-4 text-gold-400" /> hello@alphatrekkers.com</p>
                </div>
              </div>

              <div className="mt-auto space-y-3 pt-6">
                {isAuthenticated && user ? (
                  <>
                    <Link to="/my-bookings" className="block rounded-2xl bg-sand-100 px-4 py-3 text-sm font-medium text-ink-800">
                      My Bookings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-2xl border border-coral-500/25 px-4 py-3 text-left text-sm font-medium text-coral-600"
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
                      <Button variant="accent" size="md" fullWidth>
                        Explore Tours
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
