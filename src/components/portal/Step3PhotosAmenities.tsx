import { useState } from 'react'
import { Upload, Plus, Search, Star } from 'lucide-react'
import type { AmenityOption } from '../../types/pms'

interface Step3Props {
  photos: File[]
  onPhotosChange: (photos: File[]) => void
  amenities: string[]
  onAmenitiesChange: (amenities: string[]) => void
  starRating: number
  onStarRatingChange: (rating: number) => void
  apiAmenities: AmenityOption[]
}

export default function Step3PhotosAmenities({
  photos, onPhotosChange,
  amenities, onAmenitiesChange,
  starRating, onStarRatingChange,
  apiAmenities,
}: Step3Props) {
  const [amenitySearch, setAmenitySearch] = useState('')
  const [customAmenity, setCustomAmenity] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const toggleAmenity = (label: string) => {
    onAmenitiesChange(
      amenities.includes(label)
        ? amenities.filter(x => x !== label)
        : [...amenities, label]
    )
  }

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      onAmenitiesChange([...amenities, customAmenity.trim()])
      setCustomAmenity('')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newPhotos = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
      onPhotosChange([...photos, ...newPhotos].slice(0, 50))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
      onPhotosChange([...photos, ...newPhotos].slice(0, 50))
    }
  }

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index))
  }

  const filteredAmenities = apiAmenities.filter(a => {
    const label = a.label || a.name || ''
    return label.toLowerCase().includes(amenitySearch.toLowerCase())
  })

  return (
    <div className="step-photos-wrapper">
      <div className="flex-1">
        <div className="step-card">
          <div className="step-card-header">
            <h3 className="step-card-title">Property Photos</h3>
            <span className="photo-count">{photos.length} / 50 Uploaded</span>
          </div>

          <div
            className={`photo-upload-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('photo-input')?.click()}
          >
            <Upload size={32} className="upload-icon" />
            <p className="upload-text">Drag & drop your photos here</p>
            <p className="upload-link">or browse files from your computer</p>
            <p className="upload-hint">
              <span className="hint-dot" /> High resolution
              <span className="hint-dot" /> JPG, PNG, WEBP
              <span className="hint-dot" /> Up to 20MB
            </p>
          </div>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileSelect}
          />

          {photos.length > 0 && (
            <div className="photo-preview-grid">
              {photos.slice(0, 4).map((p, i) => (
                <div key={i} className="photo-preview-item">
                  <img src={URL.createObjectURL(p)} alt="" className="photo-preview-img" />
                  <button
                    className="photo-remove-btn"
                    onClick={(e) => { e.stopPropagation(); removePhoto(i) }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {photos.length > 4 && (
                <div className="photo-preview-more">
                  +{photos.length - 4}
                </div>
              )}
              <div
                className="photo-preview-add"
                onClick={() => document.getElementById('photo-input')?.click()}
              >
                <Plus size={20} />
              </div>
            </div>
          )}
        </div>

        <div className="step-card">
          <div className="star-rating-section">
            <div className="star-rating-header">
              <Star size={18} className="icon-primary" />
              <h3 className="step-card-title" style={{ margin: 0 }}>Official Star Rating</h3>
            </div>
            <p className="form-hint" style={{ margin: '0 0 12px' }}>
              Select the certified commercial rating of this property.
            </p>
            <div className="star-rating-buttons">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${starRating >= star ? 'active' : ''}`}
                  onClick={() => onStarRatingChange(star === starRating ? 0 : star)}
                >
                  <Star size={24} fill={starRating >= star ? '#F39C12' : 'none'} />
                </button>
              ))}
              <span className="star-rating-label">
                {starRating > 0 ? `${starRating} Star${starRating > 1 ? 's' : ''}` : 'Select a rating'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="amenities-sidebar">
        <div className="step-card">
          <h3 className="step-card-title">Amenities</h3>
          <div className="search-input-wrapper">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              value={amenitySearch}
              onChange={e => setAmenitySearch(e.target.value)}
              placeholder="Search amenities..."
              className="search-input"
            />
          </div>

          <div className="amenities-list">
            {filteredAmenities.map(a => {
              const label = a.label || a.name || ''
              return (
                <label key={a.id} className="amenity-item">
                  <input
                    type="checkbox"
                    checked={amenities.includes(label)}
                    onChange={() => toggleAmenity(label)}
                    className="amenity-checkbox"
                  />
                  {a.icon && <span className="amenity-icon">{a.icon}</span>}
                  <span className="amenity-label">{label}</span>
                </label>
              )
            })}
          </div>

          <div className="custom-amenity-section">
            <p className="custom-amenity-title">Add a custom amenity</p>
            <div className="custom-amenity-input-row">
              <input
                type="text"
                value={customAmenity}
                onChange={e => setCustomAmenity(e.target.value)}
                placeholder="e.g. Private Helipad, Wine Cellar, Hammam..."
                onKeyDown={e => e.key === 'Enter' && addCustomAmenity()}
                className="form-input flex-1"
              />
              <button onClick={addCustomAmenity} className="btn-add-amenity">
                + Add
              </button>
            </div>
            <p className="custom-amenity-hint">Press Enter or click Add to include an amenity not in the list above.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
