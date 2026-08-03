import { CalendarCheck, Clock, Shield, CreditCard } from 'lucide-react'
import type { BookingSettings } from '../../types/settings'

interface BookingSettingsFormProps {
  data: BookingSettings
  onChange: (data: Partial<BookingSettings>) => void
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  border: '1px solid #E5E7EB',
  padding: 24,
  marginBottom: 24,
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  fontSize: 14,
  color: '#111827',
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box' as const,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%236B7280\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  fontSize: 14,
  color: '#111827',
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box' as const,
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: '#374151',
  marginBottom: 6,
  display: 'block',
}

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 8,
}

const sectionDescStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#6B7280',
  marginBottom: 20,
}

const iconCircleStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  background: '#F5F3FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

interface ToggleProps {
  enabled: boolean
  onChange: (value: boolean) => void
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        background: enabled ? '#1A3C5E' : '#D1D5DB',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: 3,
          left: enabled ? 23 : 3,
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      />
    </button>
  )
}

function SettingToggle({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description: string
  enabled: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.4 }}>{description}</div>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  )
}

function SettingSelect({
  label,
  description,
  value,
  onChange,
  children,
}: {
  label: string
  description: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8, lineHeight: 1.4 }}>{description}</div>
      <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
        {children}
      </select>
    </div>
  )
}

