import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PropertyState {
  currentPropertyId: string | null
  setCurrentPropertyId: (id: string | null) => void
}

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set) => ({
      currentPropertyId: null,
      setCurrentPropertyId: (id) => set({ currentPropertyId: id }),
    }),
    { name: 'stayeasy-current-property' }
  )
)
