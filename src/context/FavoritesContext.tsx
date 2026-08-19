import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import type { SearchProperty } from '../shared/types/api'

interface FavoritesContextValue {
  favorites: Set<string>
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string, property?: SearchProperty) => void
  getFavoriteProperties: () => SearchProperty[]
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function getStorageKey(userId?: number): string {
  return userId ? `favorites_${userId}` : 'favorites_guest'
}

function getDataStorageKey(userId?: number): string {
  return userId ? `favorites_data_${userId}` : 'favorites_data_guest'
}

function loadFavorites(userId?: number): Set<string> {
  try {
    const data = localStorage.getItem(getStorageKey(userId))
    return data ? new Set(JSON.parse(data)) : new Set()
  } catch {
    return new Set()
  }
}

function loadFavoritesData(userId?: number): Record<string, SearchProperty> {
  try {
    const data = localStorage.getItem(getDataStorageKey(userId))
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function saveFavorites(ids: Set<string>, userId?: number) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify([...ids]))
}

function saveFavoritesData(data: Record<string, SearchProperty>, userId?: number) {
  localStorage.setItem(getDataStorageKey(userId), JSON.stringify(data))
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites(user?.id))
  const [favoritesData, setFavoritesData] = useState<Record<string, SearchProperty>>(() => loadFavoritesData(user?.id))

  useEffect(() => {
    setFavorites(loadFavorites(user?.id))
    setFavoritesData(loadFavoritesData(user?.id))
  }, [user?.id])

  useEffect(() => {
    saveFavorites(favorites, user?.id)
  }, [favorites, user?.id])

  useEffect(() => {
    saveFavoritesData(favoritesData, user?.id)
  }, [favoritesData, user?.id])

  const isFavorite = useCallback(
    (id: string) => favorites.has(id),
    [favorites]
  )

  const toggleFavorite = useCallback(
    (id: string, property?: SearchProperty) => {
      setFavorites((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
      if (property) {
        setFavoritesData((prev) => {
          const next = { ...prev }
          if (next[id]) {
            delete next[id]
          } else {
            next[id] = property
          }
          return next
        })
      }
    },
    []
  )

  const getFavoriteProperties = useCallback(
    () => Object.values(favoritesData).filter((p) => favorites.has(p.property_id)),
    [favorites, favoritesData]
  )

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        getFavoriteProperties,
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
