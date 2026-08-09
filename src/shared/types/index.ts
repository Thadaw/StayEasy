export * from './api'
export * from './booking'
export * from './razorpay'
export * from './stripe'

export interface Coupon {
  id: string
  code: string
  description: string
  discount: number
  discountType: 'percentage' | 'fixed'
  status: 'active' | 'used' | 'expired'
  expiresAt: string
  usedAt?: string
}

export interface Destination {
  id: string
  name: string
  country: string
  image: string
  propertyCount: number
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  avatar: string
}

export interface Tenant {
  id: string
  name: string
  email: string
  phone: string
}
