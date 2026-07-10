export interface RoomPricing {
  id: number
  roomType: string
  bedDescription: string
  occupancy: string
  baseRate: number
  weekendRate: number
  extraPersonRate: number
  status: 'Active' | 'Inactive'
  image?: string
}

export interface SeasonalPricing {
  id: number
  seasonName: string
  emoji: string
  dateRange: string
  appliesTo: string
  rateAdjustment: string
  status: 'Active' | 'Scheduled' | 'Expired'
}

export interface Discount {
  id: number
  discountName: string
  type: string
  value: string
  appliesTo: string
  validUntil: string
  status: 'Active' | 'Scheduled' | 'Expired'
}

export interface PricingStats {
  activeDiscounts: number
  seasonalPrices: number
  bestRate: number
  revenueImpact: number
}
