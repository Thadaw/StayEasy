import { useMemo, useState } from 'react'
import { Download, MoreVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  REVIEW_CATEGORIES,
  REVIEW_ROWS,
  REVIEW_STATUS_PILL,
  getInitials,
  type ReviewRow,
} from './demoFeedback'

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  fontSize: 13,
  color: '#374151',
  cursor: 'pointer',
  outline: 'none',
}

export default function GuestReviewsTable() {
  const [rating, setRating] = useState('All Ratings')
  const [category, setCategory] = useState('All Categories')
  const [status, setStatus] = useState('All Statuses')
  const [dateRange, setDateRange] = useState('Last 30 Days')

  const rows = useMemo(
    () =>
      REVIEW_ROWS.filter((row) => {
        const matchRating = rating === 'All Ratings' || row.rating >= Number(rating)
        const matchCategory = category === 'All Categories' || row.category === category
        const matchStatus = status === 'All Statuses' || row.status === status
        let matchDate = true
        if (dateRange === 'Last 7 Days') {
          const day = Number.parseInt(row.date.split(' ')[1] ?? '', 10)
          matchDate = row.date.startsWith('Apr') && Number.isFinite(day) && day >= 24
        }
        return matchRating && matchCategory && matchStatus && matchDate
      }),
    [rating, category, status, dateRange],
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

  const renderStars = (rating: number) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ color: '#f59e0b', fontSize: 13 }}>★</span>
      <span style={{ fontWeight: 600, color: '#111827' }}>{rating.toFixed(1)}</span>
    </span>
  )

  return (
    <div className="f-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          padding: '20px 24px 16px',
        }}
      >
        <div>
          <h3 className="f-card-title">Guest Reviews</h3>
          <p className="f-card-sub">All guest feedback in one place</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={selectStyle}>
            <option value="All Ratings">All Ratings</option>
            <option value="4.5">4.5 &amp; above</option>
            <option value="4">4.0 &amp; above</option>
            <option value="3">3.0 &amp; above</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
            <option>All Categories</option>
            {REVIEW_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
            <option>All Statuses</option>
            <option>Replied</option>
            <option>Pending Response</option>
          </select>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={selectStyle}>
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
          </select>
          <button
            onClick={() => toast.success('Feedback report exported')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '9px 14px',
              background: '#111827',
              border: '1px solid #111827',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Download size={15} />
            Export Feedback Report
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={headerStyle}>Review ID</th>
              <th style={headerStyle}>Guest Name</th>
              <th style={headerStyle}>Room</th>
              <th style={headerStyle}>Rating</th>
              <th style={headerStyle}>Category</th>
              <th style={headerStyle}>Review Date</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row: ReviewRow) => {
              const pill = REVIEW_STATUS_PILL[row.status]
              return (
                <tr
                  key={row.id}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#111827' }}>{row.reviewId}</td>
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
                  <td style={cellStyle}>{row.room}</td>
                  <td style={cellStyle}>{renderStars(row.rating)}</td>
                  <td style={cellStyle}>{row.category}</td>
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
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <button
                      title="More"
                      onClick={() => toast.success(`Opened ${row.reviewId}`)}
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
                      <MoreVertical size={15} />
                    </button>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ ...cellStyle, textAlign: 'center', padding: '32px 16px', color: '#9ca3af' }}>
                  No reviews match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
