import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'

export interface AuthRequestConfig extends AxiosRequestConfig {
  skipAuthRedirect?: boolean
}

const TOKEN_KEY = 'token'
const REFRESH_KEY = 'refreshToken'
const ROLE_KEY = 'authRole'
const EXPIRY_KEY = 'tokenExpiry'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

function storageGet(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

function updateAccessToken(token: string) {
  if (localStorage.getItem(TOKEN_KEY)) localStorage.setItem(TOKEN_KEY, token)
  else if (sessionStorage.getItem(TOKEN_KEY)) sessionStorage.setItem(TOKEN_KEY, token)
}

function updateRefreshToken(token: string) {
  if (localStorage.getItem(REFRESH_KEY)) localStorage.setItem(REFRESH_KEY, token)
  else if (sessionStorage.getItem(REFRESH_KEY)) sessionStorage.setItem(REFRESH_KEY, token)
}

function clearStoredSession() {
  const keys = [TOKEN_KEY, REFRESH_KEY, ROLE_KEY, EXPIRY_KEY]
  keys.forEach((k) => {
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
  })
}

function redirectToLogin() {
  const isHost = storageGet(ROLE_KEY) === 'host'
  const loginPath = isHost ? '/host/login' : '/login'
  clearStoredSession()
  if (window.location.pathname !== loginPath) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search)
    window.location.href = `${loginPath}?redirect=${redirect}`
  }
}

// Attach the stored JWT to every outgoing request so the backend can identify the user.
api.interceptors.request.use((config) => {
  const token = storageGet(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Token refresh with deduplication: multiple concurrent 401s share ONE refresh request.
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = storageGet(REFRESH_KEY)
  if (!refreshToken) throw new Error('No refresh token available')

  const role = storageGet(ROLE_KEY) === 'guest' ? 'guests' : 'users'
  const { data } = await axios.post(`${api.defaults.baseURL}/auth/${role}/refresh`, {
    refresh_token: refreshToken,
  })

  updateAccessToken(data.access_token)
  if (data.refresh_token) updateRefreshToken(data.refresh_token)
  return data.access_token
}

// On 401, attempt a silent token refresh and retry the original request once.
// If refresh fails, redirect to the role-appropriate login page.
// Requests flagged with skipAuthRedirect (e.g. the post-login /me handshake)
// skip the redirect so a fresh session isn't nuked immediately.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error)
    }

    // Skip redirect for requests that opt out (e.g. initial /me call after login)
    if ((original as AuthRequestConfig).skipAuthRedirect) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }
      const newToken = await refreshPromise
      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch {
      redirectToLogin()
      return Promise.reject(error)
    }
  }
)

export default api
