import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, Upload, Search } from 'lucide-react'
import type { AmenityOption } from '../../types/pms'

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential', 'Studio', 'Penthouse', 'Family', 'Connecting', 'Accessible']
const BED_TYPES = ['Single', 'Double', 'Queen', 'King', 'Twin', 'Sofa Bed', 'Bunk Bed', 'Murphy Bed']

const CANCELLATION_POLICIES = [
  { id: 'flexible', label: 'Flexible', desc: 'Full refund 24 hrs before check-in' },
  { id: 'moderate', label: 'Moderate', desc: 'Full refund 5 days before check-in' },
  { id: 'strict', label: 'Strict', desc: '50% refund up to 1 week before' },
  { id: 'non-refundable', label: 'Non-Refundable', desc: 'No refund at any time' },
  { id: 'custom', label: 'Custom', desc: 'Define your own terms' },
]

export interface Room {
  id: string
  floor: string
  name: string
  type: string
  bedType: string
  maxAdults: number
  maxChildren: number
  petsAllowed: boolean
  minRate: string
  cancellationPolicy: string
  amenities: string[]
  expanded: boolean
  photos: File[]
}

const createRoom = (id: number): Room => ({
  id: `room-${id}`, floor: '1', name: `Room ${id}`, type: '', bedType: '',
  maxAdults: 2, maxChildren: 0, petsAllowed: false, minRate: '0.00',
  cancellationPolicy: 'moderate', amenities: ['High-speed WiFi', 'Air Conditioning'], expanded: true, photos: [],
})

interface Step4Props {
  rooms: Room[]
  onRoomsChange: (rooms: Room[]) => void
  apiAmenities: AmenityOption[]
}

