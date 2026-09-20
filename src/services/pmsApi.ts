import api from '../api'
import type {
  GeneralInfoPayload,
  GeneralInfoResponse,
  LocationPayload,
  PhotosAmenitiesPayload,
  LocalizationPayload,
  BrandVisualPayload,
  RoomBase,
  RoomBulkCreateRequest,
  RoomResponse,
  RoomTypeResponse,
  BedTypeResponse,
  AvailableRoom,
  RoomCalendarRoom,
  SpecialOfferPayload,
  SpecialOfferResponse,
  DiscountCodePayload,
  DiscountCodeResponse,
  AmenityOption,
  TenantResponse,
  PropertyBooking,
  BookingCreatePayload,
  WalkinBookingPayload,
  ArrivalGuest,
  StaffNotification,
  NotificationsResponse,
} from '../types/pms'

// The backend wraps every JSON response in a StandardResponse envelope:
//   { success: true, data: <payload>, meta: ... }
// Unwrap `data` while falling back to the raw body so both envelope and
// bare-response backends keep working.
function unwrapBody<T>(body: unknown): T {
  const wrapped = body as { data?: T } | null
  return wrapped?.data ?? (body as T)
}

// ─── Properties ──────────────────────────────────────────────

export const createGeneralInfo = async (data: GeneralInfoPayload): Promise<GeneralInfoResponse> => {
  const { data: result } = await api.post('/properties/general-information', data)
  return unwrapBody<GeneralInfoResponse>(result)
}

export const createLocation = async (propertyId: string, data: LocationPayload): Promise<void> => {
  await api.post(`/properties/${propertyId}/create-location`, data)
}

export const createPhotosAmenities = async (propertyId: string, data: PhotosAmenitiesPayload): Promise<void> => {
  await api.post(`/properties/${propertyId}/create-photos-and-amenities`, data)
}

export const createLocalization = async (propertyId: string, data: LocalizationPayload): Promise<void> => {
  await api.post(`/properties/${propertyId}/create-localization`, data)
}

export const createBrandVisual = async (propertyId: string, data: BrandVisualPayload): Promise<void> => {
  await api.post(`/properties/${propertyId}/create-brand-visual`, data)
}

export const getProperty = async (id: string): Promise<GeneralInfoResponse> => {
  const { data: result } = await api.get(`/properties/${id}`)
  return unwrapBody<GeneralInfoResponse>(result)
}

export const getAllProperties = async (): Promise<GeneralInfoResponse[]> => {
  const all: GeneralInfoResponse[] = []
  let skip = 0
  const pageSize = 50
  for (;;) {
    const { data: result } = await api.get('/properties/', { params: { skip, limit: pageSize } })
    const data = unwrapBody<{ properties?: GeneralInfoResponse[] }>(result)
    const batch: GeneralInfoResponse[] = data?.properties ?? []
    all.push(...batch)
    if (batch.length < pageSize) break
    skip += pageSize
  }
  return all
}

export const deleteProperty = async (id: string): Promise<void> => {
  await api.delete(`/properties/${id}`)
}

export const updatePropertyActivation = async (id: string): Promise<string> => {
  const { data: result } = await api.post(`/properties/${id}/toggle-property-activation`)
  return unwrapBody<string>(result)
}

export const getAmenities = async (): Promise<AmenityOption[]> => {
  const { data: result } = await api.get('/properties/amenities')
  const data = unwrapBody<{ amenities?: AmenityOption[] }>(result)
  return Array.isArray(data?.amenities) ? data.amenities : []
}

// ─── Images ──────────────────────────────────────────────────

