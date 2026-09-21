import { useState } from "react"
import axios from "axios"
import api from "../../../services/axios"

interface EditReviewPayload {
  rating: number
  comment: string
}

interface UseEditReviewReturn {
  editReview: (propertyId: string, reviewId: string, payload: EditReviewPayload) => Promise<boolean>
  isEditing: boolean
  error: string | null
}

export function useEditReview(): UseEditReviewReturn {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editReview = async (propertyId: string, reviewId: string, payload: EditReviewPayload): Promise<boolean> => {
    setIsEditing(true)
    setError(null)
    try {
      await api.patch(`/properties/${propertyId}/reviews/${reviewId}`, {
        rating: payload.rating,
        comment: payload.comment,
      })
      return true
    } catch (err: unknown) {
      let message = "Failed to update review"
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data
        if (typeof data === "string") {
          message = data
        } else if (data.detail) {
          message = Array.isArray(data.detail)
            ? data.detail.map((d: { msg?: string; loc?: string[] }) => d.msg || JSON.stringify(d)).join(", ")
            : String(data.detail)
        } else if (data.message) {
          message = String(data.message)
        }
      } else if (err instanceof Error) {
        message = err.message
      }
      setError(message)
      return false
    } finally {
      setIsEditing(false)
    }
  }

  return { editReview, isEditing, error }
}
