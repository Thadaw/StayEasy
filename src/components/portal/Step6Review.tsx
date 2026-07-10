import { CheckCircle, Edit, Rocket, Save, LifeBuoy, MapPin, Camera, Tag, Star } from 'lucide-react'
import { Room } from './Step4RoomSetup'

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
    mapLink: string
  }
  photos: File[]
  amenities: string[]
  rooms: Room[]
  offers: Offer[]
  starRating: number
  onGoToStep: (step: number) => void
  onPublish: () => void
}

const stepOrder = ['type', 'property', 'location', 'photos', 'rooms', 'pricing', 'review']

export default function Step6Review({
  property, location, photos, amenities, rooms, offers, starRating,
  onGoToStep, onPublish,
}: Step6Props) {
  const fullAddress = [location.street, location.city, location.state, location.country, location.zip]
    .filter(Boolean).join(', ')

  const enabledOffers = offers.filter(o => o.enabled)

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
     (amenities.length > 0 ? 10 : 0) +
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
          {location.mapLink && (
            <div className="review-field" style={{ marginTop: 8 }}>
              <span className="review-field-label">MAP LINK</span>
              <span className="review-field-value" style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>
                {location.mapLink}
              </span>
            </div>
          )}
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
            {amenities.slice(0, 8).map(a => (
              <span key={a} className="review-amenity-tag">{a}</span>
            ))}
            {amenities.length > 8 && (
              <span className="review-amenity-more">+{amenities.length - 8} more</span>
            )}
          </div>
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
          {rooms.length > 0 && (
            <div className="review-field" style={{ marginTop: 16 }}>
              <span className="review-field-label">ROOMS ({rooms.length})</span>
              <div className="review-rooms-list">
                {rooms.map(r => (
                  <span key={r.id} className="review-room-tag">
                    {r.name} - {r.type || 'Standard'} ({r.bedType || 'No bed type'})
                  </span>
                ))}
              </div>
            </div>
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
          <button className="btn-launch" onClick={onPublish}>
            <Rocket size={16} /> Launch Property
          </button>
          <button className="btn-save-draft" onClick={onPublish}>
            <Save size={16} /> Save as Draft
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
