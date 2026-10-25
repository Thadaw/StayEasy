interface StaffPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (count: number) => void
}

export default function StaffPagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }: StaffPaginationProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '12px 16px', background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB' }}>
      <div style={{ fontSize: 13, color: '#6B7280' }}>
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 13 }}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', fontSize: 13, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>
            Previous
          </button>
          {Array.from({ length: Math.max(1, totalPages) }).slice(0, 5).map((_, i) => {
            const page = i + 1
            return (
              <button key={page} onClick={() => onPageChange(page)} style={{ padding: '6px 10px', borderRadius: 6, border: page === currentPage ? 'none' : '1px solid #E5E7EB', background: page === currentPage ? 'var(--primary)' : '#fff', color: page === currentPage ? '#fff' : '#374151', fontSize: 13 }}>
                {page}
              </button>
            )
          })}
          <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', fontSize: 13, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', opacity: currentPage >= totalPages ? 0.5 : 1 }}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
