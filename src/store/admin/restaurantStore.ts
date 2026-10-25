import { create } from 'zustand'

interface RestaurantState {
  period: string
  setPeriod: (period: string) => void
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  period: 'This Week',
  setPeriod: (period) => set({ period }),
}))
