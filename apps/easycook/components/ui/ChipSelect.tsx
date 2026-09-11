'use client'

interface ChipSelectProps {
  label?: string
  options: { value: string; label: string; description?: string }[]
  selected: string[]
  onChange: (values: string[]) => void
  multi?: boolean
  hint?: string
}

export function ChipSelect({
  label,
  options,
  selected,
  onChange,
  multi = true,
  hint,
}: ChipSelectProps) {
  function toggle(value: string) {
    if (multi) {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
      onChange(next)
    } else {
      onChange([value])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`
                rounded-full px-3.5 py-1.5 text-sm font-medium border transition-all duration-150
                ${
                  active
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'bg-white text-text-muted border-border hover:border-accent/40 hover:text-text-primary'
                }
              `}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  )
}
