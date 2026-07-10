import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PortalHeader from '../components/portal/PortalHeader'
import ProgressBar from '../components/portal/ProgressBar'
import PropertyTypeSelector from '../components/portal/PropertyTypeSelector'
import Step1PropertyDetails from '../components/portal/Step1PropertyDetails'
import Step2Location from '../components/portal/Step2Location'
import Step3PhotosAmenities from '../components/portal/Step3PhotosAmenities'
import Step4RoomSetup, { Room } from '../components/portal/Step4RoomSetup'
import Step5PricingOffers from '../components/portal/Step5PricingOffers'
import Step6Review from '../components/portal/Step6Review'
import NavigationButtons from '../components/portal/NavigationButtons'
import * as pmsApi from '../services/pmsApi'
import type { AmenityOption } from '../types/pms'
import '../styles/portal.css'

type WizardStep = 'type' | 'property' | 'location' | 'photos' | 'rooms' | 'pricing' | 'review'

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
  mapLink: string
}

interface Offer {
  id: string
  label: string
  badge: string
  badgeColor: string
  badgeText: string
  desc: string
  enabled: boolean
  startDate?: Date | null
  endDate?: Date | null
}

const DEFAULT_OFFERS: Offer[] = [
  { id: 'early', label: 'Early Bird Discount', badge: '10% OFF', badgeColor: '#dcfce7', badgeText: '#16a34a', desc: '10% off for bookings made 30+ days in advance', enabled: false, startDate: null, endDate: null },
  { id: 'last', label: 'Last-Minute Deal', badge: '15% OFF', badgeColor: '#fee2e2', badgeText: '#dc2626', desc: '15% off for bookings made within 48 hours of check-in', enabled: false, startDate: null, endDate: null },
  { id: 'long', label: 'Long Stay Discount', badge: '20% OFF', badgeColor: '#dbeafe', badgeText: '#2563eb', desc: '20% off for stays of 7 nights or more', enabled: false, startDate: null, endDate: null },
  { id: 'free', label: 'Free Cancellation', badge: 'Free', badgeColor: '#f3e8ff', badgeText: '#9333ea', desc: 'Full refund if cancelled 48+ hours before check-in', enabled: false, startDate: null, endDate: null },
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
  amenities: ['High-speed WiFi', 'Air Conditioning'],
  expanded: true,
  photos: [],
})

const FALLBACK_AMENITIES: AmenityOption[] = [
  { id: 'wifi', name: 'High-speed WiFi', icon: '📶' },
  { id: 'ac', name: 'Air Conditioning', icon: '❄️' },
  { id: 'washer', name: 'In-unit Washer/Dryer', icon: '👕' },
  { id: 'pool', name: 'Private Pool', icon: '🏊' },
  { id: 'gym', name: 'Gym / Fitness Center', icon: '💪' },
  { id: 'parking', name: 'Free Parking', icon: '🅿️' },
  { id: 'smoke', name: 'Smoke Alarms', icon: '🔥' },
  { id: 'fire', name: 'Fire Extinguisher', icon: '🧯' },
  { id: 'camera', name: 'Security Cameras', icon: '📷' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'tv', name: 'Smart TV', icon: '📺' },
  { id: 'balcony', name: 'Balcony', icon: '🌅' },
]

