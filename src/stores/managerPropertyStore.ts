import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ManagerPropertyState {
  assignedPropertyId: string | null
  assignedPropertyName: string | null
  setAssignedProperty: (id: string | null, name?: string | null) => void
  clearAssignedProperty: () => void
}

export const useManagerPropertyStore = create<ManagerPropertyState>()(
  persist(
    (set) => ({
      assignedPropertyId: null,
      assignedPropertyName: null,
      setAssignedProperty: (id, name = null) => set({ assignedPropertyId: id, assignedPropertyName: name }),
      clearAssignedProperty: () => set({ assignedPropertyId: null, assignedPropertyName: null }),
    }),
    { name: 'serveiq-manager-property' }
  )
)
