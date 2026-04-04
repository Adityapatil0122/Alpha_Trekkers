import { useEffect, useState } from 'react';
import { CurrencyInr, Mountains, SuitcaseRolling, Users } from '@phosphor-icons/react';
import type { ApiResponse } from '@alpha-trekkers/shared';
import api from '@/lib/axios';

interface DashboardStats {
  totalUsers: number;
  totalTrips: number;
  totalBookings: number;
  totalRevenue: number;
  unreadMessages: number;
}

const emptyStats: DashboardStats = {
  totalUsers: 0,
  totalTrips: 0,
  totalBookings: 0,
  totalRevenue: 0,
  unreadMessages: 0,
};

const statCards = [
  { key: 'totalUsers', label: 'Users', Icon: Users },
  { key: 'totalTrips', label: 'Active Trips', Icon: Mountains },
  { key: 'totalBookings', label: 'Bookings', Icon: SuitcaseRolling },
  { key: 'totalRevenue', label: 'Revenue', Icon: CurrencyInr },
] as const;

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);

  useEffect(() => {
    api
      .get<ApiResponse<{ stats: DashboardStats }>>('/admin/dashboard')
      .then((res) => setStats(res.data.data.stats))
      .catch(() => setStats(emptyStats));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold text-stone-900">Dashboard</h2>
        <p className="mt-2 text-sm text-stone-500">
          Snapshot of platform activity and admin workload.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, Icon }) => (
          <div key={key} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-stone-500">{label}</p>
              <Icon className="h-5 w-5 text-forest-600" />
            </div>
            <p className="mt-4 font-heading text-3xl font-bold text-stone-900">
              {key === 'totalRevenue'
                ? `INR ${Math.round(stats[key]).toLocaleString('en-IN')}`
                : stats[key].toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Unread contact messages: {stats.unreadMessages.toLocaleString('en-IN')}
      </div>
    </div>
  );
}
