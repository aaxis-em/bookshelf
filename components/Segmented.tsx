interface Option {
  value: string;
  label: string;
  dot?: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label: string;
}

// iOS-style segmented control
export default function Segmented({ options, value, onChange, disabled, label }: Props) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-[9px] bg-hover p-[2px]">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`pressable flex items-center gap-1.5 rounded-[7px] px-3 py-1 text-[13px] font-medium tracking-[-0.003em] disabled:opacity-50 ${
              active ? "bg-thumb text-fg shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.04)]" : "text-muted hover:text-fg"
            }`}
          >
            {opt.dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: opt.dot }} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
