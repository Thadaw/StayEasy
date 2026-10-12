import { RATING_DISTRIBUTION, TOTAL_REVIEWS } from './demoFeedback'

export default function CustomerSatisfactionCard() {
  return (
    <div className="f-card">
      <div className="f-card-head">
        <div>
          <h3 className="f-card-title">Customer Satisfaction</h3>
          <p className="f-card-sub">Overall guest rating breakdown</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', minWidth: 140 }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#111827' }}>4.8 / 5</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 6 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} style={{ color: '#f59e0b', fontSize: 18 }}>
                ★
              </span>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>Based on {TOTAL_REVIEWS} reviews</div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Rating Distribution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RATING_DISTRIBUTION.map((row) => (
              <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', width: 44 }}>{row.stars} ★</span>
                <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${row.percent}%`,
                      height: '100%',
                      background: row.stars >= 4 ? '#1f2937' : row.stars === 3 ? '#f97316' : '#ef4444',
                      borderRadius: 4,
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color: '#6b7280', width: 96, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {row.count} ({row.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
