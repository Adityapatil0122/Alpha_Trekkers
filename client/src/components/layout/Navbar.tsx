import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mountains,
  List,
  X,
  User,
  SignOut,
  CaretDown,
  CalendarBlank,
  Compass,
} from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/authStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/weekend-trips', label: 'Weekend Trips' },
  { to: '/weekday-trips', label: 'Weekday Trips' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-dark shadow-lg shadow-forest-900/20'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-500/20 transition-colors group-hover:bg-forest-500/30">
              <Mountains className="h-6 w-6 text-forest-400" weight="duotone" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold text-white">
                Alpha{' '}
                <span className="text-forest-400">Trekkers</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-forest-500/15 text-forest-300'
                      : 'text-forest-100/80 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth / User */}
          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/15"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-500 text-xs font-bold text-white">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <span>{user.firstName}</span>
                  <CaretDown
                    className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="glass-dark absolute right-0 mt-2 w-52 overflow-hidden rounded-xl py-1 shadow-xl"
                    >
                      <Link
                        to="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-forest-100 transition-colors hover:bg-white/10"
                      >
                        <CalendarBlank className="h-4 w-4" />
                        My Bookings
                      </Link>
                      <Link
                        to="/trips"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-forest-100 transition-colors hover:bg-white/10"
                      >
                        <Compass className="h-4 w-4" />
                        Explore Treks
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 transition-colors hover:bg-white/10"
                        >
                          <User className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <div className="my-1 border-t border-white/10" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-white/10"
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
                  className="rounded-lg px-5 py-2 text-sm font-medium text-forest-100 transition-colors hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-forest-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-forest-500/25 transition-all hover:bg-forest-400 hover:shadow-forest-400/30"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <List className="h-6 w-6" />
            )}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-forest-900 p-6 shadow-2xl lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Mountains className="h-6 w-6 text-forest-400" weight="duotone" />
                  <span className="font-heading text-lg font-bold text-white">
                    Alpha <span className="text-forest-400">Trekkers</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1 text-forest-300 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-4 py-3 text-base font-medium transition-all ${
                        isActive
                          ? 'bg-forest-500/15 text-forest-300'
                          : 'text-forest-100/80 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="mt-8 border-t border-forest-700 pt-6">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="mb-4 flex items-center gap-3 rounded-lg bg-forest-800 px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-500 text-sm font-bold text-white">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-forest-400">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-4 py-2.5 text-sm text-forest-100 hover:bg-white/5"
                    >
                      My Bookings
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-4 py-2.5 text-sm text-amber-400 hover:bg-white/5"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full rounded-lg px-4 py-2.5 text-left text-sm text-red-400 hover:bg-white/5"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl border border-forest-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-forest-800"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl bg-forest-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-forest-400"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
