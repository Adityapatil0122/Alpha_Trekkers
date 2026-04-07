import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BellSimpleRinging,
  CalendarBlank,
  ChartBar,
  Mountains,
  SignOut,
  SuitcaseRolling,
  Sparkle,
} from '@phosphor-icons/react';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

const links = [
  {
    to: '/admin',
    label: 'Dashboard',
    description: 'Platform overview',
    Icon: ChartBar,
  },
  {
    to: '/admin/trips',
    label: 'Trips',
    description: 'Content and departures',
    Icon: Mountains,
  },
  {
    to: '/admin/bookings',
    label: 'Bookings',
    description: 'Reservation control',
    Icon: SuitcaseRolling,
  },
] as const;

const pageMeta = {
  '/admin': {
    title: 'Dashboard Overview',
    subtitle: 'Monitor platform activity, booking flow, and operational updates.',
  },
  '/admin/trips': {
    title: 'Trip Operations',
    subtitle: 'Manage trek content, pricing, schedules, and gallery assets from one place.',
  },
  '/admin/bookings': {
    title: 'Booking Operations',
    subtitle: 'Review reservation requests and keep departures on track.',
  },
} as const;

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? 'A'}${lastName?.[0] ?? 'T'}`.toUpperCase();
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const currentMeta =
    pageMeta[location.pathname as keyof typeof pageMeta] ?? pageMeta['/admin'];

  const activeDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="admin-shell min-h-screen pt-24">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-6 sm:px-6 xl:px-8">
        <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-80">
          <div className="travel-panel flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_26px_60px_rgba(15,23,42,0.08)]">
            <div className="rounded-[1.8rem] bg-gradient-to-br from-forest-500 via-forest-600 to-sea-500 p-5 text-white shadow-[0_22px_50px_rgba(34,120,69,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                Admin
              </p>
              <h1 className="mt-3 text-3xl font-bold">Control Center</h1>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Clean layout, same Alpha Trekkers palette, faster operations.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              {links.map(({ to, label, description, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  className={({ isActive }) =>
                    `group flex items-start gap-3 rounded-[1.4rem] px-4 py-3.5 transition ${
                      isActive
                        ? 'bg-gradient-to-r from-forest-500 to-forest-600 text-white shadow-[0_14px_32px_rgba(34,120,69,0.18)]'
                        : 'text-ink-700 hover:bg-sand-100'
                    }`
                  }
                >
                  <span className="mt-0.5 rounded-2xl bg-white/16 p-2 text-current">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="mt-1 block text-xs leading-5 text-current/72">
                      {description}
                    </span>
                  </span>
                </NavLink>
              ))}
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-forest-500/12 bg-sand-50 p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-forest-500/12 p-2 text-forest-500">
                  <BellSimpleRinging className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">Admin mode</p>
                  <p className="text-xs text-ink-600">
                    Protected route with elevated edit access.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto rounded-[1.6rem] border border-ink-900/6 bg-sand-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sea-500 text-sm font-semibold text-white">
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                  </p>
                  <p className="truncate text-xs text-ink-600">
                    {user?.email ?? 'admin@alphatrekkers.com'}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                fullWidth
                className="mt-4"
                leftIcon={<SignOut className="h-4 w-4" />}
                onClick={() => {
                  logout();
                  navigate('/admin/login', { replace: true });
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <header className="travel-panel rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-forest-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-forest-600">
                  <Sparkle className="h-3.5 w-3.5" weight="fill" />
                  Admin Workspace
                </div>
                <h2 className="mt-3 text-4xl font-bold text-ink-900">{currentMeta.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-ink-600">
                  {currentMeta.subtitle}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[26rem]">
                <div className="rounded-[1.4rem] border border-ink-900/6 bg-sand-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                    Today
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <CalendarBlank className="h-4 w-4 text-forest-500" />
                    {activeDate}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-ink-900/6 bg-sand-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                    Signed in as
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink-900">
                    {user?.role ?? 'ADMIN'} account
                  </p>
                  <p className="mt-1 text-xs text-ink-600">Theme preserved, layout expanded.</p>
                </div>
              </div>
            </div>
          </header>

          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
