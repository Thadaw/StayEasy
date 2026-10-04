import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { ChannelData } from '../../types/reports'

interface TopPerformingChannelsProps {
  data: ChannelData[]
  totalRevenue: number
}

export default function TopPerformingChannels({ data, totalRevenue }: TopPerformingChannelsProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E2E8F0',
        padding: '20px',
        flex: '1 1 0',
        minWidth: 0,
      }}
    >
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>Top Performing Channels</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: 180, height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="percentage"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
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
            <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
              ${totalRevenue.toLocaleString()}
            </p>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Total</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          {data.map(item => (
            <div key={item.channel} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#334155', flex: 1 }}>{item.channel}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
