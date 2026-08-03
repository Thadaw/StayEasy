import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'

interface PropertyCardProps {
  id: string
  name: string
  location: string
  image: string
  type: string
  units: string
  status: 'Active' | 'Maintenance' | 'Inactive'
  is_active?: boolean
  nextInspection?: string
  teamCount?: number
  onToggleActivation?: (id: string) => void
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#dcfce7', text: '#16a34a' },
  Maintenance: { bg: '#fef3c7', text: '#d97706' },
  Inactive: { bg: '#fee2e2', text: '#dc2626' },
}

export default function PropertyCard({ id, name, location, image, type, units, status, is_active = true, nextInspection, teamCount = 2, onToggleActivation }: PropertyCardProps) {
  const navigate = useNavigate()
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
      overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onClick={() => navigate(`/host/my-properties/dashboard/${id}`)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{
          position: 'absolute', top: 12, right: 12,
          padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
          background: statusColors[status]?.bg, color: statusColors[status]?.text,
        }}>
          {status}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>{name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 12 }}>
          <MapPin size={13} /> {location}
        </div>

        <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>TYPE</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{type}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>UNITS</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{units}</div>
          </div>
        </div>

        {nextInspection && (
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 12 }}>
            Next Inspection: {nextInspection}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div style={{ display: 'flex' }}>
            {Array.from({ length: Math.min(teamCount, 3) }).map((_, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: '50%', background: i === 0 ? 'var(--primary)' : i === 1 ? '#6366f1' : '#f59e0b',
                border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600, color: '#fff',
              }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleActivation?.(id) }}
              className={`toggle-switch ${is_active ? 'active' : ''}`}
              title={is_active ? 'Deactivate property' : 'Activate property'}
            >
              <div className="toggle-knob" />
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>Details →</span>
          </div>
        </div>
      </div>
    </div>
  )
}
