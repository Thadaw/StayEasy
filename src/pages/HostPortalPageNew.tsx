import { useState, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import PortalHeader from '../components/portal/PortalHeader'
import ProgressBar from '../components/portal/ProgressBar'
import PropertyTypeSelector from '../components/portal/PropertyTypeSelector'
import Step1PropertyDetails from '../components/portal/Step1PropertyDetails'
import Step2Location from '../components/portal/Step2Location'
import Step3PhotosAmenities from '../components/portal/Step3PhotosAmenities'
import Step4Localization from '../components/portal/Step4Localization'
import type { LocalizationData } from '../components/portal/Step4Localization'
import Step5BrandingVisuals from '../components/portal/Step5BrandingVisuals'
import type { BrandData } from '../components/portal/Step5BrandingVisuals'
import Step4RoomSetup, { Room } from '../components/portal/Step4RoomSetup'
import Step5PricingOffers from '../components/portal/Step5PricingOffers'
import Step6Review from '../components/portal/Step6Review'
import NavigationButtons from '../components/portal/NavigationButtons'
import {
  createProperty,
  uploadSingleImage,
  uploadPropertyImage,
  uploadRoomImages,
  createRooms,
  createSpecialOffers,
  updatePropertyActivation,
  getAmenities as fetchAmenitiesApi,
  getSystemRoomTypes,
  getSystemBedTypes,
  getTenant,
  createTenant,
} from '../services/pmsApi'
import type {
  CreatePropertyPayload,
  AmenityOption,
  PhotosAmenityCustom,
  RoomBase,
  SpecialOfferPayload,
  SystemRoomTypeItem,
  SystemBedTypeItem,
  CancellationPolicyEnum,
} from '../types/pms'
import '../styles/portal.css'

type WizardStep = 'type' | 'property' | 'location' | 'photos' | 'localization' | 'branding' | 'rooms' | 'pricing' | 'review'

interface PropertyData {
  type: string
  name: string
  totalRooms: number
  floors: number
  yearBuilt: number
  description: string
  phone: string
  email: string
}

interface LocationData {
  country: string
  state: string
  city: string
  zip: string
  street: string
  latitude: number | null
  longitude: number | null
}

interface Offer {
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

const DEFAULT_OFFERS: Offer[] = [
  { id: 'early', label: 'Early Bird Discount', badge: '10% OFF', badgeColor: '#dcfce7', badgeText: '#16a34a', desc: '10% off for bookings made 30+ days in advance', discountPercentage: 10, enabled: false, startDate: null, endDate: null },
  { id: 'last', label: 'Last-Minute Deal', badge: '15% OFF', badgeColor: '#fee2e2', badgeText: '#dc2626', desc: '15% off for bookings made within 48 hours of check-in', discountPercentage: 15, enabled: false, startDate: null, endDate: null },
  { id: 'long', label: 'Long Stay Discount', badge: '20% OFF', badgeColor: '#dbeafe', badgeText: '#2563eb', desc: '20% off for stays of 7 nights or more', discountPercentage: 20, enabled: false, startDate: null, endDate: null },
  { id: 'free', label: 'Free Cancellation', badge: 'Free', badgeColor: '#f3e8ff', badgeText: '#9333ea', desc: 'Full refund if cancelled 48+ hours before check-in', discountPercentage: 0, enabled: false, startDate: null, endDate: null },
]

const createDefaultRoom = (id: number): Room => ({
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

export default function HostPortalPageNew() {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()

  const [currentStep, setCurrentStep] = useState<WizardStep>('type')
  const [propertyData, setPropertyData] = useState<PropertyData>({
    type: 'HOTEL',
    name: '',
    totalRooms: 1,
    floors: 1,
    yearBuilt: 2020,
    description: '',
    phone: '',
    email: '',
  })
  const [locationData, setLocationData] = useState<LocationData>({
    country: 'United States',
    state: '',
    city: '',
    zip: '',
    street: '',
    latitude: null,
    longitude: null,
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [coverIndex, setCoverIndex] = useState(0)
  const [systemAmenityIds, setSystemAmenityIds] = useState<string[]>([])
  const [customAmenities, setCustomAmenities] = useState<PhotosAmenityCustom[]>([])
  const [availableAmenities, setAvailableAmenities] = useState<AmenityOption[]>([])
  const [systemRoomTypes, setSystemRoomTypes] = useState<SystemRoomTypeItem[]>([])
  const [systemBedTypes, setSystemBedTypes] = useState<SystemBedTypeItem[]>([])
  const [rooms, setRooms] = useState<Room[]>([createDefaultRoom(1)])
  const [offers, setOffers] = useState<Offer[]>(DEFAULT_OFFERS)
  const [starRating, setStarRating] = useState(0)

  const [localizationData, setLocalizationData] = useState<LocalizationData>({
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
  })

  const [brandData, setBrandData] = useState<BrandData>({
    logo: null,
    brandColor: '#2E86AB',
    isWcagPassing: true,
  })

  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [draftSaved, setDraftSaved] = useState(false)
  const hasRestoredRef = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const draftSavedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedStepsRef = useRef<Set<WizardStep>>(new Set())
  const lastSavedDataRef = useRef<Record<string, unknown>>({})

  const draftKey = `serveIQDraft_${user?.id || user?.email || 'anon'}`

  useEffect(() => {
    try { localStorage.removeItem('serveIQDraft') } catch {}
  }, [])

  useEffect(() => {
    if (hasRestoredRef.current) return
    if (!user) return

    const raw = localStorage.getItem(draftKey)
    if (raw) {
      try {
        const draft = JSON.parse(raw)
        if (draft.currentStep) setCurrentStep(draft.currentStep)
        if (draft.propertyData) setPropertyData(draft.propertyData)
        if (draft.locationData) setLocationData(draft.locationData)
        if (draft.coverIndex !== undefined) setCoverIndex(draft.coverIndex)
        if (draft.systemAmenityIds) setSystemAmenityIds(draft.systemAmenityIds)
        if (draft.customAmenities) setCustomAmenities(draft.customAmenities)
        if (draft.starRating !== undefined) setStarRating(draft.starRating)
        if (draft.localizationData) setLocalizationData(draft.localizationData)
        if (draft.rooms) setRooms(draft.rooms.map((r: any) => ({
          ...r,
          photos: [],
          customPolicyTitle: r.customPolicyTitle ?? '',
          customPolicyDescription: r.customPolicyDescription ?? '',
          savedCustomPolicies: r.savedCustomPolicies ?? [],
          // Old drafts stored display labels (e.g. "Standard Room") instead of UUIDs.
          // Clear non-UUID values so the user re-picks from the real API options.
          type: isUuid(r.type) ? r.type : '',
          bedType: isUuid(r.bedType) ? r.bedType : '',
        })))
        if (draft.offers) {
          setOffers(draft.offers.map((o: any) => ({
            ...o,
            discountPercentage: o.discountPercentage ?? 0,
            startDate: o.startDate ? new Date(o.startDate) : null,
            endDate: o.endDate ? new Date(o.endDate) : null,
          })))
        }
        if (draft.brandData) setBrandData({ ...draft.brandData, logo: null })
        if (draft.propertyId !== undefined) setPropertyId(draft.propertyId)
      } catch {}
    }
    hasRestoredRef.current = true
  }, [draftKey, user, location.state])

  useEffect(() => {
    if (!hasRestoredRef.current) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      const draft = {
        currentStep,
        propertyData,
        locationData,
        coverIndex,
        systemAmenityIds,
        customAmenities,
        starRating,
        localizationData,
        rooms: rooms.map(r => ({ ...r, photos: [] })),
        offers: offers.map(o => ({
          ...o,
          startDate: o.startDate instanceof Date ? o.startDate.toISOString() : o.startDate,
          endDate: o.endDate instanceof Date ? o.endDate.toISOString() : o.endDate,
        })),
        brandData: { ...brandData, logo: null },
        propertyId,
      }
      try { localStorage.setItem(draftKey, JSON.stringify(draft)) } catch {}
    }, 500)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [currentStep, propertyData, locationData, coverIndex, systemAmenityIds, customAmenities, starRating, localizationData, rooms, offers, brandData, propertyId, draftKey])

  useEffect(() => {
    if (!hasRestoredRef.current) return
    const handler = () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      const draft = {
        currentStep,
        propertyData,
        locationData,
        coverIndex,
        systemAmenityIds,
        customAmenities,
        starRating,
        localizationData,
        rooms: rooms.map(r => ({ ...r, photos: [] })),
        offers: offers.map(o => ({
          ...o,
          startDate: o.startDate instanceof Date ? o.startDate.toISOString() : o.startDate,
          endDate: o.endDate instanceof Date ? o.endDate.toISOString() : o.endDate,
        })),
        brandData: { ...brandData, logo: null },
        propertyId,
      }
      try { localStorage.setItem(draftKey, JSON.stringify(draft)) } catch {}
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [currentStep, propertyData, locationData, coverIndex, systemAmenityIds, customAmenities, starRating, localizationData, rooms, offers, brandData, propertyId, draftKey])

  const stepChangedRef = useRef(false)
  useEffect(() => {
    if (!stepChangedRef.current) { stepChangedRef.current = true; return }
    if (draftSavedTimerRef.current) clearTimeout(draftSavedTimerRef.current)
    setDraftSaved(true)
    draftSavedTimerRef.current = setTimeout(() => setDraftSaved(false), 2000)
  }, [currentStep])

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey)
    savedStepsRef.current.clear()
    lastSavedDataRef.current = {}
  }, [draftKey])

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const isUuid = (v: unknown): boolean => typeof v === 'string' && UUID_RE.test(v)

  useEffect(() => {
    if (authLoading) return
    if (!user) return
    fetchAmenitiesApi()
      .then(setAvailableAmenities)
      .catch((err) => {
        console.error('Failed to fetch amenities:', err)
        setSaveError('Failed to load amenities. Room amenities may not work correctly.')
      })
    getSystemRoomTypes()
      .then(setSystemRoomTypes)
      .catch((err) => {
        console.error('Failed to fetch system room types:', err)
        setSaveError('Failed to load room types. Room setup may not work correctly.')
      })
    getSystemBedTypes()
      .then(setSystemBedTypes)
      .catch((err) => {
        console.error('Failed to fetch system bed types:', err)
        setSaveError('Failed to load bed types. Room setup may not work correctly.')
      })
  }, [authLoading, user])

  const stepOrder: WizardStep[] = ['type', 'property', 'location', 'photos', 'localization', 'branding', 'rooms', 'pricing', 'review']

  const getStepIndex = (step: WizardStep): number => stepOrder.indexOf(step)

  const getSectionNumber = (): number => {
    switch (currentStep) {
      case 'property': case 'location': case 'photos': case 'localization': case 'branding':
        return 1
      case 'rooms':
        return 2
      case 'pricing': case 'review':
        return 3
      default:
        return 0
    }
  }

  const getProgressPercentage = (): number => {
    const section = getSectionNumber()
    if (section === 0) return 0
    return Math.round(((section - 1) / 2) * 100)
  }

  const getStepNumber = (): { current: number; total: number } => {
    const section = getSectionNumber()
    return { current: section, total: 3 }
  }

  const SECTION_STEP_MAP: Record<number, WizardStep> = {
    1: 'property',
    2: 'rooms',
    3: 'pricing',
  }

  const hasStepChanged = (step: WizardStep): boolean => {
    const last = lastSavedDataRef.current[step]
    if (!last) return true
    switch (step) {
      case 'property': return JSON.stringify(propertyData) !== JSON.stringify(last)
      case 'location': return JSON.stringify(locationData) !== JSON.stringify(last)
      case 'photos': return (
        photos.length !== (last as any).photosLength ||
        coverIndex !== (last as any).coverIndex ||
        JSON.stringify(systemAmenityIds) !== JSON.stringify((last as any).systemAmenityIds) ||
        JSON.stringify(customAmenities) !== JSON.stringify((last as any).customAmenities) ||
        starRating !== (last as any).starRating
      )
      case 'localization': return JSON.stringify(localizationData) !== JSON.stringify(last)
      case 'branding': return (
        brandData.brandColor !== (last as any).brandColor ||
        brandData.logo !== null
      )
      case 'rooms': return JSON.stringify(rooms) !== JSON.stringify(last)
      case 'pricing': return JSON.stringify(offers) !== JSON.stringify(last)
      default: return true
    }
  }

  const snapshotStepData = (step: WizardStep): void => {
    switch (step) {
      case 'property':
        lastSavedDataRef.current[step] = { ...propertyData }
        break
      case 'location':
        lastSavedDataRef.current[step] = { ...locationData }
        break
      case 'photos':
        lastSavedDataRef.current[step] = {
          photosLength: photos.length,
          coverIndex,
          systemAmenityIds: [...systemAmenityIds],
          customAmenities: [...customAmenities],
          starRating,
        }
        break
      case 'localization':
        lastSavedDataRef.current[step] = { ...localizationData }
        break
      case 'branding':
        lastSavedDataRef.current[step] = { brandColor: brandData.brandColor, logo: brandData.logo }
        break
      case 'rooms':
        lastSavedDataRef.current[step] = JSON.parse(JSON.stringify(rooms))
        break
      case 'pricing':
        lastSavedDataRef.current[step] = JSON.parse(JSON.stringify(offers))
        break
    }
  }

  const handleProgressStepClick = (sectionNumber: number) => {
    const targetStep = SECTION_STEP_MAP[sectionNumber]
    if (!targetStep) return
    const targetIndex = getStepIndex(targetStep)
    const currentIndex = getStepIndex(currentStep)
    if (targetIndex < currentIndex) {
      setCurrentStep(targetStep)
    }
  }

  const getStepTitle = (): string => {
    const titles: Record<WizardStep, string> = {
      type: 'Select Your Property Type',
      property: 'Property Details',
      location: 'Location Details',
      photos: 'Photos & Amenities',
      localization: 'Property Localization',
      branding: 'Branding & Visuals',
      rooms: 'Room Setup',
      pricing: 'Pricing & Offers',
      review: 'Final Review & Launch',
    }
    return titles[currentStep]
  }

  const getNextStep = (): WizardStep | null => {
    const idx = getStepIndex(currentStep)
    return idx < stepOrder.length - 1 ? stepOrder[idx + 1] : null
  }

  const getPrevStep = (): WizardStep | null => {
    const idx = getStepIndex(currentStep)
    return idx > 0 ? stepOrder[idx - 1] : null
  }

  const saveCurrentStep = useCallback(async (): Promise<boolean> => {
    setSaveError(null)

    if (savedStepsRef.current.has(currentStep) && !hasStepChanged(currentStep)) {
      return true
    }

    try {
      switch (currentStep) {
        case 'type':
          savedStepsRef.current.add('type')
          return true

        case 'property': {
          if (!propertyData.name.trim()) {
            setSaveError('Property name is required before continuing.')
            return false
          }
          const phoneDigits = propertyData.phone.replace(/\D/g, '')
          if (phoneDigits.length !== 10) {
            setSaveError('Phone number must be exactly 10 digits.')
            return false
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(propertyData.email.trim())) {
            setSaveError('A valid email address is required.')
            return false
          }
          if (!propertyData.type) {
            setSaveError('Please select a property type.')
            return false
          }
          if (propertyData.totalRooms < 1) {
            setSaveError('Total rooms must be at least 1.')
            return false
          }
          savedStepsRef.current.add('property')
          snapshotStepData('property')
          return true
        }

        case 'location': {
          const requiredFields: [string, string][] = [
            ['Country', locationData.country],
            ['State/Province', locationData.state],
            ['City', locationData.city],
            ['ZIP/Postal Code', locationData.zip],
            ['Street Address', locationData.street],
          ]
          const missing = requiredFields.find(([, v]) => v.trim().length < 2)
          if (missing) {
            setSaveError(`${missing[0]} must be at least 2 characters before continuing.`)
            return false
          }
          savedStepsRef.current.add('location')
          snapshotStepData('location')
          return true
        }

        case 'photos':
          savedStepsRef.current.add('photos')
          snapshotStepData('photos')
          return true

        case 'localization': {
          if (!localizationData.allowAlwaysCheckIn) {
            const checkInTime = localizationData.checkInTime.trim()
            const checkOutTime = localizationData.checkOutTime.trim()
            if (checkInTime.length < 2) {
              setSaveError('Check-in Time must be at least 2 characters before continuing.')
              return false
            }
            if (checkOutTime.length < 2) {
              setSaveError('Check-out Time must be at least 2 characters before continuing.')
              return false
            }
          }
          savedStepsRef.current.add('localization')
          snapshotStepData('localization')
          return true
        }

        case 'branding':
          savedStepsRef.current.add('branding')
          snapshotStepData('branding')
          return true

        case 'rooms': {
          if (rooms.length === 0) {
            setSaveError('At least one room is required before continuing.')
            return false
          }
          const unnamedRoom = rooms.find(r => !r.name.trim())
          if (unnamedRoom) {
            setSaveError('All rooms must have a name before continuing.')
            return false
          }
          if (systemRoomTypes.length === 0 || systemBedTypes.length === 0) {
            setSaveError('Room or bed types failed to load. Please refresh the page and try again.')
            return false
          }
          const roomMissingType = rooms.find(r => !isUuid(r.type))
          if (roomMissingType) {
            setSaveError(`Room "${roomMissingType.name || 'Unnamed'}" must have a valid room type selected before continuing.`)
            return false
          }
          const roomMissingBedType = rooms.find(r => !isUuid(r.bedType))
          if (roomMissingBedType) {
            setSaveError(`Room "${roomMissingBedType.name || 'Unnamed'}" must have a valid bed type selected before continuing.`)
            return false
          }
          savedStepsRef.current.add('rooms')
          snapshotStepData('rooms')
          return true
        }

        case 'pricing':
          savedStepsRef.current.add('pricing')
          snapshotStepData('pricing')
          return true

        case 'review':
          return true

        default:
          return true
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to save'
      setSaveError(msg)
      return false
    }
  }, [currentStep, propertyData, locationData, localizationData, rooms])

  const handlePublish = useCallback(async (): Promise<void> => {
    setSaveError(null)

    try {
      // Phase 1: Ensure tenant exists
      try {
        await getTenant()
      } catch {
        await createTenant(propertyData.name || 'My Property')
      }

      // Phase 2: Upload brand logo first (before property creation)
      let logoUrl: string | null = null
      if (brandData.logo) {
        logoUrl = await uploadSingleImage(brandData.logo)
      }

      // Phase 3: Create property with all data including logo URL
      let checkInTime: string | null = null
      let checkOutTime: string | null = null
      if (!localizationData.allowAlwaysCheckIn) {
        checkInTime = localizationData.checkInTime.trim()
        checkOutTime = localizationData.checkOutTime.trim()
      }

      const propertyPayload: CreatePropertyPayload = {
        general_information: {
          name: propertyData.name,
          type: propertyData.type,
          description: propertyData.description,
          total_rooms: propertyData.totalRooms,
          year_built: propertyData.yearBuilt,
          number_of_floors: propertyData.floors,
          phone_number: propertyData.phone,
          email: propertyData.email,
        },
        location: {
          country: locationData.country,
          state: locationData.state,
          city: locationData.city,
          zip_code: locationData.zip,
          address: locationData.street,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        },
        photos_and_amenities: {
          photos: { cover: '', gallery: [] },
          amenities: {
            system_amenity_ids: systemAmenityIds,
            custom_amenities: customAmenities,
          },
        },
        localization: {
          currency: localizationData.currency,
          timezone: localizationData.timezone,
          language: localizationData.language,
          check_in_time: checkInTime,
          check_out_time: checkOutTime,
          check_in_grace_period: localizationData.earlyCheckInGrace,
          check_out_grace_period: localizationData.lateCheckOutGrace,
          always_allow_check_in_out: localizationData.allowAlwaysCheckIn,
          allow_pay_on_arrival: localizationData.allowPayOnArrival,
          min_advance_percentage: localizationData.minAdvancePercentage,
          max_advance_percentage: localizationData.maxAdvancePercentage,
        },
        brand_visual: {
          brand_logo_url: logoUrl,
          brand_color: brandData.brandColor,
        },
      }

      const propertyResult = await createProperty(propertyPayload)
      const newPropertyId = propertyResult.id
      setPropertyId(newPropertyId)

      // Phase 4: Upload property images with real property ID
      if (photos.length > 0) {
        const orderedPhotos = coverIndex < photos.length
          ? [photos[coverIndex], ...photos.filter((_, i) => i !== coverIndex)]
          : photos
        const formData = new FormData()
        orderedPhotos.forEach(p => formData.append('files', p))
        await uploadPropertyImage(newPropertyId, formData)
      }

      // Phase 5: Upload room images and create rooms
      if (rooms.length > 0) {
        const roomBases: RoomBase[] = []

        for (const room of rooms) {
          let roomCoverUrl: string | null = null
          let roomGalleryUrls: string[] = []
          if (room.photos.length > 0) {
            const coverIdx = room.coverPhotoIndex ?? 0
            const orderedPhotos = coverIdx < room.photos.length
              ? [room.photos[coverIdx], ...room.photos.filter((_, i) => i !== coverIdx)]
              : room.photos
            const formData = new FormData()
            orderedPhotos.forEach(p => formData.append('files', p))
            const uploadedUrls = await uploadRoomImages(newPropertyId, formData)
            if (uploadedUrls.length > 0) {
              roomCoverUrl = uploadedUrls[0]
              roomGalleryUrls = uploadedUrls.slice(1)
            }
          }

          let cancellationPolicy: CancellationPolicyEnum = ((room.cancellationPolicy || 'moderate').toUpperCase().replace('-', '_')) as CancellationPolicyEnum
          let cancellationTitle: string | null = null
          let cancellationDescription: string | null = null
          if (cancellationPolicy === 'CUSTOM' || room.cancellationPolicy?.toLowerCase().startsWith('custom-')) {
            const saved = room.savedCustomPolicies.find(p => p.id === room.cancellationPolicy)
            if (saved) {
              cancellationPolicy = 'CUSTOM'
              cancellationTitle = saved.title
              cancellationDescription = saved.description
            } else {
              // Custom policy was never saved or was removed — fall back to a valid default
              cancellationPolicy = 'MODERATE'
            }
          }

          const roomSystemAmenityIds = room.amenities
            .map(name => {
              const found = availableAmenities.find(a => (a.label || a.name) === name)
              return found ? String(found.id) : null
            })
            .filter((id): id is string => id !== null)

          const roomCustomAmenityNames = room.amenities.filter(name =>
            !availableAmenities.some(a => (a.label || a.name) === name)
          )

          if (!isUuid(room.type) || !isUuid(room.bedType)) {
            setSaveError(`Room "${room.name || 'Unnamed'}" is missing a valid room type or bed type. Please go back to Room Setup and re-select them.`)
            throw new Error('Room type/bed type validation failed')
          }

          roomBases.push({
            floor_number: parseInt(room.floor, 10) || 0,
            room_name: room.name,
            room_type_id: room.type,
            bed_type_id: room.bedType,
            max_adults: room.maxAdults,
            max_children: room.maxChildren,
            base_rate: parseFloat(room.minRate) || 1,
            status: 'AVAILABLE',
            cancellation_policy: cancellationPolicy,
            cancellation_title: cancellationTitle,
            cancellation_description: cancellationDescription,
            photos: { cover: roomCoverUrl, gallery: roomGalleryUrls },
            system_amenity_ids: roomSystemAmenityIds,
            custom_amenities: roomCustomAmenityNames.map(name => ({ name, icon: null })),
          })
        }

        await createRooms(newPropertyId, { rooms: roomBases })
      }

      // Phase 6: Create special offers
      const enabledOffers = offers.filter(o => o.enabled)
      if (enabledOffers.length > 0) {
        const offerPayload: SpecialOfferPayload[] = enabledOffers.map(o => ({
          title: o.label,
          description: o.desc,
          discount_percentage: o.discountPercentage,
          start_date: o.startDate ? o.startDate.toISOString().split('T')[0] : null,
          end_date: o.endDate ? o.endDate.toISOString().split('T')[0] : null,
          is_active: true,
          is_custom: o.id.startsWith('custom-'),
        }))
        await createSpecialOffers(newPropertyId, offerPayload)
      }

      // Phase 7: Activate and navigate
      try {
        await updatePropertyActivation(newPropertyId)
      } catch (activationErr) {
        setSaveError('Property created but could not be activated. Please activate it from the dashboard.')
      }

      clearDraft()
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to publish property'
      setSaveError(msg)
      throw err
    }
  }, [propertyData, locationData, photos, coverIndex, systemAmenityIds, customAmenities, localizationData, brandData, rooms, offers, availableAmenities, clearDraft])

  const handleNext = useCallback(async () => {
    setIsSaving(true)
    const ok = await saveCurrentStep()
    setIsSaving(false)
    if (!ok) return
    const next = getNextStep()
    if (next) setCurrentStep(next)
  }, [saveCurrentStep])

  const handleBack = useCallback(() => {
    setSaveError(null)
    const prev = getPrevStep()
    if (prev) setCurrentStep(prev)
  }, [currentStep])

  const handleGoToStep = useCallback((stepIdx: number) => {
    if (stepIdx >= 0 && stepIdx < stepOrder.length) {
      setCurrentStep(stepOrder[stepIdx])
    }
  }, [])

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <PropertyTypeSelector
            selectedType={propertyData.type}
            onSelect={(type) => {
              setPropertyData(prev => ({ ...prev, type }))
              handleNext()
            }}
          />
        )

      case 'property':
        return (
          <Step1PropertyDetails
            data={propertyData}
            onChange={(data) => setPropertyData(prev => ({ ...prev, ...data }))}
          />
        )

      case 'location':
        return (
          <Step2Location
            data={locationData}
            onChange={(data) => setLocationData(prev => ({ ...prev, ...data }))}
          />
        )

      case 'photos':
        return (
          <>
            {saveError && (
              <div style={{ margin: '0 0 16px', padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13 }}>
                {saveError}
              </div>
            )}
            <Step3PhotosAmenities
              photos={photos}
              onPhotosChange={setPhotos}
              coverIndex={coverIndex}
              onCoverIndexChange={setCoverIndex}
              availableAmenities={availableAmenities}
              systemAmenityIds={systemAmenityIds}
              onSystemAmenityIdsChange={setSystemAmenityIds}
              customAmenities={customAmenities}
              onCustomAmenitiesChange={setCustomAmenities}
              starRating={starRating}
              onStarRatingChange={setStarRating}
            />
          </>
        )

      case 'localization':
        return (
          <Step4Localization
            data={localizationData}
            onChange={(data) => setLocalizationData(prev => ({ ...prev, ...data }))}
          />
        )

      case 'branding':
        return (
          <Step5BrandingVisuals
            data={brandData}
            onChange={(data) => setBrandData(prev => ({ ...prev, ...data }))}
            propertyName={propertyData.name}
            propertyPhone={propertyData.phone}
          />
        )

      case 'rooms':
        return (
          <Step4RoomSetup
            rooms={rooms}
            onRoomsChange={setRooms}
            availableAmenities={availableAmenities}
            floors={propertyData.floors}
            systemRoomTypes={systemRoomTypes}
            systemBedTypes={systemBedTypes}
          />
        )

      case 'pricing':
        return (
          <Step5PricingOffers
            offers={offers}
            onOffersChange={setOffers}
          />
        )

      case 'review':
        return (
          <Step6Review
            property={{
              name: propertyData.name,
              type: propertyData.type,
              description: propertyData.description,
              phone: propertyData.phone,
              email: propertyData.email,
              totalRooms: propertyData.totalRooms,
              floors: propertyData.floors,
              yearBuilt: propertyData.yearBuilt,
            }}
            location={locationData}
            localization={localizationData}
            photos={photos}
            availableAmenities={availableAmenities}
            systemAmenityIds={systemAmenityIds}
            customAmenities={customAmenities}
            rooms={rooms}
            systemRoomTypes={systemRoomTypes}
            systemBedTypes={systemBedTypes}
            offers={offers}
            starRating={starRating}
            onGoToStep={handleGoToStep}
            onPublish={handlePublish}
          />
        )

      default:
        return null
    }
  }

  const renderNavigation = () => {
    if (currentStep === 'type') return null
    if (currentStep === 'review') return null

    const prev = getPrevStep()
    const next = getNextStep()

    const nextLabel =
      currentStep === 'localization' ? 'Continue to Branding & Visuals' :
      currentStep === 'rooms' ? 'Continue to Pricing & Offers' :
      'Next Step'

    return (
      <div className="portal-nav-container">
        {saveError && <div className="error-banner">{saveError}</div>}
        <NavigationButtons
          onBack={prev ? handleBack : undefined}
          onNext={next ? handleNext : undefined}
          backLabel="Previous Step"
          nextLabel={nextLabel}
          loading={isSaving}
        />
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="portal-page">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="portal-page">
      <PortalHeader draftSaved={draftSaved} />

      <main className="portal-main">
        {currentStep === 'type' ? (
          <div className="portal-type-container">
            <div className="portal-type-card">
              <h1 className="portal-type-title">{getStepTitle()}</h1>
              <p className="portal-type-subtitle">
                Choose the primary category that best describes your property. This helps us customize your management dashboard.
              </p>
              {renderStepContent()}
            </div>
          </div>
        ) : (
          <div className="portal-wizard-container">
            <ProgressBar
              currentStep={getStepNumber().current}
              totalSteps={getStepNumber().total}
              percentage={getProgressPercentage()}
              title={getStepTitle()}
              onStepClick={handleProgressStepClick}
              clickableSteps={[1, 2, 3].filter(s => {
                const targetStep = SECTION_STEP_MAP[s]
                return targetStep && getStepIndex(targetStep) < getStepIndex(currentStep)
              })}
            />
            {renderStepContent()}
            {renderNavigation()}
          </div>
        )}
      </main>
    </div>
  )
}
