import { useState } from 'react';
import type { TemplateMeta } from '../services/api';

interface HomeTemplatePreviewProps {
  template: TemplateMeta;
}

const lines = (widths: number[], className = 'bg-slate-200') => (
  <div className="space-y-1">
    {widths.map((width, index) => (
      <div key={index} className={`h-[2.5px] rounded-full ${className}`} style={{ width: `${width}%` }} />
    ))}
  </div>
);

function Minimal({ accent }: { accent: string }) {
  return (
    <div className="h-full bg-white p-5 text-slate-900">
      <header className="border-b-2 pb-3 text-center" style={{ borderColor: accent }}>
        <div className="text-[18px] font-black">JOHN CARTER</div>
        <div className="mt-1 text-[7px] font-bold" style={{ color: accent }}>SOFTWARE ENGINEER</div>
        <div className="mt-1.5 text-[5px] text-slate-500">Colombo, Sri Lanka · john@email.com · +94 77 123 4567</div>
      </header>
      {['Professional Summary', 'Work Experience', 'Education', 'Skills'].map((title, index) => (
        <section key={title} className="mt-4">
          <div className="border-b pb-1 text-[7px] font-black uppercase tracking-wide" style={{ color: accent, borderColor: `${accent}55` }}>{title}</div>
          <div className="mt-2">
            {index === 3 ? (
              <div className="flex flex-wrap gap-1">{['React', 'TypeScript', 'Node.js', 'MongoDB', 'Git'].map(s => <span key={s} className="rounded border px-1.5 py-0.5 text-[4.5px] font-semibold text-slate-600" style={{ borderColor: `${accent}45` }}>{s}</span>)}</div>
            ) : lines(index === 0 ? [94, 88, 76] : [95, 87, 72])}
          </div>
        </section>
      ))}
    </div>
  );
}

