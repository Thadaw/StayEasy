import { useState } from "react";
import { Heart, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface HotelCardProps {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  imageUrl: string;
  tag?: string;
  isSuperhost?: boolean;
}

export function HotelCard({ id, name, location, rating, reviews, price, imageUrl, tag, isSuperhost }: HotelCardProps) {
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link to={`/hotel/${id}`} className="group block bg-white rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        {!imgLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isSuperhost && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm" style={{ backgroundColor: "var(--brand-dark)", color: "white" }}>
              Verified Host
            </span>
          )}
          {tag && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm" style={{ backgroundColor: "var(--primary)", color: "white" }}>
              {tag}
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm active:scale-90"
          style={{ backgroundColor: liked ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.85)" }}
        >
          <Heart
            size={17}
            className="transition-all duration-200"
            style={{ fill: liked ? "var(--primary)" : "transparent", stroke: liked ? "var(--primary)" : "var(--foreground)" }}
          />
        </button>
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{name}</p>
            <p className="text-xs mt-0.5 flex items-center gap-1 truncate" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={11} />
              {location}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={12} style={{ fill: "var(--primary)", stroke: "var(--primary)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{rating.toFixed(1)}</span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>({reviews})</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-border flex items-center justify-between">
          <p className="text-sm font-bold" style={{ color: "var(--brand-dark)" }}>
            ${price}<span className="font-normal text-xs" style={{ color: "var(--muted-foreground)" }}> /night</span>
          </p>
          {liked && (
            <span className="text-xs font-medium" style={{ color: "var(--primary)" }}>Saved</span>
          )}
        </div>
      </div>
    </Link>
  );
}
