export default function PolicyDetailsSidebar() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 24,
        marginBottom: 16,
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Policy Details</h3>

      <div style={{ textAlign: 'center', padding: '20px 16px' }}>
        {/* Shield / document icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#F5F3FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 36,
          }}
        >
          🛡️
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
          Select a policy to view full details, conditions, and related settings.
        </p>
      </div>
    </div>
  )
}
