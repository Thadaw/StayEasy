import { useState, useEffect } from "react"
import axios from "axios"
import api from "../../../services/axios"

interface PropertyReview {
  id: string | number
  rating: number
  comment: string
  guest_name?: string
  created_at?: string
  author?: string
  date?: string
  text?: string
  avatar?: string
}

interface UsePropertyReviewsReturn {
  reviews: PropertyReview[]
  averageRating: number
  totalReviews: number
  isLoading: boolean
  error: string | null
}

export function usePropertyReviews(propertyId: string | undefined): UsePropertyReviewsReturn {
  const [reviews, setReviews] = useState<PropertyReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!propertyId) {
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    const fetchReviews = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get(`/properties/${propertyId}/reviews`, { signal: controller.signal })
        const data = response.data?.data ?? response.data
        setReviews(Array.isArray(data) ? data : [])
      } catch (err) {
        if (err instanceof Error && err.name === "CanceledError") return
        let message = "Failed to load reviews"
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
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
    return () => { controller.abort() }
  }, [propertyId])

  const totalReviews = reviews.length
  const averageRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
    : 0

  return { reviews, averageRating, totalReviews, isLoading, error }
}
