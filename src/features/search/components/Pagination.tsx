import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MAX_VISIBLE = 5;

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= MAX_VISIBLE) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - MAX_VISIBLE + 1));
  return Array.from({ length: MAX_VISIBLE }, (_, i) => start + i);
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const firstVisible = visiblePages[0];
  const lastVisible = visiblePages[visiblePages.length - 1];

  const navClass = (disabled: boolean) =>
    `w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center transition-colors ${
      disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"
    }`;

  const pageButton = (page: number, active = false) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
        active
          ? "bg-brand-primary text-white"
          : "border border-gray-200 hover:bg-gray-50"
      }`}
      style={!active ? { color: "var(--brand-heading)" } : {}}
    >
      {page}
    </button>
  );

  return (
    <div className="mt-8">
      <p
        className="text-xs text-center mb-3 font-semibold"
        style={{ color: "var(--brand-text-secondary)" }}
      >
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={navClass(currentPage === 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} className="text-gray-600" />
        </button>

        {firstVisible > 1 && (
          <>
            {pageButton(1)}
            {firstVisible > 2 && (
              <span className="text-xs" style={{ color: "var(--brand-text-secondary)" }}>...</span>
            )}
          </>
        )}

        {visiblePages.map((page) => pageButton(page, page === currentPage))}

        {lastVisible < totalPages && (
          <>
            {lastVisible < totalPages - 1 && (
              <span className="text-xs" style={{ color: "var(--brand-text-secondary)" }}>...</span>
            )}
            {pageButton(totalPages)}
          </>
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={navClass(currentPage === totalPages)}
          aria-label="Next page"
        >
          <ChevronRight size={14} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
