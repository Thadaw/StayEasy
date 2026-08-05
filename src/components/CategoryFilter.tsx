const categories = [
  { id: "all",         label: "All",           icon: "✦" },
  { id: "beachfront",  label: "Beachfront",    icon: "🏖️" },
  { id: "mountain",    label: "Mountain",      icon: "⛰️" },
  { id: "city",        label: "City centre",   icon: "🏙️" },
  { id: "villa",       label: "Villas",        icon: "🏡" },
  { id: "luxury",      label: "Luxury",        icon: "💎" },
  { id: "pool",        label: "Amazing pools", icon: "🏊" },
  { id: "countryside", label: "Countryside",   icon: "🌿" },
  { id: "skiing",      label: "Ski resorts",   icon: "⛷️" },
  { id: "historic",    label: "Historic",      icon: "🏛️" },
];

interface CategoryFilterProps {
  selected: string;
  onChange: (id: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="border-b border-border sticky top-[68px] z-40 bg-white shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-3.5 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = selected === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0"
                style={{
                  backgroundColor: isActive ? "var(--primary)" : "white",
                  color: isActive ? "white" : "var(--foreground)",
                  borderColor: isActive ? "var(--primary)" : "var(--border)",
                  boxShadow: isActive ? "0 2px 8px rgba(46,134,171,0.3)" : "none",
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
