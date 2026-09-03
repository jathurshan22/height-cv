import { useState, type ReactNode } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const { user } = useAuth();

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const navigate = useNavigate();

  const initials = (
    user?.name || 'U'
  )
    .split(' ')
    .map((name) => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface-page">
      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="lg:pl-64">

        {/* Top bar */}

        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/90 px-5 backdrop-blur-md sm:px-6">

          {/* Mobile menu */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-lg p-2 text-ink-soft hover:bg-surface-subtle lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Title */}

          <div className="flex-1">
            {title && (
              <h1 className="text-base font-semibold text-ink sm:text-lg">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="text-xs text-ink-muted sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right side */}

          <div className="flex items-center gap-2">

            {/* Theme */}

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-line bg-surface p-2 text-ink-soft hover:bg-surface-subtle"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Page actions */}

            {actions}

            {/* Profile */}

            <button
              type="button"
              onClick={() =>
                navigate('/settings')
              }
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-accent text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              aria-label="Open profile settings"
            >
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
            </button>

          </div>
        </header>

        {/* Main */}

        <main className="px-5 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

      </div>
    </div>
  );
}