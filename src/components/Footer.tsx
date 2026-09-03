import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Twitter, Github, Linkedin } from 'lucide-react';

const cols = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/#features' },
      { label: 'Templates', to: '/#templates' },
      { label: 'ATS Analyzer', to: '/#ats' },
      { label: 'Pricing', to: '/#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/' },
      { label: 'Blog', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Contact', to: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', to: '/' },
      { label: 'CV Guide', to: '/' },
      { label: 'ATS Tips', to: '/' },
      { label: 'Privacy', to: '/' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-ink-muted">
              Build. Optimize. Get Hired. The all-in-one platform for ATS-friendly CVs that get noticed.
            </p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-muted transition hover:border-accent hover:text-accent"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-ink">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-ink-muted transition hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-ink-muted">© {new Date().getFullYear()} Height CV. All rights reserved.</p>
          <p className="text-xs text-ink-muted">Build. Optimize. Get Hired.</p>
        </div>
      </div>
    </footer>
  );
}
