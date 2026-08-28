import { Star } from "lucide-react";
import { Hotel } from "../../../data/hotels";
import { usePropertyReviews } from "../../review/hooks/usePropertyReviews";

interface ReviewSectionProps {
  hotel: Hotel;
  propertyId: string;
}

export function ReviewSection({ hotel, propertyId }: ReviewSectionProps) {
  const { reviews, averageRating, totalReviews, isLoading, error } = usePropertyReviews(propertyId);

  const displayRating = averageRating || hotel.rating;
  const displayCount = totalReviews || hotel.reviews;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <Star size={18} className="fill-foreground stroke-foreground" />
        <span className="font-semibold text-foreground">{displayRating} · {displayCount} reviews</span>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {!isLoading && !error && reviews.length === 0 && (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      )}

      {!isLoading && !error && reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => {
            const author = review.guest_name || review.author || "Guest";
            const comment = review.comment || review.text || "";
            const date = review.created_at
              ? new Date(review.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : review.date || "";

            return (
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
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{comment}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                    {author.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{author}</p>
                    <p className="text-xs text-muted-foreground">{date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
