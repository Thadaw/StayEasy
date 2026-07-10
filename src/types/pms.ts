// PMS Property Management System - TypeScript Interfaces

export interface PropertyPayload {
  name: string
  property_type: string
  total_rooms: number
  no_of_floors: number
  year_built: number
  description: string
  phone: string
  email: string
  country: string
  state: string
  city: string
  zip_code: string
  address: string
  map_link: string
  star_rating: number
  check_in_from: string
  check_in_to: string
  check_out_from: string
  check_out_to: string
  amenities: string[]
  is_active: boolean
}

export interface PropertyResponse extends PropertyPayload {
  id: number
  created_at?: string
  updated_at?: string
}

export interface RoomPayload {
  floor: string
  name: string
  room_type: string
  bed_type: string
  max_adults: number
  max_children: number
  pets_allowed: boolean
  min_rate: string
  cancellation_policy: string
  amenities: string[]
}

export interface RoomResponse extends RoomPayload {
  id: number
  property_id: number
  created_at?: string
}

export interface SpecialOfferPayload {
  title: string
  description: string
  badge: string
  discount_percentage?: number
  start_date: string | null
  end_date: string | null
  is_active: boolean
}

export interface SpecialOfferResponse extends SpecialOfferPayload {
  id: number
  property_id: number
  created_at?: string
}

export interface DiscountCodePayload {
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  valid_from: string
  valid_until: string
  max_uses: number | null
  min_stay: number
  is_active: boolean
}

export interface DiscountCodeResponse extends DiscountCodePayload {
  id: number
  property_id: number
  created_at?: string
}

export interface ActivationPayload {
  is_active: boolean
}

export interface AmenityOption {
  id: string | number
  name: string
  label?: string
  icon?: string
}

// ─── Tenant ─────────────────────────────────────────────────

export interface TenantPayload {
  name: string
}

export interface TenantResponse {
  id: number | string
  name: string
  created_at?: string
}
