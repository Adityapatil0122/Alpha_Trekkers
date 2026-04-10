import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BellSimpleRinging,
  ChartBar,
  ChatCircleDots,
  List,
  Mountains,
  SignOut,
  SuitcaseRolling,
  Users,
  X,
} from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/authStore';

const links = [
  { to: '/admin',          label: 'Dashboard', desc: 'Analytics and status',   Icon: ChartBar        },
  { to: '/admin/trips',    label: 'Trips',     desc: 'Table view and editing', Icon: Mountains       },
  { to: '/admin/bookings', label: 'Bookings',  desc: 'Reservation control',    Icon: SuitcaseRolling },
  { to: '/admin/messages', label: 'Messages',  desc: 'Inbox and replies',      Icon: ChatCircleDots  },
  { to: '/admin/users',    label: 'Users',     desc: 'Registered accounts',    Icon: Users           },
] as const;

const pageMeta: Record<string, { label: string; title: string }> = {
  '/admin':           { label: 'Analytics Dashboard', title: 'Control Center' },
  '/admin/trips':     { label: 'Trip Directory',       title: 'Trips'         },
  '/admin/bookings':  { label: 'Reservation Hub',      title: 'Bookings'      },
  '/admin/messages':  { label: 'Inbox',                title: 'Messages'      },
  '/admin/users':     { label: 'User Directory',       title: 'Users'         },
};

