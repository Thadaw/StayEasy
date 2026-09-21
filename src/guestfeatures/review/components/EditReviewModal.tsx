import { useState } from "react"
import { Star } from "lucide-react"
import toast from "react-hot-toast"
import { useEditReview } from "../hooks/useEditReview"

interface EditReviewModalProps {
  propertyId: string
  reviewId: string
  propertyName: string
  initialRating: number
  initialComment: string
  onClose: () => void
  onUpdated: () => void
}

export function EditReviewModal({
  propertyId,
  reviewId,
  propertyName,
  initialRating,
  initialComment,
  onClose,
  onUpdated,
}: EditReviewModalProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState(initialComment)
  const { editReview, isEditing, error } = useEditReview()

  const handleSubmit = async () => {
    const success = await editReview(propertyId, reviewId, { rating, comment })
    if (success) {
      toast.success("Review updated successfully!")
      onUpdated()
      onClose()
    } else {
      toast.error(error || "Failed to update review. Please try again.")
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

        <h2 className="text-lg font-bold text-gray-900 mb-1">Edit Review</h2>
        <p className="text-sm text-gray-500 mb-1">Update your review for {propertyName}</p>

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
          disabled={!rating || !comment.trim() || isEditing}
          onClick={handleSubmit}
          className="mt-4 w-full py-3 rounded-xl bg-[#1A3C5E] text-white font-semibold text-sm hover:bg-[#163552] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {isEditing ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
