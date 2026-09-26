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

export const bookingKeys = {
  all: ['bookings'] as const,
  byProperty: (propertyId: string) => ['bookings', propertyId] as const,
  detail: (refNumber: string) => ['bookings', 'detail', refNumber] as const,
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
