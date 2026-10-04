import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Edit, Rocket, LifeBuoy, MapPin, Camera, Tag, Star, Home, Users, Bed, DollarSign, FileText, Globe } from 'lucide-react'
import { Room } from './Step4RoomSetup'
import type { AmenityOption, SystemRoomTypeItem, SystemBedTypeItem } from '../../types/pms'

interface Offer {
  id: string
  label: string
  badge: string
  badgeColor: string
  badgeText: string
  desc: string
  enabled: boolean
}

interface Step6Props {
  property: {
    name: string
    type: string
    description: string
    phone: string
    email: string
    totalRooms: number
    floors: number
    yearBuilt: number
  }
  location: {
    street: string
    city: string
    state: string
    country: string
    zip: string
    latitude: number | null
    longitude: number | null
  }
  localization: {
    currency: string
    timezone: string
    language: string
    checkInTime: string
    checkOutTime: string
    earlyCheckInGrace: number
    lateCheckOutGrace: number
    allowAlwaysCheckIn: boolean
    allowPayOnArrival: boolean
    minAdvancePercentage: number
    maxAdvancePercentage: number
  }
  photos: File[]
  availableAmenities: AmenityOption[]
  systemAmenityIds: string[]
  customAmenities: Array<{ name: string; icon: string }>
  rooms: Room[]
  systemRoomTypes: SystemRoomTypeItem[]
  systemBedTypes: SystemBedTypeItem[]
  offers: Offer[]
  starRating: number
  onGoToStep: (step: number) => void
  onPublish?: () => Promise<void>
}

const stepOrder = ['type', 'property', 'location', 'photos', 'localization', 'branding', 'rooms', 'pricing', 'review']

