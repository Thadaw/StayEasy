import { useState } from "react"
import axios from "axios"
import api from "../../../services/axios"

interface SubmitReviewPayload {
  rating: number
  comment: string
}

interface UseSubmitReviewReturn {
  submitReview: (propertyId: string, payload: SubmitReviewPayload) => Promise<boolean>
  isSubmitting: boolean
  error: string | null
}

export function useSubmitReview(): UseSubmitReviewReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitReview = async (propertyId: string, payload: SubmitReviewPayload): Promise<boolean> => {
    setIsSubmitting(true)
    setError(null)
    try {
      await api.post(`/properties/${propertyId}/reviews`, {
        rating: payload.rating,
        comment: payload.comment,
      })
      return true
    } catch (err: unknown) {
      let message = "Failed to submit review"
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
      setIsSubmitting(false)
    }
  }

  return { submitReview, isSubmitting, error }
}
