import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ChartBar,
  Compass,
  List,
  Mountains,
  SignOut,
  SuitcaseRolling,
  Users,
  X,
} from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/authStore';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const links = [
  { to: '/admin',          label: 'Dashboard', desc: 'Analytics and status',   Icon: ChartBar        },
  { to: '/admin/trips',    label: 'Treks',     desc: 'Table view and editing', Icon: Mountains       },
  { to: '/admin/tours',    label: 'Tours',     desc: 'One-day trip manager',   Icon: Compass         },
  { to: '/admin/bookings', label: 'Bookings',  desc: 'Reservation control',    Icon: SuitcaseRolling },
  { to: '/admin/users',    label: 'Users',     desc: 'Registered accounts',    Icon: Users           },
] as const;

const adminLogo = '/destinations/alogo.png';

function getInitials(f?: string, l?: string) {
  return `${f?.[0] ?? 'A'}${l?.[0] ?? 'T'}`.toUpperCase();
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const activeDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date());

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    setMobileNavOpen(false);
    logout();
    navigate('/admin/login', { replace: true });
  };

  // Sidebar width class — only width transitions on desktop, transform on mobile
  const sidebarW = collapsed ? 'lg:w-[68px]' : 'lg:w-60';

  // Text/labels hide when collapsed (desktop only)
  const textHide = collapsed
    ? 'lg:w-0 lg:opacity-0 lg:overflow-hidden'
    : 'w-auto opacity-100';

  // Section hide (admin badge, menu label)
  const sectionHide = collapsed
    ? 'lg:h-0 lg:opacity-0 lg:overflow-hidden lg:m-0 lg:p-0'
    : 'opacity-100';

  return (
    <div className="admin-shell flex min-h-screen bg-[#f0f4f2]">
      {/* Mobile backdrop — no backdrop-blur to avoid lag */}
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex max-w-[86vw] flex-col overflow-hidden',
          'border-r border-black/[0.07] bg-white shadow-[2px_0_12px_rgba(15,23,42,0.05)]',
          // Mobile: slide via transform
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          // Desktop: width transition only
          'w-60 transition-[width] duration-200 ease-out',
          // Mobile: also transition transform
          'max-lg:transition-transform max-lg:duration-200',
          sidebarW,
        ].join(' ')}
      >

        {/* Logo row */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-black/[0.07] px-3">
          <img
            src={adminLogo}
            alt="Alpha Trekkers logo"
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-black/5"
          />
          <div className={`overflow-hidden whitespace-nowrap transition-[width,opacity] duration-200 ease-out ${textHide}`}>
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-ink-400">Alpha Trekkers</p>
            <p className="text-sm font-extrabold text-ink-900 leading-tight">Admin Panel</p>
          </div>
          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.06] bg-sand-50 text-ink-400 hover:text-forest-600 transition-colors lg:hidden"
            title="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
          {/* Desktop collapse */}
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="ml-auto hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.06] bg-sand-50 text-ink-400 hover:text-forest-600 transition-colors lg:flex"
              title="Collapse sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
          <div className={`overflow-hidden px-2 transition-[height,opacity] duration-200 ease-out ${sectionHide}`}>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.24em] text-ink-400">Menu</p>
          </div>
          {links.map(({ to, label, desc, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `group flex items-center rounded-xl transition-colors duration-150 ${
                  collapsed ? 'gap-3 px-2.5 py-2.5 lg:justify-center lg:gap-0 lg:px-0' : 'gap-3 px-2.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-forest-500 to-forest-600 text-white shadow-sm'
                    : 'text-ink-600 hover:bg-forest-500/5 hover:text-ink-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${isActive ? 'bg-white/20' : 'bg-sand-100 group-hover:bg-forest-500/10'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className={`min-w-0 overflow-hidden whitespace-nowrap transition-[width,opacity] duration-200 ease-out ${textHide}`}>
                    <span className="block text-sm font-semibold leading-tight">{label}</span>
                    <span className={`block text-[10px] truncate ${isActive ? 'text-white/65' : 'text-ink-400'}`}>{desc}</span>
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Admin badge — only visible when expanded */}
        {/* User section */}
        <div className="shrink-0 border-t border-black/[0.07] p-2.5">
          {/* Collapsed view — icon only */}
          {collapsed && (
            <div className="hidden lg:flex flex-col items-center gap-2">
              <div
                title={user ? `${user.firstName} ${user.lastName}` : 'Admin'}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-forest-600 text-[11px] font-bold text-white"
              >
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <button
                type="button"
                title="Sign out"
                onClick={() => setLogoutDialogOpen(true)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-400 hover:bg-coral-500/10 hover:text-coral-600 transition-colors"
              >
                <SignOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          {/* Expanded view — full user info */}
          {!collapsed && (
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-forest-600 text-[11px] font-bold text-white">
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900 leading-tight">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</p>
                  <p className="truncate text-[10px] text-ink-500">{user?.email ?? 'admin@alphatrekkers.com'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLogoutDialogOpen(true)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-black/[0.07] bg-sand-50 py-1.5 text-xs font-medium text-ink-600 hover:bg-coral-500/8 hover:text-coral-600 transition-colors"
              >
                <SignOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          )}
          {/* Mobile: always show expanded */}
          {collapsed && (
            <div className="lg:hidden">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-forest-600 text-[11px] font-bold text-white">
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900 leading-tight">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</p>
                  <p className="truncate text-[10px] text-ink-500">{user?.email ?? 'admin@alphatrekkers.com'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLogoutDialogOpen(true)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-black/[0.07] bg-sand-50 py-1.5 text-xs font-medium text-ink-600 hover:bg-coral-500/8 hover:text-coral-600 transition-colors"
              >
                <SignOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* ── Content area ───────────────────────────────────────────── */}
      <div className={`flex min-h-screen min-w-0 flex-1 flex-col transition-[margin-left] duration-200 ease-out ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-60'}`}>

        {/* Top header bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-black/[0.07] bg-white/95 px-3 shadow-[0_1px_4px_rgba(15,23,42,0.04)] sm:gap-3 sm:px-4">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-sand-100 hover:text-ink-900 transition-colors lg:hidden"
          >
            <List className="h-4.5 w-4.5" />
          </button>
          {/* Desktop toggle */}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-sand-100 hover:text-ink-900 transition-colors lg:flex"
          >
            <List className="h-4.5 w-4.5" />
          </button>

          <span className="hidden h-5 w-px bg-ink-900/10 sm:block" />

          <div className="min-w-0 flex-1">
            <span className="block truncate font-heading text-base font-extrabold text-forest-600 sm:text-xl">Welcome admin!</span>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-700">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
              {activeDate}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-forest-600 text-[11px] font-bold text-white">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-ink-900 leading-tight">{user?.firstName ?? 'Admin'}</p>
                <p className="text-[10px] text-ink-500 leading-tight">{user?.role ?? 'ADMIN'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-w-0 flex-1 px-3 py-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        title="Sign out from admin?"
        description="You will be logged out from the admin panel and sent back to the admin login page."
        confirmLabel="Sign out"
        cancelLabel="Stay here"
        icon={<SignOut className="h-7 w-7" weight="bold" />}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
