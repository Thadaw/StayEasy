import { Plus, Pencil, Copy, Trash2 } from 'lucide-react'
import type { RoomRateSettings, RatePlan, SeasonalRate } from '../../types/settings'

interface RoomRateSettingsFormProps {
  data: RoomRateSettings
  onChange: (data: Partial<RoomRateSettings>) => void
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  border: '1px solid #E5E7EB',
  padding: 24,
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

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: '#111827',
  margin: '0 0 4px',
}

const sectionDescStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#6B7280',
  margin: '0 0 20',
  lineHeight: 1.4,
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

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  color: '#6B7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  borderBottom: '1px solid #E5E7EB',
}

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  fontSize: 14,
  color: '#374151',
  borderBottom: '1px solid #F3F4F6',
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 10px',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  background: '#ECFDF5',
  color: '#059669',
}

const iconBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 6,
  border: '1px solid #E5E7EB',
  background: '#fff',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#6B7280',
}

const defaultRatePlans: RatePlan[] = [
  { id: '1', name: 'Rack Rate', description: 'Best available rate with flexible cancellation', mealPlan: 'Room Only', cancellationPolicy: 'Free cancellation up to 24 hours', status: 'Active' },
  { id: '2', name: 'Bed & Breakfast', description: 'Includes breakfast for 2 guests', mealPlan: 'Breakfast', cancellationPolicy: 'Free cancellation up to 48 hours', status: 'Active' },
  { id: '3', name: 'Half Board', description: 'Includes breakfast and dinner', mealPlan: 'Breakfast + Dinner', cancellationPolicy: 'Free cancellation up to 24 hours', status: 'Active' },
  { id: '4', name: 'Non Refundable', description: 'Lower rate with no cancellation', mealPlan: 'Room Only', cancellationPolicy: 'Non refundable', status: 'Active' },
]

const defaultSeasonalRates: SeasonalRate[] = [
  { id: '1', seasonName: 'Peak Season', period: 'Jun 1 - Aug 31', rateAdjustment: '+20%', status: 'Active' },
  { id: '2', seasonName: 'Shoulder Season', period: 'Mar 1 - May 31', rateAdjustment: '+10%', status: 'Active' },
  { id: '3', seasonName: 'Low Season', period: 'Sep 1 - Nov 30', rateAdjustment: '-15%', status: 'Active' },
  { id: '4', seasonName: 'Off Season', period: 'Dec 1 - Feb 28', rateAdjustment: '-20%', status: 'Active' },
]

