import { useState } from 'react'
import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ActivityLog } from '../../types/activity'

interface ActivityTableProps {
  activities: ActivityLog[]
  onSelectActivity: (activity: ActivityLog) => void
  selectedActivity: ActivityLog | null
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Success: { bg: '#D1FAE5', text: '#065F46' },
  Warning: { bg: '#FEF3C7', text: '#92400E' },
  Failed: { bg: '#FEE2E2', text: '#991B1B' },
}

export default function ActivityTable({ activities, onSelectActivity, selectedActivity }: ActivityTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const totalItems = 1248
  const totalPages = Math.ceil(totalItems / perPage)
  const startItem = (currentPage - 1) * perPage + 1
  const endItem = Math.min(currentPage * perPage, totalItems)

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              {['Date & Time', 'User', 'Module', 'Action', 'Description', 'IP Address', 'Status', ''].map(col => (
                <th key={col} style={{
                  padding: '12px 16px', fontSize: 11, fontWeight: 600,
                  color: '#6B7280', textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em', textAlign: 'left', whiteSpace: 'nowrap',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => {
              const sc = statusColors[activity.status] || statusColors.Success
              const isSelected = selectedActivity?.id === activity.id
              return (
                <tr
                  key={activity.id}
                  onClick={() => onSelectActivity(activity)}
                  style={{
                    borderBottom: '1px solid #F3F4F6',
                    cursor: 'pointer',
                    background: isSelected ? '#F5F3FF' : 'transparent',
                  }}
                >
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{activity.dateTime.split(' ').slice(0, 1).join(' ')}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{activity.dateTime.split(' ').slice(1).join(' ')}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#EDE9FE', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 600, color: '#5B21B6',
                        flexShrink: 0,
                      }}>
                        {activity.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{activity.user.name}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{activity.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 6, fontSize: 12,
                      fontWeight: 600, background: activity.moduleColor.bg,
                      color: activity.moduleColor.text,
                    }}>
                      {activity.module}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 6, fontSize: 12,
                      fontWeight: 600, background: activity.actionColor.bg,
                      color: activity.actionColor.text,
                    }}>
                      {activity.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', maxWidth: 280 }}>
                    {activity.descriptionLink ? (
                      <>
                        {activity.description.split(activity.descriptionLink)[0]}
                        <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{activity.descriptionLink}</span>
                        {activity.description.split(activity.descriptionLink)[1] || ''}
                      </>
                    ) : activity.description}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {activity.ipAddress}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 6, fontSize: 12,
                      fontWeight: 600, background: sc.bg, color: sc.text,
                    }}>
                      {activity.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{
                      width: 30, height: 30, border: 'none', background: 'transparent',
                      borderRadius: 6, cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: '#6B7280',
                    }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
          Showing {startItem} to {endItem} of {totalItems.toLocaleString()} entries
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <select
              value={perPage}
              onChange={e => { setPerPage(Number(e.target.value)); setCurrentPage(1) }}
              style={{
                appearance: 'none', WebkitAppearance: 'none',
                background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6,
                padding: '6px 28px 6px 10px', fontSize: 13, color: '#374151',
                cursor: 'pointer', outline: 'none',
              }}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <ChevronDownIcon style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentPage === 1 ? '#D1D5DB' : '#6B7280' }}>
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} style={{
                width: 32, height: 32,
                border: page === currentPage ? '1px solid var(--primary)' : '1px solid #E5E7EB',
                borderRadius: 6,
                background: page === currentPage ? 'var(--primary)' : '#fff',
                color: page === currentPage ? '#fff' : '#374151',
                fontWeight: page === currentPage ? 600 : 400,
                fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {page}
              </button>
            ))}
            <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>...</span>
            <button onClick={() => setCurrentPage(125)} style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', color: '#374151', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              125
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentPage === totalPages ? '#D1D5DB' : '#6B7280' }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChevronDownIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}
