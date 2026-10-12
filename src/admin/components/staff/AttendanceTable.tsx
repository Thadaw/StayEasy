import { useState, useMemo } from 'react'
import { ChevronDown, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import RequestsPanel from './RequestsPanel'

interface AttendanceRecord {
  id: number
  name: string
  staffId: string
  department: string
  shift: string
  checkIn: string | null
  checkOut: string | null
  hours: string | null
  status: 'Shift Ended' | 'Late' | 'Absent' | 'On Duty'
  avatarColor: string
  initials: string
}

const allAttendanceData: AttendanceRecord[] = [
  {
    id: 1,
    name: 'Emma Johnson',
    staffId: 'EMP-1001',
    department: 'Housekeeping',
    shift: 'Night',
    checkIn: '10:02 PM',
    checkOut: '06:01 AM',
    hours: '7h 59m',
    status: 'Shift Ended',
    avatarColor: '#3B82F6',
    initials: 'EJ',
  },
  {
    id: 2,
    name: 'Liam Smith',
    staffId: 'EMP-1002',
    department: 'Front Desk',
    shift: 'Morning',
    checkIn: '06:18 AM',
    checkOut: null,
    hours: null,
    status: 'Late',
    avatarColor: '#10B981',
    initials: 'LS',
  },
  {
    id: 3,
    name: 'Olivia Brown',
    staffId: 'EMP-1003',
    department: 'Kitchen Staff',
    shift: 'Night',
    checkIn: null,
    checkOut: null,
    hours: null,
    status: 'Absent',
    avatarColor: '#8B5CF6',
    initials: 'OB',
  },
  {
    id: 4,
    name: 'Sita Gurung',
    staffId: 'EMP-1004',
    department: 'Kitchen Staff',
    shift: 'Night',
    checkIn: '10:00 PM',
    checkOut: '06:00 AM',
    hours: '8h',
    status: 'Shift Ended',
    avatarColor: '#F59E0B',
    initials: 'SG',
  },
  {
    id: 5,
    name: 'Ram Thapa',
    staffId: 'EMP-1005',
    department: 'Housekeeping',
    shift: 'Morning',
    checkIn: '6:00 AM',
    checkOut: null,
    hours: null,
    status: 'On Duty',
    avatarColor: '#EF4444',
    initials: 'RT',
  },
  {
    id: 6,
    name: 'Maya Rai',
    staffId: 'EMP-1006',
    department: 'Housekeeping',
    shift: 'Morning',
    checkIn: '06:00 AM',
    checkOut: '02:00 PM',
    hours: '8h',
    status: 'Shift Ended',
    avatarColor: '#8B5CF6',
    initials: 'MR',
  },
  {
    id: 7,
    name: 'James Chen',
    staffId: 'EMP-1007',
    department: 'Front Desk',
    shift: 'Morning',
    checkIn: '06:05 AM',
    checkOut: '02:00 PM',
    hours: '7h 55m',
    status: 'Shift Ended',
    avatarColor: '#10B981',
    initials: 'JC',
  },
  {
    id: 8,
    name: 'Noah Williams',
    staffId: 'EMP-1008',
    department: 'Restaurant',
    shift: 'Morning',
    checkIn: '06:10 AM',
    checkOut: '02:05 PM',
    hours: '7h 55m',
    status: 'Shift Ended',
    avatarColor: '#F59E0B',
    initials: 'NW',
  },
  {
    id: 9,
    name: 'Elena V.',
    staffId: 'EMP-1009',
    department: 'Housekeeping',
    shift: 'Morning',
    checkIn: '06:00 AM',
    checkOut: null,
    hours: null,
    status: 'On Duty',
    avatarColor: '#8B5CF6',
    initials: 'EV',
  },
  {
    id: 10,
    name: 'Mark O.',
    staffId: 'EMP-1010',
    department: 'Housekeeping',
    shift: 'Morning',
    checkIn: null,
    checkOut: null,
    hours: null,
    status: 'Absent',
    avatarColor: '#10B981',
    initials: 'MO',
  },
  {
    id: 11,
    name: 'Priya Sharma',
    staffId: 'EMP-1011',
    department: 'Kitchen Staff',
    shift: 'Morning',
    checkIn: '06:02 AM',
    checkOut: '02:00 PM',
    hours: '7h 58m',
    status: 'Shift Ended',
    avatarColor: '#EF4444',
    initials: 'PS',
  },
  {
    id: 12,
    name: 'Hari P.',
    staffId: 'EMP-1012',
    department: 'Front Desk',
    shift: 'Morning',
    checkIn: '06:30 AM',
    checkOut: null,
    hours: null,
    status: 'Late',
    avatarColor: '#F59E0B',
    initials: 'HP',
  },
  {
    id: 13,
    name: 'Aswin Pandit',
    staffId: 'EMP-1013',
    department: 'Front Desk',
    shift: 'Morning',
    checkIn: null,
    checkOut: null,
    hours: null,
    status: 'Absent',
    avatarColor: '#3B82F6',
    initials: 'AP',
  },
  {
    id: 14,
    name: 'John Doe',
    staffId: 'EMP-1014',
    department: 'Housekeeping',
    shift: 'Morning',
    checkIn: '06:00 AM',
    checkOut: '02:00 PM',
    hours: '8h',
    status: 'Shift Ended',
    avatarColor: '#F59E0B',
    initials: 'JD',
  },
  {
    id: 15,
    name: 'Sarah Kim',
    staffId: 'EMP-1015',
    department: 'Restaurant',
    shift: 'Morning',
    checkIn: '06:08 AM',
    checkOut: '02:02 PM',
    hours: '7h 54m',
    status: 'Shift Ended',
    avatarColor: '#8B5CF6',
    initials: 'SK',
  },
  {
    id: 16,
    name: 'Alex Turner',
    staffId: 'EMP-1016',
    department: 'Restaurant',
    shift: 'Morning',
    checkIn: '06:15 AM',
    checkOut: null,
    hours: null,
    status: 'Late',
    avatarColor: '#10B981',
    initials: 'AT',
  },
  {
    id: 17,
    name: 'Lisa Wang',
    staffId: 'EMP-1017',
    department: 'Kitchen Staff',
    shift: 'Morning',
    checkIn: '06:00 AM',
    checkOut: '02:00 PM',
    hours: '8h',
    status: 'Shift Ended',
    avatarColor: '#EF4444',
    initials: 'LW',
  },
  {
    id: 18,
    name: 'Mike Chen',
    staffId: 'EMP-1018',
    department: 'Housekeeping',
    shift: 'Morning',
    checkIn: '06:03 AM',
    checkOut: null,
    hours: null,
    status: 'On Duty',
    avatarColor: '#3B82F6',
    initials: 'MC',
  },
]

const statusStyles: Record<string, { bg: string; text: string }> = {
  'Shift Ended': { bg: '#D1FAE5', text: '#065F46' },
  Late: { bg: '#FEF3C7', text: '#92400E' },
  Absent: { bg: '#FEE2E2', text: '#991B1B' },
  'On Duty': { bg: '#DBEAFE', text: '#1E40AF' },
}

const selectStyle: React.CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '8px 32px 8px 12px',
  fontSize: 13,
  color: '#374151',
  fontWeight: 500,
  cursor: 'pointer',
  outline: 'none',
  backgroundImage: 'none',
}

