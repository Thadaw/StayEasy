import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const hours = ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM']
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const heatData = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 1, 1, 1, 0],
  [3, 3, 2, 3, 3, 4, 2],
  [4, 4, 3, 4, 5, 5, 3],
  [2, 2, 2, 2, 3, 3, 1],
]

const getColor = (level: number) => {
  const colors = ['#e8e0f0', '#c4b0e0', '#9b7dd4', '#7c3aed', '#5b21b6', '#4c1d95']
  return colors[level] || colors[0]
}

export default function BusyHoursHeatmap() {
  const [period] = useState('This Week')

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Busy Hours</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--foreground)' }}>
          {period}
          <ChevronDown size={14} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingTop: 4 }}>
          {hours.map((h) => (
            <div key={h} style={{ height: 36, display: 'flex', alignItems: 'center', fontSize: 11, color: 'var(--muted-foreground)' }}>
              {h}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 4, marginBottom: 4 }}>
            {days.map((d) => (
              <div key={d} style={{ fontSize: 11, color: 'var(--muted-foreground)', textAlign: 'center' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 4 }}>
            {heatData.flat().map((level, i) => (
              <div
                key={i}
                style={{
                  height: 36,
                  borderRadius: 4,
                  background: getColor(level),
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, justifyContent: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Low Orders</span>
        <div style={{ display: 'flex', gap: 2 }}>
          {[0, 1, 2, 3, 4, 5].map((l) => (
            <div key={l} style={{ width: 16, height: 10, borderRadius: 2, background: getColor(l) }} />
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>High Orders</span>
      </div>
    </div>
  )
}
