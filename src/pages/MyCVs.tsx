import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Pencil,
  Download,
  Trash2,
  MoreVertical,
  ArrowUpRight,
  Clock3,

  Search,
} from 'lucide-react';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { CircularProgress } from '../components/ui/CircularProgress';
import { LoadingState, EmptyState } from '../components/ui/States';
import { cvService } from '../services/cvService';
import { useToast } from '../context/ToastContext';
import type { CVData } from '../types';

function timeAgo(iso: string) {
  const diff = Date.now() - +new Date(iso);
  const h = Math.floor(diff / 3600000);

  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;

  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function MyCVs() {
  const [cvs, setCVs] = useState<CVData[] | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    cvService.list().then(setCVs);
  }, []);

  const refresh = () => cvService.list().then(setCVs);

  const remove = async (id: string) => {
    await cvService.remove(id);
    setMenu(null);
    toast('CV deleted', 'info');
    refresh();
  };

  const create = async () => {
    const cv = await cvService.create();
    toast('New CV created', 'success');
    navigate(`/builder/${cv.id}`);
  };

  const filteredCVs =
    cvs?.filter((cv) =>
      cv.title.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <DashboardLayout
      title="My CVs"
      subtitle="Manage and optimize your professional resumes"
    >
      <div className="mx-auto max-w-[1450px] space-y-7">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[26px] border border-indigo-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-7">
          <div className="absolute -right-24 -top-28 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-60 w-60 rounded-full bg-violet-100/40 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              

              <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-950">
                My CVs
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Keep your resumes organized, updated, and ready for your next
                opportunity.
              </p>
            </div>

            <button
              onClick={create}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
              <PlusCircle className="h-4 w-4" />
              Create New CV
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>

        {!cvs ? (
          <LoadingState />
        ) : cvs.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="No CVs yet"
            description="Create your first professional CV and start applying."
            action={
              <Button variant="accent" onClick={create}>
                <PlusCircle className="h-4 w-4" />
                Create Your First CV
              </Button>
            }
          />
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                  Your documents
                </p>

                <h3 className="mt-1 font-display text-xl font-extrabold text-slate-950">
                  {cvs.length} {cvs.length === 1 ? 'CV' : 'CVs'}
                </h3>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your CVs..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            {/* CV Cards */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCVs.map((cv) => (
                <div
                  key={cv.id}
                  className="group relative overflow-visible rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_4px_22px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_15px_35px_rgba(15,23,42,0.09)]"
                >
                  {/* Card top */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenu(menu === cv.id ? null : cv.id)
                        }
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {menu === cv.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenu(null)}
                          />

                          <div className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_15px_40px_rgba(15,23,42,0.15)]">
                            <button
                              onClick={() =>
                                navigate(`/builder/${cv.id}`)
                              }
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit CV
                            </button>

                            <button
                              onClick={() => remove(cv.id)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mt-5">
                    <h3 className="truncate font-display text-lg font-bold text-slate-950">
                      {cv.title}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      Last edited {timeAgo(cv.updatedAt)}
                    </div>
                  </div>

                  <div className="my-5 h-px bg-slate-100" />

                  {/* ATS */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <CircularProgress
                        value={cv.atsScore}
                        size={72}
                        stroke={6}
                      />
                    </div>

                    <div>
                      <p className="font-display text-xl font-extrabold text-slate-950">
                        {cv.atsScore}
                        <span className="ml-1 text-sm font-semibold text-slate-400">
                          /100
                        </span>
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-slate-500">
                        ATS Compatibility
                      </p>

                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {cv.atsScore >= 80
                          ? 'Excellent'
                          : cv.atsScore >= 60
                            ? 'Good'
                            : 'Needs improvement'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
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
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Create Card */}
              <button
                onClick={create}
                className="group flex min-h-[285px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50/40"
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
              </button>
            </div>

            {filteredCVs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
                <Search className="mx-auto h-7 w-7 text-slate-300" />
                <p className="mt-3 font-semibold text-slate-700">
                  No CVs found
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Try searching with a different CV name.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}