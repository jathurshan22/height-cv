import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Grid2X2,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Logo } from './Logo';
import { Button } from './ui/Button';

const appLinks = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'My CVs',
    href: '/my-cvs',
    icon: FileText,
  },
  {
    label: 'Templates',
    href: '/templates',
    icon: Grid2X2,
  },
  {
    label: 'ATS Analyzer',
    href: '/ats-analyzer',
    icon: BarChart3,
  },
];

const publicLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Templates', href: '/#templates' },
  { label: 'ATS Analyzer', href: '/#ats' },
  { label: 'How It Works', href: '/#how' },
];

export function Navbar() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const profileRef = useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* =========================================================
     THEME (single source of truth = ThemeContext)
  ========================================================= */

  const { theme, setTheme } = useTheme();

  // Reflect the actually-applied theme (mirrors ThemeContext's apply()).
  const darkMode =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleDarkMode = () => setTheme(darkMode ? 'light' : 'dark');

  /* =========================================================
     SCROLL
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* =========================================================
     CLOSE PROFILE DROPDOWN
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, []);

  /* =========================================================
     CLOSE MOBILE MENU
  ========================================================= */

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /* =========================================================
     ACTIVE ROUTE
  ========================================================= */

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }

    return location.pathname.startsWith(href);
  };

  /* =========================================================
     USER INITIALS
  ========================================================= */

  const getInitials = () => {
    if (!user?.name) return 'U';

    return user.name
      .split(' ')
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  /* =========================================================
     PUBLIC SECTION NAVIGATION
  ========================================================= */

  const handlePublicNavigation = (href: string) => {
    setMobileOpen(false);

    if (!href.startsWith('/#')) {
      navigate(href);
      return;
    }

    const id = href.substring(1);

    if (location.pathname !== '/') {
      navigate('/');

      setTimeout(() => {
        document
          .querySelector(id)
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
      }, 100);
    } else {
      document
        .querySelector(id)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);

    await logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container-page py-3">

        {/* =====================================================
            DESKTOP NAVBAR
        ===================================================== */}

        <nav
          className={`
            hidden
            min-h-[70px]
            items-center
            rounded-[22px]
            border
            px-5
            transition-all
            duration-300
            md:flex

            ${
              darkMode
                ? 'border-white/10 bg-slate-950/65'
                : 'border-white/70 bg-white/70'
            }

            backdrop-blur-2xl

            ${
              scrolled
                ? 'shadow-[0_18px_50px_rgba(15,23,42,0.10)]'
                : 'shadow-[0_8px_30px_rgba(15,23,42,0.05)]'
            }
          `}
        >

          {/* ===================================================
              LOGO
          =================================================== */}

          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label="HeightCV Home"
          >
            <Logo />
          </Link>

          {/* Logo Divider */}
          <div
            className={`
              mx-5
              h-8
              w-px
              ${
                darkMode
                  ? 'bg-white/10'
                  : 'bg-slate-200/80'
              }
            `}
          />

          {/* ===================================================
              LOGGED IN NAVIGATION
          =================================================== */}

          {user ? (
            <>
              <div className="flex min-w-0 flex-1 items-center gap-1">

                {appLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`
                        group
                        relative
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        px-3.5
                        py-2.5
                        text-sm
                        font-medium
                        transition-all
                        duration-200

                        ${
                          active
                            ? darkMode
                              ? 'bg-white/10 text-violet-300'
                              : 'bg-white/80 text-violet-600 shadow-[0_5px_20px_rgba(124,58,237,0.08)]'
                            : darkMode
                              ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                              : 'text-slate-600 hover:bg-white/60 hover:text-slate-950'
                        }
                      `}
                    >
                      <Icon
                        className={`
                          h-[18px]
                          w-[18px]
                          transition-transform
                          duration-200
                          group-hover:scale-105

                          ${
                            active
                              ? 'text-violet-600 dark:text-violet-300'
                              : ''
                          }
                        `}
                      />

                      <span>{item.label}</span>

                      {/* Active line */}
                      {active && (
                        <span
                          className="
                            absolute
                            bottom-0.5
                            left-5
                            right-5
                            h-[2px]
                            rounded-full
                            bg-gradient-to-r
                            from-violet-500
                            to-indigo-500
                          "
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* =================================================
                  RIGHT SIDE
              ================================================= */}

              <div className="flex shrink-0 items-center gap-3">

                {/* =================================================
                    THEME TOGGLE
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    toggleDarkMode()
                  }
                  aria-label={
                    darkMode
                      ? 'Switch to light mode'
                      : 'Switch to dark mode'
                  }
                  className={`
                    relative
                    flex
                    h-10
                    w-[72px]
                    items-center
                    rounded-full
                    border
                    p-1
                    transition-all
                    duration-300

                    ${
                      darkMode
                        ? 'border-white/10 bg-white/10'
                        : 'border-slate-200/80 bg-white/60'
                    }
                  `}
                >
                  {/* Sliding background */}
                  <span
                    className={`
                      absolute
                      top-1
                      h-8
                      w-8
                      rounded-full
                      bg-white
                      shadow-sm
                      transition-transform
                      duration-300

                      ${
                        darkMode
                          ? 'translate-x-8'
                          : 'translate-x-0'
                      }
                    `}
                  />

                  {/* Sun */}
                  <span
                    className="
                      relative
                      z-10
                      flex
                      w-1/2
                      items-center
                      justify-center
                    "
                  >
                    <Sun
                      className={`
                        h-4
                        w-4
                        ${
                          darkMode
                            ? 'text-slate-400'
                            : 'text-amber-500'
                        }
                      `}
                    />
                  </span>

                  {/* Moon */}
                  <span
                    className="
                      relative
                      z-10
                      flex
                      w-1/2
                      items-center
                      justify-center
                    "
                  >
                    <Moon
                      className={`
                        h-4
                        w-4
                        ${
                          darkMode
                            ? 'text-violet-600'
                            : 'text-slate-400'
                        }
                      `}
                    />
                  </span>
                </button>

                {/* Divider */}
                <div
                  className={`
                    h-8
                    w-px
                    ${
                      darkMode
                        ? 'bg-white/10'
                        : 'bg-slate-200/80'
                    }
                  `}
                />

                {/* =================================================
                    PROFILE AVATAR ONLY
                ================================================= */}

                <div
                  ref={profileRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen((value) => !value)
                    }
                    aria-label="Open profile menu"
                    aria-expanded={profileOpen}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      p-1
                      transition-all
                      duration-200
                      hover:bg-white/60
                      dark:hover:bg-white/5
                    "
                  >

                    {/* Avatar */}
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="
                          h-10
                          w-10
                          rounded-full
                          border
                          border-white/80
                          object-cover
                          shadow-sm
                          transition-transform
                          duration-200
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          bg-gradient-to-br
                          from-violet-600
                          to-indigo-600
                          text-xs
                          font-bold
                          text-white
                          shadow-sm
                          transition-transform
                          duration-200
                          group-hover:scale-105
                        "
                      >
                        {getInitials()}
                      </div>
                    )}

                    <ChevronDown
                      className={`
                        h-4
                        w-4
                        text-slate-400
                        transition-transform
                        duration-200

                        ${
                          profileOpen
                            ? 'rotate-180'
                            : ''
                        }
                      `}
                    />
                  </button>

                  {/* =================================================
                      PROFILE DROPDOWN
                  ================================================= */}

                  {profileOpen && (
                    <div
                      className={`
                        absolute
                        right-0
                        top-[calc(100%+12px)]
                        w-52
                        overflow-hidden
                        rounded-2xl
                        border
                        shadow-[0_20px_60px_rgba(15,23,42,0.15)]
                        backdrop-blur-2xl

                        ${
                          darkMode
                            ? 'border-white/10 bg-slate-950/90'
                            : 'border-white/80 bg-white/90'
                        }
                      `}
                    >
                      <div className="p-2">

                        {/* Profile */}
                        

                        {/* Settings */}
                        <Link
                          to="/settings"
                          onClick={() =>
                            setProfileOpen(false)
                          }
                          className={`
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-2.5
                            text-sm
                            font-medium
                            transition

                            ${
                              darkMode
                                ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                            }
                          `}
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>

                        {/* Divider */}
                        <div
                          className={`
                            my-1
                            h-px
                            ${
                              darkMode
                                ? 'bg-white/10'
                                : 'bg-slate-100'
                            }
                          `}
                        />

                        {/* Logout */}
                        <button
                          type="button"
                          onClick={() =>
                            void handleLogout()
                          }
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-2.5
                            text-left
                            text-sm
                            font-medium
                            text-red-500
                            transition
                            hover:bg-red-50
                            dark:hover:bg-red-500/10
                          "
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* =====================================================
               PUBLIC NAVBAR
            ===================================================== */

            <>
              <div className="flex flex-1 items-center justify-center gap-1">

                {publicLinks.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      handlePublicNavigation(item.href)
                    }
                    className="
                      rounded-xl
                      px-3.5
                      py-2.5
                      text-sm
                      font-medium
                      text-slate-600
                      transition
                      hover:bg-white/60
                      hover:text-slate-950
                      dark:text-slate-300
                      dark:hover:bg-white/5
                      dark:hover:text-white
                    "
                  >
                    {item.label}
                  </button>
                ))}

              </div>

              {/* Public theme + auth */}
              <div className="flex items-center gap-3">

                {/* Theme */}
                <button
                  type="button"
                  onClick={() =>
                    toggleDarkMode()
                  }
                  aria-label="Toggle theme"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    bg-white/60
                    text-slate-600
                    transition
                    hover:bg-white
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-slate-300
                  "
                >
                  {darkMode ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </button>

                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    className="
                      rounded-xl
                      bg-gradient-to-r
                      from-violet-600
                      to-indigo-600
                      text-white
                    "
                  >
                    Get Started
                  </Button>
                </Link>

              </div>
            </>
          )}
        </nav>

        {/* =====================================================
            MOBILE NAVBAR
        ===================================================== */}

        <nav
          className="
            flex
            min-h-[60px]
            items-center
            justify-between
            rounded-2xl
            border
            border-white/70
            bg-white/70
            px-4
            shadow-[0_8px_30px_rgba(15,23,42,0.07)]
            backdrop-blur-2xl
            md:hidden
            dark:border-white/10
            dark:bg-slate-950/70
          "
        >
          <Link to="/">
            <Logo />
          </Link>

          <div className="flex items-center gap-2">

            {/* Mobile theme */}
            <button
              type="button"
              onClick={() =>
                toggleDarkMode()
              }
              aria-label="Toggle theme"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white/60
                text-slate-600
                dark:border-white/10
                dark:bg-white/5
                dark:text-slate-300
              "
            >
              {darkMode ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            {/* Menu */}
            <button
              type="button"
              onClick={() =>
                setMobileOpen((value) => !value)
              }
              aria-label="Toggle navigation"
              className="
                rounded-xl
                p-2
                text-slate-600
                transition
                hover:bg-white/70
                dark:text-slate-300
                dark:hover:bg-white/5
              "
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

          </div>
        </nav>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        {mobileOpen && (
          <div
            className="
              mt-2
              overflow-hidden
              rounded-2xl
              border
              border-white/70
              bg-white/85
              shadow-[0_15px_45px_rgba(15,23,42,0.10)]
              backdrop-blur-2xl
              md:hidden
              dark:border-white/10
              dark:bg-slate-950/90
            "
          >
            <div className="p-3">

              {user ? (
                <>
                  {/* Mobile navigation */}
                  <div className="space-y-1">

                    {appLinks.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);

                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={`
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-sm
                            font-medium

                            ${
                              active
                                ? 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
                            }
                          `}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      );
                    })}

                  </div>

                  {/* Mobile Profile */}
                  <Link
                    to="/profile"
                    className="
                      mt-2
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      font-medium
                      text-slate-600
                      hover:bg-slate-50
                      dark:text-slate-300
                      dark:hover:bg-white/5
                    "
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>

                  {/* Settings */}
                  <Link
                    to="/settings"
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      font-medium
                      text-slate-600
                      hover:bg-slate-50
                      dark:text-slate-300
                      dark:hover:bg-white/5
                    "
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() =>
                      void handleLogout()
                    }
                    className="
                      mt-1
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-left
                      text-sm
                      font-medium
                      text-red-500
                      hover:bg-red-50
                      dark:hover:bg-red-500/10
                    "
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Public mobile links */}
                  <div className="space-y-1">

                    {publicLinks.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() =>
                          handlePublicNavigation(item.href)
                        }
                        className="
                          flex
                          w-full
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          text-sm
                          font-medium
                          text-slate-600
                          hover:bg-slate-50
                          dark:text-slate-300
                          dark:hover:bg-white/5
                        "
                      >
                        {item.label}
                      </button>
                    ))}

                  </div>

                  {/* Public buttons */}
                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <Link to="/login">
                      <Button
                        variant="outline"
                        size="md"
                        className="w-full rounded-xl"
                      >
                        Login
                      </Button>
                    </Link>

                    <Link to="/register">
                      <Button
                        variant="primary"
                        size="md"
                        className="
                          w-full
                          rounded-xl
                          bg-gradient-to-r
                          from-violet-600
                          to-indigo-600
                          text-white
                        "
                      >
                        Get Started
                      </Button>
                    </Link>

                  </div>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </header>
  );
}