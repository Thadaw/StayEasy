import { create } from 'zustand'
import type { RatePlan, SeasonalRate } from '@/types/settings'

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

interface SettingsState {
  companyData: CompanyProfile
  logoData: LogoBranding
  businessData: BusinessInfo
  contactData: ContactPerson
  generalData: GeneralSettings
  bookingData: BookingSettings
  roomRateData: RoomRateSettings
  savedAt: number | null

  patchCompany: (patch: Partial<CompanyProfile>) => void
  patchLogo: (patch: Partial<LogoBranding>) => void
  patchBusiness: (patch: Partial<BusinessInfo>) => void
  patchContact: (patch: Partial<ContactPerson>) => void
  patchGeneral: (patch: Partial<GeneralSettings>) => void
  patchBooking: (patch: Partial<BookingSettings>) => void
  patchRoomRate: (patch: Partial<RoomRateSettings>) => void
  markSaved: () => void
}

const defaultCompany: CompanyProfile = {
  propertyName: 'Hotel Blue Pearl',
  propertyType: 'Hotel',
  tagline: 'Experience Comfort, Feel at Home',
  phone: '+977 1 4567890',
  email: 'info@bluepearlhotel.com',
  website: 'https://www.bluepearlhotel.com',
  vatPan: '604123456',
  address: 'Lazimpat, Kathmandu, Bagmati Province, Nepal',
  city: 'Kathmandu',
  state: 'Bagmati Province',
  postalCode: '44600',
  country: 'Nepal',
  currency: 'NPR (Nepalese Rupee)',
  timeZone: '(GMT+05:45) Kathmandu',
  language: 'English',
  dateFormat: 'Jun 1, 2026',
  timeFormat: '12 Hours (hh:mm AM/PM)',
}

const defaultLogo: LogoBranding = {
  logoUrl: '',
  logoName: 'bluepearl-logo.png',
  primaryColor: '#1A3C5E',
  secondaryColor: '#1F2937',
}

const defaultBusiness: BusinessInfo = {
  registrationNumber: '123456/078/079',
  licenseNumber: 'HOTEL/KTM/2024/1234',
  establishedYear: '2018',
}

const defaultContact: ContactPerson = {
  name: 'Ramesh Thapa',
  designation: 'General Manager',
  phone: '+977 9812345678',
  email: 'ramesh.thapa@bluepearl.com',
}

const defaultGeneral: GeneralSettings = {
  timeZone: '(GMT+05:45) Kathmandu',
  dateFormat: 'Jun 1, 2026',
  timeFormat: '12 Hours (hh:mm AM/PM)',
  currency: 'NPR (Nepalese Rupee)',
  language: 'English',
  maintenanceMode: false,
  allowMultipleLogin: true,
  showTips: true,
  autoLogout: '30',
  defaultDashboard: 'Dashboard v1',
  itemsPerPage: '10',
}

const defaultBooking: BookingSettings = {
  enableOnlineBooking: true,
  autoConfirmBooking: true,
  bookingConfirmation: 'Email',
  defaultBookingStatus: 'Confirmed',
  holdBookingMinutes: '15 Minutes',
  allowWalkinBooking: true,
  minimumStayNights: '1',
  maximumStayNights: '30',
  applyMaximumStayTo: 'All Bookings',
  checkinTime: '14:00',
  checkoutTime: '12:00',
  earlyCheckin: 'On Request',
  lateCheckout: 'On Request',
  cancellationAllowed: true,
  cancellationCharge: '100% of Total Amount',
  cancellationDeadline: '24 Hours Before Check-in',
  requireAdvancePayment: true,
  advancePaymentType: 'Percentage',
  advancePercentage: '20',
}

const defaultRoomRate: RoomRateSettings = {
  autoRoomNumber: true,
  roomStatus: true,
  displayRoomFloor: true,
  defaultRoomView: 'Grid View',
  roomImageUpload: true,
  maxImagesPerRoom: '5 Images',
  baseRateType: 'Rack Rate',
  rateDisplay: 'Inclusive of Tax',
  allowRateOverride: true,
  rateRounding: '1',
  currency: 'NPR (Nepalese Rupee)',
  overbooking: false,
  inventoryUpdate: true,
  releaseUnusedRooms: '23:00',
  minimumSellableRate: '1000',
  maxRoomsPerBooking: '10 Rooms',
  closeRoomForCheckinAfter: '22:00',
  ratePlans: [],
  seasonalRates: [],
}

export const useSettingsStore = create<SettingsState>((set) => ({
  companyData: defaultCompany,
  logoData: defaultLogo,
  businessData: defaultBusiness,
  contactData: defaultContact,
  generalData: defaultGeneral,
  bookingData: defaultBooking,
  roomRateData: defaultRoomRate,
  savedAt: null,

  patchCompany: (patch) => set((s) => ({ companyData: { ...s.companyData, ...patch } })),
  patchLogo: (patch) => set((s) => ({ logoData: { ...s.logoData, ...patch } })),
  patchBusiness: (patch) => set((s) => ({ businessData: { ...s.businessData, ...patch } })),
  patchContact: (patch) => set((s) => ({ contactData: { ...s.contactData, ...patch } })),
  patchGeneral: (patch) => set((s) => ({ generalData: { ...s.generalData, ...patch } })),
  patchBooking: (patch) => set((s) => ({ bookingData: { ...s.bookingData, ...patch } })),
  patchRoomRate: (patch) => set((s) => ({ roomRateData: { ...s.roomRateData, ...patch } })),
  markSaved: () => set({ savedAt: Date.now() }),
}))
