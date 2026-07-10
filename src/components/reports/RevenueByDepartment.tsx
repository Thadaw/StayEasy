import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { DepartmentRevenue } from '../../types/reports'

interface RevenueByDepartmentProps {
  data: DepartmentRevenue[]
  total: number
}

export default function RevenueByDepartment({ data, total }: RevenueByDepartmentProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: '20px',
        flex: '1 1 0',
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Revenue by Department</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="percentage"
              >
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>NPR</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '2px 0' }}>{total.toLocaleString()}</p>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>Total</p>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map(item => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                <span style={{ fontSize: 13, color: '#374151' }}>{item.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{item.percentage}%</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', minWidth: 80, textAlign: 'right' }}>
                  NPR {item.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
