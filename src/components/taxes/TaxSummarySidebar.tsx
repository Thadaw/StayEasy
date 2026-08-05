import { Info } from 'lucide-react'

const taxData = [
  { name: 'VAT 13%', rate: '13.00%', color: 'var(--primary)' },
  { name: 'Service Charge 10%', rate: '10.00%', color: '#F59E0B' },
  { name: 'SC 5% (Takeaway)', rate: '5.00%', color: '#2563EB' },
  { name: 'Delivery Charge 0%', rate: '0.00%', color: '#10B981' },
  { name: 'Municipal Tax 2%', rate: '2.00%', color: '#EC4899' },
]

const totalTaxes = 5
const effectiveRate = 25.0
const orderAmount = 1000
const effectiveAmount = 250

function DonutChart() {
  const size = 180
  const strokeWidth = 28
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const segments = [
    { pct: 32.5, color: 'var(--primary)' },   // VAT 13% of 40% total
    { pct: 25, color: '#F59E0B' },     // SC 10%
    { pct: 12.5, color: '#2563EB' },   // SC 5%
    { pct: 0, color: '#10B981' },      // Delivery 0%
    { pct: 5, color: '#EC4899' },      // Municipal 2%
  ]

  // Normalize to make a visually appealing donut
  const total = segments.reduce((s, seg) => s + Math.max(seg.pct, 1), 0)
  let accumulated = 0

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto 16px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg, i) => {
          const segPct = Math.max(seg.pct, 1) / total
          const dashLength = circumference * segPct
          const dashOffset = circumference * (0.25 - accumulated)
          accumulated += segPct
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
            />
          )
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{totalTaxes}</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Total Taxes</div>
      </div>
    </div>
  )
}

export default function TaxSummarySidebar() {
  return (
    <div>
      {/* Tax Summary Card */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          padding: 24,
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Tax Summary</h3>

        <DonutChart />

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {taxData.map((tax) => (
            <div key={tax.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: tax.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: '#374151' }}>{tax.name}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{tax.rate}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#E5E7EB', margin: '16px 0' }} />

        {/* Effective Tax */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>Effective Tax on Sample Order</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{effectiveRate.toFixed(2)}%</span>
              <Info size={14} color="#9CA3AF" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>
              Order Amount (NPR {orderAmount.toLocaleString()}.00)
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
              NPR {effectiveAmount.toLocaleString()}.00
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