export default function HostPortalPageNew() {
  const navigate = useNavigate()
  useAuth()

  const [currentStep, setCurrentStep] = useState<WizardStep>('type')
  const [propertyData, setPropertyData] = useState<PropertyData>({
    type: '',
    name: '',
    totalRooms: 0,
    floors: 1,
    yearBuilt: 0,
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
    mapLink: '',
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [rooms, setRooms] = useState<Room[]>([createDefaultRoom(1)])
  const [offers, setOffers] = useState<Offer[]>(DEFAULT_OFFERS)
  const [starRating, setStarRating] = useState(0)

  // API state
  const [propertyId, setPropertyId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [apiAmenities, setApiAmenities] = useState<AmenityOption[]>(FALLBACK_AMENITIES)

  // Fetch amenities on mount
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await pmsApi.getAmenities()
        if (Array.isArray(data) && data.length > 0) {
          setApiAmenities(data)
        }
      } catch {
        // Fallback to hardcoded amenities if API fails
        setApiAmenities(FALLBACK_AMENITIES)
      }
    }
    fetchAmenities()
  }, [])

  const stepOrder: WizardStep[] = ['type', 'property', 'location', 'photos', 'rooms', 'pricing', 'review']

  const getStepIndex = (step: WizardStep): number => stepOrder.indexOf(step)

  const getProgressPercentage = (): number => {
    const idx = getStepIndex(currentStep)
    const total = stepOrder.length - 1
    return Math.round((idx / total) * 100)
  }

  const getStepNumber = (): { current: number; total: number } => {
    const mainSteps: WizardStep[] = ['property', 'location', 'photos', 'rooms', 'pricing', 'review']
    const idx = mainSteps.indexOf(currentStep)
    if (idx === -1) return { current: 0, total: 5 }
    return { current: idx + 1, total: 5 }
  }

  const getStepTitle = (): string => {
    const titles: Record<WizardStep, string> = {
      type: 'Select Your Property Type',
      property: 'Property Details',
      location: 'Location Details',
      photos: 'Photos & Amenities',
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

  // ─── Save helpers ─────

  const showError = (err: unknown) => {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosErr = err as { response?: { status?: number; data?: unknown } }
      const status = axiosErr.response?.status
      const data = axiosErr.response?.data

      console.error('Save error:', status, data)

      const extractMsg = (obj: unknown): string | null => {
        if (typeof obj === 'string') return obj
        if (Array.isArray(obj) && obj.length > 0) return extractMsg(obj[0])
        if (obj && typeof obj === 'object') {
          for (const key of ['detail', 'message', 'error', 'non_field_errors', 'name', 'errors']) {
            if (key in obj) {
              const found = extractMsg((obj as Record<string, unknown>)[key])
              if (found) return found
            }
          }
          const vals = Object.values(obj as Record<string, unknown>)
          for (const v of vals) {
            const found = extractMsg(v)
            if (found) return found
          }
        }
        return null
      }

      const serverMsg = extractMsg(data)
      setSaveError(serverMsg || 'An error occurred')
    } else {
      setSaveError('An unexpected error occurred')
    }
    setTimeout(() => setSaveError(null), 5000)
  }

  const buildPropertyPayload = () => ({
    name: propertyData.name,
    property_type: propertyData.type,
    total_rooms: propertyData.totalRooms,
    no_of_floors: propertyData.floors,
    year_built: propertyData.yearBuilt,
    description: propertyData.description,
    phone: propertyData.phone,
    email: propertyData.email,
    country: locationData.country,
    state: locationData.state,
    city: locationData.city,
    zip_code: locationData.zip,
      address: locationData.street,
    map_link: locationData.mapLink,
    star_rating: starRating,
    check_in_from: '15:00',
    check_in_to: '22:00',
    check_out_from: '08:00',
    check_out_to: '11:00',
    amenities,
    is_active: false,
  })

  const savePropertyBasic = async (): Promise<number> => {
    if (propertyId) {
      await pmsApi.updateProperty(propertyId, {
        name: propertyData.name,
        property_type: propertyData.type,
        total_rooms: propertyData.totalRooms,
        no_of_floors: propertyData.floors,
        year_built: propertyData.yearBuilt,
        description: propertyData.description,
        phone: propertyData.phone,
        email: propertyData.email,
      })
      return propertyId
    } else {
      const result = await pmsApi.createProperty({
        name: propertyData.name,
        property_type: propertyData.type,
        total_rooms: propertyData.totalRooms,
        no_of_floors: propertyData.floors,
        year_built: propertyData.yearBuilt,
        description: propertyData.description,
        phone: propertyData.phone,
        email: propertyData.email,
      })
      setPropertyId(result.id)
      return result.id
    }
  }

  const saveLocation = async () => {
    if (!propertyId) return
    await pmsApi.updateProperty(propertyId, {
      country: locationData.country,
      state: locationData.state,
      city: locationData.city,
      zip_code: locationData.zip,
    address: locationData.street,
      map_link: locationData.mapLink,
    })
  }

  const savePhotosAndAmenities = async () => {
    if (!propertyId) return
    await pmsApi.updateProperty(propertyId, {
      amenities,
      star_rating: starRating,
      check_in_from: '15:00',
      check_in_to: '22:00',
      check_out_from: '08:00',
      check_out_to: '11:00',
    })
    // Upload property images
    if (photos.length > 0) {
      const formData = new FormData()
      photos.forEach(p => formData.append('images', p))
      await pmsApi.uploadPropertyImages(formData)
    }
  }

  const saveRooms = async () => {
    if (!propertyId) return
    // Delete existing rooms then recreate
    try {
      const existingRooms = await pmsApi.getRooms(propertyId)
      for (const r of existingRooms) {
        await pmsApi.deleteRoom(propertyId, r.id)
      }
    } catch {
      // No existing rooms or error fetching
    }

    for (const room of rooms) {
      const roomResult = await pmsApi.createRoom(propertyId, {
        floor: room.floor,
        name: room.name,
        room_type: room.type,
        bed_type: room.bedType,
        max_adults: room.maxAdults,
        max_children: room.maxChildren,
        pets_allowed: room.petsAllowed,
        min_rate: room.minRate,
        cancellation_policy: room.cancellationPolicy,
        amenities: room.amenities,
      })
      // Upload room images
      if (room.photos.length > 0) {
        const formData = new FormData()
        room.photos.forEach(p => formData.append('images', p))
        await pmsApi.uploadRoomImages(roomResult.id, formData)
      }
    }
  }

  const saveOffers = async () => {
    if (!propertyId) return
    // Delete existing offers
    try {
      const existingOffers = await pmsApi.getSpecialOffers(propertyId)
      for (const o of existingOffers) {
        await pmsApi.deleteSpecialOffer(propertyId, o.id)
      }
    } catch {
      // No existing offers or error
    }

    const enabledOffers = offers.filter(o => o.enabled)
    if (enabledOffers.length > 0) {
      const payload = enabledOffers.map(o => ({
        title: o.label,
        description: o.desc,
        badge: o.badge,
        start_date: o.startDate ? o.startDate.toISOString() : null,
        end_date: o.endDate ? o.endDate.toISOString() : null,
        is_active: true,
      }))
      await pmsApi.createSpecialOffers(propertyId, payload)
    }
  }

  // ─── Step transition with auto-save ─────────────────────────

  const handleNext = useCallback(async () => {
    const next = getNextStep()
    if (!next) return

    setIsSaving(true)
    setSaveError(null)
    try {
      switch (currentStep) {
        case 'property':
          await savePropertyBasic()
          break
        case 'location':
          await saveLocation()
          break
        case 'photos':
          await savePhotosAndAmenities()
          break
        case 'rooms':
          await saveRooms()
          break
        case 'pricing':
          await saveOffers()
          break
      }
      setCurrentStep(next)
    } catch (err) {
      showError(err)
    } finally {
      setIsSaving(false)
    }
  }, [currentStep, propertyData, locationData, photos, amenities, rooms, offers, starRating, propertyId])

  const handleBack = useCallback(() => {
    const prev = getPrevStep()
    if (prev) setCurrentStep(prev)
  }, [currentStep])

  const handleGoToStep = useCallback((stepIdx: number) => {
    if (stepIdx >= 0 && stepIdx < stepOrder.length) {
      setCurrentStep(stepOrder[stepIdx])
    }
  }, [])

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true)
    setSaveError(null)
    try {
      if (!propertyId) {
        const id = await savePropertyBasic()
        setPropertyId(id)
      } else {
        // Update with whatever we have so far
        await pmsApi.updateProperty(propertyId, buildPropertyPayload())
      }
      alert('Draft saved successfully!')
    } catch (err) {
      showError(err)
    } finally {
      setIsSaving(false)
    }
  }, [propertyData, locationData, photos, amenities, rooms, offers, starRating, propertyId])

  const handlePublish = useCallback(async () => {
    if (!propertyId) return
    setIsSaving(true)
    setSaveError(null)
    try {
      await pmsApi.updatePropertyActivation(propertyId, { is_active: true })
      alert('Property published successfully!')
      navigate('/host/dashboard')
    } catch (err) {
      showError(err)
    } finally {
      setIsSaving(false)
    }
  }, [propertyId, navigate])

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
          <Step3PhotosAmenities
            photos={photos}
            onPhotosChange={setPhotos}
            amenities={amenities}
            onAmenitiesChange={setAmenities}
            starRating={starRating}
            onStarRatingChange={setStarRating}
            apiAmenities={apiAmenities}
          />
        )

      case 'rooms':
        return (
          <Step4RoomSetup
            rooms={rooms}
            onRoomsChange={setRooms}
            apiAmenities={apiAmenities}
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
            photos={photos}
            amenities={amenities}
            rooms={rooms}
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

    const nextLabel = currentStep === 'rooms' ? 'Continue to Pricing & Offers' : 'Next Step'
    const showSaveDraft = currentStep === 'photos' || currentStep === 'pricing'

    return (
      <div className="portal-nav-container">
        <NavigationButtons
          onBack={prev ? handleBack : undefined}
          onNext={isSaving ? undefined : (next ? handleNext : undefined)}
          onSaveDraft={showSaveDraft ? handleSaveDraft : undefined}
          backLabel="Previous Step"
          nextLabel={isSaving ? 'Saving...' : nextLabel}
          showSaveDraft={showSaveDraft}
        />
      </div>
    )
  }

  return (
    <div className="portal-page">
      <PortalHeader stepText={currentStep !== 'type' ? `Step ${getStepNumber().current} of ${getStepNumber().total}` : undefined} />

      <main className="portal-main">
        {saveError && (
          <div className="portal-error-banner">
            <span>{saveError}</span>
            <button onClick={() => setSaveError(null)} className="portal-error-close">&times;</button>
          </div>
        )}

        {isSaving && currentStep !== 'type' && (
          <div className="portal-saving-indicator">
            <div className="saving-spinner" />
            <span>Saving...</span>
          </div>
        )}

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
            />
            {renderStepContent()}
            {renderNavigation()}
          </div>
        )}
      </main>
    </div>
  )
}
