interface RevenueData {
  day: string
  revenue: number
  target?: number
}

interface RevenueChartProps {
  data: RevenueData[]
  currentRevenue: number
  lastWeekRevenue: number
  growth: number
}

export function RevenueChart({ 
  data, 
  currentRevenue, 
  lastWeekRevenue, 
  growth 
}: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue))
  const chartHeight = 100

  const getYPosition = (value: number) => {
    return chartHeight - (value / maxRevenue) * chartHeight
  }

  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = getYPosition(point.revenue)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const areaPath = `${pathData} L 100 ${chartHeight} L 0 ${chartHeight} Z`

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Revenue Overview</h3>
          <p className="text-xs text-gray-500">Daily income vs. booking forecast</p>
        </div>
        <select className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-2xl font-bold text-gray-900">${currentRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total gross revenue this week</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Today's Revenue</p>
          <p className="text-lg font-bold text-gray-900">${currentRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-green-600">↑ {growth}%</span>
      </div>

      <div className="relative">
        <svg 
          viewBox={`0 0 100 ${chartHeight}`} 
          className="w-full h-24"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <path
            d={areaPath}
            fill="url(#areaGradient)"
          />
          
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {data.map((point, index) => (
            <circle
              key={point.day}
              cx={(index / (data.length - 1)) * 100}
              cy={getYPosition(point.revenue)}
              r="3"
              fill="#3b82f6"
              className="opacity-0 hover:opacity-100 transition-opacity"
            />
          ))}
        </svg>
      </div>

      <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 px-2">
        {data.map((point) => (
          <span key={point.day}>{point.day}</span>
        ))}
      </div>
    </div>
  )
}
