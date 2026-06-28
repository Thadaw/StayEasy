import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../api'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string) => Promise<void>
  credentialLogin: (email: string, password: string) => Promise<boolean>
  signup: (fullName: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapUser(u: User): User {
  const name = u.full_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email
  const parts = name.split(' ')
  return {
    ...u,
    firstName: u.firstName || u.first_name || parts[0] || '',
    lastName: u.lastName || u.last_name || parts.slice(1).join(' ') || '',
    name,
    avatar: u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=2E86AB&textColor=ffffff`,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const { data } = await api.get<User>('/api/v1/auth/users/me')
      setUser(mapUser(data))
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }

  useEffect(() => {
    if (token) {
      fetchUser().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    await fetchUser()
  }

  const credentialLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const form = new FormData()
      form.append('username', email)
      form.append('password', password)
      const res = await api.post('/api/v1/auth/users/login', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await login(res.data.access_token)
      return true
    } catch {
      return false
    }
  }

  const signup = async (fullName: string, email: string, password: string): Promise<boolean> => {
    try {
      await api.post('/api/v1/auth/users/register', {
        full_name: fullName,
        email,
        password,
      })
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, credentialLogin, signup, logout }}>
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
