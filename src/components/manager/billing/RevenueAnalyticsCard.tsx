import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { MONTHLY_REVENUE, REVENUE_COMPARISON } from './demoBilling'

const tooltipStyle: React.CSSProperties = {
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontSize: 12,
}

const axisTick = { fontSize: 11, fill: '#9ca3af' }

const panelTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 600,
  color: '#111827',
}

const panelCaption: React.CSSProperties = {
  margin: '3px 0 0',
  fontSize: 11,
  color: '#9ca3af',
}

export default function RevenueAnalyticsCard() {
  const [period, setPeriod] = useState('Last 12 Months')
  const monthlyRevenue =
    period === 'Last 6 Months'
      ? MONTHLY_REVENUE.slice(-6)
      : period === 'Last 30 Days'
        ? MONTHLY_REVENUE.slice(-1)
        : MONTHLY_REVENUE

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Revenue Analytics</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            padding: '7px 10px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 12,
            color: '#374151',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option>Last 12 Months</option>
          <option>Last 6 Months</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      <div className="b-analytics">
        {/* Monthly Revenue — line */}
        <div className="b-analytics-panel">
          <div style={{ marginBottom: 12 }}>
            <h4 style={panelTitle}>Monthly Revenue</h4>
            <p style={panelCaption}>NPR (in K)</p>
          </div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 1000]}
                  ticks={[0, 250, 500, 750, 1000]}
                  tickFormatter={(v: number) => `${v}K`}
                  width={52}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`NPR ${value}K`, 'Revenue']} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1f2937"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#1f2937', strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Comparison — grouped bars */}
        <div className="b-analytics-panel">
          <div style={{ marginBottom: 12 }}>
            <h4 style={panelTitle}>Revenue Comparison</h4>
            <p style={panelCaption}>NPR (in K)</p>
          </div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={REVENUE_COMPARISON}
                margin={{ top: 8, right: 8, left: -14, bottom: 0 }}
                barGap={2}
                barCategoryGap="28%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 600]}
                  ticks={[0, 150, 300, 450, 600]}
                  tickFormatter={(v: number) => `${v}K`}
                  width={52}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  formatter={(value, name) => [
                    `NPR ${value}K`,
                    name === 'thisYear' ? 'This Year Revenue' : 'Last Year Revenue',
                  ]}
                />
                <Bar dataKey="thisYear" fill="#1f2937" radius={[3, 3, 0, 0]} maxBarSize={11} isAnimationActive={false} />
                <Bar dataKey="lastYear" fill="#d1d5db" radius={[3, 3, 0, 0]} maxBarSize={11} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6b7280' }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: '#1f2937' }} />
              This Year Revenue
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6b7280' }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: '#d1d5db' }} />
              Last Year Revenue
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
