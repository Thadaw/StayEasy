import { useState } from 'react'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import {
  BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  ChevronDown, Download, Search, Clock,
  TrendingUp, Users, CheckCircle, FileText,
  Bell, Calendar, Award, Star, Eye
} from 'lucide-react'

const departmentPerformance = [
  { name: 'Manager', pct: 88 },
  { name: 'Front Desk', pct: 94 },
  { name: 'Housekeeping', pct: 90 },
  { name: 'Kitchen', pct: 84 },
  { name: 'Chef/Pastry', pct: 88 },
  { name: 'Maintenance', pct: 82 },
]

const performanceTrend = [
  { date: 'May 12', score: 78 },
  { date: 'May 19', score: 82 },
  { date: 'May 26', score: 79 },
  { date: 'Jun 02', score: 85 },
  { date: 'Jun 09', score: 83 },
  { date: 'Jun 16', score: 88 },
  { date: 'Jun 23', score: 86 },
  { date: 'Jun 30', score: 91 },
]

const attendanceData = [
  { name: 'Present', value: 72, color: '#10B981' },
  { name: 'Absent', value: 12, color: '#EF4444' },
  { name: 'Late', value: 16, color: '#F59E0B' },
]

const shiftPerformance = [
  { shift: 'Morning', attendance: 92, tasks: 88 },
  { shift: 'Afternoon', attendance: 85, tasks: 80 },
  { shift: 'Night', attendance: 78, tasks: 75 },
]

const topPerformers = [
  { rank: 1, name: 'Sanjay Thapa', role: 'Chef', score: 98, color: '#F59E0B' },
  { rank: 2, name: 'Sunita Sharma', role: 'Receptionist', score: 95, color: '#6B7280' },
  { rank: 3, name: 'Rajan Gupta', role: 'Housekeeping', score: 92, color: '#CD7F32' },
  { rank: 4, name: 'Anita Patil', role: 'Manager', score: 90, color: '#10B981' },
  { rank: 5, name: 'Bikash Rai', role: 'Waiter', score: 88, color: '#3B82F6' },
]

const staffTable = [
  { id: 1, name: 'Sanjay Thapa', dept: 'Front Desk', attendance: '95%', tasks: '92', performance: '96%', status: 'Excellent', statusColor: '#10B981' },
  { id: 2, name: 'Rajan Gupta', dept: 'Front Desk', attendance: '100%', tasks: '92', performance: '95%', status: 'Excellent', statusColor: '#10B981' },
  { id: 3, name: 'Sunita Sharma', dept: 'Housekeeping', attendance: '98%', tasks: '79', performance: '94%', status: 'Excellent', statusColor: '#10B981' },
  { id: 4, name: 'Anita Patil', dept: 'Receptionist', attendance: '90%', tasks: '75', performance: '90%', status: 'Good', statusColor: '#3B82F6' },
  { id: 5, name: 'Bikash Rai', dept: 'Maintenance', attendance: '88%', tasks: '84', performance: '88%', status: 'Good', statusColor: '#3B82F6' },
]

const recentActivity = [
  { text: 'Sanjay Thapa completed shift', time: '11:42', color: '#10B981' },
  { text: 'Rajan Gupta is now on break from... 4:00-4:15', time: '11:30', color: '#F59E0B' },
  { text: 'Anita Patil checked in for Morning...', time: '08:15', color: '#3B82F6' },
]

const notifications = [
  { text: 'Shift schedule updated for Kitchen staff', time: '2h ago' },
  { text: 'Reminder: Staff meeting at 3:00 PM today', time: '3h ago' },
  { text: 'Rajan Gupta shift swap request pending', time: '5h ago' },
]

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  border: '1px solid #E5E7EB',
  padding: 20,
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
  minWidth: 140,
}

