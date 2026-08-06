import axios, { type AxiosRequestConfig } from 'axios'

export interface AuthRequestConfig extends AxiosRequestConfig {
  skipAuthRedirect?: boolean
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach the stored JWT to every outgoing request so the backend can identify the user.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function clearStoredSession() {
  const keys = ['token', 'refreshToken', 'authRole', 'tokenExpiry']
  keys.forEach((k) => {
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
  })
}

// Force a login redirect on 401 responses. We don't use silent token refresh
// because the backend doesn't issue refresh tokens — a 401 means the session
// is truly expired and the user must re-authenticate.
// Redirects to the role-appropriate login and skips requests flagged with
// skipAuthRedirect (the post-login /me handshake) so a fresh session isn't
// nuked the moment it's created.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !(error.config as AuthRequestConfig)?.skipAuthRedirect) {
      const isHost = localStorage.getItem('authRole') === 'host' || sessionStorage.getItem('authRole') === 'host'
      const loginPath = isHost ? '/host/login' : '/login'
      if (window.location.pathname !== loginPath) {
        clearStoredSession()
        const redirect = encodeURIComponent(window.location.pathname + window.location.search)
        window.location.href = `${loginPath}?redirect=${redirect}`
      }
    }
    return Promise.reject(error)
  }
)

export default api
