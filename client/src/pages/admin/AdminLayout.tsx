import { Outlet, NavLink } from 'react-router-dom';
import { ChartBar, Mountains, SuitcaseRolling } from '@phosphor-icons/react';

const links = [
  { to: '/admin', label: 'Dashboard', Icon: ChartBar },
  { to: '/admin/trips', label: 'Trips', Icon: Mountains },
  { to: '/admin/bookings', label: 'Bookings', Icon: SuitcaseRolling },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-sand-50 pt-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <aside className="lg:w-72">
          <div className="travel-panel rounded-[2rem] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-500">
              Admin
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-ink-900">
              Control Center
            </h1>
            <div className="mt-6 space-y-2">
              {links.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-forest-500 text-white'
                        : 'text-ink-700 hover:bg-sand-100'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
