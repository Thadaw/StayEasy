import { useState, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import PortalHeader from '@/components/admin/portal/PortalHeader'
import ProgressBar from '@/components/admin/portal/ProgressBar'
import PropertyTypeSelector from '@/components/admin/portal/PropertyTypeSelector'
import Step1PropertyDetails from '@/components/admin/portal/Step1PropertyDetails'
import Step2Location from '@/components/admin/portal/Step2Location'
import Step3PhotosAmenities from '@/components/admin/portal/Step3PhotosAmenities'
import Step4Localization from '@/components/admin/portal/Step4Localization'
import Step5BrandingVisuals from '@/components/admin/portal/Step5BrandingVisuals'
import Step4RoomSetup from '@/components/admin/portal/Step4RoomSetup'
import Step5PricingOffers from '@/components/admin/portal/Step5PricingOffers'
import Step6Review from '@/components/admin/portal/Step6Review'
import NavigationButtons from '@/components/admin/portal/NavigationButtons'
import { usePublishPropertyMutation } from '@/services/mutations/admin/portalMutations'
import {
  usePortalAmenitiesQuery,
  usePortalSystemRoomTypesQuery,
  usePortalSystemBedTypesQuery,
} from '@/services/queries/admin/portalQueries'
import { usePortalStore } from '@/store/admin/portalStore'
import {
  portalPropertyStepSchema,
  portalLocationStepSchema,
  portalLocalizationStepSchema,
  portalRoomsBasicSchema,
  portalRoomsTypeSchema,
} from '@/schemas/admin/portalSchemas'
import type { Offer, WizardStep } from '@/store/admin/portalStore'
import type { Room } from '@/components/admin/portal/Step4RoomSetup'
import type { PhotosAmenityCustom } from '@/types/pms'
import '@/styles/portal.css'

interface DraftOffer extends Omit<Offer, 'startDate' | 'endDate'> {
  startDate?: string | null
  endDate?: string | null
}

interface PhotosStepSnapshot {
  photosLength: number
  coverIndex: number
  systemAmenityIds: string[]
  customAmenities: PhotosAmenityCustom[]
  starRating: number
}

interface BrandingStepSnapshot {
  brandColor: string
  logo: import('@/components/admin/portal/Step5BrandingVisuals').BrandData['logo']
}

interface ApiErrorLike {
  response?: { data?: { error?: string; message?: string } }
  message?: string
}

export default function HostPortalPageNew() {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()

  const {
    currentStep, setCurrentStep,
    propertyData, setPropertyData, patchPropertyData,
    locationData, setLocationData, patchLocationData,
    photos, setPhotos, coverIndex, setCoverIndex,
    systemAmenityIds, setSystemAmenityIds,
    customAmenities, setCustomAmenities,
    rooms, setRooms, offers, setOffers, starRating, setStarRating,
    localizationData, setLocalizationData, patchLocalizationData,
    brandData, setBrandData, patchBrandData,
    propertyId, setPropertyId, reset,
  } = usePortalStore()

  const { publishProperty } = usePublishPropertyMutation()

  const dataEnabled = !authLoading && !!user
  const amenitiesQuery = usePortalAmenitiesQuery(dataEnabled)
  const roomTypesQuery = usePortalSystemRoomTypesQuery(dataEnabled)
  const bedTypesQuery = usePortalSystemBedTypesQuery(dataEnabled)
  const availableAmenities = amenitiesQuery.data ?? []
  const systemRoomTypes = roomTypesQuery.data ?? []
  const systemBedTypes = bedTypesQuery.data ?? []

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
    try { localStorage.removeItem('serveIQDraft') } catch { /* ignore */ }
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
        if (draft.rooms) setRooms(draft.rooms.map((r: Room) => ({
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
          setOffers(draft.offers.map((o: DraftOffer) => ({
            ...o,
            discountPercentage: o.discountPercentage ?? 0,
            startDate: o.startDate ? new Date(o.startDate) : null,
            endDate: o.endDate ? new Date(o.endDate) : null,
          })))
        }
        if (draft.brandData) setBrandData({ ...draft.brandData, logo: null })
        if (draft.propertyId !== undefined) setPropertyId(draft.propertyId)
      } catch { /* ignore */ }
    } else {
      reset()
    }
    hasRestoredRef.current = true
  }, [draftKey, user, location.state, reset, setCurrentStep, setPropertyData, setLocationData, setCoverIndex, setSystemAmenityIds, setCustomAmenities, setStarRating, setLocalizationData, setRooms, setOffers, setBrandData, setPropertyId])

  useEffect(() => {
    if (amenitiesQuery.isError) {
      console.error('Failed to fetch amenities:', amenitiesQuery.error)
      setSaveError('Failed to load amenities. Room amenities may not work correctly.')
    }
  }, [amenitiesQuery.isError, amenitiesQuery.error])

  useEffect(() => {
    if (roomTypesQuery.isError) {
      console.error('Failed to fetch system room types:', roomTypesQuery.error)
      setSaveError('Failed to load room types. Room setup may not work correctly.')
    }
  }, [roomTypesQuery.isError, roomTypesQuery.error])

  useEffect(() => {
    if (bedTypesQuery.isError) {
      console.error('Failed to fetch system bed types:', bedTypesQuery.error)
      setSaveError('Failed to load bed types. Room setup may not work correctly.')
    }
  }, [bedTypesQuery.isError, bedTypesQuery.error])

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
      try { localStorage.setItem(draftKey, JSON.stringify(draft)) } catch { /* ignore */ }
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
      try { localStorage.setItem(draftKey, JSON.stringify(draft)) } catch { /* ignore */ }
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
        photos.length !== (last as PhotosStepSnapshot).photosLength ||
        coverIndex !== (last as PhotosStepSnapshot).coverIndex ||
        JSON.stringify(systemAmenityIds) !== JSON.stringify((last as PhotosStepSnapshot).systemAmenityIds) ||
        JSON.stringify(customAmenities) !== JSON.stringify((last as PhotosStepSnapshot).customAmenities) ||
        starRating !== (last as PhotosStepSnapshot).starRating
      )
      case 'localization': return JSON.stringify(localizationData) !== JSON.stringify(last)
      case 'branding': return (
        brandData.brandColor !== (last as BrandingStepSnapshot).brandColor ||
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
          const result = portalPropertyStepSchema.safeParse(propertyData)
          if (!result.success) {
            setSaveError(result.error.issues[0]?.message ?? 'Please complete the property details.')
            return false
          }
          savedStepsRef.current.add('property')
          snapshotStepData('property')
          return true
        }

        case 'location': {
          const result = portalLocationStepSchema.safeParse(locationData)
          if (!result.success) {
            setSaveError(result.error.issues[0]?.message ?? 'Please complete the location details.')
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
          const result = portalLocalizationStepSchema.safeParse(localizationData)
          if (!result.success) {
            setSaveError(result.error.issues[0]?.message ?? 'Please complete the localization details.')
            return false
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
          const basic = portalRoomsBasicSchema.safeParse({ rooms })
          if (!basic.success) {
            setSaveError(basic.error.issues[0]?.message ?? 'Please add at least one room.')
            return false
          }
          if (systemRoomTypes.length === 0 || systemBedTypes.length === 0) {
            setSaveError('Room or bed types failed to load. Please refresh the page and try again.')
            return false
          }
          const typed = portalRoomsTypeSchema.safeParse({ rooms })
          if (!typed.success) {
            setSaveError(typed.error.issues[0]?.message ?? 'Please complete the room setup.')
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
    } catch (err) {
      const apiErr = err as ApiErrorLike | null | undefined
      const msg = apiErr?.response?.data?.error || apiErr?.response?.data?.message || apiErr?.message || 'Failed to save'
      setSaveError(msg)
      return false
    }
  }, [currentStep, propertyData, locationData, localizationData, rooms, photos, coverIndex, systemAmenityIds, customAmenities, starRating, brandData, offers, systemRoomTypes, systemBedTypes])

  const handlePublish = useCallback(async (): Promise<void> => {
    setSaveError(null)

    try {
      const result = await publishProperty({
        propertyData,
        locationData,
        photos,
        coverIndex,
        systemAmenityIds,
        customAmenities,
        localizationData,
        brandData,
        rooms,
        offers,
        availableAmenities,
      })
      setPropertyId(result.propertyId)
      if (result.activationWarning) setSaveError(result.activationWarning)
      clearDraft()
    } catch (err) {
      const apiErr = err as ApiErrorLike | null | undefined
      const msg = apiErr?.response?.data?.error || apiErr?.response?.data?.message || apiErr?.message || 'Failed to publish property'
      setSaveError(msg)
      throw err
    }
  }, [propertyData, locationData, photos, coverIndex, systemAmenityIds, customAmenities, localizationData, brandData, rooms, offers, availableAmenities, publishProperty, clearDraft, setPropertyId])

  const handleNext = useCallback(async () => {
    setIsSaving(true)
    const ok = await saveCurrentStep()
    setIsSaving(false)
    if (!ok) return
    const next = getNextStep()
    if (next) setCurrentStep(next)
  }, [saveCurrentStep, currentStep, setCurrentStep])

  const handleBack = useCallback(() => {
    setSaveError(null)
    const prev = getPrevStep()
    if (prev) setCurrentStep(prev)
  }, [currentStep, setCurrentStep])

  const handleGoToStep = useCallback((stepIdx: number) => {
    if (stepIdx >= 0 && stepIdx < stepOrder.length) {
      setCurrentStep(stepOrder[stepIdx])
    }
  }, [setCurrentStep])

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <PropertyTypeSelector
            selectedType={propertyData.type}
            onSelect={(type) => {
              patchPropertyData({ type })
              handleNext()
            }}
          />
        )

      case 'property':
        return (
          <Step1PropertyDetails
            data={propertyData}
            onChange={patchPropertyData}
          />
        )

      case 'location':
        return (
          <Step2Location
            data={locationData}
            onChange={patchLocationData}
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
            onChange={patchLocalizationData}
          />
        )

      case 'branding':
        return (
          <Step5BrandingVisuals
            data={brandData}
            onChange={patchBrandData}
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