export default function Step4RoomSetup({ rooms, onRoomsChange, apiAmenities }: Step4Props) {
  const [amenitySearch, setAmenitySearch] = useState('')

  const updateRoom = (id: string, data: Partial<Room>) => {
    onRoomsChange(rooms.map(r => r.id === id ? { ...r, ...data } : r))
  }

  const addRoom = () => {
    onRoomsChange([...rooms, createRoom(rooms.length + 1)])
  }

  const removeRoom = (id: string) => {
    onRoomsChange(rooms.filter(r => r.id !== id))
  }

  const handleRoomPhotoUpload = (roomId: string, files: FileList | null) => {
    if (!files) return
    const room = rooms.find(r => r.id === roomId)
    if (!room) return
    const newPhotos = Array.from(files).filter(f => f.type.startsWith('image/'))
    updateRoom(roomId, { photos: [...room.photos, ...newPhotos].slice(0, 6) })
  }

  const removeRoomPhoto = (roomId: string, photoIdx: number) => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return
    updateRoom(roomId, { photos: room.photos.filter((_, i) => i !== photoIdx) })
  }

  const filteredAmenities = apiAmenities.filter(a => {
    const label = a.label || a.name || ''
    return label.toLowerCase().includes(amenitySearch.toLowerCase())
  })

  return (
    <div className="step-room-wrapper">
      <div className="flex-1">
        <div className="step-card">
          <div className="step-card-header">
            <h3 className="step-card-title with-icon">
              <span className="step-icon">&#128203;</span> Room Setup
            </h3>
            <p className="step-card-subtitle">Add each room type guests will be able to book at your property</p>
          </div>
        </div>

        {rooms.map((room, idx) => (
          <div key={room.id} className="room-card">
            <div
              className={`room-header ${room.expanded ? 'expanded' : ''}`}
              onClick={() => updateRoom(room.id, { expanded: !room.expanded })}
            >
              <div className="room-header-left">
                <div className="room-number">{idx + 1}</div>
                <span className="room-name">{room.name || `Room ${idx + 1}`}</span>
              </div>
              <div className="room-header-right">
                {rooms.length > 1 && (
                  <button
                    className="room-delete-btn"
                    onClick={e => { e.stopPropagation(); removeRoom(room.id) }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                {room.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {room.expanded && (
              <div className="room-content">
                <div className="room-section-label">Room Identification</div>
                <div className="form-row-4">
                  <div className="form-group">
                    <label className="form-label">Floor *</label>
                    <select
                      value={room.floor}
                      onChange={e => updateRoom(room.id, { floor: e.target.value })}
                      className="form-select"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Room Name *</label>
                    <input
                      type="text"
                      value={room.name}
                      onChange={e => updateRoom(room.id, { name: e.target.value })}
                      placeholder="e.g. Ocean Suite A"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Room Type *</label>
                    <select
                      value={room.type}
                      onChange={e => updateRoom(room.id, { type: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select type</option>
                      {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bed Type *</label>
                    <select
                      value={room.bedType}
                      onChange={e => updateRoom(room.id, { bedType: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select bed type</option>
                      {BED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="room-section-label">Room Photos (MAX 6)</div>
                <div className="room-photos-section">
                  <div className="room-photos-grid">
                    {room.photos.slice(0, 6).map((p, i) => (
                      <div key={i} className="room-photo-item">
                        <img src={URL.createObjectURL(p)} alt="" className="room-photo-img" />
                        <button
                          className="room-photo-remove"
                          onClick={() => removeRoomPhoto(room.id, i)}
                        >
                          ×
                        </button>
                        {i === 0 && <span className="room-photo-cover">Cover</span>}
                      </div>
                    ))}
                    {room.photos.length < 6 && (
                      <label className="room-photo-add">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={e => handleRoomPhotoUpload(room.id, e.target.files)}
                        />
                        <Upload size={20} className="upload-icon" />
                        <span>Add</span>
                      </label>
                    )}
                  </div>
                  <p className="room-photos-hint">Drag photos. Hover a card to remove. First photo is the cover image.</p>
                </div>

                <div className="room-section-label">Maximum Occupancy</div>
                <div className="occupancy-row">
                  <div className="occupancy-control">
                    <span className="occupancy-label">Adults <small>Age 18+</small></span>
                    <div className="counter-input small">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => updateRoom(room.id, { maxAdults: Math.max(1, room.maxAdults - 1) })}
                      >-</button>
                      <span className="counter-value">{room.maxAdults}</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => updateRoom(room.id, { maxAdults: room.maxAdults + 1 })}
                      >+</button>
                    </div>
                  </div>
                  <div className="occupancy-control">
                    <span className="occupancy-label">Children <small>Age 2-17</small></span>
                    <div className="counter-input small">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => updateRoom(room.id, { maxChildren: Math.max(0, room.maxChildren - 1) })}
                      >-</button>
                      <span className="counter-value">{room.maxChildren}</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => updateRoom(room.id, { maxChildren: room.maxChildren + 1 })}
                      >+</button>
                    </div>
                  </div>
                  <div className="occupancy-control">
                    <span className="occupancy-label">Pets Allowed</span>
                    <button
                      type="button"
                      className={`toggle-switch ${room.petsAllowed ? 'active' : ''}`}
                      onClick={() => updateRoom(room.id, { petsAllowed: !room.petsAllowed })}
                    >
                      <div className="toggle-knob" />
                    </button>
                  </div>
                </div>

                <div className="room-section-label">Rates & Policies</div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Minimum Rate per Night (USD) *</label>
                  <input
                    type="number"
                    value={room.minRate}
                    onChange={e => updateRoom(room.id, { minRate: e.target.value })}
                    placeholder="0.00"
                    className="form-input"
                    style={{ width: 200 }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cancellation Policy *</label>
                  <div className="cancellation-grid">
                    {CANCELLATION_POLICIES.map(p => (
                      <label
                        key={p.id}
                        className={`cancellation-option ${room.cancellationPolicy === p.id ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`cancel-${room.id}`}
                          checked={room.cancellationPolicy === p.id}
                          onChange={() => updateRoom(room.id, { cancellationPolicy: p.id })}
                          className="radio-input"
                        />
                        <div>
                          <div className="cancellation-label">{p.label}</div>
                          <div className="cancellation-desc">{p.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <button onClick={addRoom} className="add-room-btn">
          <Plus size={18} /> Add Blank Room
        </button>
      </div>

      <div className="amenities-sidebar">
        <div className="step-card sticky">
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
                    checked={rooms.length > 0 && rooms[0].amenities.includes(label)}
                    readOnly
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
                placeholder="e.g. Private Helipad, Wine Cellar, Hammam..."
                className="form-input flex-1"
              />
              <button className="btn-add-amenity">+ Add</button>
            </div>
            <p className="custom-amenity-hint">Press Enter or click Add to include an amenity not in the list above.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
