import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarBlank,
  CaretDown,
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  List,
  MapPinLine,
  Mountains,
  PhoneCall,
  SignOut,
  TwitterLogo,
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
        {/* Top info bar */}
        <div className="hidden border-b border-dark-200 bg-dark-900 text-white lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 text-sm sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <a href="mailto:hello@alphatrekkers.com" className="flex items-center gap-2 text-dark-300 hover:text-white">
                <EnvelopeSimple className="h-4 w-4 text-primary-500" />
                hello@alphatrekkers.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-dark-300 hover:text-white">
                <PhoneCall className="h-4 w-4 text-primary-500" />
                +91 98765 43210
              </a>
              <span className="flex items-center gap-2 text-dark-300">
                <MapPinLine className="h-4 w-4 text-primary-500" />
                Pune, Maharashtra
              </span>
            </div>
            <div className="flex items-center gap-3">
              {[FacebookLogo, TwitterLogo, InstagramLogo, LinkedinLogo].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-dark-400 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" weight="fill" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main navigation */}
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
            {/* Logo */}
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

            {/* Desktop nav links */}
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

              <div
                className="relative"
                onMouseEnter={() => setTripsMenuOpen(true)}
                onMouseLeave={() => setTripsMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setTripsMenuOpen((open) => !open)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-[0.9rem] font-medium transition ${
                    isTripsSection
                      ? 'text-primary-500'
                      : 'text-dark-700 hover:text-primary-500'
                  }`}
                >
                  Tours
                  <CaretDown className={`h-3.5 w-3.5 transition-transform ${tripsMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {tripsMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 mt-1 w-56 rounded-lg border border-dark-200 bg-white p-2 shadow-xl"
                    >
                      {tripMenuLinks.map((link) => {
                        const active = location.pathname === link.to;
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                              active ? 'bg-primary-500 text-white' : 'text-dark-700 hover:bg-primary-50 hover:text-primary-500'
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

            {/* Right side actions */}
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

            {/* Mobile hamburger */}
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

      {/* Mobile menu */}
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

              <div className="space-y-1">
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

                <div className="rounded-lg border border-dark-200 p-1">
                  <button
                    type="button"
                    onClick={() => setMobileTripsOpen((open) => !open)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium ${
                      isTripsSection ? 'bg-primary-500 text-white' : 'text-dark-700 hover:bg-primary-50'
                    }`}
                  >
                    <span>Tours</span>
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
                        <div className="mt-1 space-y-1 px-2 pb-2">
                          {tripMenuLinks.map((link) => (
                            <Link
                              key={link.to}
                              to={link.to}
                              className={`block rounded-lg px-4 py-2.5 text-sm ${
                                location.pathname === link.to
                                  ? 'bg-primary-500 text-white'
                                  : 'text-dark-700 hover:bg-primary-50'
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
