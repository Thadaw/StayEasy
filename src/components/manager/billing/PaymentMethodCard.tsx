import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PAYMENT_METHODS } from './demoBilling'

export default function PaymentMethodCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111827' }}>
        Payment Method Distribution
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(value, name) => [`${value}%`, String(name)]}
              />
              <Pie
                data={PAYMENT_METHODS}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={1}
                stroke="none"
                label={false}
              >
                {PAYMENT_METHODS.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>100</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>Total</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, flex: 1, minWidth: 0 }}>
          {PAYMENT_METHODS.map((method) => (
            <div key={method.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{ width: 9, height: 9, borderRadius: 2, background: method.color, flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: '#374151', flex: 1, minWidth: 0 }}>{method.name}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{method.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
