import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'

const propertyTypes = [
  { icon: '🏨', label: 'Hotel' },
  { icon: '🏡', label: 'Villa' },
  { icon: '🏢', label: 'Apartment' },
  { icon: '🌴', label: 'Resort' },
  { icon: '🛖', label: 'Cottage' },
  { icon: '🛏️', label: 'Hostel' },
  { icon: '🏠', label: 'Guest House' },
  { icon: '✨', label: 'Boutique Hotel' },
]

const allAmenities = [
  'Free WiFi', 'Free Parking', 'Gym', 'Swimming Pool',
  'Full Kitchen', 'Air Conditioning', 'Smart TV', 'Breakfast Included',
]

const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Penthouse', 'Dormitory', 'Studio']

const cancellationPolicies = [
  { key: 'flexible', label: 'Flexible', desc: 'Full refund 1 day before check-in' },
  { key: 'moderate', label: 'Moderate', desc: 'Full refund 5 days before check-in' },
  { key: 'strict', label: 'Strict', desc: '50% refund 7 days before check-in' },
]

const houseRulesList = [
  'Pets allowed', 'Smoking allowed', 'Events/parties allowed', 'Children welcome',
  'Wheelchair accessible', 'Eco-friendly property', '24/7 check-in', 'Security deposit required',
]

const allLanguages = [
  'English', 'Hindi', 'Nepali', 'French', 'Spanish', 'Arabic',
  'Mandarin', 'Japanese', 'German', 'Italian', 'Portuguese',
]

interface Room {
  name: string
  type: string
  beds: number
  bathrooms: number
  maxGuests: number
  price: number
  pets: boolean
  smoking: boolean
  amenities: string[]
  description: string
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-500 mb-6">
      <span className={step >= 1 ? 'text-blue-600 font-semibold' : ''}>Property</span>
      <span className="text-gray-300">——</span>
      <span className={step >= 2 ? 'text-blue-600 font-semibold' : ''}>Rooms</span>
      <span className="text-gray-300">——</span>
      <span className={step >= 3 ? 'text-blue-600 font-semibold' : ''}>Facilities</span>
      <span className="ml-auto text-gray-400">{['Property', 'Rooms', 'Facilities'][step - 1]}</span>
    </div>
  )
}

function ChipGrid({ items, selected, toggle, cols = 4 }: {
  items: string[]
  selected: string[]
  toggle: (item: string) => void
  cols?: number
}) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-${cols} gap-2`}>
      {items.map((item) => {
        const on = selected.includes(item)
        return (
          <button
            key={item}
            type="button"
            onClick={() => toggle(item)}
            className={`text-xs px-3 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
              on ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}

