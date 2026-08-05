import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
      >
        <ChevronLeft size={14} className="text-gray-600" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
            currentPage === page
              ? "bg-brand-primary text-white"
              : "border border-gray-200 hover:bg-gray-50"
          }`}
          style={currentPage !== page ? { color: "var(--brand-heading)" } : {}}
        >
          {page}
        </button>
      ))}
      {totalPages > 5 && (
        <>
          <span className="text-xs" style={{ color: "var(--brand-text-secondary)" }}>...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-xs font-semibold hover:bg-gray-50"
            style={{ color: "var(--brand-heading)" }}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
      >
        <ChevronRight size={14} className="text-gray-600" />
      </button>
    </div>
  );
}