function getInitials(f?: string, l?: string) {
  return `${f?.[0] ?? 'A'}${l?.[0] ?? 'T'}`.toUpperCase();
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const meta = pageMeta[location.pathname] ?? pageMeta['/admin'];
  const activeDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date());

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const W = collapsed ? 'lg:w-[68px]' : 'lg:w-60';
  const sidebarCopyClass = collapsed
    ? 'max-w-[160px] translate-x-0 opacity-100 lg:max-w-0 lg:-translate-x-2 lg:opacity-0 lg:pointer-events-none'
    : 'max-w-[160px] translate-x-0 opacity-100';
  const sidebarSectionClass = collapsed
    ? 'max-h-24 translate-y-0 opacity-100 lg:max-h-0 lg:-translate-y-2 lg:opacity-0 lg:pointer-events-none'
    : 'max-h-24 translate-y-0 opacity-100';
  const compactUserClass = collapsed
    ? 'max-h-0 translate-y-2 opacity-0 pointer-events-none lg:max-h-20 lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto'
    : 'max-h-0 translate-y-2 opacity-0 pointer-events-none';
  const expandedUserClass = collapsed
    ? 'max-h-32 translate-y-0 opacity-100 lg:max-h-0 lg:-translate-y-2 lg:opacity-0 lg:pointer-events-none'
    : 'max-h-32 translate-y-0 opacity-100';

  return (
    <div className="flex min-h-screen bg-[#f0f4f2]">
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close admin navigation"
          className="fixed inset-0 z-30 bg-ink-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      {/* ── Fixed Sidebar ──────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 max-w-[86vw] flex-col overflow-hidden border-r border-black/[0.07] bg-white shadow-[2px_0_16px_rgba(15,23,42,0.07)] transition-[transform,width,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${W}`}>

        {/* Logo row */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-black/[0.07] px-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-forest-500 to-sea-600 shadow-[0_4px_12px_rgba(34,120,69,0.3)]">
            <Mountains className="h-4 w-4 text-white" weight="fill" />
          </div>
          <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${sidebarCopyClass}`}>
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-ink-400 whitespace-nowrap">Alpha Trekkers</p>
            <p className="text-sm font-extrabold text-ink-900 leading-tight whitespace-nowrap">Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.06] bg-sand-50 text-ink-400 transition-all duration-300 ease-out hover:border-forest-500/20 hover:bg-white hover:text-forest-600 lg:hidden"
            title="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="ml-auto hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.06] bg-sand-50 text-ink-400 transition-all duration-300 ease-out hover:border-forest-500/20 hover:bg-white hover:text-forest-600 lg:flex"
              title="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-0.5">
          <div className={`overflow-hidden px-2 transition-all duration-300 ease-out ${sidebarSectionClass}`}>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.24em] text-ink-400">Menu</p>
          </div>
          {links.map(({ to, label, desc, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `group flex items-center rounded-xl transition-all duration-300 ease-out ${collapsed ? 'gap-3 px-2.5 py-2.5 lg:justify-center lg:gap-0 lg:px-0' : 'gap-3 px-2.5 py-2.5'} ${
                  isActive
                    ? 'bg-gradient-to-r from-forest-500 to-forest-600 text-white shadow-[0_4px_12px_rgba(34,120,69,0.22)]'
                    : 'text-ink-600 hover:bg-sand-50 hover:text-ink-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-sand-100 group-hover:bg-white'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className={`min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${sidebarCopyClass}`}>
                    <span className="block text-sm font-semibold leading-tight whitespace-nowrap">{label}</span>
                    <span className={`block text-[10px] whitespace-nowrap truncate ${isActive ? 'text-white/65' : 'text-ink-400'}`}>{desc}</span>
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Admin badge */}
        <div className={`mx-2 mb-2 shrink-0 overflow-hidden rounded-xl border border-forest-500/15 bg-sand-50 transition-all duration-300 ease-out ${sidebarSectionClass}`}>
          <div className="p-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-forest-500/12 text-forest-500">
                <BellSimpleRinging className="h-3 w-3" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-ink-900 whitespace-nowrap">Admin mode</p>
                <p className="text-[9px] text-ink-500 whitespace-nowrap">Elevated access active.</p>
              </div>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="shrink-0 border-t border-black/[0.07] p-2.5">
          <div className={`overflow-hidden transition-all duration-300 ease-out ${compactUserClass}`}>
            <div className="flex flex-col items-center gap-2">
              <div title={user ? `${user.firstName} ${user.lastName}` : 'Admin'} className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sea-500 to-forest-500 text-[11px] font-bold text-white">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <button type="button" title="Sign out" onClick={() => { logout(); navigate('/admin/login', { replace: true }); }} className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-400 hover:bg-coral-500/10 hover:text-coral-600 transition">
                <SignOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ease-out ${expandedUserClass}`}>
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sea-500 to-forest-500 text-[11px] font-bold text-white">
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900 leading-tight">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</p>
                  <p className="truncate text-[10px] text-ink-500">{user?.email ?? 'admin@alphatrekkers.com'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { logout(); navigate('/admin/login', { replace: true }); }}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-black/[0.07] bg-sand-50 py-1.5 text-xs font-medium text-ink-600 hover:bg-coral-500/8 hover:text-coral-600 transition"
              >
                <SignOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>
        </div>

      </aside>

      {/* ── Content area ───────────────────────────────────────────── */}
      <div className={`flex min-h-screen flex-1 flex-col transition-[margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-60'}`}>

        {/* Sticky top header bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-black/[0.07] bg-white/96 px-4 backdrop-blur-sm shadow-[0_1px_6px_rgba(15,23,42,0.05)]">
          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition hover:bg-sand-100 hover:text-ink-900 lg:hidden"
          >
            <List className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition hover:bg-sand-100 hover:text-ink-900 lg:flex"
          >
            <List className="h-4.5 w-4.5" />
          </button>

          {/* Divider */}
          <span className="h-5 w-px bg-ink-900/10" />

          {/* Page crumb */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400 whitespace-nowrap">{meta.label}</span>
            <span className="hidden sm:block text-ink-300 text-xs">/</span>
            <span className="text-sm font-bold text-ink-900 whitespace-nowrap">{meta.title}</span>
          </div>

          {/* Right */}
          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1 text-[11px] font-medium text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
              {activeDate}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sea-500 to-forest-500 text-[11px] font-bold text-white">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-ink-900 leading-tight">{user?.firstName ?? 'Admin'}</p>
                <p className="text-[10px] text-ink-500 leading-tight">{user?.role ?? 'ADMIN'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 sm:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
