interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-end gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
          currentPage === 1
            ? "border-brand-card-border text-brand-placeholder cursor-not-allowed"
            : "border-brand-card-border text-brand-heading hover:bg-brand-secondary-surface"
        }`}
      >
        Previous
      </button>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
          currentPage === totalPages
            ? "border-brand-card-border text-brand-placeholder cursor-not-allowed"
            : "border-brand-card-border text-brand-heading hover:bg-brand-secondary-surface"
        }`}
      >
        Next
      </button>
    </div>
  );
}
