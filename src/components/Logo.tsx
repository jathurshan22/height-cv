import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
  className?: string;
  light?: boolean;
}

export function Logo({
  to = '/',
  className = '',
  light = false,
}: LogoProps) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center ${className}`}
      aria-label="Height CV"
    >
      <span className="font-display text-lg font-bold tracking-tight">
        {light ? (
          <span className="text-white">
            Height<span className="text-accent">CV</span>
          </span>
        ) : (
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-violet-500 bg-clip-text text-transparent">
            HeightCV
          </span>
        )}
      </span>
    </Link>
  );
}