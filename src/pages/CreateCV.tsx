import { useEffect, useState } from 'react';

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  FileText,
  LayoutTemplate,
  Search,
 
  X,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { useTemplates } from '../hooks/useTemplates';
import type { TemplateMeta } from '../services/api';
import { useToast } from '../context/ToastContext';
import { cvService } from '../services/cvService';

type TemplateItem = TemplateMeta;

function TemplatePreview({
  template,
  large = false,
}: {
  template: TemplateItem;
  large?: boolean;
}) {
  const id = template.id;

  /* MINIMAL ATS */
  if (id === 'minimal') {
    return (
      <div
        className={`bg-white text-slate-900 ${
          large ? 'min-h-[1050px] p-10' : 'h-full p-5'
        }`}
      >
        <div
          className={`text-center ${
            large ? 'border-b pb-7' : 'border-b pb-4'
          }`}
          style={{ borderColor: '#d1d5db' }}
        >
          <div
            className={`font-black tracking-tight text-slate-950 ${
              large ? 'text-4xl' : 'text-[13px]'
            }`}
          >
            MICHAEL HARRIS
          </div>

          <div
            className={`font-bold text-slate-800 ${
              large ? 'mt-3 text-base' : 'mt-1.5 text-[7px]'
            }`}
          >
            Digital Marketing | SEO | SEM | Content Marketing
          </div>

          <div
            className={`text-slate-600 ${
              large ? 'mt-3 text-xs' : 'mt-1.5 text-[5px]'
            }`}
          >
            Sydney, Australia | michael.harris@email.com |
            +61 412 345 678 | linkedin.com/in/michaelharris
          </div>
        </div>

        {[
          'PROFESSIONAL SUMMARY',
          'WORK EXPERIENCE',
          'EDUCATION',
          'SKILLS',
          'CERTIFICATIONS',
        ].map((section, index) => (
          <div
            key={section}
            className={large ? 'mt-7' : 'mt-4'}
          >
            <div
              className={`border-b border-slate-400 font-black ${
                large ? 'pb-2 text-xl' : 'pb-1 text-[7px]'
              }`}
            >
              {section}
            </div>

            {section === 'WORK EXPERIENCE' ? (
              <div
                className={`space-y-3 ${
                  large ? 'mt-3 text-xs' : 'mt-1.5 text-[5px]'
                }`}
              >
                <div>
                  <div className="flex justify-between font-bold">
                    <span>Marketing Manager</span>
                    <span>January 2022 – Present</span>
                  </div>

                  <div className="mt-1 font-semibold">
                    XYZ Corporation, Sydney, NSW
                  </div>

                  <div className="mt-2 space-y-1.5 text-slate-600">
                    <div>• Led a team of 5 across multiple platforms.</div>
                    <div>• Increased website traffic by 35%.</div>
                    <div>• Managed marketing budgets and ROI.</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold">
                    <span>Digital Marketing Specialist</span>
                    <span>2018 – 2021</span>
                  </div>

                  <div className="mt-2 space-y-1.5 text-slate-600">
                    <div>• Developed SEO and SEM strategies.</div>
                    <div>• Improved qualified leads by 20%.</div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`leading-relaxed text-slate-600 ${
                  large ? 'mt-3 text-xs' : 'mt-1.5 text-[5px]'
                }`}
              >
                {index === 0 &&
                  'Results-oriented professional with proven experience delivering measurable results and building strong business outcomes.'}

                {index === 2 &&
                  'Bachelor of Marketing — University of Sydney'}

                {index === 3 &&
                  'Digital Marketing, SEO, Analytics, Strategy, Communication, Leadership'}

                {index === 4 &&
                  'Google Analytics Certified, HubSpot Certification'}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  /* MODERN */
  if (id === 'modern') {
    return (
      <div
        className={`flex bg-white text-slate-800 ${
          large ? 'min-h-[1050px]' : 'h-full'
        }`}
      >
        <aside
          className={`w-[32%] bg-slate-950 text-white ${
            large ? 'p-7' : 'p-3'
          }`}
        >
          <div
            className={`mx-auto flex items-center justify-center rounded-full bg-indigo-600 font-black ${
              large
                ? 'h-20 w-20 text-2xl'
                : 'h-9 w-9 text-[8px]'
            }`}
          >
            MH
          </div>

          <div className={large ? 'mt-8' : 'mt-4'}>
            <div
              className={`font-black uppercase tracking-widest ${
                large ? 'text-xs' : 'text-[5px]'
              }`}
            >
              Contact
            </div>

            <div
              className={`mt-2 leading-5 text-slate-300 ${
                large ? 'text-[9px]' : 'text-[4px]'
              }`}
            >
              Sydney, Australia
              <br />
              michael@email.com
              <br />
              +61 412 345 678
              <br />
              linkedin.com
            </div>
          </div>

          <div className={large ? 'mt-8' : 'mt-4'}>
            <div
              className={`font-black uppercase tracking-widest ${
                large ? 'text-xs' : 'text-[5px]'
              }`}
            >
              Skills
            </div>

            <div
              className={`mt-2 space-y-1.5 text-slate-300 ${
                large ? 'text-[9px]' : 'text-[4px]'
              }`}
            >
              <div>React</div>
              <div>TypeScript</div>
              <div>Node.js</div>
              <div>UI/UX</div>
              <div>Leadership</div>
            </div>
          </div>
        </aside>

        <main className={`flex-1 ${large ? 'p-8' : 'p-4'}`}>
          <div
            className={`font-black text-slate-950 ${
              large ? 'text-3xl' : 'text-[14px]'
            }`}
          >
            MICHAEL HARRIS
          </div>

          <div
            className={`font-semibold text-indigo-600 ${
              large ? 'mt-2 text-sm' : 'mt-1 text-[6px]'
            }`}
          >
            Senior Software Engineer
          </div>

          {[
            'Professional Summary',
            'Experience',
            'Education',
            'Projects',
          ].map((section) => (
            <div
              key={section}
              className={large ? 'mt-8' : 'mt-4'}
            >
              <div
                className={`font-black uppercase tracking-wide ${
                  large ? 'text-xs' : 'text-[6px]'
                }`}
              >
                {section}
              </div>

              <div
                className={`mt-3 space-y-2 ${
                  large ? 'text-[9px]' : 'text-[4px]'
                }`}
              >
                <div className="font-bold">
                  Senior Software Engineer
                </div>

                <div className="text-slate-500">
                  Built scalable products and delivered
                  measurable business impact.
                </div>

                <div className="h-1 rounded bg-slate-100" />
                <div className="h-1 w-[90%] rounded bg-slate-100" />
                <div className="h-1 w-[78%] rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  /* SOFTWARE ENGINEER */
  if (id === 'software-engineer') {
    return (
      <div
        className={`bg-white ${
          large ? 'min-h-[1050px] p-9' : 'h-full p-5'
        }`}
      >
        <div
          className="border-l-4 pl-4"
          style={{ borderColor: template.accent }}
        >
          <div
            className={`font-black text-slate-950 ${
              large ? 'text-3xl' : 'text-[13px]'
            }`}
          >
            JOHN CARTER
          </div>

          <div
            className={`font-bold ${
              large ? 'mt-1 text-sm' : 'mt-0.5 text-[6px]'
            }`}
            style={{ color: template.accent }}
          >
            SOFTWARE ENGINEER
          </div>

          <div
            className={`mt-2 text-slate-500 ${
              large ? 'text-[9px]' : 'text-[4px]'
            }`}
          >
            React · TypeScript · Node.js · AWS · Docker
          </div>
        </div>

        {[
          'PROFILE',
          'TECHNICAL SKILLS',
          'EXPERIENCE',
          'PROJECTS',
          'EDUCATION',
        ].map((section) => (
          <div
            key={section}
            className={large ? 'mt-7' : 'mt-4'}
          >
            <div
              className={`font-black tracking-wide ${
                large ? 'text-xs' : 'text-[6px]'
              }`}
              style={{ color: template.accent }}
            >
              {section}
            </div>

            <div
              className={`mt-2 space-y-1.5 ${
                large ? 'text-[9px]' : 'text-[4px]'
              }`}
            >
              <div className="font-bold">
                Software Engineer
              </div>

              <div className="text-slate-500">
                Developed scalable web applications,
                APIs and modern cloud solutions.
              </div>

              <div className="h-1 rounded bg-slate-100" />
              <div className="h-1 w-[90%] rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* STUDENT */
  if (id === 'student') {
    return (
      <div
        className={`bg-white ${
          large ? 'min-h-[1050px] p-9' : 'h-full p-5'
        }`}
      >
        <div
          className={`rounded-2xl bg-emerald-50 ${
            large ? 'p-6' : 'p-3'
          }`}
        >
          <div
            className={`font-black text-slate-950 ${
              large ? 'text-3xl' : 'text-[13px]'
            }`}
          >
            JATHURSHAN YOGESWAREN
          </div>

          <div
            className={`font-semibold text-emerald-600 ${
              large ? 'mt-2 text-sm' : 'mt-1 text-[6px]'
            }`}
          >
            ICT STUDENT · FULL STACK DEVELOPER
          </div>

          <div
            className={`mt-2 text-slate-500 ${
              large ? 'text-[9px]' : 'text-[4px]'
            }`}
          >
            Sri Lanka · email@example.com · GitHub · LinkedIn
          </div>
        </div>

        {[
          'PROFILE',
          'EDUCATION',
          'PROJECTS',
          'TECHNICAL SKILLS',
          'CERTIFICATIONS',
        ].map((section) => (
          <div
            key={section}
            className={large ? 'mt-7' : 'mt-4'}
          >
            <div
              className={`border-b border-emerald-200 pb-1 font-black ${
                large ? 'text-xs' : 'text-[6px]'
              }`}
            >
              {section}
            </div>

            <div
              className={`mt-2 leading-relaxed text-slate-600 ${
                large ? 'text-[9px]' : 'text-[4px]'
              }`}
            >
              <strong className="text-slate-900">
                Bachelor of Information and Communication
                Technology
              </strong>

              <br />

              Rajarata University of Sri Lanka

              <br />

              Projects, technical skills and academic
              achievements.
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* PROFESSIONAL / EXECUTIVE */
  return (
    <div
      className={`bg-white text-slate-800 ${
        large ? 'min-h-[1050px] p-10' : 'h-full p-5'
      }`}
    >
      <div className="border-b-2 border-slate-800 pb-5">
        <div
          className={`font-serif font-black ${
            large ? 'text-3xl' : 'text-[14px]'
          }`}
        >
          MICHAEL HARRIS
        </div>

        <div
          className={`mt-2 text-slate-500 ${
            large ? 'text-sm' : 'text-[6px]'
          }`}
        >
          Senior Professional
        </div>
      </div>

      {[
        'EXECUTIVE SUMMARY',
        'PROFESSIONAL EXPERIENCE',
        'EDUCATION',
        'CORE COMPETENCIES',
        'CERTIFICATIONS',
      ].map((section) => (
        <div
          key={section}
          className={large ? 'mt-8' : 'mt-4'}
        >
          <div
            className={`font-serif font-black ${
              large ? 'text-sm' : 'text-[7px]'
            }`}
          >
            {section}
          </div>

          <div
            className={`mt-3 text-slate-600 ${
              large ? 'text-[9px]' : 'text-[4px]'
            }`}
          >
            Results-driven professional with a proven
            record of delivering strategic initiatives and
            measurable business outcomes.

            <div className="mt-2 space-y-1.5">
              <div className="h-1 rounded bg-slate-100" />
              <div className="h-1 w-[90%] rounded bg-slate-100" />
              <div className="h-1 w-[80%] rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CreateCV() {
  const navigate = useNavigate();
  const toast = useToast();
  const { templates, loading } = useTemplates('featured');

  const [title, setTitle] = useState('Software Engineer CV');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('minimal');
  const [previewTemplate, setPreviewTemplate] =
    useState<TemplateItem | null>(null);
  const [creating, setCreating] = useState(false);

  // Default the selection to the first template once they load.
  useEffect(() => {
    if (templates.length && !templates.some((t) => t.id === selectedId)) {
      setSelectedId(templates[0].id);
    }
  }, [templates, selectedId]);

  const selectedTemplate: TemplateItem =
    templates.find((template) => template.id === selectedId) ??
    templates[0] ?? {
      id: selectedId,
      name: 'Loading…',
      description: '',
      accent: '#4F46E5',
    };

  const filteredTemplates = templates.filter((template) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query)
    );
  });

  const createCV = async () => {
    if (!selectedTemplate) return;

    setCreating(true);

    try {
      const cv = await cvService.create();

      await cvService.update({
        ...cv,
        title: title.trim() || 'Untitled CV',
        template: selectedTemplate.id,
      });

      toast('CV created — opening builder', 'success');

      navigate(`/builder/${cv.id}`);
    } catch (error) {
      console.error('Create CV error:', error);

      toast(
        'Unable to create your CV. Please try again.',
        'error',
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout
      title="Create CV"
      subtitle="Start with a professional template and customize it"
    >
      <div className="mx-auto max-w-[1500px] space-y-7">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.06)]">

          <div className="absolute -right-32 -top-36 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />

          <div className="relative p-7 sm:p-9">

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div>
               
                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Create your
                  <span className="text-indigo-600">
                    {' '}professional CV.
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Choose a professionally designed template,
                  give your CV a name, and start building your
                  career profile.
                </p>
              </div>

              <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-[26px] bg-indigo-50 text-indigo-600 lg:flex">
                <FileText className="h-10 w-10" />
              </div>

            </div>
          </div>
        </section>

        {/* DOCUMENT NAME */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div className="flex-1">

              <label className="mb-2 block text-xs font-extrabold text-slate-700">
                CV Name
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Software Engineer CV"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

              <p className="mt-2 text-[11px] text-slate-400">
                This name is only used to identify your CV in
                your dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
              <LayoutTemplate className="h-4 w-4 text-indigo-600" />

              <span className="text-xs font-bold text-slate-600">
                {templates.length} templates available
              </span>
            </div>

          </div>
        </section>

        {/* TEMPLATE HEADER */}
        <section>

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-indigo-600">
                Step 1
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Choose a template
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Pick a layout that matches your career and
                target role.
              </p>
            </div>

            <div className="relative sm:w-72">

              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search templates..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
              />

            </div>
          </div>

          {/* TEMPLATE GRID */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {filteredTemplates.map((template) => {
              const selected =
                selectedId === template.id;

              return (
                <article
                  key={template.id}
                  className={`group overflow-hidden rounded-[26px] border bg-white transition-all duration-300 ${
                    selected
                      ? 'border-indigo-500 shadow-[0_15px_45px_rgba(79,70,229,0.15)] ring-2 ring-indigo-100'
                      : 'border-slate-200 shadow-[0_6px_25px_rgba(15,23,42,0.045)] hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]'
                  }`}
                >

                  {/* PREVIEW */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 p-5 sm:p-7">

                    <div className="absolute left-4 top-4 z-20">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-2.5 py-1.5 text-[9px] font-extrabold text-emerald-600 shadow-sm">
                        <Check className="h-3 w-3" />
                        ATS Friendly
                      </span>
                    </div>

                    {selected && (
                      <div className="absolute right-4 top-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
                        <Check className="h-4 w-4" />
                      </div>
                    )}

                    <div className="h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition-transform duration-500 group-hover:scale-[1.025]">
                      <TemplatePreview
                        template={template}
                      />
                    </div>

                    {/* ACTIONS */}
                    <div className="absolute inset-x-5 bottom-5 z-30 flex translate-y-3 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-7">

                      <button
                        type="button"
                        onClick={() =>
                          setPreviewTemplate(template)
                        }
                        className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white bg-white text-xs font-extrabold text-slate-800 shadow-xl"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedId(template.id)
                        }
                        className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-extrabold text-white shadow-xl hover:bg-indigo-600"
                      >
                        <Check className="h-4 w-4" />
                        Select
                      </button>

                    </div>
                  </div>

                  {/* INFO */}
                  <div className="border-t border-slate-100 p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h3 className="text-base font-extrabold text-slate-950">
                          {template.name}
                        </h3>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                          {template.description}
                        </p>
                      </div>

                      <span
                        className="mt-1 h-4 w-4 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            template.accent,
                        }}
                      />

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                        <Check className="h-3 w-3" />
                        ATS
                      </span>

                      {selected ? (
                        <span className="text-xs font-extrabold text-indigo-600">
                          Selected
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedId(template.id)
                          }
                          className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700"
                        >
                          Select Template
                        </button>
                      )}

                    </div>
                  </div>

                </article>
              );
            })}

          </div>
        </section>

        {/* SELECTED TEMPLATE + CREATE */}
        {selectedTemplate && (
          <section className="sticky bottom-4 z-40 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_15px_45px_rgba(15,23,42,0.12)] backdrop-blur sm:p-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-3">

                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
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
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Selected Template
                  </p>

                  <h3 className="text-sm font-black text-slate-950">
                    {selectedTemplate.name}
                  </h3>
                </div>

              </div>

              <Button
                variant="accent"
                disabled={creating}
                onClick={createCV}
                className="h-11 rounded-xl px-6"
              >
                {creating
                  ? 'Creating CV...'
                  : 'Create CV & Continue'}
                {!creating && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>

            </div>
          </section>
        )}
      </div>

      {/* FULL TEMPLATE PREVIEW */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm sm:p-6">

          <div className="flex h-full max-h-[95vh] w-full max-w-[1050px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4">

              <div className="flex items-center gap-3">

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      `${previewTemplate.accent}12`,
                  }}
                >
                  <LayoutTemplate
                    className="h-5 w-5"
                    style={{
                      color: previewTemplate.accent,
                    }}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-indigo-600">
                    Template Preview
                  </p>

                  <h2 className="text-lg font-black text-slate-950">
                    {previewTemplate.name}
                  </h2>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            {/* CV */}
            <div className="flex-1 overflow-auto bg-slate-200 p-4 sm:p-8">

              <div className="mx-auto w-full max-w-[800px] overflow-hidden rounded-lg bg-white shadow-2xl">

                <TemplatePreview
                  template={previewTemplate}
                  large
                />

              </div>

            </div>

            {/* FOOTER */}
            <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-bold text-slate-950">
                  {previewTemplate.name}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  {previewTemplate.description}
                </p>
              </div>

              <Button
                variant="accent"
                onClick={() => {
                  setSelectedId(previewTemplate.id);
                  setPreviewTemplate(null);
                }}
                className="rounded-xl"
              >
                Select This Template
                <Check className="h-4 w-4" />
              </Button>

            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}