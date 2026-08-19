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

function updateAccessToken(token: string) {
  if (localStorage.getItem('token')) localStorage.setItem('token', token)
  else if (sessionStorage.getItem('token')) sessionStorage.setItem('token', token)
}

function updateRefreshToken(token: string) {
  if (localStorage.getItem('refreshToken')) localStorage.setItem('refreshToken', token)
  else if (sessionStorage.getItem('refreshToken')) sessionStorage.setItem('refreshToken', token)
}

const clearAuthAndRedirect = () => {
  const keys = ['token', 'refreshToken', 'authRole', 'tokenExpiry']
  keys.forEach((k) => {
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
  })

  const isHost = localStorage.getItem('authRole') === 'host' || sessionStorage.getItem('authRole') === 'host'
  const loginPath = isHost ? '/host/login' : '/login'

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
