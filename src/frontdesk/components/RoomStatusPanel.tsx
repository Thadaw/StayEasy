import { useState } from "react"
import { ArrowLeft, Search, Home, ChevronDown } from "lucide-react"

interface Room {
  number: string
  status: "available" | "occupied" | "reserved" | "dirty" | "maintenance"
}

interface Floor {
  label: string
  rooms: Room[]
}

interface RoomStatusPanelProps {
  onClose: () => void
}

const floorsData: Floor[] = [
  {
    label: "FLOOR 1",
    rooms: [
      { number: "101", status: "available" },
      { number: "102", status: "occupied" },
      { number: "103", status: "available" },
      { number: "104", status: "dirty" },
      { number: "105", status: "reserved" },
      { number: "106", status: "available" },
      { number: "107", status: "maintenance" },
      { number: "108", status: "available" },
    ],
  },
  {
    label: "FLOOR 2",
    rooms: [
      { number: "201", status: "available" },
      { number: "202", status: "dirty" },
      { number: "203", status: "occupied" },
      { number: "204", status: "available" },
    ],
  },
]

const statusStyles: Record<string, { bg: string; border: string; text: string; label: string }> = {
  available: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", label: "Available" },
  occupied: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", label: "Occupied" },
  reserved: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", label: "Reserved" },
  dirty: { bg: "bg-red-50", border: "border-red-300", text: "text-red-600", label: "Dirty" },
  maintenance: { bg: "bg-gray-50", border: "border-gray-300", text: "text-gray-500", label: "Maintenance" },
}

const legend = [
  { status: "available", color: "bg-green-500", label: "AVAILABLE" },
  { status: "occupied", color: "bg-yellow-500", label: "OCCUPIED" },
  { status: "reserved", color: "bg-blue-500", label: "RESERVED" },
  { status: "dirty", color: "bg-red-500", label: "DIRTY" },
  { status: "maintenance", color: "bg-gray-400", label: "MAINTENANCE" },
]

export function RoomStatusPanel({ onClose }: RoomStatusPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [floorFilter, setFloorFilter] = useState("All Floors")

  const filtered = floorsData
    .filter((f) => floorFilter === "All Floors" || f.label === floorFilter)
    .map((f) => ({
      ...f,
      rooms: f.rooms.filter(
        (r) =>
          r.number.includes(searchQuery) ||
          r.status.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((f) => f.rooms.length > 0)

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <Home size={20} className="text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Room Status</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All Floors">All Floors</option>
              {floorsData.map((f) => (
                <option key={f.label} value={f.label}>
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-6 mb-6">
          {legend.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {filtered.map((floor) => (
            <div key={floor.label}>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                {floor.label}
              </h3>
              <div className="flex flex-wrap gap-4">
                {floor.rooms.map((room) => {
                  const style = statusStyles[room.status]
                  return (
                    <div
                      key={room.number}
                      className={`w-28 h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer hover:shadow-md transition-shadow ${style.bg} ${style.border}`}
                    >
                      <span className={`text-2xl font-bold ${style.text}`}>
                        {room.number}
                      </span>
                      <span className={`text-xs font-medium ${style.text}`}>
                        {style.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
