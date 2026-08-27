import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react'
import type { ShiftCoverageFilters, DayShiftGroup } from '../../types/shiftCoverage'
import { mockShifts, mockDepartments } from '../../data/mockShiftCoverage'

interface FilterBarProps {
  filters: ShiftCoverageFilters
  onFiltersChange: (filters: ShiftCoverageFilters) => void
  onWeekChange: (direction: 'prev' | 'next') => void
  data: DayShiftGroup[]
}

export default function FilterBar({ filters, onFiltersChange, onWeekChange, data }: FilterBarProps) {
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const [showShiftDropdown, setShowShiftDropdown] = useState(false)
  const departmentDropdownRef = useRef<HTMLDivElement>(null)
  const shiftDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (departmentDropdownRef.current && !departmentDropdownRef.current.contains(e.target as Node)) {
        setShowDepartmentDropdown(false)
      }
      if (shiftDropdownRef.current && !shiftDropdownRef.current.contains(e.target as Node)) {
        setShowShiftDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDepartmentChange = (department: string) => {
    onFiltersChange({ ...filters, department })
    setShowDepartmentDropdown(false)
  }

  const handleShiftChange = (shift: string) => {
    onFiltersChange({ ...filters, shift })
    setShowShiftDropdown(false)
  }

  const handleExport = () => {
    const headers = ['Date', 'Department', 'Shift', 'Time', 'Required', 'Assigned', 'Coverage', 'Status', 'Missing']
    const rows: string[][] = []

    data.forEach((dayGroup) => {
      dayGroup.shifts.forEach((shift) => {
        rows.push([
          dayGroup.day,
          shift.department,
          shift.shift,
          shift.time,
          shift.required.toString(),
          shift.assigned.toString(),
          `${shift.coverage}%`,
          shift.status,
          shift.missing !== null ? shift.missing.toString() : '-',
        ])
      })
    })

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `shift-coverage-${filters.weekStart}-${filters.weekEnd}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 20,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}
    >
      {/* Department Dropdown */}
      <div ref={departmentDropdownRef} style={{ position: 'relative', minWidth: 160 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 6 }}>
          DEPARTMENT
        </label>
        <button
          onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            width: '100%',
            padding: '10px 12px',
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            color: '#374151',
            fontWeight: 500,
          }}
        >
          <span>{filters.department || 'All Departments'}</span>
          <ChevronDown size={14} color="#9CA3AF" />
        </button>
        {showDepartmentDropdown && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 4,
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: 180,
              zIndex: 50,
            }}
          >
            {mockDepartments.map((dept) => (
              <div
                key={dept}
                onClick={() => handleDepartmentChange(dept)}
                style={{
                  padding: '10px 12px',
                  fontSize: 13,
                  color: filters.department === dept ? '#2563EB' : '#374151',
                  fontWeight: filters.department === dept ? 600 : 400,
                  background: filters.department === dept ? '#EFF6FF' : 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (filters.department !== dept) e.currentTarget.style.background = '#F9FAFB'
                }}
                onMouseLeave={(e) => {
                  if (filters.department !== dept) e.currentTarget.style.background = 'transparent'
                }}
              >
                {dept}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Week Date Range */}
      <div style={{ minWidth: 220 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 6 }}>
          WEEK
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '10px 12px',
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
          }}
        >
          <button
            onClick={() => onWeekChange('prev')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#6B7280',
              borderRadius: 4,
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <Calendar size={14} color="#6B7280" style={{ marginLeft: 4 }} />
          <span style={{ fontSize: 13, color: '#374151', fontWeight: 500, padding: '0 4px' }}>
            {filters.weekStart} - {filters.weekEnd}
          </span>
          <button
            onClick={() => onWeekChange('next')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#6B7280',
              borderRadius: 4,
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Shift Dropdown */}
      <div ref={shiftDropdownRef} style={{ position: 'relative', minWidth: 140 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 6 }}>
          SHIFT
        </label>
        <button
          onClick={() => setShowShiftDropdown(!showShiftDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            width: '100%',
            padding: '10px 12px',
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            color: '#374151',
            fontWeight: 500,
          }}
        >
          <span>{filters.shift || 'All Shifts'}</span>
          <ChevronDown size={14} color="#9CA3AF" />
        </button>
        {showShiftDropdown && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 4,
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: 150,
              zIndex: 50,
            }}
          >
            {mockShifts.map((shift) => (
              <div
                key={shift}
                onClick={() => handleShiftChange(shift)}
                style={{
                  padding: '10px 12px',
                  fontSize: 13,
                  color: filters.shift === shift ? '#2563EB' : '#374151',
                  fontWeight: filters.shift === shift ? 600 : 400,
                  background: filters.shift === shift ? '#EFF6FF' : 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (filters.shift !== shift) e.currentTarget.style.background = '#F9FAFB'
                }}
                onMouseLeave={(e) => {
                  if (filters.shift !== shift) e.currentTarget.style.background = 'transparent'
                }}
              >
                {shift}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 20px',
          background: '#2563EB',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        <Download size={16} />
        Export
      </button>
    </div>
  )
}
