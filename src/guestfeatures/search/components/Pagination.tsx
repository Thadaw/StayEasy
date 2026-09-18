interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
          currentPage === 1
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
          currentPage === totalPages
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Next
      </button>
    </div>
  );
}
