import { Star } from "lucide-react";
import { Hotel } from "../../../data/hotels";

interface ReviewSectionProps {
  hotel: Hotel;
}

const staticReviews = [
  {
    id: 1,
    author: "James R.",
    date: "May 2026",
    rating: 5,
    text: "Absolutely incredible stay. The views were even better than the photos. Our host was responsive and welcoming from day one. Would return every year if I could.",
  },
  {
    id: 2,
    author: "Priya M.",
    date: "April 2026",
    rating: 5,
    text: "One of the best travel experiences of my life. The property is immaculate, the amenities are top-tier, and the location is unbeatable. Already recommended to all my friends.",
  },
  {
    id: 3,
    author: "Thomas H.",
    date: "March 2026",
    rating: 4,
    text: "Beautiful place with great character. Check-in was smooth and the host gave us great local tips. Only minor note: the WiFi dipped occasionally, but everything else was excellent.",
  },
];

export function ReviewSection({ hotel }: ReviewSectionProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <Star size={18} className="fill-foreground stroke-foreground" />
        <span className="font-semibold text-foreground">{hotel.rating} · {hotel.reviews} reviews</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staticReviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < review.rating ? "fill-amber-400 stroke-amber-400" : "fill-muted stroke-muted"}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{review.text}</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                {review.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{review.author}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
