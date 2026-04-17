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
    <section className="space-y-6">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Total messages', value: total, Icon: ChatCircleDots, cls: 'bg-sea-500/10 text-sea-600' },
          { label: 'Unread', value: unreadCount, Icon: Clock, cls: 'bg-gold-500/12 text-gold-700' },
          { label: 'Read', value: messages.filter((m) => m.isRead).length, Icon: CheckCircle, cls: 'bg-forest-500/10 text-forest-600' },
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-forest-500">
            Inbox
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Messages</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages…"
              className="h-10 w-52 rounded-full border border-ink-900/12 bg-white pl-9 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20 transition"
            />
          </div>
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as typeof filterRead)}
            className="h-10 rounded-full border border-ink-900/12 bg-white px-4 text-sm text-ink-700 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20 transition"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-sm text-ink-400">No messages found.</div>
          ) : (
            <table className="admin-table admin-table--compact admin-table--head-center w-full text-left text-sm">
              <thead className="bg-sand-50/95">
                <tr className="border-b border-ink-900/14">
                  <th className="w-6 px-2 py-3 text-center" />
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">From</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Subject</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Message</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Received</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((msg) => (
                  <tr key={msg.id} className={`group border-b border-ink-900/6 last:border-b-0 hover:bg-sand-50/60 transition-colors ${!msg.isRead ? 'bg-gold-500/3' : ''}`}>
                    <td className="pl-4 pr-1 py-3 w-6">
                      {!msg.isRead && <span className="block h-2 w-2 rounded-full bg-gold-500" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="mx-auto flex w-fit max-w-[240px] items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sea-500/10 text-xs font-bold text-sea-600">
                          {msg.name[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div className="min-w-0 max-w-[190px] text-left">
                          <p className={`truncate ${!msg.isRead ? 'font-bold text-ink-900' : 'font-semibold text-ink-800'}`}>{msg.name}</p>
                          <p className="truncate text-xs text-ink-400">{msg.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-ink-700">{msg.subject ?? '(no subject)'}</td>
                    <td className="px-4 py-3 text-center">
                      <p className="mx-auto max-w-[22rem] truncate text-ink-600">{msg.message}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-xs text-ink-500">{formatDate(msg.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelected(msg)}
                        className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-sea-500/10 hover:text-sea-600 transition"
                        title="Read message"
                      >
                        <EnvelopeSimple className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-ink-900/6 px-4 py-3">
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
                className="admin-action-button inline-flex items-center gap-2 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_28px_rgba(34,120,69,0.24)] transition"
              >
                <EnvelopeSimple className="h-4 w-4" /> Reply via email
              </a>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
