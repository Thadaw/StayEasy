import { Skeleton } from "../../shared/ui/Skeleton"

export function RoomStatusCalendarSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-4 py-3 w-32">
              <Skeleton className="h-3 w-16" />
            </th>
            <th className="text-center px-4 py-3 w-20">
              <Skeleton className="h-3 w-10 mx-auto" />
            </th>
            {Array.from({ length: 7 }).map((_, i) => (
              <th key={i} className="text-center px-2 py-3">
                <Skeleton className="h-3 w-8 mx-auto" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <Skeleton className="h-3.5 w-12 mx-auto" />
              </td>
              {Array.from({ length: 7 }).map((_, colIdx) => (
                <td key={colIdx} className="px-1 py-1.5">
                  <Skeleton className="h-12 w-full rounded-lg" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
