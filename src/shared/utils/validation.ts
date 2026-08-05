export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PASSWORD_RE = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

export function extractApiError(err: unknown, fallback = 'An error occurred'): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as { response?: { data?: Record<string, unknown> } }
    if (axiosErr.response?.data) {
      const data = axiosErr.response.data
      if (typeof data.detail === 'string') return data.detail
      if (typeof data.message === 'string') return data.message
      if (Array.isArray(data.errors) && data.errors[0]?.msg) return data.errors[0].msg
    }
  }
  return fallback
}
