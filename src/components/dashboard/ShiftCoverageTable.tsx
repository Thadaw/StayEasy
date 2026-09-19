import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { DayShiftGroup, ShiftDetail } from '../../types/shiftCoverage'
import { getStatusColor, getStatusBgColor } from '../../types/shiftCoverage'
import ShiftDetailModal from './ShiftDetailModal'

interface ShiftCoverageTableProps {
  data: DayShiftGroup[]
  dateRange: string
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  )
}

export default function ShiftCoverageTable({ data, dateRange }: ShiftCoverageTableProps) {
  const [showFilledShifts, setShowFilledShifts] = useState(true)
  const [activeView, setActiveView] = useState<'week' | 'list'>('list')
  const [expandedDays, setExpandedDays] = useState<Set<string>>(
    new Set(data.map((d) => d.day))
  )
  const [selectedShift, setSelectedShift] = useState<{ shift: ShiftDetail; day: string } | null>(null)

  const toggleDay = (day: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(day)) {
        next.delete(day)
      } else {
        next.add(day)
      }
      return next
    })
  }

  const getFilteredShifts = (shifts: ShiftDetail[]) => {
    if (showFilledShifts) return shifts
    return shifts.filter((s) => s.status !== 'Fully Staffed')
  }

  const hasVisibleShifts = (shifts: ShiftDetail[]) => {
    return getFilteredShifts(shifts).length > 0
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}
    >
      {/* Table Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Left: Title + Date */}
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>
            Shift Coverage List
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>{dateRange}</p>
        </div>

        {/* Center: Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <LegendDot color="#16A34A" label="Fully Staffed (100% and above)" />
          <LegendDot color="#F59E0B" label="Slightly Low (80% - 99%)" />
          <LegendDot color="#DC2626" label="Critically Low (Below 80%)" />
        </div>

        {/* Right: Week / List buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
          <button
            onClick={() => setActiveView('week')}
            style={{
              padding: '8px 16px',
              background: activeView === 'week' ? '#fff' : '#F9FAFB',
              border: 'none',
              borderRight: '1px solid #E5E7EB',
              fontSize: 13,
              fontWeight: 500,
              color: activeView === 'week' ? '#111827' : '#6B7280',
              cursor: 'pointer',
            }}
          >
            Week
          </button>
          <button
            onClick={() => setActiveView('list')}
            style={{
              padding: '8px 16px',
              background: activeView === 'list' ? '#2563EB' : '#F9FAFB',
              border: 'none',
              fontSize: 13,
              fontWeight: 500,
              color: activeView === 'list' ? '#fff' : '#6B7280',
              cursor: 'pointer',
            }}
          >
            List
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F9FAFB' }}>
              <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: 12, minWidth: 160 }}>DATE</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: 12 }}>DEPARTMENT</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: 12 }}>SHIFT</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: 12 }}>TIME</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: 12 }}>REQUIRED</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: 12 }}>ASSIGNED</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: 12 }}>COVERAGE</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: 12 }}>STATUS</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: 12 }}>MISSING / EXTRA</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontSize: 12 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dayGroup) => {
              const filteredShifts = getFilteredShifts(dayGroup.shifts)
              const isExpanded = expandedDays.has(dayGroup.day)
              const isVisible = hasVisibleShifts(dayGroup.shifts)

              if (!isVisible) return null

              return [
                <tr
                  key={dayGroup.date}
                  onClick={() => toggleDay(dayGroup.day)}
                  style={{
                    borderBottom: '1px solid #E5E7EB',
                    background: '#F9FAFB',
                    cursor: 'pointer',
                  }}
                >
                  <td
                    colSpan={10}
                    style={{
                      padding: '12px 14px',
                      fontWeight: 600,
                      color: '#111827',
                      fontSize: 13,
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      {dayGroup.day}
                      <ChevronDown
                        size={16}
                        color="#6B7280"
                        style={{
                          transition: 'transform 0.2s',
                          transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                          flexShrink: 0,
                        }}
                      />
                    </span>
                  </td>
                </tr>,
                ...(isExpanded && filteredShifts.length > 0
                  ? filteredShifts.map((shift, index) => (
                      <tr
                        key={shift.id}
                        style={{
                          borderBottom: '1px solid #F3F4F6',
                          background: index % 2 === 0 ? '#FAFBFC' : '#fff',
                        }}
                      >
                        <td style={{ padding: '14px 14px', minWidth: 160 }}></td>
                        <td style={{ padding: '14px 14px', color: '#374151', fontWeight: 500 }}>{shift.department}</td>
                        <td style={{ padding: '14px 14px', color: '#6B7280' }}>{shift.shift}</td>
                        <td style={{ padding: '14px 14px', color: '#6B7280' }}>{shift.time}</td>
                        <td style={{ padding: '14px 14px', textAlign: 'center', color: '#374151' }}>{shift.required}</td>
                        <td style={{ padding: '14px 14px', textAlign: 'center', color: '#374151', fontWeight: 500 }}>{shift.assigned}</td>
                        <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              color: getStatusColor(shift.status),
                              background: getStatusBgColor(shift.status),
                            }}
                          >
                            {shift.coverage}%
                          </span>
                        </td>
                        <td style={{ padding: '14px 14px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 500,
                              color: getStatusColor(shift.status),
                              background: getStatusBgColor(shift.status),
                            }}
                          >
                            {shift.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 14px', textAlign: 'center', color: '#6B7280' }}>
                          {shift.missing !== null ? (
                            <span style={{ color: '#DC2626', fontWeight: 500 }}>{shift.missing}</span>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedShift({ shift, day: dayGroup.day })
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#2563EB',
                              fontSize: 13,
                              fontWeight: 500,
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  : []),
              ]
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {data.every((d) => !hasVisibleShifts(d.shifts)) && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6B7280' }}>
            <p style={{ margin: 0, fontSize: 14 }}>No shifts match the current filters.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedShift && (
        <ShiftDetailModal
          shift={selectedShift.shift}
          day={selectedShift.day}
          onClose={() => setSelectedShift(null)}
        />
      )}
    </div>
  )
}
