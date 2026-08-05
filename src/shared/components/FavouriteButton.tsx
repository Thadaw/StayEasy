import { Heart } from "lucide-react";

interface FavouriteButtonProps {
  isFavourite: boolean;
  onToggle: () => void;
  size?: number;
}

export function FavouriteButton({ isFavourite, onToggle, size = 14 }: FavouriteButtonProps) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
    >
      <Heart size={size} className={isFavourite ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500 transition-colors"} />
    </button>
  );
}