export default function BecomeAHost() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)

  // Step 1 — property
  const [propType, setPropType] = useState('')
  const [propName, setPropName] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [propAmenities, setPropAmenities] = useState<string[]>([])

  // Step 2 — rooms
  const [rooms, setRooms] = useState<Room[]>([
    { name: '', type: 'Standard', beds: 1, bathrooms: 1, maxGuests: 2, price: 100, pets: false, smoking: false, amenities: [], description: '' },
  ])

  // Step 3 — facilities
  const [checkIn, setCheckIn] = useState('12:00 PM')
  const [checkOut, setCheckOut] = useState('10:00 AM')
  const [cancellation, setCancellation] = useState('flexible')
  const [houseRules, setHouseRules] = useState<string[]>([])
  const [minStay, setMinStay] = useState(1)
  const [maxStay, setMaxStay] = useState(30)
  const [languages, setLanguages] = useState<string[]>(['English', 'Nepali'])
  const [submitting, setSubmitting] = useState(false)

  const toggleAmenity = (item: string) => {
    setPropAmenities((prev) => prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item])
  }

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = 6 - photos.length
    setPhotos((prev) => [...prev, ...files.slice(0, remaining)].slice(0, 6))
    if (e.target) e.target.value = ''
  }

  const removePhoto = (idx: number) => setPhotos((prev) => prev.filter((_, i) => i !== idx))

  const updateRoom = (idx: number, patch: Partial<Room>) => {
    setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  }

  const addRoom = () => {
    setRooms((prev) => [...prev, { name: '', type: 'Standard', beds: 1, bathrooms: 1, maxGuests: 2, price: 100, pets: false, smoking: false, amenities: [], description: '' }])
  }

  const removeRoom = (idx: number) => {
    if (rooms.length <= 1) return
    setRooms((prev) => prev.filter((_, i) => i !== idx))
  }

  const toggleLang = (lang: string) => {
    setLanguages((prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang])
  }

  const toggleHouseRule = (rule: string) => {
    setHouseRules((prev) => prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule])
  }

  const canSubmitStep1 = propType && propName && street && city && country && description && photos.length >= 4

  const updateRoomAmenity = (idx: number, amenity: string) => {
    setRooms((prev) => prev.map((r, i) => {
      if (i !== idx) return r
      const amenities = r.amenities.includes(amenity) ? r.amenities.filter((a) => a !== amenity) : [...r.amenities, amenity]
      return { ...r, amenities }
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('property_type', propType)
      formData.append('name', propName)
      formData.append('street', street)
      formData.append('city', city)
      formData.append('country', country)
      formData.append('description', description)
      formData.append('amenities', JSON.stringify(propAmenities))
      formData.append('check_in', checkIn)
      formData.append('check_out', checkOut)
      formData.append('cancellation_policy', cancellation)
      formData.append('house_rules', JSON.stringify(houseRules))
      formData.append('min_stay', String(minStay))
      formData.append('max_stay', String(maxStay))
      formData.append('languages', JSON.stringify(languages))
      formData.append('rooms', JSON.stringify(rooms))
      photos.forEach((p) => formData.append('photos', p))

      await api.post('/api/v1/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Property listed successfully!')
      navigate('/')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 p-6 shrink-0">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">S</div>
          <span className="font-bold text-sm">StayEasy</span>
        </div>

        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              s < step
                ? 'bg-green-500 text-white'
                : s === step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {s < step ? '✓' : s}
            </div>
            <div>
              <p className={`text-xs font-medium ${s === step ? 'text-blue-600' : s < step ? 'text-green-600' : 'text-gray-400'}`}>
                {['Property', 'Rooms', 'Facilities'][s - 1]}
              </p>
              <p className="text-[10px] text-gray-400">
                {s === 1 ? 'Details & photos' : s === 2 ? 'Room setup' : 'Policies'}
              </p>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate('/')}
          className="mt-auto text-xs text-gray-400 hover:text-gray-600 transition-colors text-left cursor-pointer bg-transparent border-none"
        >
          ← Exit
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-3xl">
        <div className="md:hidden flex items-center justify-between mb-4">
          <button onClick={() => navigate('/')} className="text-xs text-gray-400 cursor-pointer bg-transparent border-none">← Exit</button>
          <span className="text-xs text-gray-500 font-medium">{['Property', 'Rooms', 'Facilities'][step - 1]} — Step {step}/3</span>
        </div>

        <StepIndicator step={step} />

        {/* Step 1 — Property */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your property</h1>
            <p className="text-sm text-gray-500 mb-6">Share the details that will attract the right guests</p>

            <label className="text-sm font-semibold text-gray-800 mb-3 block">Property type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {propertyTypes.map((pt) => (
                <button
                  key={pt.label}
                  type="button"
                  onClick={() => setPropType(pt.label)}
                  className={`flex flex-col items-center gap-1 p-4 rounded-xl border text-sm transition-colors cursor-pointer ${
                    propType === pt.label
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <span className="text-2xl">{pt.icon}</span>
                  <span className="font-medium">{pt.label}</span>
                </button>
              ))}
            </div>

            <label className="text-sm font-semibold text-gray-800 mb-1 block">Property name</label>
            <input
              value={propName}
              onChange={(e) => setPropName(e.target.value)}
              placeholder="e.g. Sunset Beach Resort"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 mb-5"
            />

            <label className="text-sm font-semibold text-gray-800 mb-1 block">Street address</label>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street address"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 mb-5"
            />

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-1 block">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kathmandu"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-1 block">Country</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Nepal"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                />
              </div>
            </div>

            <label className="text-sm font-semibold text-gray-800 mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your property — its style, setting, what makes it special..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 resize-none mb-5"
            />

            <label className="text-sm font-semibold text-gray-800 mb-3 block">
              Property photos <span className="text-gray-400 font-normal">(min 4, max 6)</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center text-xs cursor-pointer hover:bg-black/70"
                  >
                    ×
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 transition-colors cursor-pointer bg-transparent"
                >
                  <span className="text-xl">+</span>
                  <span className="text-xs mt-1">Add photo</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoAdd}
              className="hidden"
            />
            <p className="text-xs text-gray-400 mb-6">{photos.length}/6 photos added</p>

            <label className="text-sm font-semibold text-gray-800 mb-3 block">Property-wide amenities</label>
            <ChipGrid items={allAmenities} selected={propAmenities} toggle={toggleAmenity} />

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-transparent"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!canSubmitStep1}
                className="px-5 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Rooms */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Set up your rooms</h1>
            <p className="text-sm text-gray-500 mb-6">Add each room or unit you want to list</p>

            {rooms.map((room, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-gray-800">Room {idx + 1}</h3>
                  {rooms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoom(idx)}
                      className="text-xs text-red-500 hover:text-red-600 cursor-pointer bg-transparent border-none"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Room name</label>
                    <input
                      value={room.name}
                      onChange={(e) => updateRoom(idx, { name: e.target.value })}
                      placeholder="Room 101"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Room type</label>
                    <select
                      value={room.type}
                      onChange={(e) => updateRoom(idx, { type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 bg-white"
                    >
                      {roomTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Beds</label>
                    <input
                      type="number"
                      min={1}
                      value={room.beds}
                      onChange={(e) => updateRoom(idx, { beds: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Bathrooms</label>
                    <input
                      type="number"
                      min={1}
                      value={room.bathrooms}
                      onChange={(e) => updateRoom(idx, { bathrooms: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Max guests</label>
                    <input
                      type="number"
                      min={1}
                      value={room.maxGuests}
                      onChange={(e) => updateRoom(idx, { maxGuests: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Price / night</label>
                    <input
                      type="number"
                      min={1}
                      value={room.price}
                      onChange={(e) => updateRoom(idx, { price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                <div className="flex gap-6 mb-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={room.pets} onChange={(e) => updateRoom(idx, { pets: e.target.checked })} className="accent-gray-900" />
                    Pets allowed
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={room.smoking} onChange={(e) => updateRoom(idx, { smoking: e.target.checked })} className="accent-gray-900" />
                    Smoking allowed
                  </label>
                </div>

                <label className="text-xs font-semibold text-gray-700 mb-2 block">Room amenities</label>
                <ChipGrid items={allAmenities} selected={room.amenities} toggle={(a) => updateRoomAmenity(idx, a)} cols={4} />

                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Room description (optional)</label>
                  <textarea
                    value={room.description}
                    onChange={(e) => updateRoom(idx, { description: e.target.value })}
                    placeholder="Describe this room..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 resize-none"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addRoom}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors cursor-pointer bg-transparent mb-6"
            >
              + Add another room
            </button>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-transparent">
                Back
              </button>
              <button onClick={() => setStep(3)} className="px-5 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Facilities */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Facilities & policies</h1>
            <p className="text-sm text-gray-500 mb-6">Set the rules and requirements for your property</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-1 block">Check-in time</label>
                <input
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  placeholder="12:00 PM"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-1 block">Check-out time</label>
                <input
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  placeholder="10:00 AM"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                />
              </div>
            </div>

            <label className="text-sm font-semibold text-gray-800 mb-3 block">Cancellation policy</label>
            <div className="space-y-3 mb-6">
              {cancellationPolicies.map((cp) => (
                <button
                  key={cp.key}
                  type="button"
                  onClick={() => setCancellation(cp.key)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    cancellation === cp.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-900">{cp.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{cp.desc}</p>
                </button>
              ))}
            </div>

            <label className="text-sm font-semibold text-gray-800 mb-3 block">House rules</label>
            <ChipGrid items={houseRulesList} selected={houseRules} toggle={toggleHouseRule} cols={2} />

            <div className="grid grid-cols-2 gap-4 my-6">
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-1 block">Minimum stay (nights)</label>
                <input
                  type="number"
                  min={1}
                  value={minStay}
                  onChange={(e) => setMinStay(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-1 block">Maximum stay (nights)</label>
                <input
                  type="number"
                  min={1}
                  value={maxStay}
                  onChange={(e) => setMaxStay(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                />
              </div>
            </div>

            <label className="text-sm font-semibold text-gray-800 mb-3 block">Languages spoken by staff</label>
            <div className="flex flex-wrap gap-2 mb-8">
              {allLanguages.map((lang) => {
                const on = languages.includes(lang)
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLang(lang)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      on ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {lang}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-5 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-transparent">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-40"
              >
                {submitting ? 'Submitting...' : 'Submit listing'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
