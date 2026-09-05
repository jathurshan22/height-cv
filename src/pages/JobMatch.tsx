import { useEffect, useState } from 'react';
import {
  Target,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  BriefcaseBusiness,
} from 'lucide-react';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/States';

import { cvService } from '../services/cvService';
import { jobMatchService } from '../services/jobMatchService';

import type { CVData, JobMatchResult } from '../types';

export function JobMatch() {
  const [cvs, setCVs] = useState<CVData[] | null>(null);
  const [selected, setSelected] = useState('');
  const [jd, setJd] = useState('');
  const [result, setResult] =
    useState<JobMatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cvService.list().then((list) => {
      setCVs(list);

      if (list[0]) {
        setSelected(list[0].id);
      }
    });
  }, []);

  const run = async () => {
    const cv = cvs?.find(
      (item) => item.id === selected
    );

    if (!cv || !jd.trim()) return;

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const response =
        await jobMatchService.analyze(cv, jd);

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze this job description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Job Match"
      subtitle="Compare your CV against any job description"
    >
      <div className="mx-auto max-w-[1400px] space-y-7">

        <section className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white p-7 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-violet-100/50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
             

              <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Match your CV to a{' '}
                <span className="text-indigo-600">
                  job
                </span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Paste a job description and discover your
                matching skills, missing keywords, and
                improvement opportunities.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
              <Target className="h-7 w-7" />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[430px_minmax(0,1fr)]">

          <section className="h-fit rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_5px_25px_rgba(15,23,42,0.04)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                <BriefcaseBusiness className="h-4 w-4" />
              </div>

              <div>
                <h2 className="font-display font-bold text-slate-950">
                  Job Details
                </h2>

                <p className="text-xs text-slate-500">
                  Add your CV and target job
                </p>
              </div>
            </div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Select your CV
            </label>

            <Select
              ariaLabel="Select your CV"
              value={selected}
              onChange={setSelected}
              placeholder="Choose a CV"
              options={(cvs ?? []).map((cv) => ({
                value: cv.id,
                label: cv.title,
              }))}
            />

            <div className="my-5 h-px bg-slate-100" />

            <Textarea
              label="Job Description"
              value={jd}
              onChange={(e) =>
                setJd(e.target.value)
              }
              placeholder="Paste the full job description here..."
              className="min-h-[280px]"
            />

            <Button
              variant="accent"
              className="mt-4 w-full"
              onClick={run}
              loading={loading}
              disabled={!jd.trim() || !selected}
            >
              <Target className="h-4 w-4" />
              Analyze Match
              <ArrowRight className="h-4 w-4" />
            </Button>
          </section>

          <main>
            {loading ? (
              <div className="flex min-h-[540px] flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-slate-950">
                  Analyzing your match
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Comparing your CV with the job requirements...
                </p>
              </div>
            ) : error ? (
              <div className="flex min-h-[540px] flex-col items-center justify-center rounded-[24px] border border-red-200 bg-white p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><AlertTriangle className="h-6 w-6" /></div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-950">Match analysis failed</h3>
                <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>
                <Button variant="accent" size="sm" className="mt-5" onClick={run}>Try Again</Button>
              </div>
            ) : !result ? (
              <div className="flex min-h-[540px] items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white">
                <EmptyState
                  icon={<Target className="h-6 w-6" />}
                  title="Ready to match"
                  description="Paste a job description and run the analysis to discover your compatibility."
                />
              </div>
            ) : (
              <div className="space-y-5">

                <section className="relative overflow-hidden rounded-[24px] bg-slate-950 p-7 text-white shadow-[0_15px_40px_rgba(15,23,42,0.12)]">
                  <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-indigo-600/30 blur-3xl" />

                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">
                        Compatibility
                      </p>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-200">
                        {result.analysisMode === 'ai' ? 'AI Analysis' : 'Local Fallback'}
                      </span>
                    </div>
                    <p className="hidden">Compatibility</p>
                      

                      <h2 className="mt-2 font-display text-2xl font-extrabold text-white">
                        Job Match Score
                      </h2>

                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                        Your CV matches approximately{' '}
                        <span className="font-bold text-white">
                          {result.matchScore}%
                        </span>{' '}
                        of the requirements identified in
                        this job.
                      </p>
                    </div>

                    <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
                      <span className="font-display text-4xl font-extrabold">
                        {result.matchScore}%
                      </span>

                      <span className="text-xs font-medium text-slate-400">
                        Match
                      </span>
                    </div>
                  </div>
                </section>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ['Skills', result.matchedSkills.length, result.missingSkills.length],
                    ['Experience', result.experienceMatch ?? 0, null],
                    ['Education', result.educationMatch ?? 0, null],
                    ['Projects & Responsibilities', Math.round(((result.projectMatch ?? 0) + (result.responsibilityMatch ?? 0)) / 2), null],
                  ].map(([label, value, missing]) => (
                    <section key={String(label)} className="rounded-[20px] border border-slate-200 bg-white p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                      <p className="mt-2 font-display text-2xl font-extrabold text-slate-950">
                        {label === 'Skills' ? `${value}/${Number(value) + Number(missing ?? 0)}` : `${value}%`}
                      </p>
                    </section>
                  ))}
                </div>

                {(result.matchedResponsibilities?.length || result.missingResponsibilities?.length) ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <section className="rounded-[24px] border border-emerald-100 bg-white p-6">
                      <h3 className="font-display font-bold text-slate-950">Matched Responsibilities</h3>
                      <ul className="mt-4 space-y-2 text-sm text-slate-600">
                        {(result.matchedResponsibilities ?? []).map((item) => <li key={item} className="rounded-xl bg-emerald-50 p-3">{item}</li>)}
                      </ul>
                    </section>
                    <section className="rounded-[24px] border border-amber-100 bg-white p-6">
                      <h3 className="font-display font-bold text-slate-950">Missing Responsibilities</h3>
                      <ul className="mt-4 space-y-2 text-sm text-slate-600">
                        {(result.missingResponsibilities ?? []).map((item) => <li key={item} className="rounded-xl bg-amber-50 p-3">{item}</li>)}
                      </ul>
                    </section>
                  </div>
                ) : null}

                <div className="grid gap-5 md:grid-cols-2">

                  <section className="rounded-[24px] border border-emerald-100 bg-white p-6">
                    <h3 className="flex items-center gap-2 font-display font-bold text-slate-950">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      Matched Skills
                    </h3>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {result.matchedSkills.length > 0 ? (
                        result.matchedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No direct matches found.
                        </p>
                      )}
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-amber-100 bg-white p-6">
                    <h3 className="flex items-center gap-2 font-display font-bold text-slate-950">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                      Missing Skills
                    </h3>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {result.missingSkills.length > 0 ? (
                        result.missingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600 ring-1 ring-amber-100"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No missing skills — great match!
                        </p>
                      )}
                    </div>
                  </section>
                </div>

                {result.recommendedSkills.length > 0 && (
                  <section className="rounded-[24px] border border-indigo-100 bg-white p-6">
                    <h3 className="flex items-center gap-2 font-display font-bold text-slate-950">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      Recommended Skills
                    </h3>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {result.recommendedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 ring-1 ring-indigo-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                <section className="rounded-[24px] border border-slate-200 bg-white p-6">
                  <h3 className="flex items-center gap-2 font-display font-bold text-slate-950">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Lightbulb className="h-4 w-4" />
                    </span>
                    AI Recommendations
                  </h3>

                  <ul className="mt-5 space-y-3">
                    {result.recommendations.map((recommendation) => (
                      <li
                        key={recommendation}
                        className="flex gap-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        {recommendation}
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