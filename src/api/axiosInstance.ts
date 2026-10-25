import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'

export interface AuthRequestConfig extends AxiosRequestConfig {
  skipAuthRedirect?: boolean
}

const TOKEN_KEY = 'token'
const REFRESH_KEY = 'refreshToken'
const ROLE_KEY = 'authRole'
const EXPIRY_KEY = 'tokenExpiry'
const REMEMBER_KEY = 'rememberMe'
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000
const REFRESH_AHEAD_MS = 2 * 60 * 1000
const FALLBACK_TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000

// Multipart uploads (property/room/staff images, citizenship photos) can take
// far longer than the default 15s request timeout on slow connections.
export const UPLOAD_TIMEOUT_MS = 180_000

const baseURL = (env.apiBaseUrl || 'https://stay-easy-sizw.onrender.com/api/v1').replace(/\/+$/, '')

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    ...(baseURL.includes('ngrok') && { 'ngrok-skip-browser-warning': 'true' })
  }
})

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

function storageGet(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

// Write to the store the session actually lives in (rememberMe flag), not
// "whichever store already has a token" — after an expiry cleanup NEITHER
// store has one, so refreshed tokens would be silently lost.
function sessionStore(): Storage {
  return localStorage.getItem(REMEMBER_KEY) !== 'false' ? localStorage : sessionStorage
}

// Returns the JWT `exp` claim in SECONDS, or null if it can't be decoded.
export function decodeTokenExp(token: string): number | null {
  try {
    // JWTs use base64url, which atob() doesn't handle natively.
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch {
    return null
  }
}

function updateAccessToken(token: string) {
  const store = sessionStore()
  store.setItem(TOKEN_KEY, token)
  // Keep the expiry marker in lockstep with the new JWT so a freshly
  // refreshed token is never removed by an expiry check.
  const exp = decodeTokenExp(token)
  store.setItem(EXPIRY_KEY, String(exp ? exp * 1000 : Date.now() + FALLBACK_TOKEN_LIFETIME_MS))
}

function updateRefreshToken(token: string) {
  sessionStore().setItem(REFRESH_KEY, token)
}

function updateTokenExpiry() {
  const deadline = String(Date.now() + EXPIRY_MS)
  if (localStorage.getItem(TOKEN_KEY)) localStorage.setItem(EXPIRY_KEY, deadline)
  else if (sessionStorage.getItem(TOKEN_KEY)) sessionStorage.setItem(EXPIRY_KEY, deadline)
}

function clearStoredSession() {
  ;[TOKEN_KEY, REFRESH_KEY, ROLE_KEY, EXPIRY_KEY].forEach((k) => {
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
  })
}

function redirectToLogin() {
  const role = storageGet(ROLE_KEY)
  // Staff log in through the host section — /staff/login is guest-mode and
  // can never authenticate staff (users-table) credentials.
  const loginPath =
    role === 'host' || role === 'staff' ? '/host/login' : role === 'manager' ? '/manager/login' : '/login'

  // Clear the dead session BEFORE redirecting, or the next load can
  // ping-pong between the dashboard and the login page.
  clearStoredSession()

  if (window.location.pathname !== loginPath) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search)
    window.location.href = `${loginPath}?redirect=${redirect}`
  }
}

// ---------------------------------------------------------------------------
// Request interceptor: attach the stored JWT
// ---------------------------------------------------------------------------

api.interceptors.request.use((config) => {
  const token = storageGet(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------------------------------------------------------------------------
// Token refresh (deduplicated: concurrent callers share ONE request)
// ---------------------------------------------------------------------------

let refreshPromise: Promise<string> | null = null

async function doRefresh(): Promise<string> {
  const refreshToken = storageGet(REFRESH_KEY)
  if (!refreshToken) throw new Error('No refresh token available')

  const role = storageGet(ROLE_KEY) === 'guest' ? 'guests' : 'users'
  const { data } = await axios.post(`${api.defaults.baseURL}/auth/${role}/refresh`, {
    refresh_token: refreshToken
  }, { timeout: 15000 })

  updateAccessToken(data.access_token)
  if (data.refresh_token) updateRefreshToken(data.refresh_token)
  updateTokenExpiry()
  return data.access_token
}

// Single entry point for every refresh (interceptor, timer, proactive check),
// so they can never fire two refresh calls at once. That matters if the
// backend rotates refresh tokens: the second call would use a dead token.
export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

// Refresh early when the access token is close to expiring. Returns the
// token to use, or null if the session is definitively gone.
export async function attemptSessionRefresh(): Promise<string | null> {
  const token = storageGet(TOKEN_KEY)
  if (!token) return null

  const exp = decodeTokenExp(token)
  if (exp && exp * 1000 - Date.now() > REFRESH_AHEAD_MS) return token

  try {
    return await refreshAccessToken()
  } catch (err) {
    // Only a definitive 401 means the session is gone. Transient
    // network/5xx failures keep the current token and retry on the next tick.
    if (err instanceof AxiosError && err.response?.status === 401) return null
    return token
  }
}

// Schedules a refresh 60s before expiry. Returns a cleanup function
// (handy for React useEffect).
export function startTokenRefreshTimer(
  token: string | null,
  onRefresh: (newToken: string) => void
): () => void {
  if (!token) return () => {}

  const exp = decodeTokenExp(token)
  if (!exp) return () => {}

  const refreshAt = exp * 1000 - Date.now() - 60_000

  if (refreshAt <= 0) {
    refreshAccessToken().then(onRefresh).catch(() => {})
    return () => {}
  }

  const timerId = setTimeout(async () => {
    try {
      onRefresh(await refreshAccessToken())
    } catch {
      // The response interceptor will handle the 401 on the next request.
    }
  }, refreshAt)

  return () => clearTimeout(timerId)
}

// ---------------------------------------------------------------------------
// Response interceptor: on 401, refresh once and retry the original request
// ---------------------------------------------------------------------------

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error)
    }

    // Opt-out for requests like the post-login /me handshake.
    if ((original as AuthRequestConfig).skipAuthRedirect) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      const newToken = await refreshAccessToken()
      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch (err) {
      // Redirect only when the refresh token itself is rejected (definitive
      // 401). Transient network/5xx failures keep the session.
      if (err instanceof AxiosError && err.response?.status === 401) {
        redirectToLogin()
      }
      return Promise.reject(error)
    }
  }
)

export default api
