export interface CompanyProfile {
  propertyName: string
  propertyType: string
  tagline: string
  phone: string
  email: string
  website: string
  vatPan: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  currency: string
  timeZone: string
  language: string
  dateFormat: string
  timeFormat: string
}

export interface LogoBranding {
  logoUrl: string
  logoName: string
  primaryColor: string
  secondaryColor: string
}

export interface BusinessInfo {
  registrationNumber: string
  licenseNumber: string
  establishedYear: string
}

export interface ContactPerson {
  name: string
  designation: string
  phone: string
  email: string
}

export interface GeneralSettings {
  timeZone: string
  dateFormat: string
  timeFormat: string
  currency: string
  language: string
  maintenanceMode: boolean
  allowMultipleLogin: boolean
  showTips: boolean
  autoLogout: string
  defaultDashboard: string
  itemsPerPage: string
}

export interface BookingSettings {
  enableOnlineBooking: boolean
  autoConfirmBooking: boolean
  bookingConfirmation: string
  defaultBookingStatus: string
  holdBookingMinutes: string
  allowWalkinBooking: boolean
  minimumStayNights: string
  maximumStayNights: string
  applyMaximumStayTo: string
  checkinTime: string
  checkoutTime: string
  earlyCheckin: string
  lateCheckout: string
  cancellationAllowed: boolean
  cancellationCharge: string
  cancellationDeadline: string
  requireAdvancePayment: boolean
  advancePaymentType: string
  advancePercentage: string
}

export interface RatePlan {
  id: string
  name: string
  description: string
  mealPlan: string
  cancellationPolicy: string
  status: 'Active' | 'Inactive'
}

export interface SeasonalRate {
  id: string
  seasonName: string
  period: string
  rateAdjustment: string
  status: 'Active' | 'Inactive'
}

export interface RoomRateSettings {
  autoRoomNumber: boolean
  roomStatus: boolean
  displayRoomFloor: boolean
  defaultRoomView: string
  roomImageUpload: boolean
  maxImagesPerRoom: string
  baseRateType: string
  rateDisplay: string
  allowRateOverride: boolean
  rateRounding: string
  currency: string
  overbooking: boolean
  inventoryUpdate: boolean
  releaseUnusedRooms: string
  minimumSellableRate: string
  maxRoomsPerBooking: string
  closeRoomForCheckinAfter: string
  ratePlans: RatePlan[]
  seasonalRates: SeasonalRate[]
}

export interface SystemInfo {
  systemVersion: string
  lastBackup: string
  nextBackup: string
  databaseSize: string
  totalUsers: number
  totalProperties: number
}
