import { create } from 'zustand'
import type { PhotosAmenityCustom } from '@/types/pms'
import type { BrandData } from '@/components/admin/portal/Step5BrandingVisuals'
import type { LocalizationData } from '@/components/admin/portal/Step4Localization'
import type { Room } from '@/components/admin/portal/Step4RoomSetup'

export type WizardStep = 'type' | 'property' | 'location' | 'photos' | 'localization' | 'branding' | 'rooms' | 'pricing' | 'review'

export interface PropertyData {
  type: string
  name: string
  totalRooms: number
  floors: number
  yearBuilt: number
  description: string
  phone: string
  email: string
}

export interface LocationData {
  country: string
  state: string
  city: string
  zip: string
  street: string
  latitude: number | null
  longitude: number | null
}

export interface Offer {
  id: string
  label: string
  badge: string
  badgeColor: string
  badgeText: string
  desc: string
  discountPercentage: number
  enabled: boolean
  startDate?: Date | null
  endDate?: Date | null
}

export const DEFAULT_OFFERS: Offer[] = [
  { id: 'early', label: 'Early Bird Discount', badge: '10% OFF', badgeColor: '#dcfce7', badgeText: '#16a34a', desc: '10% off for bookings made 30+ days in advance', discountPercentage: 10, enabled: false, startDate: null, endDate: null },
  { id: 'last', label: 'Last-Minute Deal', badge: '15% OFF', badgeColor: '#fee2e2', badgeText: '#dc2626', desc: '15% off for bookings made within 48 hours of check-in', discountPercentage: 15, enabled: false, startDate: null, endDate: null },
  { id: 'long', label: 'Long Stay Discount', badge: '20% OFF', badgeColor: '#dbeafe', badgeText: '#2563eb', desc: '20% off for stays of 7 nights or more', discountPercentage: 20, enabled: false, startDate: null, endDate: null },
  { id: 'free', label: 'Free Cancellation', badge: 'Free', badgeColor: '#f3e8ff', badgeText: '#9333ea', desc: 'Full refund if cancelled 48+ hours before check-in', discountPercentage: 0, enabled: false, startDate: null, endDate: null },
]

export const createDefaultRoom = (id: number): Room => ({
  id: `room-${id}`,
  floor: '1',
  name: `Room ${id}`,
  type: '',
  bedType: '',
  maxAdults: 2,
  maxChildren: 0,
  petsAllowed: false,
  minRate: '0.00',
  cancellationPolicy: 'moderate',
  customPolicyTitle: '',
  customPolicyDescription: '',
  savedCustomPolicies: [],
  amenities: ['High-speed WiFi', 'Air Conditioning'],
  expanded: true,
  photos: [],
  coverPhotoIndex: 0,
})

const defaultPropertyData: PropertyData = {
  type: 'HOTEL',
  name: '',
  totalRooms: 1,
  floors: 1,
  yearBuilt: 2020,
  description: '',
  phone: '',
  email: '',
}

const defaultLocationData: LocationData = {
  country: 'United States',
  state: '',
  city: '',
  zip: '',
  street: '',
  latitude: null,
  longitude: null,
}

const defaultLocalizationData: LocalizationData = {
  currency: 'USD',
  timezone: 'UTC',
  language: 'English (US)',
  checkInTime: '3:00 PM',
  checkOutTime: '11:00 AM',
  earlyCheckInGrace: 0,
  lateCheckOutGrace: 0,
  allowAlwaysCheckIn: true,
  allowPayOnArrival: true,
  minAdvancePercentage: 0,
  maxAdvancePercentage: 100,
}

const defaultBrandData: BrandData = {
  logo: null,
  brandColor: '#2E86AB',
  isWcagPassing: true,
}

interface PortalState {
  currentStep: WizardStep
  propertyData: PropertyData
  locationData: LocationData
  photos: File[]
  coverIndex: number
  systemAmenityIds: string[]
  customAmenities: PhotosAmenityCustom[]
  rooms: Room[]
  offers: Offer[]
  starRating: number
  localizationData: LocalizationData
  brandData: BrandData
  propertyId: string | null

  setCurrentStep: (step: WizardStep) => void
  setPropertyData: (data: PropertyData) => void
  patchPropertyData: (patch: Partial<PropertyData>) => void
  setLocationData: (data: LocationData) => void
  patchLocationData: (patch: Partial<LocationData>) => void
  setPhotos: (photos: File[]) => void
  setCoverIndex: (index: number) => void
  setSystemAmenityIds: (ids: string[]) => void
  setCustomAmenities: (items: PhotosAmenityCustom[]) => void
  setRooms: (rooms: Room[]) => void
  setOffers: (offers: Offer[]) => void
  setStarRating: (rating: number) => void
  setLocalizationData: (data: LocalizationData) => void
  patchLocalizationData: (patch: Partial<LocalizationData>) => void
  setBrandData: (data: BrandData) => void
  patchBrandData: (patch: Partial<BrandData>) => void
  setPropertyId: (id: string | null) => void
  reset: () => void
}

export const usePortalStore = create<PortalState>((set) => ({
  currentStep: 'type',
  propertyData: defaultPropertyData,
  locationData: defaultLocationData,
  photos: [],
  coverIndex: 0,
  systemAmenityIds: [],
  customAmenities: [],
  rooms: [createDefaultRoom(1)],
  offers: DEFAULT_OFFERS,
  starRating: 0,
  localizationData: defaultLocalizationData,
  brandData: defaultBrandData,
  propertyId: null,

  setCurrentStep: (currentStep) => set({ currentStep }),
  setPropertyData: (propertyData) => set({ propertyData }),
  patchPropertyData: (patch) => set((s) => ({ propertyData: { ...s.propertyData, ...patch } })),
  setLocationData: (locationData) => set({ locationData }),
  patchLocationData: (patch) => set((s) => ({ locationData: { ...s.locationData, ...patch } })),
  setPhotos: (photos) => set({ photos }),
  setCoverIndex: (coverIndex) => set({ coverIndex }),
  setSystemAmenityIds: (systemAmenityIds) => set({ systemAmenityIds }),
  setCustomAmenities: (customAmenities) => set({ customAmenities }),
  setRooms: (rooms) => set({ rooms }),
  setOffers: (offers) => set({ offers }),
  setStarRating: (starRating) => set({ starRating }),
  setLocalizationData: (localizationData) => set({ localizationData }),
  patchLocalizationData: (patch) => set((s) => ({ localizationData: { ...s.localizationData, ...patch } })),
  setBrandData: (brandData) => set({ brandData }),
  patchBrandData: (patch) => set((s) => ({ brandData: { ...s.brandData, ...patch } })),
  setPropertyId: (propertyId) => set({ propertyId }),
  reset: () => set({
    currentStep: 'type',
    propertyData: defaultPropertyData,
    locationData: defaultLocationData,
    photos: [],
    coverIndex: 0,
    systemAmenityIds: [],
    customAmenities: [],
    rooms: [createDefaultRoom(1)],
    offers: DEFAULT_OFFERS,
    starRating: 0,
    localizationData: defaultLocalizationData,
    brandData: defaultBrandData,
    propertyId: null,
  }),
}))
