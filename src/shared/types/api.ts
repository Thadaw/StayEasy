export interface ApiProperty {
  id: string
  tenant_id: string
  name: string
  type: string
  description: string
  country: string
  state: string
  city: string
  zip_code: string
  address: string
  latitude: string | null
  longitude: string | null
  check_in_time: string
  check_out_time: string
  check_in_grace_period: number
  check_out_grace_period: number
  always_allow_check_in_out: boolean
  number_of_floors: number
  total_rooms: number
  year_built: number
  phone_number: string
  email: string
  currency: string
  timezone: string
  language: string
  brand_logo_url: string
  brand_color: string
  is_active: boolean
  system_amenities: { id: string; name: string; icon: string }[]
  custom_amenities: { icon: string | null; name: string }[]
  photos: { cover: string; gallery: string[] }
}

export interface ApiRoom {
  id: string
  property_id: string
  floor_number: number
  room_name: string
  room_type_id: string
  bed_type_id: string
  max_adults: number
  max_children: number
  base_rate: string
  status: string
  cancellation_policy: string
  cancellation_title: string
  cancellation_description: string
  photos: { cover: string; gallery: string[] }
  system_amenity_ids: string[]
  custom_amenities: { icon: string | null; name: string }[]
}

export interface SearchProperty {
  property_id: string
  name: string
  type: string
  country: string
  state: string
  city: string
  address: string
  currency: string
  cover_photo: string
  distance_km?: number
  total_price?: number
  lowest_rate?: number
  nights?: number
  description?: string
  total_rooms?: number
  year_built?: number
  phone_number?: string
  email?: string
  system_amenities?: { id: string; name: string; icon: string }[]
  custom_amenities?: { icon: string | null; name: string }[]
  amenities?: string[]
}
