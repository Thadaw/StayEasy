import { useState } from 'react'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import type { Integration } from './IntegrationCard'

interface IntegrationDetailsProps {
  integration: Integration
  onConnect: (id: string) => void
  onDisconnect: (id: string) => void
  onTestConnection: (id: string) => void
}

const syncFrequencies = ['Every 5 Minutes', 'Every 15 Minutes', 'Every 30 Minutes', 'Every Hour', 'Every 6 Hours', 'Daily']

export default function IntegrationDetails({ integration, onConnect, onDisconnect, onTestConnection }: IntegrationDetailsProps) {
  const [syncFrequency, setSyncFrequency] = useState(integration.syncFrequency || 'Every 5 Minutes')
  const [autoSync, setAutoSync] = useState(integration.autoSync ?? true)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  const handleTestConnection = () => {
    onTestConnection(integration.id)
    setTestResult('success')
    setTimeout(() => setTestResult(null), 3000)
  }

  const handleDisconnect = () => {
    onDisconnect(integration.id)
    setShowDisconnectConfirm(false)
  }

  if (integration.status === 'not_connected') {
    return (
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24, height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: integration.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            {integration.icon}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--brand-dark)' }}>{integration.name}</h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted-foreground)' }}>Not Connected</span>
        </div>

        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.6, marginBottom: 24 }}>
          {integration.description}. Connect this service to enhance your hotel management capabilities.
        </p>

        <button
          onClick={() => onConnect(integration.id)}
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--primary)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 24,
          }}
        >
          Connect Now
        </button>

        {integration.benefits && (
          <div>
            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: 'var(--brand-dark)' }}>Benefits:</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {integration.benefits.map((benefit, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 8 }}>
                  <CheckCircle size={14} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24, height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: integration.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
          {integration.icon}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--brand-dark)' }}>{integration.name}</h3>
        </div>
      </div>

      {/* Status */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>Status</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--status-success)' }} />
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--status-success)' }}>Connected</span>
        </div>
      </div>

      {/* Last Sync */}
      {integration.lastSync && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>Last Sync</label>
          <span style={{ fontSize: 14, color: 'var(--foreground)' }}>{integration.lastSync}</span>
        </div>
      )}

      {/* Sync Frequency */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>Sync Frequency</label>
        <div style={{ position: 'relative' }}>
          <select
            value={syncFrequency}
            onChange={(e) => setSyncFrequency(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: '#fff',
              fontSize: 14,
              color: 'var(--foreground)',
              appearance: 'none',
              cursor: 'pointer',
            }}
          >
            {syncFrequencies.map((freq) => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 12, color: 'var(--muted-foreground)' }}>▼</div>
        </div>
      </div>

      {/* Calendar ID / Merchant ID */}
      {(integration.calendarId || integration.merchantId) && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
            {integration.calendarId ? 'Calendar ID' : 'Merchant ID'}
          </label>
          <input
            type="text"
            value={integration.calendarId || integration.merchantId || ''}
            readOnly
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--muted)',
              fontSize: 14,
              color: 'var(--foreground)',
            }}
          />
        </div>
      )}

      {/* Auto Sync */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: 'var(--foreground)' }}>
          <input
            type="checkbox"
            checked={autoSync}
            onChange={(e) => setAutoSync(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
          />
          Auto Sync
        </label>
      </div>

      {/* Test Result Toast */}
      {testResult && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 8,
            background: testResult === 'success' ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)',
            color: testResult === 'success' ? 'var(--status-success)' : 'var(--destructive)',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          {testResult === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {testResult === 'success' ? 'Connection successful! Service is working correctly.' : 'Connection failed. Please check your settings.'}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button
          onClick={handleTestConnection}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: '#fff',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--foreground)',
            cursor: 'pointer',
          }}
        >
          Test Connection
        </button>
        <button
          onClick={() => setShowDisconnectConfirm(true)}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid var(--destructive)',
            background: '#fff',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--destructive)',
            cursor: 'pointer',
          }}
        >
          Disconnect
        </button>
      </div>

      {/* Disconnect Confirmation */}
      {showDisconnectConfirm && (
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            background: 'rgba(192,57,43,0.05)',
            border: '1px solid rgba(192,57,43,0.2)',
            marginBottom: 24,
          }}
        >
          <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: 'var(--destructive)' }}>
            Disconnect {integration.name}?
          </p>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--muted-foreground)' }}>
            This will stop all syncing and remove the integration configuration.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowDisconnectConfirm(false)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: '#fff',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDisconnect}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: 'var(--destructive)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Yes, Disconnect
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: 'var(--brand-dark)' }}>Recent Activity</h4>
        {integration.recentActivity && integration.recentActivity.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {integration.recentActivity.map((activity, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted-foreground)' }}>
                <CheckCircle size={14} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
                <span>{activity.action}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.6 }}>{activity.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--muted-foreground)', opacity: 0.6 }}>No recent activity</p>
        )}
      </div>
    </div>
  )
}
