interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  size?: "sm" | "md" | "lg";
  mono?: boolean;
}

export function DetailField({ label, value, size = "sm", mono }: DetailFieldProps) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
      <p className={`font-bold text-gray-900 ${mono ? "font-mono" : ""} ${
        size === "lg" ? "text-lg" : size === "md" ? "text-base" : "text-sm"
      }`}>
        {value}
      </p>
    </div>
  );
}
