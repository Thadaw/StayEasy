import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useManagerPropertyStore } from '../../../stores/managerPropertyStore'
import { getAvailableRooms, getAllProperties } from '../../../services/pmsApi'
import { roomKeys, propertyKeys } from '../../../lib/queryKeys'
import type { AvailableRoom } from '../../../types/pms'

export interface BookingFormData {
  guestName: string
  guestEmail: string
  guestPhone: string
  idPassport: string
  nationality: string
  guestType: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  bookingSource: string
  arrivalTime: string
  promoCode: string
  roomType: string
  selectedRoomId: string
  specialRequests: string
  internalNote: string
}

export const initialFormData: BookingFormData = {
  guestName: '', guestEmail: '', guestPhone: '', idPassport: '',
  nationality: 'Nepal', guestType: 'Regular Guest',
  checkIn: '', checkOut: '', adults: 1, children: 0,
  bookingSource: 'Direct (Portal)', arrivalTime: '',
  promoCode: '', roomType: '', selectedRoomId: '',
  specialRequests: '', internalNote: '',
}

interface NewBookingStep1Props {
  data: BookingFormData
  onChange: (data: Partial<BookingFormData>) => void
  onContinue: () => void
  onCancel: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: 36, border: '1px solid #d1d5db', borderRadius: 8,
  padding: '0 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4,
}
const sectionTitle: React.CSSProperties = {
  fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 4,
}
const sectionSub: React.CSSProperties = {
  fontSize: 12, color: '#6b7280', marginBottom: 16,
}
const btnPrimary: React.CSSProperties = {
  padding: '10px 24px', borderRadius: 8, border: 'none',
  background: '#3b82f6', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
}
const btnSecondary: React.CSSProperties = {
  padding: '10px 24px', borderRadius: 8, border: '1px solid #d1d5db',
  background: '#fff', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer',
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export default function NewBookingStep1({ data, onChange, onContinue, onCancel }: NewBookingStep1Props) {
  const assignedPropertyId = useManagerPropertyStore((s) => s.assignedPropertyId)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showRatePanel, setShowRatePanel] = useState(false)

  const { data: properties = [] } = useQuery({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })
  const property = properties.find((p) => p.id === assignedPropertyId) ?? properties[0]
  const effectivePropertyId = property?.id ?? ''

  const hasDates = !!data.checkIn && !!data.checkOut && data.checkOut > data.checkIn

  const { data: availableRooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: roomKeys.available(effectivePropertyId, data.checkIn, data.checkOut, data.adults, data.children, 1),
    queryFn: () => getAvailableRooms(effectivePropertyId, data.checkIn, data.checkOut),
    enabled: !!effectivePropertyId && hasDates,
  })

  const roomTypes = useMemo(() => {
    const types = new Map<string, AvailableRoom[]>()
    for (const r of availableRooms) {
      if (!types.has(r.room_type)) types.set(r.room_type, [])
      types.get(r.room_type)!.push(r)
    }
    return types
  }, [availableRooms])

  const filteredRooms = useMemo(() => {
    if (!data.roomType) return availableRooms
    return availableRooms.filter((r) => r.room_type === data.roomType)
  }, [availableRooms, data.roomType])

  const selectedRoom = useMemo(() => {
    return availableRooms.find((r) => r.id === data.selectedRoomId) || null
  }, [availableRooms, data.selectedRoomId])

  const priceBreakdown = useMemo(() => {
    if (!hasDates || !selectedRoom) return null
    const nights = Math.max(1, Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / 86400000))
    const rate = parseFloat(selectedRoom.base_rate) || 0
    const subtotal = nights * rate
    const taxes = Math.round(subtotal * 0.13)
    const total = subtotal + taxes
    return { nights, rate, subtotal, taxes, total }
  }, [data.checkIn, data.checkOut, selectedRoom, hasDates])

  useEffect(() => {
    if (hasDates && availableRooms.length > 0) setShowRatePanel(true)
    else setShowRatePanel(false)
  }, [hasDates, availableRooms])

  useEffect(() => {
    if (data.selectedRoomId) {
      const room = availableRooms.find((r) => r.id === data.selectedRoomId)
      if (!room) onChange({ selectedRoomId: '' })
    }
  }, [data.roomType, availableRooms, data.selectedRoomId, onChange])

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!data.guestName.trim()) e.guestName = 'Required'
    if (!data.guestEmail.trim()) e.guestEmail = 'Required'
    if (!data.guestPhone.trim()) e.guestPhone = 'Required'
    if (!data.checkIn) e.checkIn = 'Required'
    if (!data.checkOut) e.checkOut = 'Required'
    if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn) e.checkOut = 'Must be after check-in'
    if (data.adults < 1) e.adults = 'At least 1'
    if (!data.roomType) e.roomType = 'Select a room type'
    if (!data.selectedRoomId) e.selectedRoomId = 'Select a room'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => { if (validate()) onContinue() }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>Create New Booking</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
          Enter the guest information and stay details to create a new reservation.
        </p>
      </div>

      {/* Guest Information */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <h3 style={{ ...sectionTitle, marginBottom: 2 }}>Guest Information</h3>
        <p style={{ ...sectionSub }}>Enter the guest's personal and contact details.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Guest *</label>
            <input style={{ ...inputStyle, borderColor: errors.guestName ? '#ef4444' : '#d1d5db' }}
              placeholder="Enter full name" value={data.guestName}
              onChange={(e) => onChange({ guestName: e.target.value })} />
            {errors.guestName && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.guestName}</span>}
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input style={{ ...inputStyle, borderColor: errors.guestEmail ? '#ef4444' : '#d1d5db' }}
              placeholder="guest@email.com" value={data.guestEmail}
              onChange={(e) => onChange({ guestEmail: e.target.value })} />
            {errors.guestEmail && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.guestEmail}</span>}
          </div>
          <div>
            <label style={labelStyle}>Phone *</label>
            <input style={{ ...inputStyle, borderColor: errors.guestPhone ? '#ef4444' : '#d1d5db' }}
              placeholder="+977 9800000000" value={data.guestPhone}
              onChange={(e) => onChange({ guestPhone: e.target.value })} />
            {errors.guestPhone && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.guestPhone}</span>}
          </div>
          <div>
            <label style={labelStyle}>ID / Passport</label>
            <input style={inputStyle} placeholder="Enter ID or passport number"
              value={data.idPassport} onChange={(e) => onChange({ idPassport: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Nationality</label>
            <select style={inputStyle} value={data.nationality}
              onChange={(e) => onChange({ nationality: e.target.value })}>
              <option>Nepal</option><option>India</option><option>United States</option>
              <option>United Kingdom</option><option>Australia</option><option>Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Guest Type</label>
            <select style={inputStyle} value={data.guestType}
              onChange={(e) => onChange({ guestType: e.target.value })}>
              <option>Regular Guest</option><option>VIP</option><option>Corporate</option>
              <option>Walk-in</option><option>Travel Agent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stay Details */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <h3 style={{ ...sectionTitle, marginBottom: 2 }}>Stay Details</h3>
        <p style={{ ...sectionSub }}>Set the check-in/check-out dates and booking details.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Check-in *</label>
            <input style={{ ...inputStyle, borderColor: errors.checkIn ? '#ef4444' : '#d1d5db' }}
              type="date" min={todayStr()} value={data.checkIn}
              onChange={(e) => onChange({ checkIn: e.target.value })} />
            {errors.checkIn && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.checkIn}</span>}
          </div>
          <div>
            <label style={labelStyle}>Check-out *</label>
            <input style={{ ...inputStyle, borderColor: errors.checkOut ? '#ef4444' : '#d1d5db' }}
              type="date" min={data.checkIn || todayStr()} value={data.checkOut}
              onChange={(e) => onChange({ checkOut: e.target.value })} />
            {errors.checkOut && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.checkOut}</span>}
          </div>
          <div>
            <label style={labelStyle}>Adults *</label>
            <input style={{ ...inputStyle, borderColor: errors.adults ? '#ef4444' : '#d1d5db' }}
              type="number" min={1} max={30} value={data.adults}
              onChange={(e) => onChange({ adults: parseInt(e.target.value) || 1 })} />
            {errors.adults && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.adults}</span>}
          </div>
          <div>
            <label style={labelStyle}>Children</label>
            <input style={inputStyle} type="number" min={0} max={15} value={data.children}
              onChange={(e) => onChange({ children: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <label style={labelStyle}>Booking Source</label>
            <select style={inputStyle} value={data.bookingSource}
              onChange={(e) => onChange({ bookingSource: e.target.value })}>
              <option>Direct (Portal)</option><option>OTA</option><option>Phone</option><option>Walk-in</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Arrival Time</label>
            <select style={inputStyle} value={data.arrivalTime}
              onChange={(e) => onChange({ arrivalTime: e.target.value })}>
              <option value="">Select time</option>
              <option>Morning (6 AM - 12 PM)</option><option>Afternoon (12 PM - 6 PM)</option>
              <option>Evening (6 PM - 12 AM)</option><option>Late Night (12 AM - 6 AM)</option>
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Promo / Corporate Code</label>
            <input style={inputStyle} placeholder="Enter promo or corporate code" value={data.promoCode}
              onChange={(e) => onChange({ promoCode: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Room & Rate */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <h3 style={{ ...sectionTitle, marginBottom: 2 }}>Room & Rate</h3>
        <p style={{ ...sectionSub }}>Select the room type and view available rooms based on dates selected.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Room Type *</label>
            <select style={{ ...inputStyle, borderColor: errors.roomType ? '#ef4444' : '#d1d5db' }}
              value={data.roomType} onChange={(e) => onChange({ roomType: e.target.value, selectedRoomId: '' })}>
              <option value="">
                {roomsLoading ? 'Loading...' : hasDates ? 'Select room type' : 'Select dates first'}
              </option>
              {Array.from(roomTypes.keys()).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.roomType && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.roomType}</span>}
          </div>
          <div>
            <label style={labelStyle}>Available Room *</label>
            <select style={{ ...inputStyle, borderColor: errors.selectedRoomId ? '#ef4444' : '#d1d5db' }}
              value={data.selectedRoomId}
              onChange={(e) => onChange({ selectedRoomId: e.target.value })}
              disabled={!data.roomType}>
              <option value="">
                {!data.roomType ? 'Select room type first' : filteredRooms.length === 0 ? 'No rooms available' : 'Select room'}
              </option>
              {filteredRooms.map((r) => (
                <option key={r.id} value={r.id}>{r.room_name} — {r.bed_type}</option>
              ))}
            </select>
            {errors.selectedRoomId && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.selectedRoomId}</span>}
          </div>
        </div>

        {showRatePanel && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#f9fafb', borderRadius: 8, padding: 16,
            border: '1px solid #e5e7eb',
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                {selectedRoom?.room_name || 'Select a room'}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                {selectedRoom?.bed_type ? `${selectedRoom.bed_type} · ` : ''}
                Max {selectedRoom?.max_adults || 0} adults
                {selectedRoom && selectedRoom.max_children > 0 ? `, ${selectedRoom.max_children} children` : ''}
              </div>
            </div>
            {priceBreakdown && (
              <div style={{ display: 'flex', gap: 32 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Rate Plan</div>
                  <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>Flexible</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Nightly Rate</div>
                  <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
                    NPR {priceBreakdown.rate.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Taxes & Fees (13%)</div>
                  <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
                    NPR {priceBreakdown.taxes.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Estimated Total</div>
                  <div style={{ fontSize: 16, color: '#111827', fontWeight: 700 }}>
                    NPR {priceBreakdown.total.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preferences & Requests */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ ...sectionTitle, marginBottom: 2 }}>Preferences & Requests</h3>
        <p style={{ ...sectionSub }}>Add any special requests or internal notes for this booking.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Special Requests</label>
            <textarea style={{ ...inputStyle, height: 80, padding: '8px 12px', resize: 'vertical' }}
              placeholder="e.g. Late check-in, extra pillows, airport transfer..."
              value={data.specialRequests} onChange={(e) => onChange({ specialRequests: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Internal Note</label>
            <textarea style={{ ...inputStyle, height: 80, padding: '8px 12px', resize: 'vertical' }}
              placeholder="Visible to staff only"
              value={data.internalNote} onChange={(e) => onChange({ internalNote: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
        <button style={btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={btnPrimary} onClick={handleContinue}>Continue to Review</button>
      </div>
    </div>
  )
}
