import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { decodeTokenExp } from './services/axios'

export interface AuthRequestConfig extends AxiosRequestConfig {
  skipAuthRedirect?: boolean
}

const TOKEN_KEY = 'token'
const REFRESH_KEY = 'refreshToken'
const ROLE_KEY = 'authRole'
const EXPIRY_KEY = 'tokenExpiry'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://stay-easy-sizw.onrender.com/api/v1',
  
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
  }
})

function storageGet(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

// Persist to the store the session lives in (rememberMe) and keep the expiry
// marker in sync — the old "only if a token already exists" check lost
// refreshed tokens after an expiry cleanup, breaking the session later.
function sessionStore(): Storage {
  return localStorage.getItem('rememberMe') !== 'false' ? localStorage : sessionStorage
}

function updateAccessToken(token: string) {
  const store = sessionStore()
  store.setItem(TOKEN_KEY, token)
  const exp = decodeTokenExp(token)
  store.setItem(EXPIRY_KEY, String(exp ? exp * 1000 : Date.now() + 24 * 60 * 60 * 1000))
}

api.interceptors.request.use((config) => {
  const token = storageGet(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = storageGet(REFRESH_KEY)
  if (!refreshToken) throw new Error('No refresh token available')
  const role = storageGet(ROLE_KEY) === 'guest' ? 'guests' : 'users'
  const { data } = await axios.post(`${api.defaults.baseURL}/auth/${role}/refresh`, {
    refresh_token: refreshToken,
  })
  updateAccessToken(data.access_token)
  return data.access_token
}

function redirectToLogin() {
  const role = storageGet(ROLE_KEY)
  // Staff log in through the host section — /staff/login is a guest-mode
  // form that can never authenticate users-table staff credentials.
  let loginPath = '/host/login'
  if (role === 'guest') loginPath = '/login'

  // Clear the dead session BEFORE redirecting (parity with services/axios):
  // stale tokens must not survive, or the next load ping-pongs between the
  // dashboard and the login page.
  const keys = [TOKEN_KEY, REFRESH_KEY, ROLE_KEY, EXPIRY_KEY]
  keys.forEach((k) => {
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
  })

  if (window.location.pathname !== loginPath) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search)
    window.location.href = `${loginPath}?redirect=${redirect}`
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error)
    }

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