export default function RoomRateSettingsForm({ data, onChange }: RoomRateSettingsFormProps) {
  const ratePlans = data.ratePlans.length > 0 ? data.ratePlans : defaultRatePlans
  const seasonalRates = data.seasonalRates.length > 0 ? data.seasonalRates : defaultSeasonalRates

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Row 1: Room Settings + Rate Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Room Settings */}
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Room Settings</h3>
          <p style={sectionDescStyle}>Manage how rooms are created and displayed.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <SettingToggle
                label="Auto Room Number"
                description="Automatically assign room numbers when creating new rooms."
                enabled={data.autoRoomNumber}
                onChange={v => onChange({ autoRoomNumber: v })}
              />
              <SettingToggle
                label="Room Status (Active/Inactive)"
                description="Allow rooms to be marked as inactive instead of deleting."
                enabled={data.roomStatus}
                onChange={v => onChange({ roomStatus: v })}
              />
              <SettingToggle
                label="Display Room Floor"
                description="Show floor/level information for rooms."
                enabled={data.displayRoomFloor}
                onChange={v => onChange({ displayRoomFloor: v })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'flex-end' }}>
              <SettingSelect
                label="Default Room View"
                description="Choose default view for rooms list."
                value={data.defaultRoomView}
                onChange={v => onChange({ defaultRoomView: v })}
              >
                <option>Grid View</option>
                <option>List View</option>
              </SettingSelect>
              <SettingToggle
                label="Room Image Upload"
                description="Allow uploading images for rooms."
                enabled={data.roomImageUpload}
                onChange={v => onChange({ roomImageUpload: v })}
              />
              <SettingSelect
                label="Max Images Per Room"
                description="Maximum number of images allowed."
                value={data.maxImagesPerRoom}
                onChange={v => onChange({ maxImagesPerRoom: v })}
              >
                <option>3 Images</option>
                <option>5 Images</option>
                <option>10 Images</option>
              </SettingSelect>
            </div>
          </div>
        </div>

        {/* Rate Settings */}
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Rate Settings</h3>
          <p style={sectionDescStyle}>Manage how rates and pricing are handled.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <SettingSelect
                label="Base Rate Type"
                description="Choose the type of rate to use as default."
                value={data.baseRateType}
                onChange={v => onChange({ baseRateType: v })}
              >
                <option>Rack Rate</option>
                <option>Negotiated Rate</option>
                <option>Corporate Rate</option>
              </SettingSelect>
              <SettingSelect
                label="Rate Display"
                description="Prices shown to users will be."
                value={data.rateDisplay}
                onChange={v => onChange({ rateDisplay: v })}
              >
                <option>Inclusive of Tax</option>
                <option>Exclusive of Tax</option>
              </SettingSelect>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'flex-end' }}>
              <SettingToggle
                label="Allow Rate Override"
                description="Allow staff to override room rates while creating bookings."
                enabled={data.allowRateOverride}
                onChange={v => onChange({ allowRateOverride: v })}
              />
              <div>
                <label style={labelStyle}>Rate Rounding</label>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Round off rate to nearest value.</div>
                <input
                  type="number"
                  value={data.rateRounding}
                  onChange={e => onChange({ rateRounding: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Currency</label>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Default currency for rates.</div>
                <select
                  value={data.currency}
                  onChange={e => onChange({ currency: e.target.value })}
                  style={selectStyle}
                >
                  <option>NPR (Nepalese Rupee)</option>
                  <option>INR (Indian Rupee)</option>
                  <option>USD (US Dollar)</option>
                  <option>EUR (Euro)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Rate Plans Table */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <h3 style={sectionTitleStyle}>Rate Plans</h3>
            <p style={{ ...sectionDescStyle, marginBottom: 0 }}>Manage rate plans available for your property.</p>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              border: 'none',
              borderRadius: 8,
              background: 'var(--primary)',
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            Add Rate Plan
          </button>
        </div>

        <div style={{ marginTop: 16, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Rate Plan Name</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Meal Plan</th>
                <th style={thStyle}>Cancellation Policy</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ratePlans.map(plan => (
                <tr key={plan.id}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#111827' }}>{plan.name}</td>
                  <td style={tdStyle}>{plan.description}</td>
                  <td style={tdStyle}>{plan.mealPlan}</td>
                  <td style={tdStyle}>{plan.cancellationPolicy}</td>
                  <td style={tdStyle}><span style={badgeStyle}>{plan.status}</span></td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button style={iconBtnStyle}><Pencil size={14} /></button>
                      <button style={iconBtnStyle}><Copy size={14} /></button>
                      <button style={iconBtnStyle}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Availability & Inventory + Seasonal Rates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Availability & Inventory Settings */}
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Availability & Inventory Settings</h3>
          <p style={sectionDescStyle}>Set rules for room availability and inventory management.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'flex-end' }}>
              <SettingToggle
                label="Overbooking"
                description="Allow overbooking for high demand."
                enabled={data.overbooking}
                onChange={v => onChange({ overbooking: v })}
              />
              <SettingToggle
                label="Inventory Update"
                description="Update room inventory in real-time."
                enabled={data.inventoryUpdate}
                onChange={v => onChange({ inventoryUpdate: v })}
              />
              <div>
                <label style={labelStyle}>Release Unused Rooms</label>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Auto release rooms at end of day.</div>
                <input
                  type="time"
                  value={data.releaseUnusedRooms}
                  onChange={e => onChange({ releaseUnusedRooms: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'flex-end' }}>
              <div>
                <label style={labelStyle}>Minimum Sellable Rate</label>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Set a minimum rate for all rooms.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <input
                    type="number"
                    value={data.minimumSellableRate}
                    onChange={e => onChange({ minimumSellableRate: e.target.value })}
                    style={{ ...inputStyle, borderRadius: '8px 0 0 8px' }}
                  />
                  <span style={{ padding: '10px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderLeft: 'none', borderRadius: '0 8px 8px 0', fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>NPR</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Max Rooms Per Booking</label>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Maximum number of rooms in a single booking.</div>
                <select
                  value={data.maxRoomsPerBooking}
                  onChange={e => onChange({ maxRoomsPerBooking: e.target.value })}
                  style={selectStyle}
                >
                  <option>5 Rooms</option>
                  <option>10 Rooms</option>
                  <option>15 Rooms</option>
                  <option>20 Rooms</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Close Room for Check-in After</label>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>Stop check-in for rooms after selected time.</div>
                <input
                  type="time"
                  value={data.closeRoomForCheckinAfter}
                  onChange={e => onChange({ closeRoomForCheckinAfter: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rate Settings by Season */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <h3 style={sectionTitleStyle}>Rate Settings by Season</h3>
              <p style={{ ...sectionDescStyle, marginBottom: 0 }}>Set seasonal pricing to automatically update room rates.</p>
            </div>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                border: 'none',
                borderRadius: 8,
                background: 'var(--primary)',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <Plus size={14} />
              Add Season
            </button>
          </div>

          <div style={{ marginTop: 16, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Season Name</th>
                  <th style={thStyle}>Period</th>
                  <th style={thStyle}>Rate Adjustment</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {seasonalRates.map(rate => (
                  <tr key={rate.id}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#111827' }}>{rate.seasonName}</td>
                    <td style={tdStyle}>{rate.period}</td>
                    <td style={{ ...tdStyle, color: rate.rateAdjustment.startsWith('+') ? '#059669' : '#DC2626', fontWeight: 600 }}>{rate.rateAdjustment}</td>
                    <td style={tdStyle}><span style={badgeStyle}>{rate.status}</span></td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button style={iconBtnStyle}><Pencil size={14} /></button>
                        <button style={iconBtnStyle}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
