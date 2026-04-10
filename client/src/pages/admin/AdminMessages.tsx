import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChatCircleDots,
  CheckCircle,
  Clock,
  EnvelopeSimple,
  MagnifyingGlass,
  X,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import type { PaginatedResponse } from '@alpha-trekkers/shared';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function formatDate(v: string) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(v));
}

function getErrorMessage(error: unknown) {
  const e = error as { response?: { data?: { message?: string } } };
  return e.response?.data?.message ?? 'Request failed';
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="admin-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/40 px-4 py-8 backdrop-blur-sm">
      <div ref={ref} className="admin-modal-panel relative w-full max-w-xl rounded-[1.6rem] border border-white/80 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-ink-900/8 px-6 py-4">
          <h3 className="text-lg font-bold text-ink-900">{title}</h3>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-100 text-ink-500 hover:bg-sand-200 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [markingRead, setMarkingRead] = useState(false);

  const loadMessages = useCallback(async (pg = page) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page: pg, limit: 15 };
      if (filterRead === 'unread') params.isRead = false;
      if (filterRead === 'read') params.isRead = true;
      const res = await api.get<PaginatedResponse<{ messages: ContactMessage[] }>>('/admin/contact-messages', { params });
      setMessages(res.data.data.messages ?? []);
      setTotal(res.data.pagination?.total ?? 0);
      setTotalPages(res.data.pagination?.pages ?? 1);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [filterRead, page]);

  useEffect(() => { setPage(1); void loadMessages(1); }, [filterRead, loadMessages]);
  useEffect(() => { void loadMessages(page); }, [loadMessages, page]);

  const markRead = async (id: string) => {
    setMarkingRead(true);
    try {
      await api.put(`/admin/contact-messages/${id}`, { isRead: true });
      setMessages((cur) => cur.map((m) => m.id === id ? { ...m, isRead: true } : m));
      setSelected((cur) => cur?.id === id ? { ...cur, isRead: true } : cur);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setMarkingRead(false);
    }
  };

  const filtered = messages.filter((m) =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase()),
  );

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Total messages', value: total, Icon: ChatCircleDots, cls: 'bg-sea-500/10 text-sea-600' },
          { label: 'Unread', value: unreadCount, Icon: Clock, cls: 'bg-gold-500/12 text-gold-700' },
          { label: 'Read', value: messages.filter((m) => m.isRead).length, Icon: CheckCircle, cls: 'bg-forest-500/10 text-forest-600' },
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
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-400">Inbox</p>
            <h3 className="mt-0.5 text-xl font-extrabold text-ink-900">Messages</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages…"
                className="w-52 rounded-full border border-ink-900/10 bg-sand-50 py-2 pl-9 pr-4 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
              />
            </div>
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value as typeof filterRead)}
              className="rounded-full border border-ink-900/10 bg-sand-50 px-4 py-2 text-sm focus:outline-none"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16"><LoadingSpinner text="Loading messages…" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-900/6 bg-sand-50/60">
                  {['', 'FROM', 'SUBJECT', 'MESSAGE', 'RECEIVED', ''].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-14 text-center text-sm text-ink-400">No messages found.</td></tr>
                ) : filtered.map((msg) => (
                  <tr key={msg.id} className={`group transition-colors hover:bg-sand-50/60 ${!msg.isRead ? 'bg-gold-500/3' : ''}`}>
                    <td className="pl-5 pr-2 py-4 w-6">
                      {!msg.isRead && <span className="block h-2 w-2 rounded-full bg-gold-500" />}
                    </td>
                    <td className="px-5 py-4">
                      <div className="min-w-[10rem]">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sea-500/10 text-xs font-bold text-sea-600">
                            {msg.name[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <p className={`leading-tight ${!msg.isRead ? 'font-bold text-ink-900' : 'font-semibold text-ink-800'}`}>{msg.name}</p>
                            <p className="text-xs text-ink-500">{msg.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-ink-700 whitespace-nowrap">{msg.subject ?? '(no subject)'}</td>
                    <td className="px-5 py-4">
                      <p className="max-w-[22rem] truncate text-sm text-ink-600">{msg.message}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-ink-500">{formatDate(msg.createdAt)}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelected(msg)}
                        className="flex h-8 items-center gap-1.5 rounded-lg bg-sea-500/10 px-3 text-xs font-semibold text-sea-600 opacity-0 group-hover:opacity-100 hover:bg-sea-500/20 transition"
                      >
                        <EnvelopeSimple className="h-3.5 w-3.5" /> Read
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t border-ink-900/6 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button type="button" size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <Modal title={selected.subject ?? 'Message'} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-ink-900/6 bg-sand-50 px-4 py-3">
              <div>
                <p className="font-semibold text-ink-900">{selected.name}</p>
                <p className="text-sm text-ink-500">{selected.email}</p>
                {selected.phone && <p className="text-sm text-ink-500">{selected.phone}</p>}
              </div>
              {!selected.isRead && (
                <Button type="button" size="sm" variant="secondary" isLoading={markingRead} leftIcon={<CheckCircle className="h-3.5 w-3.5" />} onClick={() => void markRead(selected.id)}>
                  Mark read
                </Button>
              )}
              {selected.isRead && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-500/10 px-3 py-1 text-xs font-semibold text-forest-600">
                  <CheckCircle className="h-3.5 w-3.5" /> Read
                </span>
              )}
            </div>

            <div className="rounded-xl border border-ink-900/6 bg-sand-50 p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">Received</p>
              <p className="text-sm text-ink-600">{formatDate(selected.createdAt)}</p>
            </div>

            <div className="rounded-xl border border-ink-900/6 bg-sand-50 p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">Message</p>
              <p className="whitespace-pre-wrap text-sm leading-6 text-ink-700">{selected.message}</p>
            </div>

            <div className="flex justify-end gap-3 border-t border-ink-900/8 pt-4">
              <Button type="button" variant="secondary" onClick={() => setSelected(null)}>Close</Button>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? 'Your message'}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-500 to-forest-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_28px_rgba(34,120,69,0.24)] hover:from-forest-400 hover:to-forest-500 transition"
              >
                <EnvelopeSimple className="h-4 w-4" /> Reply via email
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