export const uploadPropertyImage = async (propertyId: string, formData: FormData): Promise<string[]> => {
  const { data: result } = await api.post(`/properties/${propertyId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  const data = unwrapBody<string[]>(result)
  return Array.isArray(data) ? data : []
}

export const uploadRoomImages = async (propertyId: string, formData: FormData): Promise<string[]> => {
  const { data: result } = await api.post(`/properties/${propertyId}/rooms/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  const data = unwrapBody<string[]>(result)
  return Array.isArray(data) ? data : []
}

// ─── Rooms ───────────────────────────────────────────────────

export const createRooms = async (propertyId: string, data: RoomBulkCreateRequest): Promise<{ rooms: RoomResponse[] }> => {
  const { data: result } = await api.post(`/properties/${propertyId}/rooms`, data)
  return unwrapBody<{ rooms: RoomResponse[] }>(result)
}

export const getRooms = async (propertyId: string): Promise<RoomResponse[]> => {
  const all: RoomResponse[] = []
  let skip = 0
  const pageSize = 50
  for (;;) {
    const { data: result } = await api.get(`/properties/${propertyId}/rooms`, { params: { skip, limit: pageSize } })
    const data = unwrapBody<RoomResponse[]>(result)
    const batch: RoomResponse[] = Array.isArray(data) ? data : []
    all.push(...batch)
    if (batch.length < pageSize) break
    skip += pageSize
  }
  return all
}

export const getRoom = async (propertyId: string, roomId: string): Promise<RoomResponse> => {
  const { data: result } = await api.get(`/properties/${propertyId}/rooms/${roomId}`)
  return unwrapBody<RoomResponse>(result)
}

export const updateRoom = async (propertyId: string, roomId: string, data: Partial<RoomBase>): Promise<RoomResponse> => {
  const { data: result } = await api.patch(`/properties/${propertyId}/rooms/${roomId}`, data)
  return unwrapBody<RoomResponse>(result)
}

export const deleteRoom = async (propertyId: string, roomId: string): Promise<void> => {
  await api.delete(`/properties/${propertyId}/rooms/${roomId}`)
}

export const getAvailableRooms = async (propertyId: string, checkinDate: string, checkoutDate: string, adults: number, children: number): Promise<AvailableRoom[]> => {
  const { data: result } = await api.get(`/properties/${propertyId}/rooms/available-rooms`, {
    params: { checkin_date: checkinDate, checkout_date: checkoutDate, adults, children },
  })
  const data = unwrapBody<AvailableRoom[]>(result)
  return Array.isArray(data) ? data : []
}

export const getRoomCalendar = async (propertyId: string, startDate: string, endDate: string): Promise<RoomCalendarRoom[]> => {
  const { data: result } = await api.get(`/staff/properties/${propertyId}/room-calendar`, {
    params: { start_date: startDate, end_date: endDate },
  })
  const data = unwrapBody<{ rooms: RoomCalendarRoom[] }>(result)
  return data?.rooms ?? (Array.isArray(data) ? data : [])
}

// ─── Room Types ─────────────────────────────────────────────

export const getRoomTypes = async (propertyId: string): Promise<RoomTypeResponse[]> => {
  const { data: result } = await api.get(`/properties/${propertyId}/rooms/room-types`)
  const data = unwrapBody<RoomTypeResponse[]>(result)
  return Array.isArray(data) ? data : []
}

export const createRoomType = async (propertyId: string, roomTypeName: string): Promise<RoomTypeResponse> => {
  const { data: result } = await api.post(`/properties/${propertyId}/rooms/room-type`, { room_type_name: roomTypeName })
  return unwrapBody<RoomTypeResponse>(result)
}

// ─── Bed Types ──────────────────────────────────────────────

export const getBedTypes = async (propertyId: string): Promise<BedTypeResponse[]> => {
  const { data: result } = await api.get(`/properties/${propertyId}/rooms/bed-types`)
  const data = unwrapBody<BedTypeResponse[]>(result)
  return Array.isArray(data) ? data : []
}

export const createBedType = async (propertyId: string, bedName: string): Promise<BedTypeResponse> => {
  const { data: result } = await api.post(`/properties/${propertyId}/rooms/bed-type`, { bed_name: bedName })
  return unwrapBody<BedTypeResponse>(result)
}

// ─── Special Offers ──────────────────────────────────────────

export const createSpecialOffers = async (propertyId: string, offers: SpecialOfferPayload[]): Promise<SpecialOfferResponse[]> => {
  const { data: result } = await api.post(`/properties/${propertyId}/special-offers/`, { offers })
  const data = unwrapBody<SpecialOfferResponse[]>(result)
  return Array.isArray(data) ? data : []
}

export const getSpecialOffers = async (propertyId: string): Promise<SpecialOfferResponse[]> => {
  const { data: result } = await api.get(`/properties/${propertyId}/special-offers/`)
  const data = unwrapBody<SpecialOfferResponse[]>(result)
  return Array.isArray(data) ? data : []
}

export const getSpecialOffer = async (propertyId: string, offerId: string): Promise<SpecialOfferResponse> => {
  const { data: result } = await api.get(`/properties/${propertyId}/special-offers/${offerId}`)
  return unwrapBody<SpecialOfferResponse>(result)
}

export const updateSpecialOffer = async (propertyId: string, offerId: string, data: Partial<SpecialOfferPayload>): Promise<SpecialOfferResponse> => {
  const { data: result } = await api.patch(`/properties/${propertyId}/special-offers/${offerId}`, data)
  return unwrapBody<SpecialOfferResponse>(result)
}

export const deleteSpecialOffer = async (propertyId: string, offerId: string): Promise<void> => {
  await api.delete(`/properties/${propertyId}/special-offers/${offerId}`)
}

// ─── Discount Codes ─────────────────────────────────────────

export const createDiscountCode = async (propertyId: string, data: DiscountCodePayload): Promise<DiscountCodeResponse> => {
  const { data: result } = await api.post(`/properties/${propertyId}/discount-codes/`, data)
  return unwrapBody<DiscountCodeResponse>(result)
}

export const getDiscountCodes = async (propertyId: string): Promise<DiscountCodeResponse[]> => {
  const { data: result } = await api.get(`/properties/${propertyId}/discount-codes/`)
  const data = unwrapBody<DiscountCodeResponse[]>(result)
  return Array.isArray(data) ? data : []
}

export const getDiscountCode = async (propertyId: string, discountId: string): Promise<DiscountCodeResponse> => {
  const { data: result } = await api.get(`/properties/${propertyId}/discount-codes/${discountId}`)
  return unwrapBody<DiscountCodeResponse>(result)
}

export const updateDiscountCode = async (propertyId: string, discountId: string, data: Partial<DiscountCodePayload>): Promise<DiscountCodeResponse> => {
  const { data: result } = await api.patch(`/properties/${propertyId}/discount-codes/${discountId}`, data)
  return unwrapBody<DiscountCodeResponse>(result)
}

export const deleteDiscountCode = async (propertyId: string, discountId: string): Promise<void> => {
  await api.delete(`/properties/${propertyId}/discount-codes/${discountId}`)
}

// ─── Tenant ─────────────────────────────────────────────────

export const getTenant = async (): Promise<TenantResponse> => {
  const { data: result } = await api.get('/tenants/')
  return unwrapBody<TenantResponse>(result)
}

export const createTenant = async (name: string): Promise<TenantResponse> => {
  const { data: result } = await api.post('/tenants/', { name })
  return unwrapBody<TenantResponse>(result)
}

export const updateTenant = async (name: string): Promise<TenantResponse> => {
  const { data: result } = await api.patch('/tenants/', { name })
  return unwrapBody<TenantResponse>(result)
}

export const deleteTenant = async (): Promise<void> => {
  await api.delete('/tenants/')
}

// ─── Bookings ───────────────────────────────────────────────

export const getPropertyBookings = async (propertyId: string): Promise<PropertyBooking[]> => {
  const all: PropertyBooking[] = []
  let skip = 0
  const pageSize = 50
  for (;;) {
    const { data: result } = await api.get(`/properties/${propertyId}/bookings`, { params: { skip, limit: pageSize } })
    const data = unwrapBody<PropertyBooking[]>(result)
    const batch: PropertyBooking[] = Array.isArray(data) ? data : []
    all.push(...batch)
    if (batch.length < pageSize) break
    skip += pageSize
  }
  return all
}

export const getBookingByRefNumber = async (refNumber: string): Promise<PropertyBooking> => {
  const { data: result } = await api.get(`/bookings/${refNumber}`)
  return unwrapBody<PropertyBooking>(result)
}

export const createBooking = async (data: BookingCreatePayload): Promise<PropertyBooking> => {
  const { data: result } = await api.post('/bookings/', data)
  return unwrapBody<PropertyBooking>(result)
}

export const createWalkinBooking = async (data: WalkinBookingPayload): Promise<PropertyBooking> => {
  const fd = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      fd.append(key, Array.isArray(value) ? JSON.stringify(value) : String(value))
    }
  })
  const TOKEN_KEY = 'token'
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
  const baseURL = (api.defaults.baseURL || '').replace(/\/+$/, '')
  const response = await fetch(`${baseURL}/staff/create-walkin-booking`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error || `Request failed with status ${response.status}`)
  }
  const result = await response.json()
  return unwrapBody<PropertyBooking>(result)
}

