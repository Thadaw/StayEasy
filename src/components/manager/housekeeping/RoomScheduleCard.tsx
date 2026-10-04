import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  CLEANING_STATUS_COLORS,
  PRIORITY_COLORS,
  type CleaningStatus,
  type SchedulePriority,
  type ScheduleRow,
} from './demoHousekeeping'

interface RoomScheduleCardProps {
  rows: ScheduleRow[]
  totalRows: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onRowActions: (row: ScheduleRow) => void
}

const COLUMNS = ['ROOM', 'ROOM TYPE', 'FLOOR', 'CLEANING STATUS', 'ASSIGNED STAFF', 'LAST CLEANED', 'PRIORITY', 'ACTIONS']

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }
  pages.push(1)
  if (currentPage > 3) pages.push('...')
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (currentPage < totalPages - 2) pages.push('...')
  pages.push(totalPages)
  return pages
}

function StatusPill({ status }: { status: CleaningStatus }) {
  const colors = CLEANING_STATUS_COLORS[status] ?? { bg: '#F3F4F6', text: '#374151' }
  return (
    <span
      className="inline-flex whitespace-nowrap rounded-full px-1.5 py-1 text-[11px] font-semibold"
      style={{ background: colors.bg, color: colors.text }}
    >
      {status}
    </span>
  )
}

function PriorityPill({ priority }: { priority: SchedulePriority }) {
  const colors = PRIORITY_COLORS[priority] ?? { bg: '#F3F4F6', text: '#374151' }
  return (
    <span
      className="inline-flex whitespace-nowrap rounded-full px-1.5 py-1 text-[11px] font-semibold"
      style={{ background: colors.bg, color: colors.text }}
    >
      {priority}
    </span>
  )
}

export default function RoomScheduleCard({
  rows,
  totalRows,
  currentPage,
  totalPages,
  onPageChange,
  onRowActions,
}: RoomScheduleCardProps) {
  const startItem = totalRows === 0 ? 0 : (currentPage - 1) * 8 + 1
  const endItem = Math.min(startItem + rows.length - 1, totalRows)

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
        <h3 className="text-[16px] font-bold text-[#111827]">Room Cleaning Schedule</h3>
        <span className="text-[12px] text-[#9CA3AF]">
          Showing {rows.length} of {totalRows} rooms
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse">
          <thead>
            <tr className="border-y border-[#E5E7EB] bg-[#F9FAFB]">
              {COLUMNS.map(column => (
                <th
                  key={column}
                  className={`whitespace-nowrap px-2.5 py-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#6B7280] ${
                    column === 'ACTIONS' ? 'text-center' : 'text-left'
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row.id}
                className="border-b border-[#F3F4F6] transition-colors last:border-b-0 hover:bg-[#F9FAFB]"
              >
                <td className="whitespace-nowrap px-2.5 py-3 text-[14px] font-semibold text-[#111827]">{row.room}</td>
                <td className="whitespace-nowrap px-2.5 py-3 text-[13px] text-[#374151]">{row.roomType}</td>
                <td className="whitespace-nowrap px-2.5 py-3 text-[13px] text-[#374151]">{row.floor}</td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <StatusPill status={row.status} />
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-[13px]">
                  {row.assignedTo ? (
                    <span className="text-[#374151]">{row.assignedTo}</span>
                  ) : (
                    <span className="text-[#9CA3AF]">Unassigned</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-2.5 py-3 text-[13px] text-[#374151]">{row.lastCleaned}</td>
                <td className="whitespace-nowrap px-2.5 py-3">
                  <PriorityPill priority={row.priority} />
                </td>
                <td className="px-2.5 py-3">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      title="More options"
                      onClick={() => onRowActions(row)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-[#6B7280] transition-colors hover:border-[#E5E7EB] hover:bg-white"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="px-3 py-10 text-center text-[14px] text-[#6B7280]">
          No rooms found matching your filters.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F3F4F6] px-4 py-3.5">
        <p className="m-0 text-[13px] text-[#6B7280]">
          Showing {startItem}-{endItem} of {totalRows} rooms
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#6B7280] ${
              currentPage === 1 ? 'cursor-not-allowed text-[#D1D5DB]' : 'hover:bg-[#F9FAFB]'
            }`}
          >
            <ChevronLeft size={14} />
          </button>

          {getPageNumbers(currentPage, totalPages).map((page, index) =>
            typeof page === 'string' ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-[13px] text-[#9CA3AF]"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-[13px] ${
                  page === currentPage
                    ? 'border-[#0F172A] bg-[#0F172A] font-semibold text-white'
                    : 'border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]'
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#6B7280] ${
              currentPage >= totalPages ? 'cursor-not-allowed text-[#D1D5DB]' : 'hover:bg-[#F9FAFB]'
            }`}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