const PAGE_SIZE = 5

interface AttendanceTableProps {
  activeTab: 'daily' | 'requests'
  onTabChange: (tab: 'daily' | 'requests') => void
}

export default function AttendanceTable({ activeTab, onTabChange }: AttendanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filterDepartment, setFilterDepartment] = useState('All Departments')
  const [filterStatus, setFilterStatus] = useState('All Status')
  const [filterStaff, setFilterStaff] = useState('All Staffs')

  const filteredData = useMemo(() => {
    return allAttendanceData.filter((row) => {
      if (filterDepartment !== 'All Departments' && row.department !== filterDepartment) return false
      if (filterStatus !== 'All Status' && row.status !== filterStatus) return false
      if (filterStaff !== 'All Staffs' && row.name !== filterStaff) return false
      return true
    })
  }, [filterDepartment, filterStatus, filterStaff])

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE)
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleExport = () => {
    const headers = ['Staff Name', 'Staff ID', 'Department', 'Shift', 'Check In', 'Check Out', 'Hours', 'Status']
    const rows = filteredData.map((row) => [
      row.name,
      row.staffId,
      row.department,
      row.shift,
      row.checkIn || '-',
      row.checkOut || '-',
      row.hours || '-',
      row.status,
    ])
    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `attendance-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', padding: '0 20px' }}>
        {[
          { key: 'daily' as const, label: 'Daily Attendance' },
          { key: 'requests' as const, label: 'Requests' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              padding: '14px 16px',
              border: 'none',
              background: 'none',
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 600 : 500,
              color: activeTab === tab.key ? '#2563EB' : '#6B7280',
              cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid #2563EB' : '2px solid transparent',
              marginBottom: -1,
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'requests' ? (
        <RequestsPanel onClose={() => onTabChange('daily')} />
      ) : (
        <>
          {/* Filters */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 20px',
              borderBottom: '1px solid #F3F4F6',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: 8, padding: '7px 12px', background: '#fff' }}>
              <span style={{ fontSize: 13, color: '#374151' }}>May 30, 2024</span>
              <ChevronDown size={14} color="#9CA3AF" />
            </div>

            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                style={selectStyle}
                value={filterDepartment}
                onChange={(e) => { setFilterDepartment(e.target.value); setCurrentPage(1) }}
              >
                <option>All Departments</option>
                <option>Housekeeping</option>
                <option>Front Desk</option>
                <option>Kitchen Staff</option>
                <option>Restaurant</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: '#9CA3AF' }} />
            </div>

            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                style={selectStyle}
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}
              >
                <option>All Status</option>
                <option>Shift Ended</option>
                <option>Late</option>
                <option>Absent</option>
                <option>On Duty</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: '#9CA3AF' }} />
            </div>

            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                style={selectStyle}
                value={filterStaff}
                onChange={(e) => { setFilterStaff(e.target.value); setCurrentPage(1) }}
              >
                <option>All Staffs</option>
                {[...new Set(allAttendanceData.map((r) => r.name))].sort().map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: '#9CA3AF' }} />
            </div>

            <button
              onClick={handleExport}
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                background: '#fff',
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              Export
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  {['STAFF NAME', 'STAFF ID', 'DEPARTMENT', 'SHIFT', 'CHECK IN', 'CHECK OUT', 'HOURS', 'STATUS'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#9CA3AF',
                          background: '#F9FAFB',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                      No records match the current filters.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => (
                    <tr
                      key={row.id}
                      style={{ borderBottom: '1px solid #F3F4F6' }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: row.avatarColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {row.initials}
                          </div>
                          <span style={{ fontWeight: 500, color: '#111827' }}>{row.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6B7280' }}>{row.staffId}</td>
                      <td style={{ padding: '14px 16px', color: '#374151' }}>{row.department}</td>
                      <td style={{ padding: '14px 16px', color: '#374151' }}>{row.shift}</td>
                      <td style={{ padding: '14px 16px', color: '#374151', fontWeight: 500 }}>
                        {row.checkIn || '-'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#374151', fontWeight: 500 }}>
                        {row.checkOut || '-'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#374151' }}>{row.hours || '-'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            background: statusStyles[row.status]?.bg,
                            color: statusStyles[row.status]?.text,
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderTop: '1px solid #F3F4F6',
            }}
          >
            <span style={{ fontSize: 13, color: '#6B7280' }}>
              Showing {paginatedData.length} of {filteredData.length} Staffs
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: '1px solid #E5E7EB',
                  background: '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? '#D1D5DB' : '#6B7280',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Page {currentPage} of {totalPages || 1}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: '1px solid #E5E7EB',
                  background: '#fff',
                  cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer',
                  color: currentPage === totalPages || totalPages === 0 ? '#D1D5DB' : '#6B7280',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
