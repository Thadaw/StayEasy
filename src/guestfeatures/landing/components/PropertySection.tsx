import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PropertySectionProps {
  title: string;
  linkTo?: string;
  linkLabel?: string;
  loading: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

export function PropertySection({ title, linkTo, linkLabel = "View all", loading, isEmpty, emptyMessage, children }: PropertySectionProps) {
  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold font-display text-brand-heading">
          {title}
        </h2>
        {linkTo && (
          <Link to={linkTo} className="flex items-center gap-1 text-sm font-semibold text-brand-accent hover:underline">
            {linkLabel} <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="relative h-[130px] md:h-[150px] bg-gray-200">
                {/* property type badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/70 rounded-full h-3.5 w-10" />
                {/* favourite button */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/70" />
              </div>
              <div className="px-3 py-2">
                <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-1.5" />
                <div className="h-2.5 bg-gray-200 rounded w-1/2 mb-2" />
                {/* "Starting from $X / night" is right-aligned */}
                <div className="flex items-center justify-end gap-1">
                  <div className="h-2 bg-gray-200 rounded w-10" />
                  <div className="h-3 bg-gray-200 rounded w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty && emptyMessage ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-sm text-brand-text-secondary">
            {emptyMessage}
          </p>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
