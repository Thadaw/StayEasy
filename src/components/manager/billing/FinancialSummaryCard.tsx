import { FINANCIAL_TILES } from './demoBilling'

export default function FinancialSummaryCard() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        padding: '20px 24px 24px',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Financial Summary</h3>
        <span
          style={{
            padding: '5px 10px',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            background: '#f9fafb',
            fontSize: 11,
            color: '#374151',
            whiteSpace: 'nowrap',
          }}
        >
          Apr 1 - Apr 30
        </span>
      </div>

      <div className="b-summary-grid" style={{ marginTop: 16 }}>
        {FINANCIAL_TILES.map((tile) => (
          <div
            key={tile.label}
            style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 14px', minWidth: 0 }}
          >
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>{tile.label}</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: tile.danger ? '#dc2626' : '#111827',
                marginBottom: tile.delta ? 4 : 0,
              }}
            >
              {tile.value}
            </div>
            {tile.delta && (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: tile.deltaPositive ? '#16a34a' : '#dc2626',
                }}
              >
                {tile.delta}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
