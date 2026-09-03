import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LayoutTemplate,
  ScanSearch,
  Target,
  Settings,
  LifeBuoy,
  LogOut,
  X,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';

import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const mainNav = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/my-cvs',
    label: 'My CVs',
    icon: FileText,
  },
  {
    to: '/create-cv',
    label: 'Create CV',
    icon: PlusCircle,
  },
  {
    to: '/templates',
    label: 'Templates',
    icon: LayoutTemplate,
  },
  {
    to: '/ats-analyzer',
    label: 'ATS Analyzer',
    icon: ScanSearch,
  },
  {
    to: '/job-match',
    label: 'Job Match',
    icon: Target,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const {
    user,
    logout,
  } = useAuth();

  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    toast(
      'Signed out successfully',
      'info'
    );

    navigate('/');
  };

  const initials = (
    user?.name || 'U'
  )
    .split(' ')
    .map((name) => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Mobile overlay */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-300 lg:translate-x-0 ${
          open
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        {/* Header */}

        <div className="flex h-[70px] items-center justify-between border-b border-line px-5">
          <Logo />

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-subtle lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">

          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Menu
          </p>

          <ul className="space-y-1">
            {mainNav.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <li
                    key={item.to}
                  >
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      className={({
                        isActive,
                      }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-accent-soft text-accent shadow-sm'
                            : 'text-ink-soft hover:bg-surface-subtle hover:text-ink'
                        }`
                      }
                    >
                      <Icon className="h-[18px] w-[18px]" />

                      {item.label}
                    </NavLink>
                  </li>
                );
              }
            )}
          </ul>

          {/* Administration */}

          {user?.role ===
            'admin' && (
            <div className="mt-6 border-t border-line pt-4">

              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Administration
              </p>

              <NavLink
                to="/admin"
                onClick={onClose}
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-accent-soft text-accent'
                      : 'text-ink-soft hover:bg-surface-subtle hover:text-ink'
                  }`
                }
              >
                <ShieldCheck className="h-[18px] w-[18px]" />

                Admin Dashboard
              </NavLink>

            </div>
          )}

          {/* Support */}

          <div className="mt-6 border-t border-line pt-4">

            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Support
            </p>

            <NavLink
              to="/help"
              onClick={onClose}
              className={({
                isActive,
              }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent-soft text-accent'
                    : 'text-ink-soft hover:bg-surface-subtle hover:text-ink'
                }`
              }
            >
              <LifeBuoy className="h-[18px] w-[18px]" />

              Help &amp; Support
            </NavLink>

          </div>

        </nav>

        {/* User profile */}

        <div className="border-t border-line p-3">

          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">

            {/* Profile Photo */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink text-sm font-semibold text-white">

              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={
                    user.name ||
                    'Profile'
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}

            </div>

            {/* User information */}

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold text-ink">
                {user?.name ||
                  'Guest'}
              </p>

              <p className="truncate text-xs text-ink-muted">
                {user?.email ||
                  '—'}
              </p>

            </div>

            {/* Logout */}

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="rounded-lg p-1.5 text-ink-muted transition hover:bg-surface-subtle hover:text-danger"
              aria-label="Sign out"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>

          </div>

        </div>
      </aside>
    </>
  );
}

export function MobileBackButton({
  to = '/dashboard',
}: {
  to?: string;
}) {
  return (
    <NavLink
      to={to}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
    >
      <ChevronLeft className="h-4 w-4" />

      Back
    </NavLink>
  );
}