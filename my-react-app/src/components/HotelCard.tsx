import { useState } from "react";
import { Heart, Star } from "lucide-react";
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
    <Link to={`/hotel/${id}`} className="group cursor-pointer block">
      <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-muted mb-3">
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        {!imgLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isSuperhost && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm" style={{ backgroundColor: "var(--brand-dark)", color: "white" }}>
              Verified Host
            </span>
          )}
          {tag && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm" style={{ backgroundColor: "var(--primary)", color: "white" }}>
              {tag}
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3 p-2 rounded-full transition-transform hover:scale-110 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
        >
          <Heart size={17} style={{ fill: liked ? "var(--primary)" : "transparent", stroke: liked ? "var(--primary)" : "var(--foreground)" }} />
        </button>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{name}</p>
          <p className="text-sm truncate" style={{ color: "var(--muted-foreground)" }}>{location}</p>
          <p className="text-sm mt-1">
            <span className="font-semibold" style={{ color: "var(--brand-dark)" }}>${price}</span>
            <span style={{ color: "var(--muted-foreground)" }}> / night</span>
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Star size={12} style={{ fill: "var(--primary)", stroke: "var(--primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{rating.toFixed(1)}</span>
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>({reviews})</span>
        </div>
      </div>
    </Link>
  );
}
