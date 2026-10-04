import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import StaffActionsMenu, { type StaffAction } from './StaffActionsMenu'
import { ATTENDANCE_PILL, getInitials, type StaffRow } from './demoStaff'

const ITEMS_PER_PAGE = 7

interface ManagerStaffDirectoryProps {
  staff: StaffRow[]
  onAction: (member: StaffRow, action: StaffAction) => void
}

function getPageItems(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  if (current <= 3) [2, 3].forEach((p) => pages.add(p))
  if (current >= total - 2) [total - 2, total - 1].forEach((p) => pages.add(p))
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const items: (number | '…')[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push('…')
    items.push(p)
    prev = p
  }
  return items
}

export default function ManagerStaffDirectory({ staff, onAction }: ManagerStaffDirectoryProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const pageCount = Math.max(1, Math.ceil(staff.length / ITEMS_PER_PAGE))
  const page = Math.min(currentPage, pageCount)

  useEffect(() => {
    setCurrentPage(1)
  }, [staff])

  useEffect(() => {
    if (!openMenuId) return
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [openMenuId])

  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const pageRows = staff.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
    whiteSpace: 'nowrap',
  }

  const cellStyle: React.CSSProperties = {
    padding: '14px 16px',
    fontSize: 13,
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle',
  }

  const pageButtonStyle = (active: boolean): React.CSSProperties => ({
    minWidth: 32,
    height: 32,
    padding: '0 8px',
    borderRadius: 6,
    border: 'none',
    background: active ? '#111827' : 'transparent',
    color: active ? '#fff' : '#374151',
    fontSize: 13,
    fontWeight: active ? 600 : 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })

  const from = staff.length === 0 ? 0 : startIndex + 1
  const to = Math.min(startIndex + ITEMS_PER_PAGE, staff.length)

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Staff Directory</h3>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>
          Showing {from}–{to} of {staff.length} staff
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1150 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={headerStyle}>Staff ID</th>
              <th style={headerStyle}>Employee</th>
              <th style={headerStyle}>Department</th>
              <th style={headerStyle}>Position</th>
              <th style={headerStyle}>Shift</th>
              <th style={headerStyle}>Attendance</th>
              <th style={headerStyle}>Contact</th>
              <th style={headerStyle}>Performance</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((member) => {
              const pill = ATTENDANCE_PILL[member.attendance]
              return (
                <tr
                  key={member.id}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
                    {member.staffId}
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          background: member.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(member.name)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{member.name}</span>
                    </div>
                  </td>
                  <td style={cellStyle}>{member.department}</td>
                  <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>{member.position}</td>
                  <td style={cellStyle}>{member.shift}</td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        background: pill.background,
                        color: pill.color,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {member.attendance}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>{member.phone}</td>
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#111827' }}>{member.performance}%</td>
                  <td style={{ ...cellStyle, position: 'relative' }}>
                    <div ref={openMenuId === member.id ? menuRef : undefined}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(openMenuId === member.id ? null : member.id)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 18,
                          lineHeight: 1,
                          color: '#9ca3af',
                          padding: '0 4px',
                        }}
                      >
                        ⋮
                      </button>
                      {openMenuId === member.id && (
                        <StaffActionsMenu
                          staff={member}
                          onAction={(action) => {
                            setOpenMenuId(null)
                            onAction(member, action)
                          }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={9} style={{ ...cellStyle, textAlign: 'center', padding: '32px 16px', color: '#9ca3af' }}>
                  No staff members found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 4,
          padding: '14px 20px',
        }}
      >
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, Math.min(p, pageCount) - 1))}
          disabled={page <= 1}
          style={{
            ...pageButtonStyle(false),
            opacity: page <= 1 ? 0.4 : 1,
            cursor: page <= 1 ? 'default' : 'pointer',
          }}
        >
          <ChevronLeft size={15} />
        </button>
        {getPageItems(page, pageCount).map((item, index) =>
          item === '…' ? (
            <span key={`gap-${index}`} style={{ padding: '0 4px', fontSize: 13, color: '#9ca3af' }}>
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => setCurrentPage(item)}
              style={pageButtonStyle(item === page)}
              onMouseEnter={(e) => {
                if (item !== page) e.currentTarget.style.background = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                if (item !== page) e.currentTarget.style.background = 'transparent'
              }}
            >
              {item}
            </button>
          ),
        )}
        <button
          onClick={() => setCurrentPage((p) => Math.min(pageCount, Math.min(p, pageCount) + 1))}
          disabled={page >= pageCount}
          style={{
            ...pageButtonStyle(false),
            opacity: page >= pageCount ? 0.4 : 1,
            cursor: page >= pageCount ? 'default' : 'pointer',
          }}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