// ─── Staff Arrivals ──────────────────────────────────────────

export const getTodayArrivals = async (propertyId: string): Promise<ArrivalGuest[]> => {
  const { data: result } = await api.get(`/staff/properties/${propertyId}/arrivals`)
  const data = unwrapBody<ArrivalGuest[]>(result)
  return Array.isArray(data) ? data : []
}

export const getTodayDepartures = async (propertyId: string): Promise<ArrivalGuest[]> => {
  const { data: result } = await api.get(`/staff/properties/${propertyId}/departures`)
  const data = unwrapBody<ArrivalGuest[]>(result)
  return Array.isArray(data) ? data : []
}

// ─── Staff Check-In ──────────────────────────────────────────

export const checkInGuest = async (refNumber: string): Promise<string> => {
  const { data: result } = await api.post(`/staff/check-in/${refNumber}`)
  return typeof result === "string" ? result : result?.data ?? "Checked in"
}

// ─── Staff Check-Out ─────────────────────────────────────────

export const checkOutGuest = async (refNumber: string, amount?: number, paymentGateway?: string): Promise<string> => {
  const { data: result } = await api.post(`/staff/check-out/${refNumber}`, {
    idempotency_key: crypto.randomUUID(),
    amount: amount || 0,
    payment_gateway: paymentGateway || "CASH",
  })
  return typeof result === "string" ? result : result?.data ?? "Checked out"
}

