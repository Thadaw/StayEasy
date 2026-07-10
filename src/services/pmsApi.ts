import api from '../api'
import type {
  PropertyPayload,
  PropertyResponse,
  RoomPayload,
  RoomResponse,
  SpecialOfferPayload,
  SpecialOfferResponse,
  DiscountCodePayload,
  DiscountCodeResponse,
  ActivationPayload,
  AmenityOption,
  TenantResponse,
} from '../types/pms'

// ─── Properties ──────────────────────────────────────────────

export const createProperty = async (data: Partial<PropertyPayload>): Promise<PropertyResponse> => {
  const { data: result } = await api.post('/pms/properties/', data)
  return result
}

export const updateProperty = async (id: number, data: Partial<PropertyPayload>): Promise<PropertyResponse> => {
  const { data: result } = await api.patch(`/pms/properties/${id}`, data)
  return result
}

export const getProperty = async (id: number): Promise<PropertyResponse> => {
  const { data: result } = await api.get(`/pms/properties/${id}`)
  return result
}

export const getAllProperties = async (): Promise<PropertyResponse[]> => {
  const { data: result } = await api.get('/pms/properties/')
  return result
}

export const deleteProperty = async (id: number): Promise<void> => {
  await api.delete(`/pms/properties/${id}`)
}

export const updatePropertyActivation = async (id: number, payload: ActivationPayload): Promise<PropertyResponse> => {
  const { data: result } = await api.post(`/pms/properties/${id}/activation`, payload)
  return result
}

export const getAmenities = async (): Promise<AmenityOption[]> => {
  const { data: result } = await api.get('/pms/properties/amenities')
  return result
}

// ─── Images ──────────────────────────────────────────────────

export const uploadPropertyImages = async (formData: FormData): Promise<{ urls: string[] }> => {
  const { data: result } = await api.post('/pms/properties/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return result
}

export const uploadRoomImages = async (propertyId: number, formData: FormData): Promise<{ urls: string[] }> => {
  const { data: result } = await api.post(`/pms/properties/${propertyId}/rooms/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return result
}

// ─── Rooms ───────────────────────────────────────────────────

export const createRoom = async (propertyId: number, data: RoomPayload): Promise<RoomResponse> => {
  const { data: result } = await api.post(`/pms/properties/${propertyId}/rooms`, data)
  return result
}

export const getRooms = async (propertyId: number): Promise<RoomResponse[]> => {
  const { data: result } = await api.get(`/pms/properties/${propertyId}/rooms`)
  return result
}

export const updateRoom = async (propertyId: number, roomId: number, data: Partial<RoomPayload>): Promise<RoomResponse> => {
  const { data: result } = await api.patch(`/pms/properties/${propertyId}/rooms/${roomId}`, data)
  return result
}

export const deleteRoom = async (propertyId: number, roomId: number): Promise<void> => {
  await api.delete(`/pms/properties/${propertyId}/rooms/${roomId}`)
}

// ─── Special Offers ──────────────────────────────────────────

export const createSpecialOffers = async (propertyId: number, offers: SpecialOfferPayload[]): Promise<SpecialOfferResponse[]> => {
  const { data: result } = await api.post(`/pms/${propertyId}/special-offers`, offers)
  return result
}

export const getSpecialOffers = async (propertyId: number): Promise<SpecialOfferResponse[]> => {
  const { data: result } = await api.get(`/pms/${propertyId}/special-offers`)
  return result
}

export const getSpecialOffer = async (propertyId: number, offerId: number): Promise<SpecialOfferResponse> => {
  const { data: result } = await api.get(`/pms/${propertyId}/special-offers/${offerId}`)
  return result
}

export const updateSpecialOffer = async (propertyId: number, offerId: number, data: Partial<SpecialOfferPayload>): Promise<SpecialOfferResponse> => {
  const { data: result } = await api.patch(`/pms/${propertyId}/special-offers/${offerId}`, data)
  return result
}

export const deleteSpecialOffer = async (propertyId: number, offerId: number): Promise<void> => {
  await api.delete(`/pms/${propertyId}/special-offers/${offerId}`)
}

// ─── Discount Codes ─────────────────────────────────────────

export const createDiscountCode = async (propertyId: number, data: DiscountCodePayload): Promise<DiscountCodeResponse> => {
  const { data: result } = await api.post(`/pms/properties/${propertyId}/discount-codes/`, data)
  return result
}

export const getDiscountCodes = async (propertyId: number): Promise<DiscountCodeResponse[]> => {
  const { data: result } = await api.get(`/pms/properties/${propertyId}/discount-codes/`)
  return result
}

export const getDiscountCode = async (propertyId: number, discountId: number): Promise<DiscountCodeResponse> => {
  const { data: result } = await api.get(`/pms/properties/${propertyId}/discount-codes/${discountId}`)
  return result
}

export const updateDiscountCode = async (propertyId: number, discountId: number, data: Partial<DiscountCodePayload>): Promise<DiscountCodeResponse> => {
  const { data: result } = await api.patch(`/pms/properties/${propertyId}/discount-codes/${discountId}`, data)
  return result
}

export const deleteDiscountCode = async (propertyId: number, discountId: number): Promise<void> => {
  await api.delete(`/pms/properties/${propertyId}/discount-codes/${discountId}`)
}

// ─── Tenant ─────────────────────────────────────────────────

export const getTenant = async (): Promise<TenantResponse> => {
  const { data: result } = await api.get('/api/v1/tenants/')
  return result
}

export const createTenant = async (name: string): Promise<TenantResponse> => {
  const { data: result } = await api.post('/api/v1/tenants/', { name })
  return result
}

export const updateTenant = async (name: string): Promise<TenantResponse> => {
  const { data: result } = await api.patch('/api/v1/tenants/', { name })
  return result
}

export const deleteTenant = async (): Promise<void> => {
  await api.delete('/api/v1/tenants/')
}
