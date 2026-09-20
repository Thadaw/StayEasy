import toast from "react-hot-toast"

interface ApiError {
  response?: {
    data?: { message?: string }
    status?: number
  }
  message?: string
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (!error) return fallback
  const err = error as ApiError
  return err.response?.data?.message || err.message || fallback
}

export function toastApiError(error: unknown, fallback?: string) {
  toast.error(getErrorMessage(error, fallback))
}
