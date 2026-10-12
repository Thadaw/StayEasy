import type { WorkloadEntry } from './demoHousekeeping'

interface StaffWorkloadCardProps {
  workload: WorkloadEntry[]
}

const CHART_HEIGHT = 150

export default function StaffWorkloadCard({ workload }: StaffWorkloadCardProps) {
  const maxTasks = workload.reduce((max, entry) => Math.max(max, entry.tasks), 0)
  const axisMax = Math.max(15, Math.ceil(maxTasks / 5) * 5)
  const ticks = [axisMax, axisMax * (2 / 3), axisMax / 3]
  const gridValues = [...ticks, 0]

  return (
    <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-5">
      <h3 className="m-0 text-[15px] font-bold text-[#111827]">Staff Workload</h3>
      <p className="mt-1 mb-0 text-[11px] text-[#9CA3AF]">Active housekeeping tasks</p>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[260px]">
          <div className="flex gap-2">
            <div className="relative w-5 shrink-0" style={{ height: CHART_HEIGHT }}>
              {ticks.map(tick => (
                <span
                  key={tick}
                  className="absolute right-0 -translate-y-1/2 text-[10px] text-[#9CA3AF]"
                  style={{ top: `${(1 - tick / axisMax) * 100}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>

            <div className="relative flex-1" style={{ height: CHART_HEIGHT }}>
              {gridValues.map(value => (
                <div
                  key={value}
                  className="absolute inset-x-0 border-t border-[#F1F5F9]"
                  style={{ top: `${(1 - value / axisMax) * 100}%` }}
                />
              ))}
              <div className="absolute inset-0 flex items-end justify-around">
                {workload.map(entry => (
                  <div key={entry.name} className="flex h-full flex-col items-center justify-end gap-1">
                    <span className="text-[11px] font-semibold text-[#374151]">{entry.tasks}</span>
                    <div
                      className="w-[26px] rounded-t-[4px] bg-[#2563EB]"
                      style={{ height: `${Math.max((entry.tasks / axisMax) * 100, 2)}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2 flex justify-around pl-7">
            {workload.map(entry => (
              <span key={entry.name} className="text-center text-[11px] text-[#6B7280]">
                {entry.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
