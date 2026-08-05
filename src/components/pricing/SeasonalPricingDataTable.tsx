import { Eye, Pencil, MoreVertical, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import type { SeasonalPricingEntry } from '../../types/pricing'

interface SeasonalPricingDataTableProps {
  entries: SeasonalPricingEntry[]
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  Upcoming: { bg: '#DBEAFE', text: '#1E40AF' },
  Expired: { bg: '#F3F4F6', text: '#6B7280' },
}

export default function SeasonalPricingDataTable({
  entries,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: SeasonalPricingDataTableProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

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
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
            {['SEASON', 'ROOM TYPE', 'DATE RANGE', 'BASE PRICE', 'SEASONAL PRICE', 'CHANGE', 'STATUS', 'ACTIONS'].map(col => (
              <th
                key={col}
                style={{
                  padding: '14px 16px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                  textAlign: col === 'ACTIONS' ? 'center' : 'left',
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => {
            const sc = statusColors[entry.status] || { bg: '#F3F4F6', text: '#374151' }
            const isPositive = entry.change > 0
            return (
              <tr key={entry.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: entry.seasonColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{entry.seasonName}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                  {entry.roomType}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>
                    <Calendar size={14} color="#9CA3AF" />
                    {entry.dateRange}
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                  NPR {entry.basePrice.toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#111827' }}>
                  NPR {entry.seasonalPrice.toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: isPositive ? '#16A34A' : '#DC2626' }}>
                      {isPositive ? '+' : ''}{entry.change}%
                    </span>
                    <span style={{ fontSize: 12, color: isPositive ? '#16A34A' : '#DC2626' }}>
                      {isPositive ? '↑' : '↓'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: sc.bg,
                      color: sc.text,
                    }}
                  >
                    {entry.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <button
                      title="View"
                      style={{
                        width: 32, height: 32, border: 'none', background: 'transparent',
                        borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#6B7280',
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      title="Edit"
                      style={{
                        width: 32, height: 32, border: 'none', background: 'transparent',
                        borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#6B7280',
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="More options"
                      style={{
                        width: 32, height: 32, border: 'none', background: 'transparent',
                        borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#6B7280',
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
          {entries.length === 0 && (
            <tr>
              <td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
                No seasonal pricing entries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
          Showing {startItem} to {endItem} of {totalItems} entries
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: currentPage === 1 ? '#D1D5DB' : '#6B7280',
            }}
          >
            <ChevronLeft size={14} />
          </button>
          {getPageNumbers().map((page, idx) =>
            typeof page === 'string' ? (
              <span key={`ellipsis-${idx}`} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
                ...
              </span>
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
              width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
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
