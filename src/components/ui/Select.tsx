import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Website-styled dropdown that replaces native <select>.
 * Closes on outside click / Escape and themes with the app tokens
 * (so it follows light/dark automatically).
 */
export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
  ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3.5 text-sm text-ink transition hover:bg-surface-subtle focus:outline-none focus:ring-4 focus:ring-accent/10 disabled:pointer-events-none disabled:opacity-50 ${buttonClassName}`}
      >
        <span className={`flex items-center gap-2 truncate ${selected ? 'text-ink' : 'text-ink-muted'}`}>
          {selected?.icon}
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute left-0 z-50 mt-1.5 max-h-60 w-full min-w-full overflow-auto rounded-xl border border-line bg-surface p-1 shadow-lift ${menuClassName}`}
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                  active
                    ? 'bg-accent-soft text-accent'
                    : 'text-ink-soft hover:bg-surface-subtle hover:text-ink'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {o.icon}
                  {o.label}
                </span>
                {active && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
