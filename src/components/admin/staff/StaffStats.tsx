interface StaffStatsProps {
  stats: {
    total: number
    active: number
    onLeave: number
    inactive: number
    departments: number
  }
}

export default function StaffStats({ stats }: StaffStatsProps) {
  const items = [
    { label: 'Total Staff', value: stats.total },
    { label: 'Active', value: stats.active },
    { label: 'On Leave', value: stats.onLeave },
    { label: 'Inactive', value: stats.inactive },
    { label: 'Departments', value: stats.departments },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 16 }}>
      {items.map((item) => (
        <div key={item.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{item.value}</div>
        </div>
      ))}
    </div>
  )
}
