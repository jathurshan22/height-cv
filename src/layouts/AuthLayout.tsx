import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const [stats, setStats] = useState({ users: 0, cvs: 0, templates: 0 });

  useEffect(() => {
    let active = true;
    api.homeStats()
      .then((response) => {
        if (!active) return;
        setStats({
          users: response.stats?.users ?? 0,
          cvs: response.stats?.cvs ?? 0,
          templates: response.stats?.totalTemplates ?? 0,
        });
      })
      .catch(() => {
        // Keep the real-data stats at 0 if the API is temporarily unavailable.
      });
    return () => { active = false; };
  }, []);

  const authStats = [
    [String(stats.templates), 'Templates added'],
    [String(stats.cvs), 'CVs created'],
    [String(stats.users), 'Users'],
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface-page lg:grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
        <Logo light />
        <div className="relative z-10">
          <h2 className="font-display text-3xl font-bold leading-tight">
            Build an ATS-friendly CV<br />that gets noticed.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Create, optimize, and tailor your resume with AI. Join thousands of professionals landing their next role.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {authStats.map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-2xl font-bold">{n}</p>
                <p className="text-xs text-white/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} Height CV</p>
        <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm">
            <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
            <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