export default function Step6Review({
  property, location, localization, photos, availableAmenities, systemAmenityIds, customAmenities, rooms, systemRoomTypes, systemBedTypes, offers, starRating,
  onGoToStep, onPublish,
}: Step6Props) {
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const fullAddress = [location.street, location.city, location.state, location.country, location.zip]
    .filter(Boolean).join(', ')

  const enabledOffers = offers.filter(o => o.enabled)

  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const roomTypeLabel = (id: string): string => {
    if (!id) return 'Not set'
    if (!uuidRe.test(id)) return id
    return systemRoomTypes.find(t => t.id === id)?.room_type_name || 'Unknown type'
  }
  const bedTypeLabel = (id: string): string => {
    if (!id) return 'Not set'
    if (!uuidRe.test(id)) return id
    return systemBedTypes.find(t => t.id === id)?.bed_name || 'Unknown type'
  }
  const policyLabel = (room: Room): string => {
    const p = room.cancellationPolicy
    if (!p) return 'Not set'
    if (p.toLowerCase().startsWith('custom-')) {
      return room.savedCustomPolicies.find(sp => sp.id === p)?.title || 'Custom'
    }
    const labelMap: Record<string, string> = {
      FLEXIBLE: 'Flexible', MODERATE: 'Moderate', STRICT: 'Strict', NON_REFUNDABLE: 'Non-Refundable', CUSTOM: 'Custom',
    }
    return labelMap[p.toUpperCase().replace('-', '_')] || p
  }

  const systemAmenityNames = systemAmenityIds
    .map(id => availableAmenities.find(a => String(a.id) === id)?.name)
    .filter((name): name is string => !!name)
  const allAmenityNames = [
    ...systemAmenityNames,
    ...customAmenities.map(c => c.name),
  ]

  const checklist = [
    { label: 'Core Identity Verified', done: true },
    { label: 'High-Res Media Loaded', done: photos.length > 0 },
    { label: 'Address & Geo-tagging', done: !!location.street },
    { label: 'Regulatory Compliance', done: true },
  ]

  const profileStrength = Math.min(100, Math.round(
    ((property.name ? 15 : 0) +
     (property.description ? 15 : 0) +
     (photos.length > 0 ? 20 : 0) +
     (location.street ? 15 : 0) +
     (allAmenityNames.length > 0 ? 10 : 0) +
     (rooms.length > 0 ? 15 : 0) +
     (enabledOffers.length > 0 ? 10 : 0))
  ))

  return (
    <div className="step-review-wrapper">
      <div className="flex-1">
        <div className="step-review-header">
          <h1 className="step-review-title">Final Review & Launch</h1>
          <p className="step-review-subtitle">
            Nearly there! Please review all property details before making your listing live.
            Once launched, this property will be available for bookings.
          </p>
        </div>

        <div className="review-card">
          <div className="review-card-header">
            <h3 className="review-card-title">
              <span className="review-icon">&#9432;</span> Basic Information
            </h3>
            <button className="review-edit-btn" onClick={() => onGoToStep(stepOrder.indexOf('property'))}>
              <Edit size={12} /> Edit
            </button>
          </div>
          <div className="review-grid-2">
            <div className="review-field">
              <span className="review-field-label">PROPERTY NAME</span>
              <span className="review-field-value">{property.name || 'Not set'}</span>
            </div>
            <div className="review-field">
              <span className="review-field-label">PROPERTY TYPE</span>
              <span className="review-field-value">{property.type || 'Not set'}</span>
            </div>
          </div>
          <div className="review-field" style={{ marginTop: 12 }}>
            <span className="review-field-label">DESCRIPTION</span>
            <p className="review-field-text">{property.description || 'No description provided.'}</p>
          </div>
          {starRating > 0 && (
            <div className="review-field" style={{ marginTop: 12 }}>
              <span className="review-field-label">STAR RATING</span>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} fill={s <= starRating ? '#F39C12' : 'none'} color={s <= starRating ? '#F39C12' : '#ccc'} />
                ))}
                <span>{starRating} Star{starRating > 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>

        <div className="review-card">
          <div className="review-card-header">
            <h3 className="review-card-title">
              <MapPin size={14} className="icon-primary" /> Location Details
            </h3>
            <button className="review-edit-btn" onClick={() => onGoToStep(stepOrder.indexOf('location'))}>
              <Edit size={12} /> Edit
            </button>
          </div>
          <div className="review-field">
            <span className="review-field-label">ADDRESS</span>
            <span className="review-field-value">{fullAddress || 'No address set'}</span>
          </div>
          {location.latitude != null && location.longitude != null && (
            <div className="review-field" style={{ marginTop: 8 }}>
              <span className="review-field-label">COORDINATES</span>
              <span className="review-field-value">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </span>
            </div>
          )}
        </div>

        <div className="review-card">
          <div className="review-card-header">
            <h3 className="review-card-title">
              <Globe size={14} className="icon-primary" /> Property Localization
            </h3>
            <button className="review-edit-btn" onClick={() => onGoToStep(stepOrder.indexOf('localization'))}>
              <Edit size={12} /> Edit
            </button>
          </div>
          <div className="review-grid-2">
            <div className="review-field">
              <span className="review-field-label">CURRENCY</span>
              <span className="review-field-value">{localization.currency || 'Not set'}</span>
            </div>
            <div className="review-field">
              <span className="review-field-label">TIMEZONE</span>
              <span className="review-field-value">{localization.timezone || 'Not set'}</span>
            </div>
          </div>
          <div className="review-field" style={{ marginTop: 12 }}>
            <span className="review-field-label">LANGUAGE</span>
            <span className="review-field-value">{localization.language || 'Not set'}</span>
          </div>
          <div className="review-grid-2" style={{ marginTop: 12 }}>
            <div className="review-field">
              <span className="review-field-label">CHECK-IN TIME</span>
              <span className="review-field-value">{localization.allowAlwaysCheckIn ? 'Any time' : (localization.checkInTime || 'Not set')}</span>
            </div>
            <div className="review-field">
              <span className="review-field-label">CHECK-OUT TIME</span>
              <span className="review-field-value">{localization.allowAlwaysCheckIn ? 'Any time' : (localization.checkOutTime || 'Not set')}</span>
            </div>
          </div>
          <div className="review-grid-2" style={{ marginTop: 12 }}>
            <div className="review-field">
              <span className="review-field-label">EARLY CHECK-IN GRACE</span>
              <span className="review-field-value">{localization.earlyCheckInGrace === 0 ? 'None' : `${localization.earlyCheckInGrace} hour(s)`}</span>
            </div>
            <div className="review-field">
              <span className="review-field-label">LATE CHECK-OUT GRACE</span>
              <span className="review-field-value">{localization.lateCheckOutGrace === 0 ? 'None' : `${localization.lateCheckOutGrace} hour(s)`}</span>
            </div>
          </div>
          <div className="review-grid-2" style={{ marginTop: 12 }}>
            <div className="review-field">
              <span className="review-field-label">MIN ADVANCE PAYMENT</span>
              <span className="review-field-value">{localization.minAdvancePercentage}%</span>
            </div>
            <div className="review-field">
              <span className="review-field-label">MAX ADVANCE PAYMENT</span>
              <span className="review-field-value">{localization.maxAdvancePercentage}%</span>
            </div>
          </div>
          <div className="review-field" style={{ marginTop: 12 }}>
            <span className="review-field-label">ALLOW PAY ON ARRIVAL</span>
            <span className="review-field-value">{localization.allowPayOnArrival ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="review-card">
          <div className="review-card-header">
            <h3 className="review-card-title">
              <Camera size={14} className="icon-primary" /> Media & Amenities
            </h3>
            <button className="review-edit-btn" onClick={() => onGoToStep(stepOrder.indexOf('photos'))}>
              <Edit size={12} /> Edit
            </button>
          </div>
          <div className="review-field">
            <span className="review-field-label">PHOTOS ({photos.length} UPLOADED)</span>
          </div>
          <div className="review-photos-grid">
            {photos.slice(0, 4).map((p, i) => (
              <div key={i} className="review-photo-item">
                <img src={URL.createObjectURL(p)} alt="" className="review-photo-img" />
              </div>
            ))}
            {photos.length > 4 && (
              <div className="review-photo-more">+{photos.length - 4}</div>
            )}
          </div>
          <div className="review-field" style={{ marginTop: 16 }}>
            <span className="review-field-label">AMENITIES</span>
          </div>
          <div className="review-amenities-tags">
            {allAmenityNames.slice(0, 8).map(a => (
              <span key={a} className="review-amenity-tag">{a}</span>
            ))}
            {allAmenityNames.length > 8 && (
              <span className="review-amenity-more">+{allAmenityNames.length - 8} more</span>
            )}
          </div>
        </div>

        <div className="review-card">
          <div className="review-card-header">
            <h3 className="review-card-title">
              <Home size={14} className="icon-primary" /> Rooms ({rooms.length})
            </h3>
            <button className="review-edit-btn" onClick={() => onGoToStep(stepOrder.indexOf('rooms'))}>
              <Edit size={12} /> Edit
            </button>
          </div>
          {rooms.length > 0 ? (
            <div className="review-rooms-grid">
              {rooms.map((r, idx) => (
                <div key={r.id} className="review-room-card">
                  <div className="review-room-header">
                    <div className="review-room-number">{idx + 1}</div>
                    <span className="review-room-name">{r.name || `Room ${idx + 1}`}</span>
                  </div>
                  <div className="review-room-details">
                    <div className="review-room-detail">
                      <Tag size={12} />
                      <span>{roomTypeLabel(r.type)}</span>
                    </div>
                    <div className="review-room-detail">
                      <Bed size={12} />
                      <span>{bedTypeLabel(r.bedType)}</span>
                    </div>
                    <div className="review-room-detail">
                      <Home size={12} />
                      <span>Floor {r.floor}</span>
                    </div>
                    <div className="review-room-detail">
                      <Users size={12} />
                      <span>{r.maxAdults} adults, {r.maxChildren} children</span>
                    </div>
                    <div className="review-room-detail">
                      <DollarSign size={12} />
                      <span>${r.minRate || '0'}/night</span>
                    </div>
                    <div className="review-room-detail">
                      <FileText size={12} />
                      <span>{policyLabel(r)}</span>
                    </div>
                  </div>
                  {r.amenities.length > 0 && (
                    <div className="review-room-amenities">
                      {r.amenities.slice(0, 5).map(a => (
                        <span key={a} className="review-room-amenity-tag">{a}</span>
                      ))}
                      {r.amenities.length > 5 && (
                        <span className="review-room-amenity-more">+{r.amenities.length - 5}</span>
                      )}
                    </div>
                  )}
                  {r.photos.length > 0 && (
                    <div className="review-room-photos">
                      <Camera size={12} />
                      <span>{r.photos.length} photo{r.photos.length > 1 ? 's' : ''}</span>
                      <div className="review-room-photo-thumbs">
                        {r.photos.slice(0, 3).map((p, i) => (
                          <img key={i} src={URL.createObjectURL(p)} alt="" className="review-room-photo-thumb" />
                        ))}
                        {r.photos.length > 3 && (
                          <span className="review-room-photo-more">+{r.photos.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="form-hint">No rooms added yet</p>
          )}
        </div>

        <div className="review-card">
          <div className="review-card-header">
            <h3 className="review-card-title">
              <Tag size={14} className="icon-primary" /> Offers & Policies
            </h3>
            <button className="review-edit-btn" onClick={() => onGoToStep(stepOrder.indexOf('pricing'))}>
              <Edit size={12} /> Edit
            </button>
          </div>
          {enabledOffers.length > 0 ? (
            <div className="review-offers-list">
              {enabledOffers.map(o => (
                <div key={o.id} className="review-offer-item">
                  <span className="review-offer-label">{o.label}</span>
                  <span className="review-offer-badge" style={{ background: o.badgeColor, color: o.badgeText }}>
                    {o.badge}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="form-hint">No offers enabled</p>
          )}
        </div>
      </div>

      <div className="review-sidebar">
        <div className="review-publish-card">
          <h3 className="review-publish-title">
            <CheckCircle size={16} /> Ready to Publish
          </h3>
          <p className="review-publish-desc">
            Your property listing is complete. Once you launch, it will be visible on the public portal and ready to accept bookings.
          </p>
          {publishError && (
            <div style={{ padding: '8px 12px', marginBottom: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 13, color: '#dc2626' }}>
              {publishError}
            </div>
          )}
          <button
            className="btn-launch"
            disabled={isPublishing || !onPublish}
            onClick={async () => {
              if (!onPublish) {
                setPublishError('Publish function not available')
                return
              }
              setIsPublishing(true)
              setPublishError(null)
              try {
                await onPublish()
                navigate('/host/my-properties')
              } catch (err: any) {
                const msg = err?.message || 'Failed to publish property'
                setPublishError(msg)
              } finally {
                setIsPublishing(false)
              }
            }}
          >
            {isPublishing ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Publishing...
              </>
            ) : (
              <>
                <Rocket size={16} /> Launch Property
              </>
            )}
          </button>
        </div>

        <div className="review-checklist-card">
          <h4 className="review-checklist-title">ONBOARDING CHECKLIST</h4>
          {checklist.map(c => (
            <div key={c.label} className="review-checklist-item">
              <CheckCircle size={16} color={c.done ? 'var(--status-success)' : '#ccc'} />
              <span className={c.done ? 'done' : ''}>{c.label}</span>
            </div>
          ))}
          <div className="review-profile-strength">
            <div className="review-strength-header">
              <span>Profile Strength</span>
              <span className="review-strength-value">{profileStrength}%</span>
            </div>
            <div className="review-strength-bar">
              <div
                className="review-strength-fill"
                style={{
                  width: `${profileStrength}%`,
                  background: profileStrength >= 80 ? 'var(--status-success)' : 'var(--primary)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="review-help-card">
          <LifeBuoy size={24} className="icon-primary" style={{ margin: '0 auto 8px', display: 'block' }} />
          <h4 className="review-help-title">Need help with setup?</h4>
          <p className="review-help-desc">Contact our 24/7 dedicated owner support line.</p>
          <button className="review-help-btn">Get Assistance</button>
        </div>
      </div>
    </div>
  )
}
