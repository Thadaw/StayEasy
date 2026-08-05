import { Star } from "lucide-react";
import { Hotel } from "../../../data/hotels";

interface ReviewSectionProps {
  hotel: Hotel;
}

export function ReviewSection({ hotel }: ReviewSectionProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <Star size={18} className="fill-foreground stroke-foreground" />
        <span className="font-semibold text-foreground">{hotel.rating} · {hotel.reviews} reviews</span>
      </div>
    </div>
  );
}
