type FetchOptions = RequestInit

interface RefreshResponse {
  access_token: string
  refresh_token?: string
}

let refreshPromise: Promise<string | null> | null = null

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1'

function storageGet(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

// Persist to the store the session lives in (rememberMe flag) — the old
// "only if a token already exists" check lost refreshed tokens entirely
// after an expiry cleanup, breaking the session on the next tab/reload.
function sessionStore(): Storage {
  return localStorage.getItem('rememberMe') !== 'false' ? localStorage : sessionStorage
}

function updateAccessToken(token: string) {
  sessionStore().setItem('token', token)
}

function updateRefreshToken(token: string) {
  sessionStore().setItem('refreshToken', token)
}

const clearAuthAndRedirect = () => {
  // Read the role BEFORE clearing storage — otherwise every failed refresh
  // used to bounce hosts/staff to the guest /login page.
  const isHost = localStorage.getItem('authRole') === 'host' || sessionStorage.getItem('authRole') === 'host'
  const isStaff = localStorage.getItem('authRole') === 'staff' || sessionStorage.getItem('authRole') === 'staff'

  const keys = ['token', 'refreshToken', 'authRole', 'tokenExpiry']
  keys.forEach((k) => {
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
  })

  // Staff log in through the host section — /staff/login is guest-mode and
  // can never authenticate staff (users-table) credentials.
  const loginPath = isHost || isStaff ? '/host/login' : '/login'

  if (window.location.pathname !== loginPath) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search)
    window.location.href = `${loginPath}?redirect=${redirect}`
  }
}

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const refreshToken = storageGet('refreshToken')
      if (!refreshToken) {
        clearAuthAndRedirect()
        return null
      }

      const role = storageGet('authRole') === 'guest' ? 'guests' : 'users'

      const response = await fetch(`${API_BASE}/auth/${role}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        clearAuthAndRedirect()
        return null
      }

      const data: RefreshResponse = await response.json()
      if (!data.access_token) {
        clearAuthAndRedirect()
        return null
      }

      updateAccessToken(data.access_token)
      if (data.refresh_token) updateRefreshToken(data.refresh_token)

      return data.access_token
    } catch (error) {
      console.error('Token refresh failed:', error)
      clearAuthAndRedirect()
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export const fetchWithAuth = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  const token = storageGet('token')

  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const finalOptions: RequestInit = { ...options, headers }

  let response = await fetch(`${API_BASE}${url}`, finalOptions)

  if (response.status !== 401) return response

  const newAccessToken = await refreshAccessToken()
  if (!newAccessToken) return response

  const retryHeaders = new Headers(finalOptions.headers)
  retryHeaders.set('Authorization', `Bearer ${newAccessToken}`)

  const retryOptions: RequestInit = { ...finalOptions, headers: retryHeaders }
  response = await fetch(`${API_BASE}${url}`, retryOptions)

  return response
}
