import { Minus, Plus } from "lucide-react";

interface CounterControlProps {
  label: string;
  sublabel?: string;
  value: number;
  min?: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function CounterControl({
  label,
  sublabel,
  value,
  min = 0,
  onDecrease,
  onIncrease,
}: CounterControlProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-brand-primary-extra-light last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {sublabel && <p className="text-xs text-gray-400">{sublabel}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrease}
          disabled={value <= min}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-brand-accent hover:bg-brand-accent-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="w-5 text-center text-sm font-bold tabular-nums">{value}</span>
        <button
          onClick={onIncrease}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-brand-accent hover:bg-brand-accent-light transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}
