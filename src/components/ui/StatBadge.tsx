import type { LucideIcon } from "lucide-react";

interface StatBadgeProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
}

export function StatBadge({ icon: Icon, value, label }: StatBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
      <Icon size={15} className="text-brand-heading" />
      <span className="font-semibold text-brand-heading">{value}</span> {label}
    </div>
  );
}
