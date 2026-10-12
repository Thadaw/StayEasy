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
