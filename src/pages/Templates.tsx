import { useMemo, useState } from 'react';

import {
  ArrowUpRight,
  Check,
  Eye,
  FileText,
  LayoutTemplate,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { useTemplates } from '../hooks/useTemplates';
import type { TemplateMeta } from '../services/api';
import { useToast } from '../context/ToastContext';
import { cvService } from '../services/cvService';
import { TemplatePaper } from '../components/TemplatePaper';

type TemplateItem = TemplateMeta;

export function Templates() {
  const toast = useToast();
  const navigate = useNavigate();
  const { templates, loading } = useTemplates('all');

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateItem | null>(null);

  const filters = [
    'All',
    'ATS Friendly',
    'Modern',
    'Professional',
  ];

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return templates.filter((template) => {
      const name = template.name.toLowerCase();
      const description = template.description.toLowerCase();

      const searchMatch =
        !query ||
        name.includes(query) ||
        description.includes(query);

      let filterMatch = true;

      if (activeFilter === 'ATS Friendly') {
        filterMatch =
          name.includes('ats') ||
          description.includes('ats');
      }

      if (activeFilter === 'Modern') {
        filterMatch =
          name.includes('modern') ||
          description.includes('modern');
      }

      if (activeFilter === 'Professional') {
        filterMatch =
          name.includes('professional') ||
          description.includes('professional') ||
          name.includes('executive');
      }

      return searchMatch && filterMatch;
    });
  }, [templates, search, activeFilter]);

  const applyTemplate = async (templateId: string) => {
    try {
      const cv = await cvService.create();

      await cvService.update({
        ...cv,
        template: templateId,
      });

      setSelectedTemplate(null);

      toast('Template applied — opening builder', 'success');

      navigate(`/builder/${cv.id}`);
    } catch (error) {
      console.error(error);

      toast(
        'Unable to apply template. Please try again.',
        'error',
      );
    }
  };

  const resetFilters = () => {
    setSearch('');
    setActiveFilter('All');
  };


  return (
    <DashboardLayout
      title="Templates"
      subtitle="Choose a professional design for your next CV"
    >
      <div className="mx-auto max-w-[1500px] space-y-7">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.06)]">

          <div className="absolute -right-32 -top-36 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />

          <div className="relative flex flex-col gap-8 p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between">

            <div>
              

              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Choose a CV that
                <span className="text-indigo-600">
                  {' '}looks professional.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                Select a professionally designed template.
                Every layout is optimized for readability,
                recruiters and ATS systems.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  'ATS Optimized',
                  'Recruiter Friendly',
                  'Fully Customizable',
                ].map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600"
                  >
                    <Check className="h-4 w-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-[28px] border border-indigo-100 bg-indigo-50 lg:flex">
              <LayoutTemplate className="h-12 w-12 text-indigo-600" />
            </div>
          </div>
        </section>

        {/* TOOLBAR */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-indigo-600">
                Template Library
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-950">
                {filteredTemplates.length} Templates
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative sm:w-80">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div className="flex overflow-x-auto rounded-xl bg-slate-100 p-1">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-bold transition ${
                      activeFilter === filter
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* REAL TEMPLATE CARDS */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            Loading templates…
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {filteredTemplates.map((template) => (
              <article
                key={template.id}
                className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_6px_25px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]"
              >

                {/* ACTUAL CV PREVIEW */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 p-5 sm:p-7">

                  <div className="absolute left-4 top-4 z-20">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-2.5 py-1.5 text-[9px] font-extrabold text-emerald-600 shadow-sm">
                      <Check className="h-3 w-3" />
                      ATS Friendly
                    </span>
                  </div>

                  <div className="absolute right-4 top-4 z-20">
                    <span
                      className="block h-5 w-5 rounded-full border-4 border-white shadow-sm"
                      style={{
                        backgroundColor: template.accent,
                      }}
                    />
                  </div>

                  <div className="cv-thumb h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_15px_35px_rgba(15,23,42,0.13)] transition-transform duration-500 group-hover:scale-[1.025]">
                    <TemplatePaper template={template} />
                  </div>

                  {/* ACTIONS */}
                  <div className="absolute inset-x-5 bottom-5 z-30 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-7">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTemplate(template)
                      }
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-800 shadow-xl hover:bg-slate-50"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        applyTemplate(template.id)
                      }
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-extrabold text-white shadow-xl hover:bg-indigo-600"
                    >
                      Use Template
                      <ArrowUpRight className="h-4 w-4" />
                    </button>

                  </div>
                </div>

                {/* INFO */}
                <div className="border-t border-slate-100 p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-slate-950">
                        {template.name}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                        {template.description}
                      </p>
                    </div>

                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor:
                          `${template.accent}12`,
                      }}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{
                          backgroundColor:
                            template.accent,
                        }}
                      />
                    </div>

                  </div>

                  <div className="mt-4 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                        <Check className="h-3 w-3" />
                        ATS
                      </span>

                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">
                        Professional
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        applyTemplate(template.id)
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-700"
                    >
                      Start
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>

                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Search className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 text-base font-extrabold text-slate-900">
              No templates found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search or category.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-600"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* FEATURES */}
        <section className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Check className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-extrabold text-slate-950">
              ATS Optimized
            </h3>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Clean structures designed for reliable ATS
              parsing and recruiter readability.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-extrabold text-slate-950">
              Real CV Designs
            </h3>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Preview the actual structure and visual style
              before choosing a template.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-extrabold text-slate-950">
              Fully Customizable
            </h3>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Pick a design and customize your content in the
              CV builder.
            </p>
          </div>

        </section>
      </div>

      {/* FULL PREVIEW MODAL */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm sm:p-6">

          <div className="flex h-full max-h-[95vh] w-full max-w-[1050px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4">

              <div className="flex items-center gap-3">

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      `${selectedTemplate.accent}12`,
                  }}
                >
                  <LayoutTemplate
                    className="h-5 w-5"
                    style={{
                      color: selectedTemplate.accent,
                    }}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-indigo-600">
                    Template Preview
                  </p>

                  <h2 className="text-lg font-black text-slate-950">
                    {selectedTemplate.name}
                  </h2>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            {/* REAL LARGE CV */}
            <div className="flex-1 overflow-auto bg-slate-200 p-4 sm:p-8">

              <div className="cv-thumb mx-auto w-full max-w-[800px] overflow-hidden rounded-lg bg-white shadow-2xl">

                <TemplatePaper
                  template={selectedTemplate}
                  large
                />

              </div>
            </div>

            {/* FOOTER */}
            <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">

                <span
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor:
                      selectedTemplate.accent,
                  }}
                />

                <span className="text-xs font-semibold text-slate-500">
                  {selectedTemplate.description}
                </span>

              </div>

              <Button
                variant="accent"
                onClick={() =>
                  applyTemplate(selectedTemplate.id)
                }
                className="rounded-xl"
              >
                Use This Template
                <ArrowUpRight className="h-4 w-4" />
              </Button>

            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}