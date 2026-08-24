import { useNavigate } from "react-router-dom";
import { MapPin, Building2 } from "lucide-react";
import type { SearchProperty } from "../../../shared/types/api";
import { truncateWords } from "../../../shared/utils/helpers";
import { FavouriteButton } from "../../../shared/components/FavouriteButton";

interface SearchResultGridCardProps {
  property: SearchProperty;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  filterParams: string;
  guests: string;
}

export function SearchResultGridCard({
  property,
  isFavorite,
  onToggleFavorite,
  filterParams,
  guests,
}: SearchResultGridCardProps) {
  const navigate = useNavigate();
  const description = truncateWords(property.description || '');

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
      style={{ height: "330px" }}
    >
      <div className="relative h-[140px] overflow-hidden shrink-0">
        {property.cover_photo ? (
          <img src={property.cover_photo} alt={property.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Building2 size={40} className="text-gray-300" />
          </div>
        )}
        <FavouriteButton isFavourite={isFavorite} onToggle={() => onToggleFavorite(property.property_id)} size={14} />
      </div>

      <div className="p-2 flex flex-col flex-1">
        <h3 className="text-xs font-bold line-clamp-1 mb-0.5" style={{ color: "var(--brand-heading)" }}>{property.name}</h3>
        <p className="text-[10px] flex items-center gap-0.5 mb-1" style={{ color: "var(--brand-text-secondary)" }}>
          <MapPin size={9} /> {property.city}, {property.state}
        </p>
        <div className="flex items-center gap-1 flex-wrap mb-1">
          {(property.amenities || []).slice(0, 3).map((amenity, i) => (
            <span key={i} className="text-[8px] px-1 py-0.5 bg-gray-100 rounded-full" style={{ color: "var(--brand-text-secondary)" }}>
              {amenity}
            </span>
          ))}
        </div>
        {description && (
          <p className="text-[9px] leading-snug line-clamp-2 mb-1" style={{ color: "var(--brand-text-secondary)" }}>
            {description}
          </p>
        )}
        <div className="mt-auto">
          <div className="text-right">
            <p className="text-[9px]" style={{ color: "var(--brand-text-secondary)" }}>{property.nights} night{property.nights && property.nights > 1 ? "s" : ""}, {guests} guest{guests !== "1" ? "s" : ""}</p>
            <p className="text-sm font-bold" style={{ color: "var(--brand-heading)" }}>
              <span className="font-normal" style={{ fontSize: "10px" }}>Starting from</span> {property.currency} {property.total_price}
            </p>
            <p className="text-[9px]" style={{ color: "var(--brand-text-secondary)" }}>Includes taxes and charges</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/hotel/${property.property_id}?${filterParams}`); }}
            className="w-full mt-1.5 px-2 py-1 text-[10px] font-semibold rounded-lg transition-colors bg-[#EBF6EF] text-[#1E8449] hover:bg-[#D4EDDA]"
          >
            See availability
          </button>
        </div>
      </div>
    </div>
  );
}
