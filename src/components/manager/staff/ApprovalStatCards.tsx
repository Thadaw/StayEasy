interface ApprovalStatCardsProps {
  leaveCount: number
  swapCount: number
}

const stats = (leaveCount: number, swapCount: number) => [
  { label: 'Pending Leave', value: String(leaveCount), sub: 'Awaiting manager', dot: '#ef4444' },
  { label: 'Shift Swaps', value: String(swapCount), sub: 'Pending confirmation', dot: '#f59e0b' },
  { label: 'Coverage Risks', value: '3', sub: 'May impact coverage', dot: '#f59e0b' },
]

export default function ApprovalStatCards({ leaveCount, swapCount }: ApprovalStatCardsProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}
    >
      {stats(leaveCount, swapCount).map((stat) => (
        <div
          key={stat.label}
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '16px 18px',
            position: 'relative',
            minWidth: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: stat.dot,
            }}
          />
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: '#6b7280',
              paddingRight: 14,
            }}
          >
            {stat.label}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginTop: 8, lineHeight: 1.1 }}>
            {stat.value}
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>{stat.sub}</div>
        </div>
      ))}
    </div>
  )
}
