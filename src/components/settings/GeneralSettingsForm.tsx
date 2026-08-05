import { useState } from 'react'
import { Monitor, Settings, AlertTriangle, X, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { GeneralSettings } from '../../types/settings'
import { deleteProperty } from '../../services/pmsApi'

interface GeneralSettingsFormProps {
  data: GeneralSettings
  onChange: (data: Partial<GeneralSettings>) => void
  propertyId?: string
  propertyName?: string
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

export default function GeneralSettingsForm({ data, onChange, propertyId, propertyName }: GeneralSettingsFormProps) {
  const navigate = useNavigate()
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!propertyId) return
    setDeleting(true)
    try {
      await deleteProperty(propertyId)
      setShowConfirmDelete(false)
      navigate('/host/my-properties')
    } catch (error) {
      let message = 'Failed to delete property.'
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const data = error.response?.data as { detail?: string; error?: string } | undefined
        const serverMsg = data?.detail || data?.error || error.message
        message = `Failed to delete property (${status ?? 'network error'}): ${serverMsg}`
        console.error('Delete property failed:', { status, data: error.response?.data, message: error.message })
      } else {
        console.error('Delete property failed:', error)
      }
      alert(message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconCircleStyle}>
            <Monitor size={16} color="#1A3C5E" />
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
            <Settings size={16} color="#1A3C5E" />
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

      <div style={{ ...cardStyle, border: '1px solid #FECACA', background: '#FEF2F2' }}>
        <div style={sectionHeaderStyle}>
          <div style={{ ...iconCircleStyle, background: '#FEE2E2' }}>
            <AlertTriangle size={16} color="#DC2626" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#991B1B', margin: 0 }}>
            Delete Property
          </h3>
        </div>
        <p style={{ fontSize: 14, color: '#991B1B', margin: '0 0 16px 0', lineHeight: 1.5 }}>
          Permanently delete {propertyName ? <strong>{propertyName}</strong> : 'this property'} and all associated data including rooms, bookings, and settings. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowConfirmDelete(true)}
          disabled={!propertyId}
          style={{
            padding: '10px 20px',
            border: '1px solid #DC2626',
            borderRadius: 8,
            background: '#DC2626',
            fontSize: 14,
            fontWeight: 600,
            color: '#fff',
            cursor: propertyId ? 'pointer' : 'not-allowed',
            opacity: propertyId ? 1 : 0.5,
          }}
        >
          Delete This Property
        </button>
      </div>

      {showConfirmDelete && (
        <div
          onClick={() => setShowConfirmDelete(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 32,
              width: 440,
              boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowConfirmDelete(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                border: 'none',
                background: 'transparent',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9CA3AF',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <AlertTriangle size={28} color="#DC2626" />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                Delete Property
              </h3>

              <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                Are you sure you want to delete <strong style={{ color: '#DC2626' }}>{propertyName || 'this property'}</strong>? This will permanently delete all rooms, bookings, offers, and settings. This action cannot be undone.
              </p>

              <div style={{ display: 'flex', gap: 12, marginTop: 28, width: '100%' }}>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    background: '#fff',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#DC2626',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#fff',
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.6 : 1,
                    boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {deleting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                  {deleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
