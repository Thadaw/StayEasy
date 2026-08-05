import { SlidersHorizontal } from "lucide-react";
import { PROPERTY_TYPES, AMENITIES_LIST } from "../../../constants/searchFilters";

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  propertyFilters: string[];
  onTogglePropertyType: (type: string) => void;
  amenities: string[];
  onToggleAmenity: (amenity: string) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  propertyFilters,
  onTogglePropertyType,
  amenities,
  onToggleAmenity,
  onClearAll,
}: FilterSidebarProps) {
  return (
    <aside className="w-[260px] shrink-0 border-r border-gray-200 pr-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--brand-heading)" }}>
            <SlidersHorizontal size={16} /> Filters
          </h3>
          <button onClick={onClearAll} className="text-xs font-semibold text-brand-accent hover:underline">Clear all</button>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--brand-heading)" }}>Price range per night</h4>
          <p className="text-xs mb-2" style={{ color: "var(--brand-text-secondary)" }}>${priceRange[0]} - ${priceRange[1]}+</p>
          <input
            type="range"
            min={0}
            max={500}
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-brand-primary"
          />
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
              className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-brand-accent"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
              className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--brand-heading)" }}>Property type</h4>
          <div className="space-y-2">
            {PROPERTY_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <label key={type.label} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={propertyFilters.includes(type.label)}
                    onChange={() => onTogglePropertyType(type.label)}
                    className="w-4 h-4 rounded border-gray-300 accent-brand-primary"
                  />
                  <Icon size={14} className="text-gray-500" />
                  <span className="text-xs flex-1" style={{ color: "var(--brand-heading)" }}>{type.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--brand-heading)" }}>Amenities</h4>
          <div className="space-y-2">
            {AMENITIES_LIST.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <label key={amenity.label} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity.label)}
                    onChange={() => onToggleAmenity(amenity.label)}
                    className="w-4 h-4 rounded border-gray-300 accent-brand-primary"
                  />
                  <Icon size={14} className="text-gray-500" />
                  <span className="text-xs flex-1" style={{ color: "var(--brand-heading)" }}>{amenity.label}</span>
                </label>
              );
            })}
          </div>
          <button className="text-xs font-semibold text-brand-accent hover:underline mt-2">Show more</button>
        </div>
      </div>
    </aside>
  );
}
