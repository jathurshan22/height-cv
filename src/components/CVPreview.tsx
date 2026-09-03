import type { CVData } from '../types';

interface CVPreviewProps {
  data: CVData;
}

function fmtDate(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  if (!y) return d;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return m ? `${months[+m - 1]} ${y}` : y;
}

export function CVPreview({ data }: CVPreviewProps) {
  const p = data.personalInfo;
  const accent = '#4F46E5';

  return (
    <div className="cv-page mx-auto p-[14mm] text-[10.5pt] leading-relaxed text-ink" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="border-b-2 pb-3" style={{ borderColor: accent }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          {p.fullName || 'Your Name'}
        </h1>
        <p className="text-sm font-medium" style={{ color: accent }}>
          {p.professionalTitle || 'Professional Title'}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9pt] text-ink-soft">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {p.location && <span>• {p.location}</span>}
          {p.linkedin && <span>• {p.linkedin}</span>}
          {p.github && <span>• {p.github}</span>}
          {p.portfolio && <span>• {p.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-[11pt] font-bold uppercase tracking-wide" style={{ color: accent }}>
            Professional Summary
          </h2>
          <p className="text-[10pt] leading-relaxed text-ink-soft">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.workExperience.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-2 text-[11pt] font-bold uppercase tracking-wide" style={{ color: accent }}>
            Work Experience
          </h2>
          <div className="space-y-3">
            {data.workExperience.map((w) => (
              <div key={w.id}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[10.5pt] font-semibold text-ink">{w.jobTitle || 'Job Title'}</h3>
                  <span className="text-[9pt] text-ink-muted">
                    {fmtDate(w.startDate)} — {w.current ? 'Present' : fmtDate(w.endDate)}
                  </span>
                </div>
                <p className="text-[9.5pt] font-medium text-ink-soft">
                  {w.company}{w.location ? ` · ${w.location}` : ''}
                </p>
                {w.description && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[9.5pt] text-ink-soft">
                    {w.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-2 text-[11pt] font-bold uppercase tracking-wide" style={{ color: accent }}>
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[10.5pt] font-semibold text-ink">{e.degree || 'Degree'}</h3>
                  <span className="text-[9pt] text-ink-muted">
                    {fmtDate(e.startDate)} — {fmtDate(e.endDate)}
                  </span>
                </div>
                <p className="text-[9.5pt] text-ink-soft">{e.institution}{e.location ? ` · ${e.location}` : ''}</p>
                {e.description && <p className="text-[9pt] text-ink-muted">{e.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-[11pt] font-bold uppercase tracking-wide" style={{ color: accent }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, i) => (
              <span key={i} className="rounded border px-1.5 py-0.5 text-[9pt] text-ink-soft" style={{ borderColor: '#E5E7EB' }}>
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-2 text-[11pt] font-bold uppercase tracking-wide" style={{ color: accent }}>
            Projects
          </h2>
          <div className="space-y-2">
            {data.projects.map((pr) => (
              <div key={pr.id}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[10.5pt] font-semibold text-ink">{pr.name || 'Project Name'}</h3>
                  {pr.link && <span className="text-[9pt] text-ink-muted">{pr.link}</span>}
                </div>
                {pr.technologies && <p className="text-[9pt] italic text-ink-muted">{pr.technologies}</p>}
                {pr.description && <p className="text-[9.5pt] text-ink-soft">{pr.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-[11pt] font-bold uppercase tracking-wide" style={{ color: accent }}>
            Certifications
          </h2>
          <ul className="space-y-1">
            {data.certifications.map((c) => (
              <li key={c.id} className="text-[9.5pt] text-ink-soft">
                <span className="font-medium text-ink">{c.name}</span> — {c.issuer}
                {c.date && <span className="text-ink-muted"> · {fmtDate(c.date)}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-[11pt] font-bold uppercase tracking-wide" style={{ color: accent }}>
            Languages
          </h2>
          <p className="text-[9.5pt] text-ink-soft">
            {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(' · ')}
          </p>
        </section>
      )}

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-[11pt] font-bold uppercase tracking-wide" style={{ color: accent }}>
            Achievements
          </h2>
          <ul className="list-disc space-y-0.5 pl-4 text-[9.5pt] text-ink-soft">
            {data.achievements.map((a) => (
              <li key={a.id}>
                <span className="font-medium text-ink">{a.title}</span>
                {a.description && ` — ${a.description}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* References */}
      {data.references.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-[11pt] font-bold uppercase tracking-wide" style={{ color: accent }}>
            References
          </h2>
          <div className="space-y-1">
            {data.references.map((r) => (
              <p key={r.id} className="text-[9.5pt] text-ink-soft">
                <span className="font-medium text-ink">{r.name}</span> — {r.relationship}
                {r.contact && ` · ${r.contact}`}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
