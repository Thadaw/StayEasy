import { Settings } from 'lucide-react'

export interface Integration {
  id: string
  name: string
  description: string
  icon: string
  iconBg: string
  category: 'payment' | 'calendar' | 'email' | 'messaging' | 'maps' | 'storage'
  status: 'connected' | 'not_connected'
  lastSync?: string
  merchantId?: string
  calendarId?: string
  syncFrequency?: string
  autoSync?: boolean
  recentActivity?: { action: string; time: string }[]
  benefits?: string[]
}

interface IntegrationCardProps {
  integration: Integration
  isSelected: boolean
  onSelect: () => void
}

export default function IntegrationCard({ integration, isSelected, onSelect }: IntegrationCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: isSelected ? 'var(--accent)' : '#fff',
        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        marginBottom: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: integration.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            {integration.icon}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--brand-dark)' }}>{integration.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: integration.status === 'connected' ? 'var(--status-success)' : 'var(--muted-foreground)',
              background: integration.status === 'connected' ? 'rgba(39,174,96,0.1)' : 'var(--muted)',
              padding: '4px 10px',
              borderRadius: 6,
            }}
          >
            {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
          </span>
          {integration.status === 'connected' ? (
            <Settings size={16} style={{ color: 'var(--muted-foreground)' }} />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#fff',
                background: 'var(--primary)',
                border: 'none',
                borderRadius: 6,
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              Connect
            </button>
          )}
        </div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginLeft: 48 }}>
        {integration.description}
      </div>
      {integration.lastSync && (
        <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4, marginLeft: 48, opacity: 0.7 }}>
          Last Sync: {integration.lastSync}
        </div>
      )}
      {integration.merchantId && (
        <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2, marginLeft: 48, opacity: 0.7 }}>
          Merchant ID: {integration.merchantId}
        </div>
      )}
    </div>
  )
}
