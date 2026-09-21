import { Skeleton } from "../../shared/ui/Skeleton"

interface FrontdeskTableSkeletonProps {
  columns: number
  rows?: number
}

export function FrontdeskTableSkeleton({ columns, rows = 8 }: FrontdeskTableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-gray-50 last:border-0">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-5 py-3.5">
                  {colIdx === 0 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ) : colIdx === columns - 1 ? (
                    <Skeleton className="h-7 w-20 rounded-lg" />
                  ) : (
                    <Skeleton className="h-3.5 w-24" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface FrontdeskRowSkeletonProps {
  rows?: number
  columns?: number
}

export function FrontdeskRowSkeleton({ rows = 8, columns = 5 }: FrontdeskRowSkeletonProps) {
  return (
    <div className="divide-y divide-gray-50">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="px-6 py-3.5 flex items-center gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} style={{ flex: colIdx === 0 ? 2 : 1 }} className="min-w-0">
              {colIdx === 0 ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ) : colIdx === columns - 1 ? (
                <Skeleton className="h-7 w-20 rounded-lg" />
              ) : (
                <Skeleton className="h-3.5 w-24" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
