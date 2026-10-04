import { useState, useMemo, Fragment } from 'react'
import { UserPlus } from 'lucide-react'
import type { DayShiftGroup, ShiftDetail } from '../../types/shiftCoverage'

interface ShiftCoverageTableProps {
  data: DayShiftGroup[]
  dateRange: string
}

const departments = ['Manager', 'Housekeeping', 'Restaurant', 'Kitchen Staff', 'Front Desk']
const shiftTypes = [
  { name: 'Morning', time: '08:00 - 14:00' },
  { name: 'Evening', time: '14:00 - 22:00' },
  { name: 'Night', time: '22:00 - 08:00' },
]

const deptIcons: Record<string, string> = {
  Manager: '👔',
  Housekeeping: '🧹',
  Restaurant: '🍽️',
  'Kitchen Staff': '👨‍🍳',
  'Front Desk': '🛎️',
}

function getCellColor(coverage: number): { bg: string; text: string } {
  if (coverage > 100) return { bg: '#DBEAFE', text: '#1D4ED8' }
  if (coverage >= 100) return { bg: '#DCFCE7', text: '#166534' }
  if (coverage >= 80) return { bg: '#FEF3C7', text: '#92400E' }
  return { bg: '#FEE2E2', text: '#991B1B' }
}

export default function ShiftCoverageTable({ data, dateRange }: ShiftCoverageTableProps) {

  // Build grid data: Map<department, Map<shiftName, Map<dayIndex, ShiftDetail>>>
  const gridData = useMemo(() => {
    const grid = new Map<string, Map<string, Map<number, ShiftDetail>>>()

    departments.forEach(dept => {
      const shiftMap = new Map<string, Map<number, ShiftDetail>>()
      shiftTypes.forEach(st => {
        shiftMap.set(st.name, new Map())
      })
      grid.set(dept, shiftMap)
    })

    data.forEach((dayGroup, dayIndex) => {
      dayGroup.shifts.forEach(shift => {
        const deptMap = grid.get(shift.department)
        if (deptMap) {
          const shiftDayMap = deptMap.get(shift.shift)
          if (shiftDayMap) {
            shiftDayMap.set(dayIndex, shift)
          }
        }
      })
    })

    return grid
  }, [data])

  // Compute department coverage percentages
  const deptCoverage = useMemo(() => {
    const result = new Map<string, number>()
    departments.forEach(dept => {
      let totalReq = 0
      let totalAssigned = 0
      data.forEach(dayGroup => {
        dayGroup.shifts.forEach(shift => {
          if (shift.department === dept) {
            totalReq += shift.required
            totalAssigned += shift.assigned
          }
        })
      })
      result.set(dept, totalReq > 0 ? Math.round((totalAssigned / totalReq) * 100) : 100)
    })
    return result
  }, [data])

  // Collect all understaffed shifts
  const understaffedShifts = useMemo(() => {
    const shifts: (ShiftDetail & { dayLabel: string })[] = []
    data.forEach(dayGroup => {
      dayGroup.shifts.forEach(shift => {
        if (shift.status === 'Critically Low' || shift.status === 'Slightly Low') {
          shifts.push({ ...shift, dayLabel: dayGroup.day })
        }
      })
    })
    return shifts
  }, [data])

  // Department coverage for sidebar
  const deptCoverageList = useMemo(() => {
    return departments.map(dept => ({
      name: dept,
      coverage: deptCoverage.get(dept) ?? 100,
    }))
  }, [deptCoverage])

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* ===== LEFT: Weekly Grid ===== */}
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden', minWidth: 0 }}>
        {/* Grid Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Week of {dateRange}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
              <span style={{ fontSize: 11, color: '#6B7280' }}>Fully Staffed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ fontSize: 11, color: '#6B7280' }}>Slightly Low</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} />
              <span style={{ fontSize: 11, color: '#6B7280' }}>Critically Low</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
              <span style={{ fontSize: 11, color: '#6B7280' }}>Overstaffed</span>
            </div>
          </div>
        </div>

        {/* Grid Body */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', minWidth: 180 }}>
                  DEPARTMENT / SHIFT
                </th>
                {data.map((dayGroup, i) => {
                  const date = new Date(dayGroup.date + 'T00:00:00')
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                  const dayNum = date.getDate()
                  const monthName = date.toLocaleDateString('en-US', { month: 'short' })
                  const isToday = new Date().toDateString() === date.toDateString()
                  return (
                    <th key={i} style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600, color: '#6B7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', minWidth: 80 }}>
                      <div>{dayName}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 400 }}>{monthName} {dayNum}</div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => {
                const hasAnyData = data.some(d => d.shifts.some(s => s.department === dept))
                if (!hasAnyData) return null

                return (
                  <Fragment key={dept}>
                    <tr style={{ background: '#FAFBFC', borderBottom: '1px solid #E5E7EB' }}>
                      <td colSpan={data.length + 1} style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13 }}>{deptIcons[dept]}</span>
                          <span style={{ fontWeight: 600, color: '#111827', fontSize: 13 }}>{dept}</span>
                        </div>
                      </td>
                    </tr>
                    {shiftTypes.map(st => {
                      const hasData = data.some(dayGroup =>
                        dayGroup.shifts.some(s => s.department === dept && s.shift === st.name)
                      )
                      if (!hasData) return null

                      return (
                        <tr key={`${dept}-${st.name}`} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '10px 16px 10px 40px' }}>
                            <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{st.name}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{st.time}</div>
                          </td>
                          {data.map((dayGroup, dayIndex) => {
                            const shiftData = gridData.get(dept)?.get(st.name)?.get(dayIndex)
                            if (!shiftData) {
                              return (
                                <td key={dayIndex} style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  <span style={{ color: '#D1D5DB', fontSize: 12 }}>-</span>
                                </td>
                              )
                            }
                            const cellColor = getCellColor(shiftData.coverage)
                            return (
                              <td key={dayIndex} style={{ padding: '10px 8px', textAlign: 'center' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '4px 10px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: cellColor.text,
                                  background: cellColor.bg,
                                  minWidth: 52,
                                }}>
                                  {shiftData.assigned}/{shiftData.required}
                                </span>
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== RIGHT: Summary Sidebar ===== */}
      <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Understaffed Shifts */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>
              Understaffed Shifts ({understaffedShifts.length})
            </h3>
            <button style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {understaffedShifts.slice(0, 5).map((shift, i) => {
              const date = new Date(data[0]?.date?.split(' ')[0] || '2026-07-14')
              const shiftDate = new Date(date)
              shiftDate.setDate(shiftDate.getDate() + data.findIndex(d => d.day === shift.dayLabel))
              const dayName = shiftDate.toLocaleDateString('en-US', { weekday: 'short' })
              const monthDay = shiftDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                  <div style={{ width: 4, height: 40, borderRadius: 2, background: shift.status === 'Critically Low' ? '#DC2626' : '#F59E0B', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                      {dayName}, {monthDay}, 2026
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>
                      {shift.department} &bull; {shift.shift} {shift.time}
                    </div>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: shift.status === 'Critically Low' ? '#FEE2E2' : '#FEF3C7', color: shift.status === 'Critically Low' ? '#991B1B' : '#92400E', whiteSpace: 'nowrap' }}>
                    Missing {shift.missing ?? shift.required - shift.assigned}
                  </span>
                </div>
              )
            })}
            {understaffedShifts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '16px 0', color: '#9CA3AF', fontSize: 13 }}>
                No understaffed shifts
              </div>
            )}
          </div>

          <button style={{ width: '100%', marginTop: 12, padding: '10px 0', borderRadius: 8, border: 'none', background: '#2563EB', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <UserPlus size={14} />
            Assign Staff
          </button>
        </div>

        {/* Department Coverage */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#111827' }}>
            Department Coverage (This Week)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {deptCoverageList.map(dept => {
              const barColor = dept.coverage >= 100 ? '#16A34A' : dept.coverage >= 80 ? '#F59E0B' : '#DC2626'
              return (
                <div key={dept.name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{dept.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: barColor }}>{dept.coverage}%</span>
                  </div>
                  <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#F3F4F6', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(dept.coverage, 100)}%`, height: '100%', borderRadius: 4, background: barColor, transition: 'width 0.3s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Coverage Guide */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#111827' }}>
            Coverage Guide
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#374151' }}>Fully Staffed (100% and above)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#374151' }}>Slightly Low (80% - 99%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#374151' }}>Critically Low (Below 80%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#374151' }}>Overstaffed (Above 110%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
