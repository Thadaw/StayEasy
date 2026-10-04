interface OccupancyData {
  occupied: number
  available: number
  cleaning: number
  maintenance: number
}

interface OccupancyChartProps {
  data: OccupancyData
  totalRooms: number
  occupancyRate: number
  vsLastWeek?: number
}

export function OccupancyChart({ 
  data, 
  totalRooms, 
  occupancyRate, 
  vsLastWeek = 6 
}: OccupancyChartProps) {
  const total = data.occupied + data.available + data.cleaning + data.maintenance
  
  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1)
  
  const segments = [
    { label: "Occupied", value: data.occupied, color: "var(--chart-1, #3b82f6)", percentage: getPercentage(data.occupied) },
    { label: "Available", value: data.available, color: "#22c55e", percentage: getPercentage(data.available) },
    { label: "Cleaning", value: data.cleaning, color: "#f97316", percentage: getPercentage(data.cleaning) },
    { label: "Maintenance", value: data.maintenance, color: "#ef4444", percentage: getPercentage(data.maintenance) },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Occupancy Overview</h3>
          <p className="text-xs text-gray-500">Real-time room occupancy & status</p>
        </div>
        <select className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle
              cx="65"
              cy="65"
              r="50"
              fill="none"
              stroke="var(--chart-track, #e5e7eb)"
              strokeWidth="18"
            />
            {segments.reduce((acc, segment, index) => {
              const circumference = 2 * Math.PI * 50
              const offset = acc.offset
              const dashArray = (parseFloat(segment.percentage) / 100) * circumference
              
              return {
                offset: offset + dashArray,
                elements: [
                  ...acc.elements,
                  <circle
                    key={segment.label}
                    cx="65"
                    cy="65"
                    r="50"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="18"
                    strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="round"
                    transform="rotate(-90 65 65)"
                  />
                ]
              }
            }, { offset: 0, elements: [] as JSX.Element[] }).elements}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{occupancyRate}%</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Occupied</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-xs text-gray-600">{segment.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-900">{segment.value}</span>
                <span className="text-[10px] text-gray-500">{segment.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">{data.occupied}</span> of {totalRooms} rooms booked
        </p>
        <p className="text-[10px] text-green-600 mt-0.5">
          ↑ {vsLastWeek}% vs last week
        </p>
      </div>
    </div>
  )
}