export default function StaffPerformancePage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)

  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [shiftFilter, setShiftFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredStaff = staffTable.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (deptFilter && s.dept !== deptFilter) return false
    return true
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          title="Staff Management — Performance Dashboard"
          subtitle="Track team efficiency, task completion, and attendance across all departments"
          hideControls
        />

        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Top Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Property:</span>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select style={{ ...selectStyle, minWidth: 180 }}>
                  <option>StayEasy Pokhara</option>
                  <option>StayEasy Kathmandu</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: '#9CA3AF' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Date:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: 8, padding: '7px 12px', background: '#fff' }}>
                <Calendar size={14} style={{ color: '#9CA3AF' }} />
                <span style={{ fontSize: 13, color: '#374151' }}>Jul 1, 2026 - Jul 31, 2026</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select style={selectStyle} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                  <option value="">Department</option>
                  <option value="Front Office">Front Office</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: '#9CA3AF' }} />
              </div>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select style={selectStyle} value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
                  <option value="">All Shifts</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: '#9CA3AF' }} />
              </div>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select style={selectStyle}>
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                  <option>This Month</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: '#9CA3AF' }} />
              </div>
            </div>
            <button
              style={{
                marginLeft: 'auto',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: 8,
                background: '#fff', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer',
              }}
            >
              <Download size={14} />
              Export
            </button>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { icon: <Users size={20} />, label: 'Total Staff', value: '85', sub: 'All departments', color: '#3B82F6' },
              { icon: <CheckCircle size={20} />, label: 'Active Staff', value: '72', sub: '85% of total staff', color: '#10B981' },
              { icon: <TrendingUp size={20} />, label: 'Avg Performance', value: '91%', sub: '↑ 1.2% from last month', color: '#8B5CF6' },
              { icon: <CheckCircle size={20} />, label: 'Tasks Completed', value: '456', sub: 'This month', color: '#F59E0B' },
              { icon: <Clock size={20} />, label: 'Late Arrivals', value: '5', sub: '↓ 2 from last week', color: '#EF4444' },
              { icon: <FileText size={20} />, label: 'Pending Leave', value: '17', sub: 'Requests', color: '#EC4899' },
            ].map((stat, i) => (
              <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{stat.label}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
            {/* Department Performance */}
            <div style={cardStyle}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Department Performance</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={departmentPerformance} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="pct" fill="#10B981" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Trend */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Performance Trend</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>Last 30 Days</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={performanceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#3B82F6" fill="#3B82F630" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance Overview + Task Completion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ ...cardStyle, flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                  <ResponsiveContainer width={90} height={90}>
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={40}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {attendanceData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#111827' }}>72%</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>Attendance Overview</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {attendanceData.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: '#6B7280' }}>{d.name}: <strong>{d.value}%</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ ...cardStyle, flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', border: '5px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>482</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Task Completion</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>Completed: <strong style={{ color: '#10B981' }}>380 (78%)</strong></span>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>Pending: <strong style={{ color: '#F59E0B' }}>102 (22%)</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Performance Table */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginRight: 'auto' }}>Staff Performance</div>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name..."
                  style={{ padding: '8px 12px 8px 32px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', width: 180 }}
                />
              </div>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select style={{ ...selectStyle, fontSize: 12, padding: '7px 28px 7px 10px', minWidth: 120 }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                  <option value="">Department</option>
                  <option value="Front Office">Front Office</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Restaurant">Restaurant</option>
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 8, pointerEvents: 'none', color: '#9CA3AF' }} />
              </div>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select style={{ ...selectStyle, fontSize: 12, padding: '7px 28px 7px 10px', minWidth: 100 }} value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
                  <option value="">Shift</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 8, pointerEvents: 'none', color: '#9CA3AF' }} />
              </div>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select style={{ ...selectStyle, fontSize: 12, padding: '7px 28px 7px 10px', minWidth: 100 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">Status</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 8, pointerEvents: 'none', color: '#9CA3AF' }} />
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  {['S.No', 'Staff', 'Department', 'Attendance', 'Tasks', 'Performance', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', background: '#F9FAFB' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px', color: '#6B7280' }}>{i + 1}</td>
                    <td style={{ padding: '12px', fontWeight: 500, color: '#111827' }}>{s.name}</td>
                    <td style={{ padding: '12px', color: '#374151' }}>{s.dept}</td>
                    <td style={{ padding: '12px', color: '#374151' }}>{s.attendance}</td>
                    <td style={{ padding: '12px', color: '#374151' }}>{s.tasks}</td>
                    <td style={{ padding: '12px', color: '#374151' }}>{s.performance}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: s.statusColor, background: `${s.statusColor}15` }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button style={{ padding: '4px 8px', border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#374151' }}>
                        <Eye size={13} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 1fr', gap: 16 }}>
            {/* Top Performers */}
            <div style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 14 }}>Top Performers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topPerformers.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < topPerformers.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: p.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {p.rank}
                    </div>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E5E7EB', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.role}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981', flexShrink: 0 }}>{p.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity + Notifications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ ...cardStyle, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Recent Activity</div>
                  <span style={{ fontSize: 11, color: '#3B82F6', cursor: 'pointer' }}>View All</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recentActivity.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: '#374151' }}>{a.text}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...cardStyle, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <Bell size={14} style={{ color: '#3B82F6' }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Daily Notifications</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {notifications.map((n, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 0', borderBottom: i < notifications.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                      <div style={{ fontSize: 12, color: '#374151' }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shift Performance + Employee of Month */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ ...cardStyle, flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Shift Performance</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={shiftPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="shift" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="attendance" fill="#3B82F6" radius={[3, 3, 0, 0]} barSize={16} />
                    <Bar dataKey="tasks" fill="#10B981" radius={[3, 3, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ ...cardStyle, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <Award size={14} style={{ color: '#F59E0B' }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Employee of the Month</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#E5E7EB', margin: '0 auto 10px' }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Anita Sharma</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Receptionist</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={12} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
