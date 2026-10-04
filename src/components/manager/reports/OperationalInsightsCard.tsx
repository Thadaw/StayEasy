import { Download, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { INSIGHT_STATUS_PILL, OPERATIONAL_REPORTS } from './demoReports'

export default function OperationalInsightsCard() {
  const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
    whiteSpace: 'nowrap',
  }

  const cellStyle: React.CSSProperties = {
    padding: '13px 16px',
    fontSize: 13,
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  }

  return (
    <div className="r-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <h3 className="r-card-title">Operational Insights</h3>
        <p className="r-card-sub">Generated reports and analytics documents</p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={headerStyle}>Report Name</th>
              <th style={headerStyle}>Period</th>
              <th style={headerStyle}>Updated On</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {OPERATIONAL_REPORTS.map((row) => {
              const pill = INSIGHT_STATUS_PILL[row.status]
              return (
                <tr
                  key={row.id}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ ...cellStyle, whiteSpace: 'normal' }}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{row.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{row.description}</div>
                  </td>
                  <td style={cellStyle}>{row.period}</td>
                  <td style={{ ...cellStyle, color: '#6b7280' }}>{row.updatedOn}</td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        background: pill.background,
                        color: pill.color,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <button
                        title="Download"
                        onClick={() => toast.success(`${row.name} downloaded`)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: 'none',
                          background: 'transparent',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f3f4f6'
                          e.currentTarget.style.color = '#374151'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#9ca3af'
                        }}
                      >
                        <Download size={15} />
                      </button>
                      <button
                        title="Refresh"
                        onClick={() => toast.success(`${row.name} refresh queued`)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: 'none',
                          background: 'transparent',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f3f4f6'
                          e.currentTarget.style.color = '#374151'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#9ca3af'
                        }}
                      >
                        <RefreshCw size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
