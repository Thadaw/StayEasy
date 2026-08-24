import { Star, Heart, Share2, ShieldCheck, BadgeCheck } from "lucide-react";
import { Hotel } from "../../../data/hotels";

interface HotelHeaderProps {
  hotel: Hotel;
  liked: boolean;
  onToggleFavorite: () => void;
  onShare?: () => void;
}

export function HotelHeader({ hotel, liked, onToggleFavorite, onShare }: HotelHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4 gap-4">
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--foreground)", lineHeight: 1.2 }}>
          {hotel.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
          {hotel.isSuperhost && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <ShieldCheck size={13} className="text-primary" />
              Superhost
            </span>
          )}
          {hotel.isActive && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <BadgeCheck size={13} /> Active
            </span>
          )}
          <span className="text-muted-foreground underline cursor-pointer">{hotel.location}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {hotel.brandLogoUrl && (
          <img src={hotel.brandLogoUrl} alt={`${hotel.name} logo`} className="h-9 w-auto object-contain" />
        )}
        <button onClick={onShare} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-xl transition-colors">
          <Share2 size={15} /> Share
        </button>
        <button onClick={onToggleFavorite} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-xl transition-colors">
          <Heart size={15} className={liked ? "fill-red-500 stroke-red-500" : "text-gray-600"} /> Save
        </button>
      </div>
    </div>
  );
}
