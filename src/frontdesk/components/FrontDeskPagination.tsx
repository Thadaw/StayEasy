interface FrontDeskPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  itemLabel?: string
}

export function FrontDeskPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "items",
}: FrontDeskPaginationProps) {
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  if (totalItems === 0) return null

  return (
    <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-gray-500">
        Showing {start}–{end} of {totalItems.toLocaleString()} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            currentPage === 1
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <button className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
          {currentPage}
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            currentPage >= totalPages
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )
}
