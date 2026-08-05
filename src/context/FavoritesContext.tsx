import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface FavoritesContextValue {
  favorites: Set<number>
  isFavorite: (id: number) => boolean
  toggleFavorite: (id: number) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function getStorageKey(userId?: number): string {
  return userId ? `favorites_${userId}` : 'favorites_guest'
}

function loadFavorites(userId?: number): Set<number> {
  try {
    const data = localStorage.getItem(getStorageKey(userId))
    return data ? new Set(JSON.parse(data)) : new Set()
  } catch {
    return new Set()
  }
}

function saveFavorites(ids: Set<number>, userId?: number) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify([...ids]))
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Set<number>>(() => loadFavorites(user?.id))

  useEffect(() => {
    setFavorites(loadFavorites(user?.id))
  }, [user?.id])

  useEffect(() => {
    saveFavorites(favorites, user?.id)
  }, [favorites, user?.id])

  const isFavorite = useCallback(
    (id: number) => favorites.has(id),
    [favorites]
  )

  const toggleFavorite = useCallback(
    (id: number) => {
      setFavorites((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    },
    []
  )

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be inside FavoritesProvider')
  return ctx
}
