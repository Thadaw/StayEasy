import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Jun 1', thisMonth: 45000, lastMonth: 38000, thisWeek: 12000 },
  { day: 'Jun 6', thisMonth: 82000, lastMonth: 71000, thisWeek: 18000 },
  { day: 'Jun 11', thisMonth: 125000, lastMonth: 95000, thisWeek: 22000 },
  { day: 'Jun 16', thisMonth: 98000, lastMonth: 110000, thisWeek: 19000 },
  { day: 'Jun 21', thisMonth: 155000, lastMonth: 120000, thisWeek: 25000 },
  { day: 'Jun 26', thisMonth: 110000, lastMonth: 90000, thisWeek: 21000 },
  { day: 'Jun 30', thisMonth: 180000, lastMonth: 140000, thisWeek: 28000 },
]

type TabType = 'thisWeek' | 'lastMonth' | 'thisMonth'

export default function RevenueChart() {
  const [activeTab, setActiveTab] = useState<TabType>('thisMonth')

  const tabs: { key: TabType; label: string }[] = [
    { key: 'thisWeek', label: 'This Week' },
    { key: 'lastMonth', label: 'Last Month' },
    { key: 'thisMonth', label: 'This Month' },
  ]

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#111827' }}>Revenue Overview</h3>
        <div style={{ display: 'flex', gap: 8, background: '#f3f4f6', borderRadius: 8, padding: 4 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                background: activeTab === tab.key ? '#fff' : 'transparent',
                color: activeTab === tab.key ? '#111827' : '#6b7280',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: activeTab === tab.key ? 600 : 400,
                boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
          <span style={{ width: 12, height: 3, borderRadius: 2, background: '#2563eb', display: 'inline-block' }} />
          This Month
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
          <span style={{ width: 12, height: 0, borderBottom: '2px dashed #d1d5db', display: 'inline-block' }} />
          Last Month
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#e5e7eb" />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#e5e7eb" tickFormatter={(v) => `${v/1000}K`} />
          <Tooltip
            formatter={(value: string | number | readonly (string | number)[] | undefined) => `NPR ${Number(value ?? 0).toLocaleString()}`}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
          <Line
            type="monotone"
            dataKey={activeTab}
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="lastMonth"
            stroke="#d1d5db"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
