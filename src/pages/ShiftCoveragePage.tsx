import { useState, useMemo } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import ShiftCoverageStats from '../components/dashboard/ShiftCoverageStats'
import ShiftCoverageFilters from '../components/dashboard/ShiftCoverageFilters'
import ShiftCoverageTable from '../components/dashboard/ShiftCoverageTable'
import { mockShiftCoverageData } from '../data/mockShiftCoverage'
import type { ShiftCoverageFilters as FilterType, DayShiftGroup } from '../types/shiftCoverage'
import { calculateStats } from '../types/shiftCoverage'
import { ChevronDown, Bell } from 'lucide-react'

function addDays(dateStr: string, days: number): Date {
  const parts = dateStr.split(' ')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames.indexOf(parts[0])
  const day = parseInt(parts[1].replace(',', ''))
  const year = parseInt(parts[2] || '2026')
  const date = new Date(year, month, day)
  date.setDate(date.getDate() + days)
  return date
}

function formatDateShort(date: Date): string {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[date.getMonth()]} ${date.getDate()}`
}

function formatDateRange(startDate: Date, endDate: Date): string {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const startMonth = monthNames[startDate.getMonth()]
  const endMonth = monthNames[endDate.getMonth()]
  if (startMonth === endMonth) {
    return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${endDate.getFullYear()}`
  }
  return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${endDate.getFullYear()}`
}

function generateWeekData(startDate: Date): DayShiftGroup[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const departments = ['Manager', 'Housekeeping', 'Restaurant', 'Kitchen Staff', 'Front Desk']
  const shiftTypes = [
    { shift: 'Morning', time: '06:00 - 14:00' },
    { shift: 'Afternoon', time: '14:00 - 22:00' },
    { shift: 'Night', time: '22:00 - 06:00' },
  ]

  const groups: DayShiftGroup[] = []
  let idCounter = 1

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dayName = dayNames[date.getDay()]
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateStr = `${dayName}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const shifts = []
    for (const dept of departments) {
      for (const st of shiftTypes) {
        if (dept === 'Kitchen Staff' && st.shift === 'Night') continue
        if (dept === 'Manager' && st.shift === 'Night') continue
        if (dept === 'Restaurant' && st.shift === 'Night') continue

        const required = dept === 'Manager' ? (st.shift === 'Night' ? 1 : st.shift === 'Afternoon' ? 2 : 3)
          : dept === 'Housekeeping' ? (st.shift === 'Night' ? 2 : st.shift === 'Afternoon' ? 6 : 8)
          : dept === 'Restaurant' ? (st.shift === 'Night' ? 0 : st.shift === 'Afternoon' ? 5 : 6)
          : dept === 'Kitchen Staff' ? (st.shift === 'Afternoon' ? 3 : 2)
          : (st.shift === 'Night' ? 1 : 2)

        if (required === 0) continue

        const variance = Math.floor(Math.random() * 3) - 1
        let assigned = required + variance
        if (assigned < 0) assigned = 0
        if (assigned > required + 1) assigned = required + 1

        const coverage = Math.round((assigned / required) * 100)
        let status: 'Fully Staffed' | 'Slightly Low' | 'Critically Low' | 'Overstaffed' = 'Fully Staffed'
        if (coverage > 100) status = 'Overstaffed'
        else if (coverage >= 80) status = 'Fully Staffed'
        else if (coverage >= 60) status = 'Slightly Low'
        else status = 'Critically Low'

        const missing = assigned < required ? required - assigned : null

        shifts.push({
          id: String(idCounter++),
          department: dept,
          shift: st.shift,
          time: st.time,
          required,
          assigned,
          coverage,
          status,
          missing,
        })
      }
    }

    groups.push({ day: dateStr, date: isoDate, shifts })
  }

  return groups
}

export default function ShiftCoveragePage() {
  const [filters, setFilters] = useState<FilterType>({
    department: 'All Departments',
    shift: 'All Shifts',
    weekStart: 'Jul 14',
    weekEnd: 'Jul 20, 2026',
  })

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    return new Date(2026, 6, 14)
  })

  const weekData = useMemo(() => {
    return generateWeekData(currentWeekStart)
  }, [currentWeekStart])

  const filteredData = useMemo(() => {
    return weekData.map((dayGroup) => ({
      ...dayGroup,
      shifts: dayGroup.shifts.filter((shift) => {
        if (filters.department !== 'All Departments' && shift.department !== filters.department) {
          return false
        }
        if (filters.shift !== 'All Shifts' && shift.shift !== filters.shift) {
          return false
        }
        return true
      }),
    }))
  }, [weekData, filters])

  const stats = useMemo(() => {
    return calculateStats(filteredData)
  }, [filteredData])

  const handleWeekChange = (direction: 'prev' | 'next') => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7))
      return newDate
    })
  }

  const weekEnd = new Date(currentWeekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const headerDateRange = formatDateRange(currentWeekStart, weekEnd)
  const filterWeekDisplay = `${formatDateShort(currentWeekStart)} - ${formatDateShort(weekEnd)}, ${weekEnd.getFullYear()}`

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Single Header */}
        <header
          style={{
            background: '#fff',
            borderBottom: '1px solid #E5E7EB',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 20,
          }}
        >
          {/* Left: Title */}
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
              Shift Coverage - <span style={{ fontWeight: 400, color: '#6B7280' }}>Weekly View</span>
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
              Manage and view shift coverage across departments
            </p>
          </div>

          {/* Right: Employee + Bell + Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Employee Avatar + Name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 12px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                SR
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                  Stephanie Rhonda
                </div>
              </div>
              <ChevronDown size={14} color="#9CA3AF" />
            </div>

            {/* Notification Bell */}
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 10,
                border: '1px solid #E5E7EB',
                background: '#fff',
                cursor: 'pointer',
                position: 'relative',
                color: '#6B7280',
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#EF4444',
                  border: '2px solid #fff',
                }}
              />
            </button>

            {/* Date Range */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 13,
                color: '#374151',
              }}
            >
              <span>{headerDateRange}</span>
              <ChevronDown size={14} color="#9CA3AF" />
            </div>
          </div>
        </header>

        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <ShiftCoverageStats stats={stats} />
          <ShiftCoverageFilters
            filters={{ ...filters, weekStart: filterWeekDisplay.split(' - ')[0], weekEnd: filterWeekDisplay.split(' - ')[1] }}
            onFiltersChange={setFilters}
            onWeekChange={handleWeekChange}
            data={filteredData}
          />
          <ShiftCoverageTable data={filteredData} dateRange={headerDateRange} />
        </main>
      </div>
    </div>
  )
}
