export * from './api'
export * from './booking'
export * from './razorpay'
export * from './stripe'

export interface Coupon {
  id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minStay: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  isActive: boolean
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
