import { Star, Heart, Share2, ShieldCheck } from "lucide-react";
import { Hotel } from "../../../data/hotels";

interface HotelHeaderProps {
  hotel: Hotel;
  liked: boolean;
  onToggleFavorite: () => void;
}

export function HotelHeader({ hotel, liked, onToggleFavorite }: HotelHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4 gap-4">
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--foreground)", lineHeight: 1.2 }}>
          {hotel.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-foreground stroke-foreground" />
            <span className="font-semibold">{hotel.rating}</span>
            <span className="text-muted-foreground">({hotel.reviews} reviews)</span>
          </span>
          {hotel.isSuperhost && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <ShieldCheck size={13} className="text-primary" />
              Superhost
            </span>
          )}
          <span className="text-muted-foreground underline cursor-pointer">{hotel.location}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-xl transition-colors">
          <Share2 size={15} /> Share
        </button>
        <button onClick={onToggleFavorite} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-xl transition-colors">
          <Heart size={15} className={liked ? "fill-primary stroke-primary" : ""} /> Save
        </button>
      </div>
    </div>
  );
}
