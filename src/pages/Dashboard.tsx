import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  PlusCircle,
  ScanSearch,
  Send,
  MoreVertical,
  Pencil,
  Eye,
  Download,
  FilePlus2,
  TrendingUp,
  ArrowUpRight,
  Target,

  Clock3,
  ChevronRight,
} from 'lucide-react';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { CircularProgress } from '../components/ui/CircularProgress';
import { LoadingState, EmptyState } from '../components/ui/States';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { cvService } from '../services/cvService';
import type { CVData } from '../types';

function calculateCVCompletion(cv: CVData): number {
  const personal = cv.personalInfo || ({} as CVData['personalInfo']);
  const checks = [
    Boolean(personal.fullName),
    Boolean(personal.professionalTitle),
    Boolean(personal.email),
    Boolean(cv.summary),
    cv.workExperience?.length > 0,
    cv.education?.length > 0,
    cv.skills?.length > 0,
    cv.projects?.length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function timeAgo(iso: string) {
  const diff = Date.now() - +new Date(iso);
  const h = Math.floor(diff / 3600000);

  if (h < 1) return 'Just now';

  if (h < 24) {
    return `${h} hour${h > 1 ? 's' : ''} ago`;
  }

  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? 's' : ''} ago`;
}

const statCards = [
  {
    key: 'cvs',
    label: 'CVs Created',
    icon: FileText,
    suffix: '',
    accent: 'text-indigo-600',
    bg: 'bg-indigo-50',
    value: (cvs: CVData[]) => cvs.length,
  },
  {
    key: 'ats',
    label: 'Avg ATS Score',
    icon: ScanSearch,
    suffix: '%',
    accent: 'text-emerald-600',
    bg: 'bg-emerald-50',
    value: (cvs: CVData[]) =>
      cvs.length
        ? Math.round(
            cvs.reduce((a, c) => a + c.atsScore, 0) / cvs.length
          )
        : 0,
  },
  {
    key: 'apps',
    label: 'Applications',
    icon: Send,
    suffix: '',
    accent: 'text-orange-500',
    bg: 'bg-orange-50',
    value: () => 0,
  },
  {
    key: 'profile',
    label: 'Profile Completion',
    icon: TrendingUp,
    suffix: '%',
    accent: 'text-violet-600',
    bg: 'bg-violet-50',
    value: (cvs: CVData[]) =>
      cvs.length ? calculateCVCompletion(cvs[0]) : 0,
  },
];

export function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [cvs, setCVs] = useState<CVData[] | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoadError(false);

    cvService.list()
      .then((data) => {
        if (mounted) setCVs(data);
      })
      .catch(() => {
        if (mounted) {
          setCVs([]);
          setLoadError(true);
        }
      });

    return () => { mounted = false; };
  }, []);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening';

  const createNew = async () => {
    const cv = await cvService.create();
    toast('New CV created', 'success');
    navigate(`/builder/${cv.id}`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1500px] space-y-8">

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white px-6 py-7 shadow-[0_8px_40px_rgba(15,23,42,0.06)] sm:px-8 sm:py-8"
        >
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-100/50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              

              <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                {greeting},{' '}
                <span className="text-indigo-600">
                  {user?.name?.split(' ')[0] || 'there'}
                </span>
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Build stronger CVs, improve your ATS score, and get closer to
                your next opportunity.
              </p>
            </div>

            <button
              onClick={createNew}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
              <PlusCircle className="h-4 w-4" />
              Create New CV
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="group rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bg} ${stat.accent}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-indigo-500" />
              </div>

              <div className="mt-5">
                <p className="font-display text-3xl font-extrabold tracking-tight text-slate-950">
                  {cvs ? stat.value(cvs) : '—'}
                  {stat.suffix}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* CV Header */}
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Your documents
              </p>

              <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-950">
                My CVs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage and improve your professional CVs.
              </p>
            </div>

            <Link
              to="/my-cvs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {!cvs ? (
            <LoadingState label="Loading your CVs…" />
          ) : loadError ? (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title="Could not load your CVs"
              description="Please check your connection and try again."
              action={
                <Button variant="accent" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              }
            />
          ) : cvs.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title="No CVs yet"
              description="Create your first professional CV and start applying."
              action={
                <Button variant="accent" onClick={createNew}>
                  <FilePlus2 className="h-4 w-4" />
                  Create Your First CV
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

              {cvs.map((cv, index) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className="group relative overflow-visible rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_15px_35px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpen(
                            menuOpen === cv.id ? null : cv.id
                          )
                        }
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {menuOpen === cv.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenuOpen(null)}
                          />

                          <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_15px_40px_rgba(15,23,42,0.15)]">
                            <button
                              onClick={() =>
                                navigate(`/builder/${cv.id}`)
                              }
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit CV
                            </button>

                            <button
                              onClick={() =>
                                navigate(`/builder/${cv.id}`)
                              }
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </button>

                            <button
                              onClick={() =>
                                navigate(`/builder/${cv.id}?download=1`)
                              }
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </button>

                            <button
                              onClick={async () => {
                                await cvService.remove(cv.id);

                                setCVs(
                                  (current) =>
                                    current?.filter(
                                      (item) => item.id !== cv.id
                                    ) || null
                                );

                                setMenuOpen(null);
                                toast('CV deleted', 'info');
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="truncate font-display text-lg font-bold text-slate-950">
                      {cv.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      Last edited {timeAgo(cv.updatedAt)}
                    </div>
                  </div>

                  <div className="my-5 h-px bg-slate-100" />

                  <div className="flex items-center gap-4">
                    <CircularProgress
                      value={cv.atsScore}
                      size={62}
                      stroke={6}
                      label=""
                    />

                    <div>
                      <p className="font-display text-lg font-extrabold text-slate-950">
                        {cv.atsScore}
                        <span className="ml-1 text-sm font-semibold text-slate-400">
                          /100
                        </span>
                      </p>

                      <p className="text-xs font-medium text-slate-500">
                        ATS Compatibility
                      </p>

                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Good score
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/builder/${cv.id}`)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit CV
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/builder/${cv.id}?download=1`)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      aria-label="Download CV"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* New CV Card */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: cvs.length * 0.07 }}
                onClick={createNew}
                className="group flex min-h-[250px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200 transition group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600">
                  <PlusCircle className="h-6 w-6" />
                </div>

                <p className="mt-4 font-display text-base font-bold text-slate-950">
                  Create New CV
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Start with a professional template
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                  Get started
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </motion.button>
            </div>
          )}
        </section>

        {/* AI Banner */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[26px] bg-slate-950 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.12)] sm:p-7"
        >
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-60 w-60 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
             

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">
                  AI Career Assistant
                </p>

                <h3 className="mt-1 font-display text-xl font-extrabold text-white">
                  Make your CV more competitive
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                  Analyze your CV, identify missing keywords, and get practical
                  improvements for better ATS performance.
                </p>
              </div>
            </div>

            <Link
              to="/ats-analyzer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50"
            >
              <ScanSearch className="h-4 w-4" />
              Analyze CV
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Shortcuts
            </p>

            <h2 className="mt-1 font-display text-xl font-extrabold text-slate-950">
              Quick Actions
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              to="/ats-analyzer"
              className="group flex items-center justify-between rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ScanSearch className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-slate-950">
                    Run ATS Analysis
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Check your CV score
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
            </Link>

            <Link
              to="/job-match"
              className="group flex items-center justify-between rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Target className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-slate-950">
                    Match a Job
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Tailor your CV to a role
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
            </Link>

            <Link
              to="/templates"
              className="group flex items-center justify-between rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-slate-950">
                    Browse Templates
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Find a professional design
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500" />
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}