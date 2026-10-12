import { useState } from 'react'
import type { BookingFormData } from './NewBookingStep1'
import type { AvailableRoom } from '../../../types/pms'

export interface PriceBreakdown {
  nights: number
  rate: number
  subtotal: number
  taxes: number
  total: number
}

interface NewBookingStep2Props {
  formData: BookingFormData
  selectedRoom: AvailableRoom
  price: PriceBreakdown
  propertyName: string
  onBack: () => void
  onConfirm: () => void
  isSubmitting: boolean
}

const btnPrimary: React.CSSProperties = {
  padding: '10px 24px', borderRadius: 8, border: 'none',
  background: '#3b82f6', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
}
const btnSecondary: React.CSSProperties = {
  padding: '10px 24px', borderRadius: 8, border: '1px solid #d1d5db',
  background: '#fff', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer',
}
const sectionTitle: React.CSSProperties = {
  fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16,
}
const rowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14,
}
const labelColor: React.CSSProperties = { color: '#6b7280' }
const valueColor: React.CSSProperties = { color: '#111827', fontWeight: 500 }

function formatDateDisplay(iso: string): string {
  if (!iso) return '–'
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NewBookingStep2({
  formData, selectedRoom, price, propertyName, onBack, onConfirm, isSubmitting,
}: NewBookingStep2Props) {
  const [paymentType, setPaymentType] = useState('full')
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>Review & Payment</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
          Review the booking details below and confirm the reservation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
        {/* Left: Booking Summary */}
        <div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <h3 style={{ ...sectionTitle, marginBottom: 4 }}>{propertyName}</h3>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
              {formatDateDisplay(formData.checkIn)} → {formatDateDisplay(formData.checkOut)}
              {' '}· {price.nights} {price.nights === 1 ? 'night' : 'nights'}
            </div>

            {/* Guest Info */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
              <div style={rowStyle}>
                <span style={labelColor}>Guest</span>
                <span style={valueColor}>{formData.guestName}</span>
              </div>
              <div style={rowStyle}>
                <span style={labelColor}>Email</span>
                <span style={valueColor}>{formData.guestEmail}</span>
              </div>
              <div style={rowStyle}>
                <span style={labelColor}>Phone</span>
                <span style={valueColor}>{formData.guestPhone}</span>
              </div>
            </div>

            {/* Room Info */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
              <div style={rowStyle}>
                <span style={labelColor}>Room</span>
                <span style={valueColor}>{selectedRoom.room_name} — {selectedRoom.room_type}</span>
              </div>
              <div style={rowStyle}>
                <span style={labelColor}>Bed</span>
                <span style={valueColor}>{selectedRoom.bed_type}</span>
              </div>
              <div style={rowStyle}>
                <span style={labelColor}>Guests</span>
                <span style={valueColor}>{formData.adults} Adult{formData.adults !== 1 ? 's' : ''}{formData.children > 0 ? `, ${formData.children} Child${formData.children !== 1 ? 'ren' : ''}` : ''}</span>
              </div>
              <div style={rowStyle}>
                <span style={labelColor}>Rate Plan</span>
                <span style={valueColor}>Flexible</span>
              </div>
              <div style={rowStyle}>
                <span style={labelColor}>Booking Source</span>
                <span style={valueColor}>{formData.bookingSource}</span>
              </div>
            </div>

            {/* Special Requests */}
            {(formData.specialRequests || formData.internalNote) && (
              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
                {formData.specialRequests && (
                  <div style={rowStyle}>
                    <span style={labelColor}>Special Request</span>
                    <span style={{ ...valueColor, textAlign: 'right', maxWidth: '60%' }}>{formData.specialRequests}</span>
                  </div>
                )}
                {formData.internalNote && (
                  <div style={rowStyle}>
                    <span style={labelColor}>Internal Note</span>
                    <span style={{ ...valueColor, textAlign: 'right', maxWidth: '60%' }}>{formData.internalNote}</span>
                  </div>
                )}
              </div>
            )}

            {/* Price Breakdown */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 12, marginTop: 4 }}>
              <div style={rowStyle}>
                <span style={labelColor}>{price.nights} nights × NPR {price.rate.toLocaleString()}</span>
                <span style={valueColor}>NPR {price.subtotal.toLocaleString()}</span>
              </div>
              <div style={rowStyle}>
                <span style={labelColor}>Taxes & Fees (13%)</span>
                <span style={valueColor}>NPR {price.taxes.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 6,
                borderTop: '2px solid #111827',
              }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>NPR {price.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Booking Policies */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Booking Policies</h3>
            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong style={{ color: '#374151' }}>Cancellation:</strong> Free cancellation up to 24 hours before check-in.
                Late cancellations or no-shows will be charged the first night's stay.
              </p>
              <p style={{ margin: '0 0 8px' }}>
                <strong style={{ color: '#374151' }}>Check-in:</strong> From 2:00 PM. Early check-in subject to availability.
              </p>
              <p style={{ margin: '0' }}>
                <strong style={{ color: '#374151' }}>Check-out:</strong> By 12:00 PM (noon). Late check-out may incur additional charges.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Payment */}
        <div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <h3 style={sectionTitle}>Payment</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'full', label: 'Full Payment', desc: `Pay NPR ${price.total.toLocaleString()} now` },
                { id: 'deposit', label: 'Deposit', desc: `Pay 20% deposit (NPR ${Math.round(price.total * 0.2).toLocaleString()})` },
                { id: 'pay_at_property', label: 'Pay at Property', desc: 'Settle payment during check-in' },
              ].map((opt) => (
                <label key={opt.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12,
                  border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer',
                }}>
                  <input type="radio" name="payment" value={opt.id}
                    checked={paymentType === opt.id}
                    onChange={() => setPaymentType(opt.id)}
                    style={{ marginTop: 2, accentColor: '#3b82f6' }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{
                  width: '100%', height: 36, border: '1px solid #d1d5db', borderRadius: 8,
                  padding: '0 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
                }}>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>Khalti</option>
                <option>eSewa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button style={btnSecondary} onClick={onBack}>Back</button>
        <button
          style={{ ...btnPrimary, opacity: isSubmitting ? 0.6 : 1 }}
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  )
}
