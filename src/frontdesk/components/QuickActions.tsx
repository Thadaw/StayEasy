import { CalendarPlus, LogIn, LogOut, BedDouble, ClipboardList } from "lucide-react"

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  iconBg: string
}

interface QuickActionsProps {
  onAction?: (actionId: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "new-booking",
      label: "New Booking",
      icon: <CalendarPlus size={18} />,
      color: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      id: "arrivals",
      label: "Arrivals",
      icon: <LogIn size={18} />,
      color: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
      iconBg: "bg-green-50 text-green-600",
    },
    {
      id: "departures",
      label: "Departures",
      icon: <LogOut size={18} />,
      color: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
      iconBg: "bg-yellow-50 text-yellow-600",
    },
    {
      id: "rooms",
      label: "Rooms",
      icon: <BedDouble size={18} />,
      color: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      id: "activities",
      label: "Activities",
      icon: <ClipboardList size={18} />,
      color: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
      iconBg: "bg-gray-50 text-gray-600",
    },
  ]

  const handleClick = (actionId: string) => {
    if (onAction) {
      onAction(actionId)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-600">⚡</span>
        <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleClick(action.id)}
            className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all hover:shadow-md active:scale-95 ${action.color}`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.iconBg}`}>
              {action.icon}
            </div>
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
