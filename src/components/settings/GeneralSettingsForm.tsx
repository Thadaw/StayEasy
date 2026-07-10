import { Monitor, Settings } from 'lucide-react'
import type { GeneralSettings } from '../../types/settings'
import SystemInfoBar from './SystemInfoBar'

interface GeneralSettingsFormProps {
  data: GeneralSettings
  onChange: (data: Partial<GeneralSettings>) => void
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
        background: enabled ? '#6C3AED' : '#D1D5DB',
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

const systemData = {
  systemVersion: '',
  lastBackup: '',
  nextBackup: '',
  databaseSize: '',
  totalUsers: 0,
  totalProperties: 0,
}

export default function GeneralSettingsForm({ data, onChange }: GeneralSettingsFormProps) {
  return (
    <div>
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconCircleStyle}>
            <Monitor size={16} color="#6C3AED" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>
            System Preferences
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Property Time Zone</label>
            <select
              value={data.timeZone}
              onChange={e => onChange({ timeZone: e.target.value })}
              style={selectStyle}
            >
              <option>(GMT+05:45) Kathmandu</option>
              <option>(GMT+05:30) Mumbai</option>
              <option>(GMT+00:00) London</option>
              <option>(GMT-08:00) Los Angeles</option>
              <option>(GMT+01:00) Paris</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date Format</label>
            <select
              value={data.dateFormat}
              onChange={e => onChange({ dateFormat: e.target.value })}
              style={selectStyle}
            >
              <option>Jun 1, 2026</option>
              <option>01/06/2026</option>
              <option>2026-06-01</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Time Format</label>
            <select
              value={data.timeFormat}
              onChange={e => onChange({ timeFormat: e.target.value })}
              style={selectStyle}
            >
              <option>12 Hours (hh:mm AM/PM)</option>
              <option>24 Hours (HH:mm)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Currency</label>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Default Language</label>
            <select
              value={data.language}
              onChange={e => onChange({ language: e.target.value })}
              style={selectStyle}
            >
              <option>English</option>
              <option>Nepali</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconCircleStyle}>
            <Settings size={16} color="#6C3AED" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>
            Other Preferences
          </h3>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Enable Maintenance Mode</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Put system in maintenance mode</div>
            </div>
            <Toggle
              enabled={data.maintenanceMode}
              onChange={v => onChange({ maintenanceMode: v })}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Allow Multiple Login</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Allow users to login from multiple devices</div>
            </div>
            <Toggle
              enabled={data.allowMultipleLogin}
              onChange={v => onChange({ allowMultipleLogin: v })}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Show Tips & Suggestions</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Display helpful tips in the system</div>
            </div>
            <Toggle
              enabled={data.showTips}
              onChange={v => onChange({ showTips: v })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Auto Logout</label>
            <select
              value={data.autoLogout}
              onChange={e => onChange({ autoLogout: e.target.value })}
              style={selectStyle}
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">1 Hour</option>
              <option value="120">2 Hours</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Default Dashboard</label>
            <select
              value={data.defaultDashboard}
              onChange={e => onChange({ defaultDashboard: e.target.value })}
              style={selectStyle}
            >
              <option>Dashboard v1</option>
              <option>Dashboard v2</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Items Per Page</label>
            <select
              value={data.itemsPerPage}
              onChange={e => onChange({ itemsPerPage: e.target.value })}
              style={selectStyle}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      <SystemInfoBar data={systemData} />
    </div>
  )
}
