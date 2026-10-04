import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  sparkline?: ReactNode
}

export function StatCard({ title, value, subtitle, icon, trend, sparkline }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
          {icon}
        </div>
        <span className="text-[11px] text-gray-500 font-medium">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{value}</h3>
          {subtitle && (
            <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {trend && (
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            trend.isPositive 
              ? "bg-green-50 text-green-600" 
              : "bg-red-50 text-red-600"
          }`}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {sparkline && (
        <div className="mt-2 h-6">{sparkline}</div>
      )}
    </div>
  )
}
