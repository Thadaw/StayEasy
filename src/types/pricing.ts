// ===== Overview Page Types =====

export interface PricingOverviewStat {
  id: number
  label: string
  value: string | number
  subtitle: string
  icon: string
  iconBg: string
  iconColor: string
  linkText: string
}

export interface PricingFeatureCard {
  id: number
  title: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
  buttonColor: string
  viewKey: string
}

export interface PricingActivity {
  id: number
  date: string
  time: string
  module: string
  moduleColor: { bg: string; text: string }
  action: string
  user: string
  status: string
}

export interface UpcomingPromotion {
  id: number
  name: string
  dateRange: string
  description: string
  status: 'Upcoming' | 'Active' | 'Expired'
  iconBg: string
  iconColor: string
  icon: string
}

// ===== Seasonal Pricing Types =====

export interface SeasonTimeline {
  id: number
  name: string
  color: string
  startDate: string
  endDate: string
  label: string
}

export interface SeasonalPricingEntry {
  id: number
  seasonName: string
  seasonColor: string
  roomType: string
  dateRange: string
  basePrice: number
  seasonalPrice: number
  change: number
  status: 'Active' | 'Upcoming' | 'Expired'
}

// ===== Discount Types =====

export interface DiscountOffer {
  id: number
  name: string
  description: string
  code: string
  type: string
  applicableTo: string
  discount: string
  validity: string
  status: 'Active' | 'Upcoming' | 'Expired'
  usage: number
  iconBg: string
  iconColor: string
  icon: string
}

export interface OfferDetail {
  id: number
  name: string
  status: 'Active' | 'Upcoming' | 'Expired'
  code: string
  type: string
  discount: string
  applicableTo: string
  minimumStay: string
  maximumDiscount: string
  validityPeriod: string
  usageLimit: string
  used: string
  description: string
}

// ===== Package Types =====

export interface Package {
  id: number
  name: string
  description: string
  type: string
  typeColor: string
  applicableTo: string
  price: number
  validity: string
  status: 'Active' | 'Upcoming' | 'Expired'
  bookings: number
  image: string
}

export interface PackageDetail {
  id: number
  name: string
  status: 'Active' | 'Upcoming' | 'Expired'
  type: string
  applicableTo: string
  price: number
  validity: string
  minimumStay: string
  inclusions: string[]
  description: string
  image: string
}