export default function BookingSettingsForm({ data, onChange }: BookingSettingsFormProps) {
  return (
    <div>
      {/* Booking Preferences */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconCircleStyle}>
            <CalendarCheck size={16} color="#1A3C5E" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Booking Preferences</h3>
        </div>
        <p style={sectionDescStyle}>Basic preferences that control how bookings are created and managed.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, rowGap: 24 }}>
          <SettingToggle
            label="Enable Online Booking"
            description="Allow guests to book from your website or booking engine."
            enabled={data.enableOnlineBooking}
            onChange={v => onChange({ enableOnlineBooking: v })}
          />
          <SettingToggle
            label="Auto Confirm Booking"
            description="Automatically confirm bookings received through online channels."
            enabled={data.autoConfirmBooking}
            onChange={v => onChange({ autoConfirmBooking: v })}
          />
          <SettingSelect
            label="Booking Confirmation"
            description="Choose how to confirm new bookings."
            value={data.bookingConfirmation}
            onChange={v => onChange({ bookingConfirmation: v })}
          >
            <option>Email</option>
            <option>SMS</option>
            <option>Manual</option>
          </SettingSelect>

          <SettingSelect
            label="Default Booking Status"
            description="Select default status for newly created bookings."
            value={data.defaultBookingStatus}
            onChange={v => onChange({ defaultBookingStatus: v })}
          >
            <option>Confirmed</option>
            <option>Pending</option>
            <option>On Hold</option>
          </SettingSelect>
          <SettingSelect
            label="Hold Booking (Minutes)"
            description="Hold inventory for a booking before payment."
            value={data.holdBookingMinutes}
            onChange={v => onChange({ holdBookingMinutes: v })}
          >
            <option>5 Minutes</option>
            <option>10 Minutes</option>
            <option>15 Minutes</option>
            <option>30 Minutes</option>
            <option>60 Minutes</option>
          </SettingSelect>
          <SettingToggle
            label="Allow Walk-in Booking"
            description="Allow creating bookings for walk-in guests."
            enabled={data.allowWalkinBooking}
            onChange={v => onChange({ allowWalkinBooking: v })}
          />
        </div>
      </div>

      {/* Stay Restrictions */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconCircleStyle}>
            <CalendarCheck size={16} color="#1A3C5E" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Stay Restrictions</h3>
        </div>
        <p style={sectionDescStyle}>Set minimum and maximum stay requirements.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <div>
            <label style={labelStyle}>Minimum Stay (Nights)</label>
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Minimum number of nights required for a booking.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <input
                type="number"
                value={data.minimumStayNights}
                onChange={e => onChange({ minimumStayNights: e.target.value })}
                style={{ ...inputStyle, borderRadius: '8px 0 0 8px' }}
              />
              <span style={{ padding: '10px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderLeft: 'none', borderRadius: '0 8px 8px 0', fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>Night(s)</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Maximum Stay (Nights)</label>
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Maximum number of nights allowed in a single booking.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <input
                type="number"
                value={data.maximumStayNights}
                onChange={e => onChange({ maximumStayNights: e.target.value })}
                style={{ ...inputStyle, borderRadius: '8px 0 0 8px' }}
              />
              <span style={{ padding: '10px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderLeft: 'none', borderRadius: '0 8px 8px 0', fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>Nights</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Apply Maximum Stay To</label>
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Select to which bookings maximum stay applies.</div>
            <select
              value={data.applyMaximumStayTo}
              onChange={e => onChange({ applyMaximumStayTo: e.target.value })}
              style={selectStyle}
            >
              <option>All Bookings</option>
              <option>Online Bookings</option>
              <option>Direct Bookings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Check-in / Check-out */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconCircleStyle}>
            <Clock size={16} color="#1A3C5E" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Check-in / Check-out</h3>
        </div>
        <p style={sectionDescStyle}>Configure default check-in and check-out times.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <div>
            <label style={labelStyle}>Check-in Time</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <Clock size={16} color="#9CA3AF" />
              <input
                type="time"
                value={data.checkinTime}
                onChange={e => onChange({ checkinTime: e.target.value })}
                style={{ ...inputStyle, border: 'none', padding: 0, color: '#111827', fontWeight: 500 }}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Check-out Time</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <Clock size={16} color="#9CA3AF" />
              <input
                type="time"
                value={data.checkoutTime}
                onChange={e => onChange({ checkoutTime: e.target.value })}
                style={{ ...inputStyle, border: 'none', padding: 0, color: '#111827', fontWeight: 500 }}
              />
            </div>
          </div>
          <SettingSelect
            label="Early Check-in"
            description="Allow early check-in for guests."
            value={data.earlyCheckin}
            onChange={v => onChange({ earlyCheckin: v })}
          >
            <option>On Request</option>
            <option>Allowed</option>
            <option>Not Allowed</option>
            <option>Up to 2 Hours</option>
            <option>Up to 4 Hours</option>
          </SettingSelect>
          <SettingSelect
            label="Late Check-out"
            description="Allow late check-out for guests."
            value={data.lateCheckout}
            onChange={v => onChange({ lateCheckout: v })}
          >
            <option>On Request</option>
            <option>Allowed</option>
            <option>Not Allowed</option>
            <option>Up to 2 Hours</option>
            <option>Up to 4 Hours</option>
          </SettingSelect>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconCircleStyle}>
            <Shield size={16} color="#1A3C5E" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Cancellation Policy</h3>
        </div>
        <p style={sectionDescStyle}>Set the default cancellation policy for bookings.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SettingToggle
              label="Cancellation Allowed"
              description="Allow guests to cancel their booking."
              enabled={data.cancellationAllowed}
              onChange={v => onChange({ cancellationAllowed: v })}
            />
            <div>
              <label style={labelStyle}>Cancellation Deadline</label>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Deadline before check-in to allow cancellation.</div>
              <select
                value={data.cancellationDeadline}
                onChange={e => onChange({ cancellationDeadline: e.target.value })}
                style={selectStyle}
              >
                <option>24 Hours Before Check-in</option>
                <option>48 Hours Before Check-in</option>
                <option>72 Hours Before Check-in</option>
                <option>7 Days Before Check-in</option>
                <option>14 Days Before Check-in</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Cancellation Charge</label>
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Charges applied if cancellation is made after deadline.</div>
            <select
              value={data.cancellationCharge}
              onChange={e => onChange({ cancellationCharge: e.target.value })}
              style={selectStyle}
            >
              <option>No Charge</option>
              <option>1 Night</option>
              <option>50% of Total Amount</option>
              <option>100% of Total Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advance & Payment */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconCircleStyle}>
            <CreditCard size={16} color="#1A3C5E" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Advance & Payment</h3>
        </div>
        <p style={sectionDescStyle}>Manage advance payment and payment requirements.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
          <SettingToggle
            label="Require Advance Payment"
            description="Collect advance payment while booking."
            enabled={data.requireAdvancePayment}
            onChange={v => onChange({ requireAdvancePayment: v })}
          />
          <SettingSelect
            label="Advance Payment Type"
            description="Type of advance payment required."
            value={data.advancePaymentType}
            onChange={v => onChange({ advancePaymentType: v })}
          >
            <option>Percentage</option>
            <option>Fixed Amount</option>
            <option>1 Night</option>
          </SettingSelect>
          <div>
            <label style={labelStyle}>Advance Percentage</label>
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Percentage of total amount to be collected.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <input
                type="number"
                value={data.advancePercentage}
                onChange={e => onChange({ advancePercentage: e.target.value })}
                style={{ ...inputStyle, borderRadius: '8px 0 0 8px' }}
              />
              <span style={{ padding: '10px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderLeft: 'none', borderRadius: '0 8px 8px 0', fontSize: 13, color: '#6B7280' }}>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
