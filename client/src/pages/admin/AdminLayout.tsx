import { Outlet, NavLink } from 'react-router-dom';
import { ChartBar, Mountains, SuitcaseRolling } from '@phosphor-icons/react';

const links = [
  { to: '/admin', label: 'Dashboard', Icon: ChartBar },
  { to: '/admin/trips', label: 'Trips', Icon: Mountains },
  { to: '/admin/bookings', label: 'Bookings', Icon: SuitcaseRolling },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <aside className="lg:w-72">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
              Admin
            </p>
            <h1 className="mt-2 font-heading text-2xl font-bold text-stone-900">
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
                        ? 'bg-forest-600 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
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