function Modern({ accent }: { accent: string }) {
  return (
    <div className="flex h-full bg-white text-slate-800">
      <aside className="w-[34%] p-4 text-white" style={{ backgroundColor: accent }}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-[13px] font-black">JC</div>
        <div className="mt-4 text-[6px] font-bold uppercase tracking-widest text-white/70">Contact</div>
        <div className="mt-2 space-y-1 text-[5px] text-white/90">john@email.com<br />+94 77 123 4567<br />Colombo, Sri Lanka</div>
        <div className="mt-5 text-[6px] font-bold uppercase tracking-widest text-white/70">Skills</div>
        <div className="mt-2 space-y-1.5">{['React', 'TypeScript', 'Node.js', 'MongoDB', 'Git'].map(s => <div key={s} className="text-[5px]">{s}<div className="mt-0.5 h-1 rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${60 + s.length * 5}%` }} /></div></div>)}</div>
      </aside>
      <main className="flex-1 p-5">
        <div className="border-b pb-3" style={{ borderColor: `${accent}35` }}>
          <div className="text-[18px] font-black tracking-tight">JOHN CARTER</div>
          <div className="mt-1 text-[7px] font-bold" style={{ color: accent }}>FULL STACK DEVELOPER</div>
        </div>
        {['Profile', 'Experience', 'Education'].map((title, i) => <section key={title} className="mt-4"><div className="text-[7px] font-black uppercase tracking-wider" style={{ color: accent }}>{title}</div><div className="mt-2">{lines(i === 0 ? [95, 90, 75] : [96, 88, 80])}</div></section>)}
      </main>
    </div>
  );
}

function Developer({ accent }: { accent: string }) {
  return (
    <div className="h-full bg-slate-950 p-5 font-mono text-white">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <div className="text-[17px] font-black">john_carter<span style={{ color: accent }}>()</span></div>
        <div className="mt-1 text-[6px] text-slate-400">Software Engineer · Full Stack Developer</div>
        <div className="mt-3 grid grid-cols-3 gap-1 text-[5px] text-slate-300"><span style={{ color: accent }}>React</span><span>Node.js</span><span>MongoDB</span></div>
      </div>
      {['// about', '// experience', '// projects', '// education'].map((title, i) => <section key={title} className="mt-4"><div className="text-[6px] font-bold" style={{ color: accent }}>{title}</div>{lines(i === 0 ? [92, 84, 68] : [95, 90, 76], 'bg-white/15')}</section>)}
    </div>
  );
}

function Student({ accent }: { accent: string }) {
  return (
    <div className="h-full bg-white p-5 text-slate-800">
      <div className="rounded-xl p-4 text-white" style={{ backgroundColor: accent }}>
        <div className="text-[17px] font-black">JOHN CARTER</div>
        <div className="mt-1 text-[6px] font-semibold text-white/80">BICT (HONS) · SOFTWARE ENGINEERING STUDENT</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {['Education', 'Projects', 'Certifications', 'Achievements'].map(title => <div key={title} className="rounded-lg border border-slate-200 p-2.5"><div className="text-[6.5px] font-black" style={{ color: accent }}>{title}</div><div className="mt-2">{lines([92, 78], 'bg-slate-200')}</div></div>)}
      </div>
      <section className="mt-4"><div className="text-[7px] font-black uppercase" style={{ color: accent }}>Technical Skills</div><div className="mt-2 flex flex-wrap gap-1">{['React', 'Python', 'Figma', 'Node.js', 'Git', 'AI/ML'].map(s => <span key={s} className="rounded-full px-2 py-1 text-[4.5px] font-bold" style={{ backgroundColor: `${accent}15`, color: accent }}>{s}</span>)}</div></section>
    </div>
  );
}

function Executive({ accent }: { accent: string }) {
  return (
    <div className="h-full bg-[#faf9f6] p-6 text-slate-900">
      <div className="border-b pb-4" style={{ borderColor: accent }}>
        <div className="text-center text-[19px] font-black tracking-[0.12em]">JOHN CARTER</div>
        <div className="mt-1 text-center text-[6px] font-bold uppercase tracking-[0.25em]" style={{ color: accent }}>Executive Software Leader</div>
        <div className="mt-2 text-center text-[5px] text-slate-500">Colombo · Sri Lanka · john@email.com</div>
      </div>
      {['Executive Profile', 'Leadership Experience', 'Education & Credentials'].map((title, i) => <section key={title} className="mt-5"><div className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} /><div className="text-[7px] font-black uppercase tracking-[0.16em]" style={{ color: accent }}>{title}</div></div><div className="mt-2 pl-3">{lines(i === 0 ? [95, 90, 78] : [94, 86, 72])}</div></section>)}
    </div>
  );
}

export function HomeTemplatePreview({ template }: HomeTemplatePreviewProps) {
  const slug = `${template.slug || template.id} ${template.category || ''} ${template.name || ''}`.toLowerCase();
  const accent = template.accent || '#4F46E5';
  const [previewFailed, setPreviewFailed] = useState(false);

  // Admin-created templates can provide their exact design as a preview URL.
  // When present, Home renders that exact selected template instead of
  // replacing it with one of the six hard-coded mock layouts.
  if (template.preview?.trim() && !previewFailed) {
    return (
      <div className="flex h-full w-full items-start justify-center bg-slate-100 p-2">
        <img
          src={template.preview.trim()}
          alt={`${template.name} CV template preview`}
          className="h-full w-full object-contain object-top"
          loading="lazy"
          onError={() => setPreviewFailed(true)}
        />
      </div>
    );
  }

  // Built-in templates keep their dedicated live previews when no usable
  // preview image was supplied.
  if (slug.includes('modern')) return <Modern accent={accent} />;
  if (slug.includes('software') || slug.includes('developer') || slug.includes('technical')) return <Developer accent={accent} />;
  if (slug.includes('student')) return <Student accent={accent} />;
  if (slug.includes('executive')) return <Executive accent={accent} />;
  if (slug.includes('professional')) return <Professional accent={accent} />;
  return <Minimal accent={accent} />;
}

function Professional({ accent }: { accent: string }) {
  return (
    <div className="h-full bg-white p-5 text-slate-800">
      <header className="flex items-end justify-between border-b-2 border-slate-800 pb-3">
        <div>
          <div className="font-serif text-[17px] font-black">MICHAEL HARRIS</div>
          <div className="mt-1 text-[6px] font-medium text-slate-500">SENIOR PROFESSIONAL</div>
        </div>
        <div className="text-right text-[4.5px] leading-4 text-slate-500">
          Sydney, Australia<br />email@email.com<br />+61 412 345 678
        </div>
      </header>
      {['Executive Summary', 'Professional Experience', 'Education', 'Core Competencies'].map((title, i) => (
        <section key={title} className="mt-4">
          <div className="font-serif text-[7px] font-black uppercase tracking-wide" style={{ color: accent }}>{title}</div>
          <div className="mt-2 text-[4.5px] leading-relaxed text-slate-600">
            Results-driven professional with a proven track record of delivering strategic initiatives and measurable outcomes.
          </div>
          {i > 0 && (
            <div className="mt-2 space-y-1">
              <div className="h-[2.5px] rounded-full bg-slate-200" />
              <div className="h-[2.5px] w-[92%] rounded-full bg-slate-200" />
              <div className="h-[2.5px] w-[78%] rounded-full bg-slate-200" />
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
