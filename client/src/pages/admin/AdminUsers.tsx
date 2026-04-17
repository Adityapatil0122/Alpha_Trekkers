import { useCallback, useEffect, useState } from 'react';
import {
  MagnifyingGlass,
  Shield,
  User,
  Users,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import type { PaginatedResponse } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN' | 'GUIDE';
  isEmailVerified: boolean;
  createdAt: string;
  _count?: { bookings: number };
}

function formatDate(v: string) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(v));
}

function getErrorMessage(error: unknown) {
  const e = error as { response?: { data?: { message?: string } } };
  return e.response?.data?.message ?? 'Request failed';
}

const ROLE_CONFIG: Record<string, { label: string; cls: string }> = {
  USER:  { label: 'Trekker', cls: 'bg-sea-500/10 text-sea-600' },
  ADMIN: { label: 'Admin',   cls: 'bg-forest-500/10 text-forest-600' },
  GUIDE: { label: 'Guide',   cls: 'bg-gold-500/12 text-gold-700' },
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadUsers = useCallback(async (pg = page) => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse<{ users: UserRow[] }>>('/admin/users', {
        params: { page: pg, limit: 15, search: search || undefined },
      });
      setUsers(res.data.data.users ?? []);
      setTotal(res.data.pagination?.total ?? 0);
      setTotalPages(res.data.pagination?.pages ?? 1);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { setPage(1); void loadUsers(1); }, [loadUsers, search]);
  useEffect(() => { void loadUsers(page); }, [loadUsers, page]);

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const guideCount = users.filter((u) => u.role === 'GUIDE').length;

  return (
    <section className="space-y-6">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Total users', value: total, Icon: Users, cls: 'bg-forest-500/10 text-forest-600' },
          { label: 'Admins', value: adminCount, Icon: Shield, cls: 'bg-forest-500/10 text-forest-600' },
          { label: 'Guides', value: guideCount, Icon: User, cls: 'bg-gold-500/12 text-gold-700' },
        ].map(({ label, value, Icon, cls }) => (
          <div key={label} className="admin-card flex items-center gap-3 rounded-xl p-4">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cls}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-extrabold text-ink-900">{value}</p>
              <p className="text-xs text-ink-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Users
            {total > 0 && <span className="ml-2 text-base font-normal text-ink-400">({total})</span>}
          </h1>
        </div>
        <div className="relative w-full sm:w-auto">
          <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="h-10 w-full rounded-full border border-ink-900/12 bg-white pl-9 pr-4 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20 sm:w-60"
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden rounded-xl">
        <div className="admin-table-scroll overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-sm text-ink-400">No users found.</div>
          ) : (
            <table className="admin-table admin-table--compact admin-table--head-center min-w-[760px] w-full text-left text-sm">
              <thead className="bg-sand-50/95">
                <tr className="border-b border-ink-900/14">
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">No.</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">User</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Contact</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Role</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Bookings</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Joined</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const roleCfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.USER;
                  const rowNumber = (page - 1) * 15 + index + 1;
                  return (
                    <tr key={user.id} className="border-b border-ink-900/6 last:border-b-0 hover:bg-sand-50/60 transition-colors">
                      <td className="px-4 py-3 text-center font-semibold text-ink-500">{rowNumber}</td>
                      <td className="px-4 py-3">
                        <div className="mx-auto min-w-0 max-w-[190px] text-center">
                          <p className="truncate font-semibold text-ink-900">{user.firstName} {user.lastName}</p>
                          <p className="truncate text-xs text-ink-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-ink-600">{user.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${roleCfg.cls}`}>
                          {roleCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-ink-600">
                        {(user._count?.bookings ?? 0) > 0 ? `${user._count?.bookings}` : '0'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-xs text-ink-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${user.isEmailVerified ? 'bg-forest-500/10 text-forest-600' : 'bg-coral-500/10 text-coral-600'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${user.isEmailVerified ? 'bg-forest-500' : 'bg-coral-500'}`} />
                          {user.isEmailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t border-ink-900/6 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-500">Page {page} of {totalPages}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" size="sm" variant="secondary" className="w-full sm:w-auto" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button type="button" size="sm" variant="secondary" className="w-full sm:w-auto" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
