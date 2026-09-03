import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanSearch,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Loader2,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Input';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/States';

import { cvService } from '../services/cvService';
import { atsService } from '../services/atsService';

import type { CVData, ATSAnalysis } from '../types';

export function ATSAnalyzer() {
  const [cvs, setCVs] = useState<CVData[] | null>(null);
  const [selected, setSelected] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    cvService.list().then((list) => {
      setCVs(list);
      if (list[0]) setSelected(list[0].id);
    });
  }, []);

  const run = async () => {
    const cv = cvs?.find((c) => c.id === selected);
    if (!cv) return;

    setLoading(true);
    setAnalysis(null);
    setError('');

    try {
      const res = await atsService.analyze(cv, jobDescription);
      setAnalysis(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze this CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const breakdown = analysis
    ? [
        { label: 'Formatting', value: analysis.breakdown.formatting },
        { label: 'Keywords', value: analysis.breakdown.keywords },
        { label: 'Skills', value: analysis.breakdown.skills },
        { label: 'Experience', value: analysis.breakdown.experience },
        { label: 'Education', value: analysis.breakdown.education },
        { label: 'Sections', value: analysis.breakdown.sections },
      ]
    : [];

  return (
    <DashboardLayout
      title="ATS Analyzer"
      subtitle="Optimize your CV for applicant tracking systems"
    >
      <div className="mx-auto max-w-[1400px] space-y-7">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] bg-slate-950 p-7 shadow-[0_15px_40px_rgba(15,23,42,0.12)] sm:p-8">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
            

              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Is your CV{' '}
                <span className="text-indigo-300">ATS-ready?</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Analyze formatting, keywords, skills and content to discover
                exactly where your CV can improve.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-indigo-300 ring-1 ring-white/10">
              <ScanSearch className="h-7 w-7" />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">

          {/* Selector */}
          <aside className="h-fit rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_5px_25px_rgba(15,23,42,0.04)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText className="h-4 w-4" />
              </div>

              <div>
                <h2 className="font-display font-bold text-slate-950">
                  Select CV
                </h2>
                <p className="text-xs text-slate-500">
                  Choose a resume to analyze
                </p>
              </div>
            </div>

            {!cvs || cvs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center">
                <FileText className="mx-auto h-7 w-7 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No CVs available
                </p>
                <Button
                  variant="accent"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/create-cv')}
                >
                  Create CV
                </Button>
              </div>
            ) : (
              <>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Your CV
                </label>

                <Select
                  ariaLabel="Your CV"
                  value={selected}
                  onChange={setSelected}
                  placeholder="Choose a CV"
                  options={cvs.map((c) => ({
                    value: c.id,
                    label: c.title,
                  }))}
                />

                <Textarea
                  label="Target Job Description (optional)"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description for a more tailored ATS analysis..."
                  className="mt-4 min-h-[140px]"
                />

                <button
                  onClick={run}
                  disabled={!selected || loading}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ScanSearch className="h-4 w-4" />
                      Analyze CV
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </>
            )}

            
          </aside>

          {/* Results */}
          <main>
            {loading ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-slate-950">
                  Analyzing your CV
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Checking keywords, skills, structure and formatting...
                </p>
              </div>
            ) : error ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center rounded-[24px] border border-red-200 bg-white p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><AlertTriangle className="h-6 w-6" /></div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-950">Analysis failed</h3>
                <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>
                <Button variant="accent" size="sm" className="mt-5" onClick={run}>Try Again</Button>
              </div>
            ) : !analysis ? (
              <div className="flex min-h-[480px] items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white">
                <EmptyState
                  icon={<ScanSearch className="h-6 w-6" />}
                  title="Ready to analyze"
                  description="Select a CV and run the analyzer to see your ATS score and recommendations."
                />
              </div>
            ) : (
              <div className="space-y-5">

                {/* Score */}
                <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_5px_25px_rgba(15,23,42,0.04)] sm:p-7">
                  <div className="flex flex-col gap-7 md:flex-row md:items-center">
                    <div className="flex flex-col items-center">
                      <CircularProgress
                        value={analysis.score}
                        size={155}
                        stroke={8}
                      />

                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {analysis.score >= 80
                          ? 'Excellent'
                          : analysis.score >= 60
                            ? 'Good'
                            : 'Needs Work'}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                          Overall performance
                        </p>
                        <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
                          {analysis.analysisMode === 'ai' ? 'AI Analysis' : 'Local Fallback'}
                        </span>
                      </div>
                      {/* removed legacy label */}
                      <p className="hidden">
                        Overall performance
                      </p>

                      <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-950">
                        Your ATS Score
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Your CV currently scores {analysis.score}/100. Review
                        the breakdown below to improve your chances of passing
                        automated screening.
                      </p>

                      <div className="mt-6 space-y-3">
                        {breakdown.map((b) => (
                          <ProgressBar
                            key={b.label}
                            value={b.value}
                            label={b.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Strengths */}
                <div className="grid gap-5 md:grid-cols-2">
                  <section className="rounded-[24px] border border-emerald-100 bg-white p-6 shadow-[0_5px_25px_rgba(15,23,42,0.04)]">
                    <h3 className="flex items-center gap-2 font-display font-bold text-slate-950">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      Strengths
                    </h3>

                    <ul className="mt-5 space-y-3">
                      {analysis.strengths.map((s) => (
                        <li
                          key={s}
                          className="flex gap-3 rounded-xl bg-emerald-50/50 p-3 text-sm text-slate-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-[24px] border border-amber-100 bg-white p-6 shadow-[0_5px_25px_rgba(15,23,42,0.04)]">
                    <h3 className="flex items-center gap-2 font-display font-bold text-slate-950">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                      Improvements
                    </h3>

                    <ul className="mt-5 space-y-3">
                      {analysis.improvements.map((s) => (
                        <li
                          key={s}
                          className="flex gap-3 rounded-xl bg-amber-50/50 p-3 text-sm text-slate-600"
                        >
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Keywords */}
                <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_5px_25px_rgba(15,23,42,0.04)]">
                  <h3 className="flex items-center gap-2 font-display font-bold text-slate-950">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    Missing Keywords & Suggestions
                  </h3>

                  {analysis.missingKeywords.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((k) => (
                        <span
                          key={k}
                          className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600 ring-1 ring-amber-100"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="mt-5 space-y-3">
                    {analysis.suggestions.map((s) => (
                      <li
                        key={s}
                        className="flex gap-3 rounded-xl bg-slate-50 p-3 text-sm leading-5 text-slate-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}