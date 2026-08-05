import type { LucideIcon } from "lucide-react";

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}

export function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon size={15} className="text-brand-text-secondary shrink-0" />
      <span className="w-16 text-brand-text-secondary">{label}</span>
      <span className="text-brand-heading">{value}</span>
    </div>
  );
}
