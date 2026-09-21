import { useState, useEffect } from "react"
import axios from "axios"
import api, { type AuthRequestConfig } from "../../../services/axios"

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
  refetch: () => void
}

export function usePropertyReviews(propertyId: string | undefined): UsePropertyReviewsReturn {
  const [reviews, setReviews] = useState<PropertyReview[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  const refetch = () => setFetchKey((k) => k + 1)

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
        const response = await api.get(`/properties/${propertyId}/reviews`, { signal: controller.signal, skipAuthRedirect: true } as AuthRequestConfig)
        const payload = response.data?.data ?? response.data
        const reviewList = payload?.reviews ?? (Array.isArray(payload) ? payload : [])
        setReviews(reviewList)
        if (payload?.average_rating != null) setAverageRating(payload.average_rating)
        if (payload?.total_reviews != null) setTotalReviews(payload.total_reviews)
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
  }, [propertyId, fetchKey])

  return { reviews, averageRating, totalReviews, isLoading, error, refetch }
}
