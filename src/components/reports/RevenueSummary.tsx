import { ArrowRight } from 'lucide-react'
import type { RevenueSummaryItem } from '../../types/reports'

interface RevenueSummaryProps {
  items: RevenueSummaryItem[]
}

export default function RevenueSummary({ items }: RevenueSummaryProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        flex: '1 1 0',
      }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Revenue Summary</h3>
      </div>

      <div style={{ padding: '8px 20px' }}>
        {items.map((item, idx) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: idx < items.length - 1 ? '1px solid #F3F4F6' : 'none',
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: item.bold ? 700 : 400,
                color: item.bold ? '#111827' : '#374151',
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: item.bold ? 700 : 600,
                color: item.color || '#111827',
              }}
            >
              NPR {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          View financial report
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
