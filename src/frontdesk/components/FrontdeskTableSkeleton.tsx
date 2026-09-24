import { Skeleton } from "../../shared/ui/Skeleton"

interface FrontdeskTableSkeletonProps {
  columns: number
  headerLabels?: string[]
  rows?: number
  centerColumns?: number[]
}

export function FrontdeskTableSkeleton({ columns, headerLabels, rows = 8, centerColumns = [] }: FrontdeskTableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {Array.from({ length: columns }).map((_, i) => (
              <th
                key={i}
                className={`text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 ${
                  centerColumns.includes(i) ? "text-center" : ""
                }`}
              >
                {headerLabels?.[i] || <Skeleton className="h-3 w-16" />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-gray-50 last:border-0">
              {Array.from({ length: columns }).map((_, colIdx) => {
                const isAvatar = colIdx === 0
                const isBadge = colIdx === columns - 2
                const isButton = colIdx === columns - 1
                return (
                  <td key={colIdx} className={`px-5 py-3.5 ${centerColumns.includes(colIdx) ? "text-center" : ""}`}>
                    {isAvatar ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ) : isButton ? (
                      <div className="flex justify-center sm:justify-start">
                        <Skeleton className="h-8 w-24 rounded-lg" />
                      </div>
                    ) : isBadge ? (
                      <Skeleton className="inline-block h-6 w-20 rounded-full" />
                    ) : (
                      <Skeleton className={`h-3.5 ${colIdx === 1 ? "w-24" : "w-16"}`} />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export type FrontdeskSkeletonCellKind = "avatar" | "title" | "lines" | "text" | "tag" | "badge" | "button"

export interface FrontdeskSkeletonColumn {
  kind: FrontdeskSkeletonCellKind
  align?: "left" | "right" | "center"
}

interface FrontdeskGridSkeletonProps {
  columns: FrontdeskSkeletonColumn[]
  template: string
  header?: string[]
  rows?: number
}

function alignClass(align?: FrontdeskSkeletonColumn["align"]): string {
  if (align === "right") return "text-right"
  if (align === "center") return "text-center"
  return ""
}

function SkeletonCell({ kind }: { kind: FrontdeskSkeletonCellKind }) {
  switch (kind) {
    case "avatar":
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )
    case "title":
      return (
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      )
    case "lines":
      return (
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-14" />
        </div>
      )
    case "tag":
      return <Skeleton className="inline-block h-5 w-16 rounded-md" />
    case "badge":
      return <Skeleton className="inline-block h-6 w-20 rounded-full" />
    case "button":
      return <Skeleton className="h-8 w-24 rounded-lg" />
    case "text":
    default:
      return <Skeleton className="h-3.5 w-20" />
  }
}

export function FrontdeskGridSkeleton({ columns, template, header, rows = 8 }: FrontdeskGridSkeletonProps) {
  const gridStyle = { gridTemplateColumns: template }
  return (
    <>
      {header && header.length > 0 && (
        <div
          className="hidden lg:grid gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider"
          style={gridStyle}
        >
          {header.map((label, i) => (
            <div key={i} className={alignClass(columns[i]?.align)}>
              {label}
            </div>
          ))}
        </div>
      )}

      <div className="hidden lg:grid divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="grid gap-4 px-6 py-4 items-center" style={gridStyle}>
            {columns.map((col, colIdx) => (
              <div key={colIdx} className={alignClass(col.align)}>
                <SkeletonCell kind={col.kind} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="lg:hidden divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={`m-${rowIdx}`} className="px-5 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 min-w-0 space-y-1.5">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

interface FrontdeskItemSkeletonProps {
  rows?: number
  iconClass?: string
  trailing?: "none" | "chevron" | "amount"
}

export function FrontdeskItemSkeleton({
  rows = 6,
  iconClass = "h-10 w-10 rounded-xl",
  trailing = "none",
}: FrontdeskItemSkeletonProps) {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex items-center gap-4 px-5 py-4">
          <Skeleton className={`${iconClass} shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
            <Skeleton className="h-3 w-2/3 mt-1.5" />
            <div className="flex items-center gap-2 mt-1.5">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-2.5 w-12" />
            </div>
          </div>
          {trailing === "chevron" && <Skeleton className="h-4 w-4 shrink-0" />}
          {trailing === "amount" && (
            <div className="shrink-0 text-right space-y-1">
              <Skeleton className="h-3.5 w-16 ml-auto" />
              <Skeleton className="h-2.5 w-10 ml-auto" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}