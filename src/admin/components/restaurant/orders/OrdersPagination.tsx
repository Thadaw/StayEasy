import { ChevronLeft, ChevronRight } from 'lucide-react'

interface OrdersPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
}

export default function OrdersPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: OrdersPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push(-1) // ellipsis
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push(-1)
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push(-1)
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push(-1)
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
        Showing {startItem} to {endItem} of {totalItems} orders
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: '#fff',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentPage === 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, index) => (
          page === -1 ? (
            <span key={`ellipsis-${index}`} style={{ padding: '0 8px', color: 'var(--muted-foreground)' }}>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: currentPage === page ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: currentPage === page ? 'var(--primary)' : '#fff',
                color: currentPage === page ? '#fff' : 'var(--foreground)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: '#fff',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentPage === totalPages ? 'var(--muted-foreground)' : 'var(--foreground)',
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          style={{
            padding: '8px 32px 8px 12px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: '#fff',
            fontSize: 13,
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235D6D7E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
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