// ─── Staff Front Desk Summary ────────────────────────────────

export interface FrontDeskSummary {
  todays_arrivals: number
  todays_departures: number
  todays_checked_in: number
  todays_checked_out: number
  total_rooms: number
  total_available_rooms: number
  dirty_rooms: number
  occupied_rooms: number
}

export const getFrontDeskSummary = async (propertyId: string): Promise<FrontDeskSummary> => {
  const { data: result } = await api.get(`/staff/properties/${propertyId}/front-desk-summary`)
  return unwrapBody<FrontDeskSummary>(result)
}

// ─── Staff Enums ─────────────────────────────────────────────

export interface EnumOption {
  value: string
  label: string
}

export const getBookingStatuses = async (): Promise<EnumOption[]> => {
  const { data: result } = await api.get('/staff/enums/booking-statuses')
  const data = unwrapBody<EnumOption[]>(result)
  return Array.isArray(data) ? data : []
}

export const getPaymentStatuses = async (): Promise<EnumOption[]> => {
  const { data: result } = await api.get('/staff/enums/payment-statuses')
  const data = unwrapBody<EnumOption[]>(result)
  return Array.isArray(data) ? data : []
}

export const getPaymentGateways = async (): Promise<EnumOption[]> => {
  const { data: result } = await api.get('/staff/enums/payment-gateways')
  const data = unwrapBody<EnumOption[]>(result)
  return Array.isArray(data) ? data : []
}

export const getPaymentMethods = async (): Promise<EnumOption[]> => {
  const { data: result } = await api.get('/staff/enums/payment-methods')
  const data = unwrapBody<EnumOption[]>(result)
  return Array.isArray(data) ? data : []
}

export const getBookingTypes = async (): Promise<EnumOption[]> => {
  const { data: result } = await api.get('/staff/enums/booking-types')
  const data = unwrapBody<EnumOption[]>(result)
  return Array.isArray(data) ? data : []
}

export const uploadCitizenshipPhotos = async (
  refNumber: string,
  front: File | null,
  back: File | null
): Promise<{ front: string; back: string }> => {
  const formData = new FormData()
  if (front) formData.append('front', front)
  if (back) formData.append('back', back)

  const { data: result } = await api.post(
    `/staff/check-in/${refNumber}/citizenship-photos`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  )
  return unwrapBody<{ front: string; back: string }>(result)
}

// ─── Notifications ──────────────────────────────────────────

export interface GetNotificationsParams {
  property_id: string
  skip?: number
  limit?: number
  unread_only?: boolean
  notif_type?: string | null
}

export const getNotifications = async (params: GetNotificationsParams): Promise<NotificationsResponse> => {
  const { data: result } = await api.get('/notifications', { params })
  return unwrapBody<NotificationsResponse>(result)
}

export const getUnreadNotificationCount = async (propertyId: string): Promise<number> => {
  const { data: result } = await api.get('/notifications/unread-count', { params: { property_id: propertyId } })
  const data = unwrapBody<{ unread_count?: number }>(result)
  return data?.unread_count ?? 0
}

export const markNotificationRead = async (notificationId: string): Promise<void> => {
  await api.patch(`/notifications/${notificationId}/read`)
}

export const markAllNotificationsRead = async (propertyId: string): Promise<void> => {
  await api.patch('/notifications/read-all', null, { params: { property_id: propertyId } })
}
