import { useEffect, useMemo, useState } from 'react'
import TableFooter from './TableFooter'
import { DEMO_PAYMENTS, PAYMENT_STATUS_PILL, getInitials, formatNpr } from './demoBilling'

const ITEMS_PER_PAGE = 6

export default function PaymentRecordsView() {
  const [currentPage, setCurrentPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(DEMO_PAYMENTS.length / ITEMS_PER_PAGE))
  const page = Math.min(currentPage, pageCount)

  useEffect(() => {
    setCurrentPage(1)
  }, [])

  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const pageRows = useMemo(
    () => DEMO_PAYMENTS.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [startIndex],
  )

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
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      <div style={{ padding: '20px 24px 16px' }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Payment Records</h3>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
          Track every guest payment across all payment methods
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={headerStyle}>Payment ID</th>
              <th style={headerStyle}>Invoice</th>
              <th style={headerStyle}>Booking</th>
              <th style={headerStyle}>Guest</th>
              <th style={headerStyle}>Method</th>
              <th style={headerStyle}>Amount</th>
              <th style={headerStyle}>Date</th>
              <th style={headerStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => {
              const pill = PAYMENT_STATUS_PILL[row.status]
              return (
                <tr
                  key={row.id}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#111827' }}>{row.id}</td>
                  <td style={{ ...cellStyle, color: '#6b7280' }}>{row.invoice}</td>
                  <td style={{ ...cellStyle, color: '#6b7280' }}>{row.booking}</td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          background: row.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(row.guest)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{row.guest}</span>
                    </div>
                  </td>
                  <td style={cellStyle}>{row.method}</td>
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#111827' }}>{formatNpr(row.amount)}</td>
                  <td style={{ ...cellStyle, color: '#6b7280' }}>{row.date}</td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        background: pill.background,
                        color: pill.color,
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <TableFooter
        from={startIndex + 1}
        to={Math.min(startIndex + ITEMS_PER_PAGE, DEMO_PAYMENTS.length)}
        total={DEMO_PAYMENTS.length}
        unit="payments"
        page={page}
        pageCount={pageCount}
        onPage={setCurrentPage}
      />
    </div>
  )
}
