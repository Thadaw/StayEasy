import { useState, useEffect, useCallback } from 'react'
import { fetchCurrentUser } from '../services/authApi'
import type { User } from '../types'

interface UseAuthReturn {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, userType?: 'host' | 'guest') => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

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

export function useAuthState(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const loadCurrentUser = useCallback(async () => {
    try {
      const userType = localStorage.getItem('userType') || 'guest'
      const data = await fetchCurrentUser(userType as 'host' | 'guest')
      setUser(normalizeUser(data))
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    loadCurrentUser().finally(() => setLoading(false))
  }, [token, loadCurrentUser])

  const login = async (newToken: string, userType?: 'host' | 'guest') => {
    localStorage.setItem('token', newToken)
    if (userType) localStorage.setItem('userType', userType)
    setToken(newToken)
    await loadCurrentUser()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return {
    user,
    token,
    loading,
    login,
    logout,
    refreshUser: loadCurrentUser,
  }
}
