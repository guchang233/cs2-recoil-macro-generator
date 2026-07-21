interface NumberInputProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  className?: string;
}

export function NumberInput({
  value,
  min,
  max,
  step,
  onChange,
  className = '',
}: NumberInputProps) {
  const clamped = Math.min(Math.max(value, min), max);
  const pct = ((clamped - min) / (max - min)) * 100;

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <input
        type="range"
        className="liquid-range flex-1"
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--background-300) ${pct}%, var(--background-300) 100%)`,
        }}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-16 px-2 py-1 glass rounded-lg text-foreground text-sm text-center font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
