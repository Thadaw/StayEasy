import { Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";

interface HeroCardData {
  id: string;
  name: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  image: string;
  /** Distance from the visitor, in km. Only set for real nearby properties. */
  distance?: number;
}

interface HeroCardProps {
  data: HeroCardData;
  fallbackName: string;
  fallbackLocation: string;
  fallbackPrice: number;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Set for cards that don't represent a real property (e.g. static demo
   * hotels). The card then opens a search for that location instead of a
   * property detail page that would404.
   */
  fallbackSearchQuery?: string;
}

export function HeroCard({
  data,
  fallbackName,
  fallbackLocation,
  fallbackPrice,
  className = "",
  style,
  fallbackSearchQuery,
}: HeroCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const name = data.name || fallbackName;
  const location = data.city ? `${data.city}, ${data.country}` : fallbackLocation;
  const price = data.price || fallbackPrice;
  const liked = isFavorite(data.id);
  const distanceLabel =
    typeof data.distance === "number" && Number.isFinite(data.distance)
      ? data.distance < 1
        ? `${Math.round(data.distance * 1000)} m away`
        : `${data.distance.toFixed(1)} km away`
      : null;

  return (
    <div
      className={`bg-white rounded-2xl shadow-modal overflow-hidden cursor-pointer ${className}`}
      style={style}
      onClick={() => {
        // SPA navigation — a hard reload (window.location.href) refires every
        // query from cold and can land on "Property not found" if the backend
        // times out while waking up.
        if (fallbackSearchQuery) {
          navigate(`/search?where=${encodeURIComponent(fallbackSearchQuery)}`);
        } else if (data.id) {
          navigate(`/hotel/${data.id}`);
        }
      }}
    >
      <div className="relative h-[120px] xl:h-[150px] overflow-hidden">
        <img src={data.image} alt="" className="w-full h-full object-cover" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(data.id, {
              property_id: data.id,
              name: data.name,
              type: "Hotel",
              country: data.country,
              state: "",
              city: data.city,
              address: location,
              currency: data.currency,
              cover_photo: data.image,
              total_price: data.price,
              lowest_rate: data.price,
            });
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart size={14} className={liked ? "fill-red-500 stroke-red-500" : "text-gray-600"} />
        </button>
      </div>
      <div className="px-3 py-2">
        <h3 className="text-[11px] xl:text-[13px] font-bold leading-tight line-clamp-1 text-brand-heading">{name}</h3>
        <p className="text-[9px] xl:text-[10px] flex items-center gap-0.5 mb-1 text-brand-text-secondary">
          <MapPin size={9} /> {location}
          {distanceLabel && <span className="ml-1 text-brand-accent font-semibold">· {distanceLabel}</span>}
        </p>
        <p className="text-xs xl:text-[13px] font-bold leading-tight text-right text-brand-heading">
          <span className="text-[9px] font-medium text-brand-text-secondary">Starting from </span>
          {data.currency} {price}
          <span className="text-[9px] font-normal text-brand-text-secondary"> / night</span>
        </p>
      </div>
    </div>
  );
}
