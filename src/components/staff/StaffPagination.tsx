import { ChevronLeft, ChevronRight } from 'lucide-react'

interface StaffPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (count: number) => void
}

export default function StaffPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: StaffPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        padding: '12px 0',
      }}
    >
      <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
        Showing {startItem} to {endItem} of {totalItems} staff
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            width: 36,
            height: 36,
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            background: '#fff',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentPage === 1 ? '#D1D5DB' : '#6B7280',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, idx) =>
          typeof page === 'string' ? (
            <span
              key={`ellipsis-${idx}`}
              style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9CA3AF',
                fontSize: 14,
              }}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                width: 36,
                height: 36,
                border: page === currentPage ? '1px solid var(--primary)' : '1px solid #E5E7EB',
                borderRadius: 8,
                background: page === currentPage ? 'var(--primary)' : '#fff',
                color: page === currentPage ? '#fff' : '#374151',
                fontWeight: page === currentPage ? 600 : 400,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
            width: 36,
            height: 36,
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            background: '#fff',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentPage === totalPages ? '#D1D5DB' : '#6B7280',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <select
          value={itemsPerPage}
          onChange={e => onItemsPerPageChange(Number(e.target.value))}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            padding: '6px 28px 6px 10px',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
            fontSize: 13,
            color: '#374151',
            background: '#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%236B7280\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E") no-repeat right 8px center',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value={10}>10 / page</option>
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>
    </div>
  )
}
