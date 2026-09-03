interface ProgressBarProps {
  value: number;
  label?: string;
  color?: string;
  showValue?: boolean;
}

export function ProgressBar({ value, label, color = 'bg-accent', showValue = true }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-sm text-ink-soft">{label}</span>}
          {showValue && <span className="text-sm font-semibold text-ink">{v}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
