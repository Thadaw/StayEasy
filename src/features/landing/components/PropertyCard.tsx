import { useNavigate } from "react-router-dom";
import { MapPin, Building2 } from "lucide-react";
import { useFavorites } from "../../../context/FavoritesContext";
import type { Property } from "../../search/hooks/useSearchProperties";
import { FavouriteButton } from "../../../shared/components/FavouriteButton";

interface PropertyCardProps {
  property: Property;
  showDistance?: boolean;
}

export function PropertyCard({ property, showDistance }: PropertyCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const location = [property.address, property.city, property.state, property.country]
    .filter(Boolean)
    .reduce<string[]>((parts, part) => {
      const prev = parts[parts.length - 1] || "";
      if (prev.toLowerCase().includes(part.toLowerCase())) return parts;
      return [...parts, part];
    }, [])
    .join(", ");

  return (
    <div
      onClick={() => navigate(`/hotel/${property.property_id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
    >
      <div className="relative h-[130px] md:h-[150px] overflow-hidden">
        {property.cover_photo ? (
          <img
            src={property.cover_photo}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Building2 size={40} className="text-gray-300" />
          </div>
        )}
        <FavouriteButton isFavourite={isFavorite(property.property_id)} onToggle={() => toggleFavorite(property.property_id)} />
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-semibold text-brand-heading">{property.type}</span>
      </div>
      <div className="px-3 py-2 relative">
        <h3 className="text-xs md:text-sm font-bold leading-tight line-clamp-1 text-brand-heading">{property.name}</h3>
        <p className="text-[9px] md:text-[10px] flex items-center gap-0.5 mb-1 text-brand-text-secondary">
          <MapPin size={9} /> {location}
        </p>
        {showDistance && property.distance_km != null ? (
          <div className="flex items-end justify-between">
            <span className="text-[9px] text-brand-text-secondary">{property.distance_km} km</span>
            <div>
              <p className="text-xs md:text-sm font-bold leading-tight text-brand-heading"><span className="text-[9px] font-medium text-brand-text-secondary">Starting from</span> {property.currency} {property.lowest_rate ?? property.total_price} <span className="text-[9px] font-normal text-brand-text-secondary">/ night</span></p>
            </div>
          </div>
        ) : (
          <p className="text-xs md:text-sm font-bold leading-tight text-right text-brand-heading"><span className="text-[9px] font-medium text-brand-text-secondary">Starting from</span> {property.currency} {property.lowest_rate ?? property.total_price} <span className="text-[9px] font-normal text-brand-text-secondary">/ night</span></p>
        )}
      </div>
    </div>
  );
}
