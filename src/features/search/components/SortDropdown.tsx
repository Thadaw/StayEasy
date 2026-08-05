interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs" style={{ color: "var(--brand-text-secondary)" }}>Sort by:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-semibold border-none outline-none cursor-pointer"
        style={{ color: "var(--brand-heading)" }}
      >
        <option value="Recommended">Recommended</option>
        <option value="Price low to high">Price: Low to High</option>
        <option value="Price high to low">Price: High to Low</option>
        <option value="Rating">Rating</option>
      </select>
    </div>
  );
}
