export const propertyKeys = {
  all: ['properties'] as const,
  detail: (id: string) => ['properties', id] as const,
}

export const roomKeys = {
  all: ['rooms'] as const,
  byProperty: (propertyId: string) => ['rooms', propertyId] as const,
  detail: (propertyId: string, roomId: string) => ['rooms', propertyId, roomId] as const,
  available: (propertyId: string, checkin: string, checkout: string, adults: number, children: number, rooms: number) =>
    ['rooms', 'available', propertyId, checkin, checkout, adults, children, rooms] as const,
}

export const roomTypeKeys = {
  all: ['roomTypes'] as const,
  byProperty: (propertyId: string) => ['roomTypes', propertyId] as const,
}

export const bedTypeKeys = {
  all: ['bedTypes'] as const,
  byProperty: (propertyId: string) => ['bedTypes', propertyId] as const,
}

export const specialOfferKeys = {
  all: ['specialOffers'] as const,
  byProperty: (propertyId: string) => ['specialOffers', propertyId] as const,
}

export const discountCodeKeys = {
  all: ['discountCodes'] as const,
  byProperty: (propertyId: string) => ['discountCodes', propertyId] as const,
}

export const tenantKeys = {
  all: ['tenant'] as const,
}

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: (propertyId: string) => ['analytics', 'overview', propertyId] as const,
  revenueTrend: (propertyId: string, days: number) => ['analytics', 'revenue-trend', propertyId, days] as const,
  revenueByRoomType: (propertyId: string, days: number) => ['analytics', 'revenue-by-room-type', propertyId, days] as const,
  bookingTrend: (propertyId: string, days: number) => ['analytics', 'booking-trend', propertyId, days] as const,
}

export const bookingKeys = {
  all: ['bookings'] as const,
  byProperty: (propertyId: string) => ['bookings', propertyId] as const,
  detail: (refNumber: string) => ['bookings', 'detail', refNumber] as const,
}

export const reviewKeys = {
  all: ['reviews'] as const,
  detail: (propertyId: string) => ['reviews', 'detail', propertyId] as const,
}

export const userKeys = {
  all: ['users'] as const,
  profile: (userId?: number) => ['users', 'profile', userId ?? 'guest'] as const,
}

export const housekeepingKeys = {
  all: ['housekeeping'] as const,
  rooms: (propertyId: string) => ['housekeeping', 'rooms', propertyId] as const,
  roomSummary: (propertyId: string) => ['housekeeping', 'roomSummary', propertyId] as const,
  tasks: (propertyId: string) => ['housekeeping', 'tasks', propertyId] as const,
  staffOptions: (propertyId: string) => ['housekeeping', 'staffOptions', propertyId] as const,
  roomOptions: (propertyId: string) => ['housekeeping', 'roomOptions', propertyId] as const,
  staffWorkSummary: (propertyId: string) => ['housekeeping', 'staffWorkSummary', propertyId] as const,
  taskTypes: (propertyId: string) => ['housekeeping', 'taskTypes', propertyId] as const,
}

export const staffKeys = {
  all: ['staff'] as const,
  list: (propertyId: string) => ['staff', 'list', propertyId] as const,
  detail: (propertyId: string, staffId: string) => ['staff', 'detail', propertyId, staffId] as const,
  summary: (propertyId: string) => ['staff', 'summary', propertyId] as const,
}

export const managerKeys = {
  dashboard: (propertyId: string) => ['manager', 'dashboard', propertyId] as const,
  stats: (propertyId: string) => ['manager', 'stats', propertyId] as const,
}

export interface NearbyKeyParams {
  lat: number
  lng: number
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
}

// The coordinates are part of the key on purpose: a visitor who moves city must
// not keep reading the previous cache entry for an hour.
export const nearbyKeys = {
  all: ['nearbyProperties'] as const,
  list: (p: NearbyKeyParams) =>
    [
      'nearbyProperties',
      p.lat,
      p.lng,
      p.checkIn,
      p.checkOut,
      p.adults,
      p.children,
      p.rooms,
    ] as const,
}

// ─── Front Desk (PMS / staff) ─────────────────────────────
export const frontdeskKeys = {
  all: ['frontdesk'] as const,

  // Summary & dashboard
  summary: (propertyId: string) => ['front-desk-summary', propertyId] as const,
  revenueBookings: (propertyId: string) => ['revenue-bookings', propertyId] as const,

  // Arrivals / departures / check-in / check-out
  arrivals: (propertyId: string) => ['today-arrivals', propertyId] as const,
  arrivalsForFolio: (propertyId: string) => ['arrivals-for-folio', propertyId] as const,
  departures: (propertyId: string) => ['today-departures', propertyId] as const,
  checkoutBookings: (propertyId: string) => ['checkout-bookings', propertyId] as const,
  checkoutBooking: (propertyId: string, id?: string) => ['checkout-booking', propertyId, id] as const,

  // Bookings
  bookings: (propertyId: string) => ['frontdesk-bookings', propertyId] as const,
  bookingDetail: (id?: string) => ['booking-detail', id] as const,

  // Folios
  folios: (propertyId: string) => ['frontdesk-folios', propertyId] as const,
  folioDetail: (folioId?: string) => ['folio-detail', folioId] as const,

  // Guests / in-house
  guests: (propertyId: string) => ['frontdesk-guests', propertyId] as const,
  inHouse: (propertyId: string) => ['in-house-guests', propertyId] as const,

  // Payments
  payments: (propertyId: string) => ['frontdesk-payments', propertyId] as const,

  // Activities
  activities: (propertyId: string) => ['frontdesk-activities', propertyId] as const,

  // Room status / calendar
  roomCalendar: (propertyId: string) => ['room-calendar', propertyId] as const,
  roomsWithRates: (propertyId: string) => ['rooms-with-rates', propertyId] as const,

  // Enums (static dropdowns)
  enums: {
    all: ['frontdesk', 'enums'] as const,
    bookingStatuses: ['frontdesk', 'enums', 'booking-statuses'] as const,
    paymentStatuses: ['frontdesk', 'enums', 'payment-statuses'] as const,
    paymentGateways: ['frontdesk', 'enums', 'payment-gateways'] as const,
    paymentMethods: ['frontdesk', 'enums', 'payment-methods'] as const,
    bookingTypes: ['frontdesk', 'enums', 'booking-types'] as const,
  },

  // Notifications
  notifications: (propertyId: string) => ['notifications', propertyId] as const,
  notificationsDropdown: (propertyId: string) => ['staff-notifications-dropdown', propertyId] as const,
  unreadCount: (propertyId: string) => ['unread-notifications-count', propertyId] as const,
}
