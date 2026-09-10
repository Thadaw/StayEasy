import { SlidersHorizontal } from "lucide-react";

interface RoomType {
  id: string;
  room_type_name: string;
}

interface BedType {
  id: string;
  bed_name: string;
}

interface Amenity {
  id: string;
  amenity_name: string;
}

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  roomTypes: RoomType[];
  bedTypes: BedType[];
  systemAmenities: Amenity[];
  propertyFilters: string[];
  onTogglePropertyType: (type: string, id: string) => void;
  selectedBedTypeIds: string[];
  onToggleBedType: (type: string, id: string) => void;
  selectedAmenityIds: string[];
  onToggleAmenity: (amenity: string, id: string) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  maxPrice,
  roomTypes,
  bedTypes,
  systemAmenities,
  propertyFilters,
  onTogglePropertyType,
  selectedBedTypeIds,
  onToggleBedType,
  selectedAmenityIds,
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
          <p className="text-xs mb-2" style={{ color: "var(--brand-text-secondary)" }}>{priceRange[0]} - {priceRange[1]} price</p>
          <input
            type="range"
            min={0}
            max={maxPrice}
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
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--brand-heading)" }}>Room type</h4>
          <div className="space-y-2">
            {roomTypes.map((roomType) => (
              <label key={roomType.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={propertyFilters.includes(roomType.room_type_name)}
                  onChange={() => onTogglePropertyType(roomType.room_type_name, roomType.id)}
                  className="w-4 h-4 rounded border-gray-300 accent-brand-primary"
                />
                <span className="text-xs flex-1" style={{ color: "var(--brand-heading)" }}>{roomType.room_type_name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--brand-heading)" }}>Bed type</h4>
          <div className="space-y-2">
            {bedTypes.map((bedType) => (
              <label key={bedType.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBedTypeIds.includes(bedType.id)}
                  onChange={() => onToggleBedType(bedType.bed_name, bedType.id)}
                  className="w-4 h-4 rounded border-gray-300 accent-brand-primary"
                />
                <span className="text-xs flex-1" style={{ color: "var(--brand-heading)" }}>{bedType.bed_name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--brand-heading)" }}>Amenities</h4>
          <div className="space-y-2">
            {systemAmenities.map((amenity) => (
              <label key={amenity.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAmenityIds.includes(amenity.id)}
                  onChange={() => onToggleAmenity(amenity.amenity_name, amenity.id)}
                  className="w-4 h-4 rounded border-gray-300 accent-brand-primary"
                />
                <span className="text-xs flex-1" style={{ color: "var(--brand-heading)" }}>{amenity.amenity_name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}


