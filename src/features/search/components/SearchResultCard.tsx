import { useNavigate } from "react-router-dom";
import { MapPin, Building2 } from "lucide-react";
import type { SearchProperty } from "../../../shared/types/api";
import { truncateWords } from "../../../shared/utils/helpers";
import { FavouriteButton } from "../../../shared/components/FavouriteButton";

interface SearchResultCardProps {
  property: SearchProperty;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  filterParams: string;
  guests: string;
}

export function SearchResultCard({
  property,
  isFavorite,
  onToggleFavorite,
  filterParams,
  guests,
}: SearchResultCardProps) {
  const navigate = useNavigate();

  const description = truncateWords(property.description || '');

  return (
    <div
      className="flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-[200px]"
      onClick={() => navigate(`/hotel/${property.property_id}?${filterParams}`)}
    >
      <div className="relative w-[280px] h-[200px] shrink-0 overflow-hidden">
        {property.cover_photo ? (
          <img src={property.cover_photo} alt={property.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Building2 size={40} className="text-gray-300" />
          </div>
        )}
        <FavouriteButton isFavourite={isFavorite} onToggle={() => onToggleFavorite(property.property_id)} size={16} />
      </div>

      <div className="flex-1 p-5 flex justify-between">
        <div>
          <h3 className="text-base font-bold mb-1" style={{ color: "var(--brand-heading)" }}>{property.name}</h3>
          <p className="text-xs flex items-center gap-1 mb-2" style={{ color: "var(--brand-text-secondary)" }}>
            <MapPin size={12} /> {property.address}, {property.city}, {property.state}
          </p>
          {description && (
            <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: "var(--brand-text-secondary)" }}>
              {description}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {(property.amenities || []).slice(0, 5).map((amenity, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full" style={{ color: "var(--brand-text-secondary)" }}>
                {amenity}
              </span>
            ))}
          </div>
          <p className="text-[11px] font-semibold text-green-600">
            Available
          </p>
        </div>

        <div className="text-right flex flex-col justify-between">
          <div className="mt-4">
            <p className="text-[10px]" style={{ color: "var(--brand-text-secondary)" }}>{property.nights} night{property.nights && property.nights > 1 ? "s" : ""}, {guests}</p>
            <p className="text-lg font-bold mt-0.5" style={{ color: "var(--brand-heading)" }}><span className="font-normal" style={{ fontSize: "12px" }}>Starting from</span> {property.currency} {property.total_price}</p>
            <p className="text-[10px]" style={{ color: "var(--brand-text-secondary)" }}>Includes taxes and charges</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/hotel/${property.property_id}?${filterParams}`); }}
            className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg transition-colors bg-[#EBF6EF] text-[#1E8449] hover:bg-[#D4EDDA]"
          >
            See availability
          </button>
        </div>
      </div>
    </div>
  );
}
