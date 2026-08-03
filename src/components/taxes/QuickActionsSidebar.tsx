import { Tag, Users, Download, Upload, Info } from 'lucide-react'

const actions = [
  {
    icon: Tag,
    label: 'Apply Tax to Items',
    subtitle: 'Manage item-wise tax',
    color: 'var(--primary)',
    bg: '#F5F3FF',
  },
  {
    icon: Users,
    label: 'Tax Groups',
    subtitle: 'Create tax groups',
    color: 'var(--primary)',
    bg: '#F5F3FF',
  },
  {
    icon: Download,
    label: 'Import Taxes',
    subtitle: 'Import from Excel',
    color: 'var(--primary)',
    bg: '#F5F3FF',
  },
  {
    icon: Upload,
    label: 'Export Policies',
    subtitle: 'Download all policies',
    color: 'var(--primary)',
    bg: '#F5F3FF',
  },
]

export default function QuickActionsSidebar() {
  return (
    <div>
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          padding: 24,
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Quick Actions</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {actions.map((action) => (
            <button
              key={action.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
                background: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C4B5FD'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(124, 58, 237, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: action.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <action.icon size={16} color={action.color} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{action.label}</div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.3 }}>{action.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div
        style={{
          background: '#F5F3FF',
          borderRadius: 12,
          border: '1px solid #EDE9FE',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#EDE9FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          <Info size={14} color="var(--primary)" />
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
          Changes to taxes or policies will be reflected in new orders only.
        </p>
      </div>
    </div>
  )
}
