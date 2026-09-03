import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy,
  Search,
  ChevronDown,
  Send,
  Mail,
  MessageSquare,
  BookOpen,
  Sparkles,
  Bug,
  UserCog,
  FileText,
  CreditCard,
  HelpCircle,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Headphones,
  Zap,
} from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { LoadingState, EmptyState } from '../components/ui/States';
import { useToast } from '../context/ToastContext';
import { supportService } from '../services/supportService';
import type { Faq, SupportTicket, TicketCategory } from '../services/api';

const categories: {
  value: TicketCategory;
  label: string;
  icon: typeof UserCog;
}[] = [
  { value: 'account', label: 'Account', icon: UserCog },
  { value: 'cv', label: 'CV & Builder', icon: FileText },
  { value: 'ai', label: 'AI tools', icon: Sparkles },
  { value: 'billing', label: 'Billing', icon: CreditCard },
  { value: 'bug', label: 'Report a bug', icon: Bug },
  { value: 'other', label: 'Something else', icon: HelpCircle },
];

const statusMeta: Record<
  SupportTicket['status'],
  { label: string; className: string; icon: typeof Clock }
> = {
  open: {
    label: 'Open',
    className: 'bg-amber-50 text-amber-700 border border-amber-100',
    icon: Clock,
  },
  in_progress: {
    label: 'In progress',
    className: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    icon: Loader2,
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    icon: CheckCircle2,
  },
};

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function HelpSupport() {
  const toast = useToast();

  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('account');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [faqRes, ticketRes] = await Promise.all([
          supportService.listFaqs(),
          supportService.myTickets(),
        ]);
        if (!active) return;
        setFaqs(faqRes.faqs);
        setTickets(ticketRes.tickets);
      } catch (err) {
        toast(
          err instanceof Error ? err.message : 'Could not load help content',
          'error',
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [toast]);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q),
    );
  }, [faqs, query]);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast('Add a subject and a message first', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { ticket } = await supportService.createTicket(
        subject.trim(),
        category,
        message.trim(),
      );
      setTickets((prev) => [ticket, ...prev]);
      setSubject('');
      setMessage('');
      setCategory('account');
      toast('Your request has been sent to our team', 'success');
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Could not send your request',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Help & Support"
      subtitle="Find answers or reach out to the Height CV team"
    >
      <div className="mx-auto max-w-[1500px] space-y-7 pb-8">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-white px-6 py-8 shadow-[0_8px_40px_rgba(15,23,42,0.06)] sm:px-8 lg:px-10 lg:py-10"
        >
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-100/60 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                <LifeBuoy className="h-3.5 w-3.5" />
                HEIGHT CV SUPPORT
              </div>

              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-[42px] lg:leading-[1.1]">
                How can we help you today?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Search common questions, check your support requests, or send our team a message whenever you need help.
              </p>

              <div className="relative mt-6 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search ATS score, password, CV builder..."
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 shadow-[0_6px_24px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            <div className="hidden min-w-[270px] rounded-[26px] border border-white/80 bg-white/80 p-5 shadow-[0_12px_40px_rgba(99,102,241,0.10)] backdrop-blur lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Need direct help?</p>
                  <p className="text-xs text-slate-500">Our support team is here.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Zap className="h-4 w-4 text-indigo-600" /> Quick ticket submission
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" /> Secure account support
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Request status tracking
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {loading ? (
          <LoadingState label="Loading help centre…" />
        ) : (
          <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-7">
              <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_8px_34px_rgba(15,23,42,0.05)] sm:p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-950">Frequently asked questions</h3>
                        <p className="text-xs text-slate-500">Quick answers to common Height CV questions.</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'}
                  </span>
                </div>

                {filteredFaqs.length === 0 ? (
                  <EmptyState
                    icon={<Search className="h-6 w-6" />}
                    title="No results found"
                    description="Try a different search, or send us a message and we'll help directly."
                  />
                ) : (
                  <div className="space-y-3">
                    {filteredFaqs.map((faq) => {
                      const isOpen = openId === faq.id;
                      return (
                        <div
                          key={faq.id}
                          className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                            isOpen
                              ? 'border-indigo-200 bg-indigo-50/40 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-indigo-100 hover:bg-slate-50/70'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : faq.id)}
                            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                            aria-expanded={isOpen}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-slate-900 sm:text-[15px]">
                                {faq.question}
                              </span>
                              <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                                {faq.category}
                              </span>
                            </span>
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p className="border-t border-indigo-100 px-4 py-4 text-sm leading-6 text-slate-600 sm:px-5">
                                  {faq.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_8px_34px_rgba(15,23,42,0.05)] sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-950">Your support requests</h3>
                      <p className="text-xs text-slate-500">Track replies and request status here.</p>
                    </div>
                  </div>
                  {tickets.length > 0 && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                      {tickets.length}
                    </span>
                  )}
                </div>

                {tickets.length === 0 ? (
                  <EmptyState
                    icon={<MessageSquare className="h-6 w-6" />}
                    title="No requests yet"
                    description="When you contact support, your conversations show up here."
                  />
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => {
                      const meta = statusMeta[ticket.status];
                      const StatusIcon = meta.icon;
                      return (
                        <div key={ticket.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-indigo-100 hover:bg-white">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900">{ticket.subject}</p>
                              <p className="mt-1 text-xs font-medium text-slate-400">
                                {formatDate(ticket.createdAt)} · {ticket.category}
                              </p>
                            </div>
                            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${meta.className}`}>
                              <StatusIcon className={`h-3.5 w-3.5 ${ticket.status === 'in_progress' ? 'animate-spin' : ''}`} />
                              {meta.label}
                            </span>
                          </div>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{ticket.message}</p>
                          {ticket.reply && (
                            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5">
                              <p className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Reply from Height CV
                              </p>
                              <p className="mt-1.5 text-sm leading-6 text-slate-600">{ticket.reply}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <aside className="xl:col-span-1">
              <div className="space-y-5 xl:sticky xl:top-24">
                <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_8px_34px_rgba(15,23,42,0.05)]">
                  <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                        <Send className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-950">Contact support</h3>
                        <p className="mt-0.5 text-xs text-slate-500">Tell us what you need help with.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 p-5 sm:p-6">
                    <Input
                      label="Subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief summary of your question"
                    />

                    <div>
                      <span className="label">Category</span>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((c) => {
                          const Icon = c.icon;
                          const active = category === c.value;
                          return (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => setCategory(c.value)}
                              className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all ${
                                active
                                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                              }`}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              {c.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Textarea
                      label="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your question or issue in detail…"
                      rows={5}
                    />

                    <Button
                      variant="accent"
                      className="h-12 w-full rounded-xl shadow-lg shadow-indigo-600/15"
                      loading={submitting}
                      onClick={handleSubmit}
                    >
                      {!submitting && <Send className="h-4 w-4" />}
                      Send message
                    </Button>

                    <p className="flex items-start gap-2 text-[11px] leading-5 text-slate-400">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                      Your request is securely sent to the Height CV support team.
                    </p>
                  </div>
                </section>

                <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900">Prefer email?</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Reach us directly and we’ll reply to your inbox.</p>
                    </div>
                  </div>

                  <a
                    href="mailto:support@heightcv.app"
                    className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-bold text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    <span className="truncate">support@heightcv.app</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </a>
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> Typical reply time: 1–2 business days
                  </p>
                </section>
              </div>
            </aside>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
