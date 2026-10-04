import { useState } from "react"
import { Star } from "lucide-react"
import toast from "react-hot-toast"
import { useSubmitReview } from "../hooks/useSubmitReview"

interface WriteReviewModalProps {
  propertyId: string
  propertyName: string
  onClose: () => void
}

export function WriteReviewModal({ propertyId, propertyName, onClose }: WriteReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const { submitReview, isSubmitting, error } = useSubmitReview()

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  const handleSubmit = async () => {
    if (!UUID_RE.test(propertyId)) {
      toast.error("Invalid property ID. Please try again later.")
      return
    }
    const success = await submitReview(propertyId, { rating, comment })
    if (success) {
      toast.success("Review submitted! Thank you.")
      onClose()
    } else {
      toast.error(error || "Failed to submit review. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold text-gray-900 mb-1">Write a Review</h2>
        <p className="text-sm text-gray-500 mb-1">How was your stay at {propertyName}?</p>

        <div className="flex items-center gap-1 my-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="cursor-pointer"
            >
              <Star
                size={28}
                className={
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 stroke-amber-400"
                    : "fill-gray-200 stroke-gray-200"
                }
              />
            </button>
          ))}
        </div>

        <label className="text-sm font-medium text-gray-700 mb-2 block">Your review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Tell us about your experience..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3C5E] resize-none"
        />

        <button
          disabled={!rating || !comment.trim() || isSubmitting}
          onClick={handleSubmit}
          className="mt-4 w-full py-3 rounded-xl bg-[#1A3C5E] text-white font-semibold text-sm hover:bg-[#163552] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  )
}
