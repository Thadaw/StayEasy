import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { AxiosError } from 'axios'
import api, { type AuthRequestConfig } from '../services/axios'
import type { User } from './types'

type AuthRole = 'host' | 'guest'

interface AuthContextValue {
  user: User | null
  token: string | null
  role: AuthRole
  loading: boolean
  login: (token: string, remember?: boolean, userType?: AuthRole, refreshToken?: string) => Promise<void>
  credentialLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
}

const TOKEN_KEY = 'token'
const REFRESH_KEY = 'refreshToken'
const ROLE_KEY = 'authRole'
const EXPIRY_KEY = 'tokenExpiry'
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000

const AuthContext = createContext<AuthContextValue | null>(null)

function storageGet(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

function readToken(): string | null {
  const persisted = localStorage.getItem(TOKEN_KEY)
  if (persisted) {
    const expiresAt = Number(localStorage.getItem(EXPIRY_KEY) || 0)
    if (expiresAt && Date.now() > expiresAt) {
      clearAuth()
      return null
    }
    return persisted
  }
  return sessionStorage.getItem(TOKEN_KEY)
}

function readRole(): AuthRole {
  return storageGet(ROLE_KEY) === 'guest' ? 'guest' : 'host'
}

function saveAuth(token: string, remember: boolean, role: AuthRole, refreshToken?: string) {
  const keys = [TOKEN_KEY, REFRESH_KEY, ROLE_KEY, EXPIRY_KEY]
  keys.forEach((k) => {
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
  })
  const store = remember ? localStorage : sessionStorage
  store.setItem(TOKEN_KEY, token)
  store.setItem(ROLE_KEY, role)
  if (refreshToken) store.setItem(REFRESH_KEY, refreshToken)
  if (remember) store.setItem(EXPIRY_KEY, (Date.now() + EXPIRY_MS).toString())
}

function clearAuth() {
  const keys = [TOKEN_KEY, REFRESH_KEY, ROLE_KEY, EXPIRY_KEY]
  keys.forEach((k) => {
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
  })
}

// Normalize the API response so the UI always receives the same user shape.
// The backend returns inconsistent field naming (snake_case vs camelCase) and
// may omit `name` or `avatar` depending on how the user signed up.
function normalizeUser(user: User): User {
  const name = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
  const parts = name.split(' ')
  const avatar =
    user.avatar ??
    `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=2E86AB&textColor=ffffff`

  return {
    ...user,
    firstName: user.firstName || user.first_name || parts[0] || '',
    lastName: user.lastName || user.last_name || parts.slice(1).join(' ') || '',
    name,
    avatar,
  }
}

function extractApiError(err: unknown, fallback: string): string {
  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data as Record<string, unknown>
    if (typeof data.detail === 'string') return data.detail
    if (typeof data.message === 'string') return data.message
  }
  return fallback
}

function getMeEndpoint(currentRole: AuthRole) {
  return currentRole === 'host' ? '/auth/users/me' : '/auth/guests/me'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => readToken())
  const [role, setRole] = useState<AuthRole>(() => readRole())
  const [loading, setLoading] = useState(true)

  const loadCurrentUser = useCallback(async () => {
    try {
      const response = await api.get<User>(getMeEndpoint(role), { skipAuthRedirect: true } as AuthRequestConfig)
      setUser(normalizeUser(response.data))
    } catch {
      // The session can't be confirmed right now (e.g. /me is down or the role
      // endpoint rejects the token). Keep the stored token so the user isn't
      // force-logged-out immediately after signing in — protected pages will
      // surface their own errors.
      setUser(null)
    }
  }, [role])

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    setLoading(true)

    loadCurrentUser().finally(() => {
      setLoading(false)
    })
  }, [token, loadCurrentUser])

  const login = async (newToken: string, remember = true, userType: AuthRole = 'host', refreshToken?: string) => {
    saveAuth(newToken, remember, userType, refreshToken)
    setRole(userType)
    setToken(newToken)
  }

  const credentialLogin = async (email: string, password: string) => {
    try {
      const params = new URLSearchParams()
      params.append('grant_type', 'password')
      params.append('username', email)
      params.append('password', password)
      const response = await api.post('auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      await login(response.data.access_token, true, 'host', response.data.refresh_token)
      return { success: true }
    } catch (err) {
      return { success: false, error: extractApiError(err, 'Incorrect email or password.') }
    }
  }

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      await api.post('/auth/users/register', { full_name: fullName, email, password })
      return { success: true }
    } catch (err) {
      return { success: false, error: extractApiError(err, 'Could not create account. Please try again.') }
    }
  }

  const refreshUser = async () => {
    if (!token) return
    try {
      const response = await api.get<User>(getMeEndpoint(role), { skipAuthRedirect: true } as AuthRequestConfig)
      setUser(normalizeUser(response.data))
    } catch {
      // Ignore refresh errors — the existing session and user state remain usable.
      // A failed refresh will be retried on the next navigation or focus event.
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.patch<User>(getMeEndpoint(role), data, { skipAuthRedirect: true } as AuthRequestConfig)
      setUser(normalizeUser(response.data))
      return { success: true }
    } catch (err) {
      return { success: false, error: extractApiError(err, 'Failed to update profile.') }
    }
  }

  const logout = () => {
    clearAuth()
    try {
      const keys = Object.keys(localStorage)
      for (const key of keys) {
        if (key === 'serveIQDraft' || key.startsWith('serveIQDraft_')) {
          localStorage.removeItem(key)
        }
      }
    } catch {
      // Ignore storage cleanup errors
    }
    setToken(null)
    setUser(null)
    setRole('host')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        login,
        credentialLogin,
        signup,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
