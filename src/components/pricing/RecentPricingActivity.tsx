import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PricingActivity } from '../../types/pricing'

interface RecentPricingActivityProps {
  activities: PricingActivity[]
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}

export default function RecentPricingActivity({
  activities,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: RecentPricingActivityProps) {
  const startItem = (currentPage - 1) * 5 + 1
  const endItem = Math.min(currentPage * 5, totalItems)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden', flex: '1 1 0' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Recent Pricing Activity</h3>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'none', border: '1px solid #E5E7EB', borderRadius: 8,
          padding: '6px 12px', fontSize: 13, fontWeight: 500,
          color: '#374151', cursor: 'pointer',
        }}>
          View all activity <ArrowRight size={14} />
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
            {['Date', 'Module', 'Action', 'User', 'Status'].map(col => (
              <th key={col} style={{
                padding: '12px 16px', fontSize: 11, fontWeight: 600,
                color: '#6B7280', textTransform: 'uppercase' as const,
                letterSpacing: '0.05em', textAlign: 'left', whiteSpace: 'nowrap',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activities.map(a => (
            <tr key={a.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '12px 16px' }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{a.date}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{a.time}</div>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 6, fontSize: 12,
                  fontWeight: 600, background: a.moduleColor.bg, color: a.moduleColor.text,
                }}>
                  {a.module}
                </span>
              </td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', maxWidth: 250 }}>
                {a.action}
              </td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>
                {a.user}
              </td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', borderRadius: 6, fontSize: 12,
                  fontWeight: 600, background: '#D1FAE5', color: '#065F46',
                }}>
                  <span style={{ fontSize: 10 }}>✓</span> {a.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
          Showing {startItem} to {endItem} of {totalItems} entries
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6,
              background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: currentPage === 1 ? '#D1D5DB' : '#6B7280',
            }}
          >
            <ChevronLeft size={14} />
          </button>
          {getPageNumbers().map((page, idx) =>
            typeof page === 'string' ? (
              <span key={`e-${idx}`} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>...</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                style={{
                  width: 32, height: 32,
                  border: page === currentPage ? '1px solid var(--primary)' : '1px solid #E5E7EB',
                  borderRadius: 6,
                  background: page === currentPage ? 'var(--primary)' : '#fff',
                  color: page === currentPage ? '#fff' : '#374151',
                  fontWeight: page === currentPage ? 600 : 400,
                  fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6,
              background: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: currentPage === totalPages ? '#D1D5DB' : '#6B7280',
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
