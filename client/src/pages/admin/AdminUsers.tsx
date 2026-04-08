import { useEffect, useState } from 'react';
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

  const loadUsers = async (pg = page) => {
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
  };

  useEffect(() => { setPage(1); void loadUsers(1); }, [search]);
  useEffect(() => { void loadUsers(page); }, [page]);

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const guideCount = users.filter((u) => u.role === 'GUIDE').length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Total users', value: total, Icon: Users, cls: 'bg-sea-500/10 text-sea-600' },
          { label: 'Admins', value: adminCount, Icon: Shield, cls: 'bg-forest-500/10 text-forest-600' },
          { label: 'Guides', value: guideCount, Icon: User, cls: 'bg-gold-500/12 text-gold-700' },
        ].map(({ label, value, Icon, cls }) => (
          <div key={label} className="flex items-center gap-3 rounded-[1.4rem] border border-white/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
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

      {/* Table card */}
      <div className="rounded-[1.8rem] border border-white/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-3 border-b border-ink-900/8 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-400">User Directory</p>
            <h3 className="mt-0.5 text-xl font-extrabold text-ink-900">
              Users table
              {total > 0 && <span className="ml-2 text-sm font-normal text-ink-400">({total} total)</span>}
            </h3>
          </div>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="w-60 rounded-full border border-ink-900/10 bg-sand-50 py-2 pl-9 pr-4 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16"><LoadingSpinner text="Loading users…" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-900/6 bg-sand-50/60">
                  {['FACULTY', 'CONTACT', 'SPECIALIZATION', 'COURSE', 'BATCH', 'JOINED DATE', 'STATUS'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {users.length === 0 ? (
                  <tr><td colSpan={7} className="py-14 text-center text-sm text-ink-400">No users found.</td></tr>
                ) : users.map((user) => {
                  const roleCfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.USER;
                  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
                  return (
                    <tr key={user.id} className="hover:bg-sand-50/60 transition-colors">
                      {/* FACULTY = Name+Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[12rem]">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${user.role === 'ADMIN' ? 'bg-gradient-to-br from-forest-500 to-forest-600' : user.role === 'GUIDE' ? 'bg-gradient-to-br from-gold-500 to-coral-500' : 'bg-gradient-to-br from-sea-500 to-sea-600'}`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-ink-900 leading-tight">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-ink-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* CONTACT = phone */}
                      <td className="px-5 py-4 text-sm text-ink-600">{user.phone ?? 'No phone'}</td>
                      {/* SPECIALIZATION = role */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${roleCfg.cls}`}>
                          {roleCfg.label}
                        </span>
                      </td>
                      {/* COURSE = bookings */}
                      <td className="px-5 py-4 text-sm text-ink-600">
                        {(user._count?.bookings ?? 0) > 0 ? `${user._count?.bookings} bookings` : 'Not assigned'}
                      </td>
                      {/* BATCH = N/A for now */}
                      <td className="px-5 py-4 text-sm text-ink-400">No batch assigned</td>
                      {/* JOINED DATE */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full border border-ink-900/10 bg-sand-50 px-3 py-1 text-xs font-semibold text-ink-700">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                      {/* STATUS = email verified toggle-like */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${user.isEmailVerified ? 'bg-forest-500/10 text-forest-700' : 'bg-coral-500/10 text-coral-600'}`}>
                          <span className={`h-2 w-4 rounded-full relative inline-block ${user.isEmailVerified ? 'bg-forest-500' : 'bg-coral-400'}`}>
                            <span className={`absolute top-0.5 h-1 w-1 rounded-full bg-white transition-all ${user.isEmailVerified ? 'right-0.5' : 'left-0.5'}`} />
                          </span>
                          {user.isEmailVerified ? 'Active' : 'Unverified'}
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
          <div className="flex items-center justify-between border-t border-ink-900/6 px-6 py-4">
            <p className="text-sm text-ink-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button type="button" size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
