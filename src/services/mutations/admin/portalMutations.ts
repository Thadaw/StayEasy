import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createProperty,
  uploadSingleImage,
  uploadPropertyImage,
  uploadRoomImages,
  createRooms,
  createSpecialOffers,
  updatePropertyActivation,
  getTenant,
  createTenant,
} from '@/api/pms/pmsApi'
import { propertyKeys, tenantKeys } from '@/lib/queryKeys'
import type {
  AmenityOption,
  CancellationPolicyEnum,
  CreatePropertyPayload,
  PhotosAmenityCustom,
  RoomBase,
  SpecialOfferPayload,
} from '@/types/pms'
import type { BrandData } from '@/components/admin/portal/Step5BrandingVisuals'
import type { LocalizationData } from '@/components/admin/portal/Step4Localization'
import type { Room } from '@/components/admin/portal/Step4RoomSetup'
import type { LocationData, Offer, PropertyData } from '@/store/admin/portalStore'

export interface PublishPropertyInput {
  propertyData: PropertyData
  locationData: LocationData
  photos: File[]
  coverIndex: number
  systemAmenityIds: string[]
  customAmenities: PhotosAmenityCustom[]
  localizationData: LocalizationData
  brandData: BrandData
  rooms: Room[]
  offers: Offer[]
  availableAmenities: AmenityOption[]
}

export interface PublishPropertyResult {
  propertyId: string
  activationWarning: string | null
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const isUuid = (v: unknown): boolean => typeof v === 'string' && UUID_RE.test(v)

async function publishProperty(input: PublishPropertyInput): Promise<PublishPropertyResult> {
  const {
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
  } = input

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

  // Phase 7: Activate
  let activationWarning: string | null = null
  try {
    await updatePropertyActivation(newPropertyId)
  } catch {
    activationWarning = 'Property created but could not be activated. Please activate it from the dashboard.'
  }

  return { propertyId: newPropertyId, activationWarning }
}

export function usePublishPropertyMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input: PublishPropertyInput) => publishProperty(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })

  return {
    publishProperty: mutation.mutateAsync,
    isPublishing: mutation.isPending,
    error: mutation.error,
  }
}
