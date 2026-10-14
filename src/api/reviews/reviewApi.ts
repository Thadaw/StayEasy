import axios from "axios"
import api, { type AuthRequestConfig } from "@/api/axiosInstance"

// The backend reports review errors as a string, a FastAPI `detail` (string or
// validation array), or `message` — normalise them into one human-readable line.
export function formatReviewApiError(err: unknown, fallback: string): string {
  let message = fallback
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
  return message
}

export function isCancelError(err: unknown): boolean {
  return axios.isCancel(err) || (err instanceof Error && err.name === "CanceledError")
}

export interface PropertyReview {
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

export interface PropertyReviewsPayload {
  reviews: PropertyReview[]
  averageRating: number
  totalReviews: number
}

export interface ReviewPayload {
  rating: number
  comment: string
}

export async function getPropertyReviews(
  propertyId: string,
  signal?: AbortSignal,
): Promise<PropertyReviewsPayload> {
  const response = await api.get(`/properties/${propertyId}/reviews`, {
    signal,
    skipAuthRedirect: true,
  } as AuthRequestConfig)
  const payload = response.data?.data ?? response.data
  const reviewList: PropertyReview[] = payload?.reviews ?? (Array.isArray(payload) ? payload : [])
  return {
    reviews: reviewList,
    averageRating: payload?.average_rating ?? 0,
    totalReviews: payload?.total_reviews ?? 0,
  }
}

export async function submitReview(propertyId: string, payload: ReviewPayload): Promise<void> {
  await api.post(`/properties/${propertyId}/reviews`, {
    rating: payload.rating,
    comment: payload.comment,
  })
}

export async function editReview(
  propertyId: string,
  reviewId: string,
  payload: ReviewPayload,
): Promise<void> {
  await api.patch(`/properties/${propertyId}/reviews/${reviewId}`, {
    rating: payload.rating,
    comment: payload.comment,
  })
}
