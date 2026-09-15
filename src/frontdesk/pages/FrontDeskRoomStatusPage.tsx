import { useState, useMemo, Fragment } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { FrontDeskSidebar } from "../components/FrontDeskSidebar"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"

interface Room {
  id: string
  room_name: string
  room_type_id?: string
  floor_number?: number
  status: string
  base_rate?: string
  max_adults?: number
  max_children?: number
}

interface RoomDayStatus {
  status: "available" | "occupied" | "reserved" | "turn" | "maintenance" | "blocked" | "checkout"
  guest_name?: string
  booking_type?: string
  is_vip?: boolean
  notes?: string
}

type ViewMode = "day" | "7days" | "14days" | "month"

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  available: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  occupied: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  reserved: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  turn: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
  maintenance: { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
  blocked: { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
  checkout: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
}

function formatDateLabel(date: Date, isToday: boolean, isTomorrow: boolean): string {
  if (isToday) return "TODAY"
  if (isTomorrow) return "TOMORROW"
  const day = date.getDay()
  if (day === 0 || day === 6) return "WEEKEND"
  return "WEEKDAY"
}

function formatDayHeader(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
}

function getDateKey(date: Date): string {
  return date.toISOString().split("T")[0]
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

interface FloorData {
  label: string
  floorNumber: number
  rooms: Room[]
}

function mapApiStatus(status: string): RoomDayStatus["status"] {
  const s = status?.toUpperCase() || ""
  if (s.includes("OCCUPIED")) return "occupied"
  if (s.includes("BOOKED") || s.includes("RESERVED")) return "reserved"
  if (s.includes("CLEANING") || s.includes("DIRTY")) return "turn"
  if (s.includes("MAINTENANCE")) return "maintenance"
  if (s.includes("BLOCKED") || s.includes("OUT_OF_SERVICE") || s.includes("OUT OF SERVICE")) return "blocked"
  return "available"
}

export default function FrontDeskRoomStatusPage() {
  const { currentPropertyId } = usePropertyStore()
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [viewMode, setViewMode] = useState<ViewMode>("7days")
  const [floorFilter, setFloorFilter] = useState("All Floors")

  const { data: rooms = [] } = useQuery({
    queryKey: ["room-status-rooms", currentPropertyId],
    queryFn: async (): Promise<Room[]> => {
      if (!currentPropertyId) return []
      try {
        let allRooms: Room[] = []
        let skip = 0
        let hasMore = true

        while (hasMore) {
          const params: Record<string, string> = { limit: "50", skip: String(skip) }
          const { data: result } = await api.get(
            `/properties/${currentPropertyId}/rooms`,
            { params }
          )
          const wrapped = result as {
            data?: Room[]
            meta?: { has_more?: boolean }
            has_more?: boolean
          }
          const apiData = (wrapped?.data ?? result) as Room[]
          allRooms = [...allRooms, ...apiData]
          hasMore = wrapped?.meta?.has_more ?? wrapped?.has_more ?? false
          skip += 50
        }

        return allRooms
      } catch {
        return []
      }
    },
    enabled: !!currentPropertyId,
  })

  const floors = useMemo<FloorData[]>(() => {
    const floorMap = new Map<number, Room[]>()
    rooms.forEach((room) => {
      const fn = room.floor_number ?? 0
      if (!floorMap.has(fn)) floorMap.set(fn, [])
      floorMap.get(fn)!.push(room)
    })
    return Array.from(floorMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([floorNumber, floorRooms]) => ({
        label: `FLOOR ${floorNumber}`,
        floorNumber,
        rooms: floorRooms.sort((a, b) => a.room_name.localeCompare(b.room_name)),
      }))
  }, [rooms])

  const roomStatuses = useMemo(() => {
    const statuses: Record<string, Record<string, RoomDayStatus>> = {}
    const todayKey = getDateKey(new Date())

    rooms.forEach((room) => {
      const roomName = room.room_name
      if (!roomName) return

      if (!statuses[roomName]) {
        statuses[roomName] = {}
      }

      statuses[roomName][todayKey] = {
        status: mapApiStatus(room.status),
      }
    })

    return statuses
  }, [rooms])

  const daysCount = viewMode === "day" ? 1 : viewMode === "7days" ? 7 : viewMode === "14days" ? 14 : 30

  const dates = useMemo(() => {
    return Array.from({ length: daysCount }, (_, i) => addDays(startDate, i))
  }, [startDate, daysCount])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = addDays(today, 1)

  const filteredFloors = floors.filter(
    (f) => floorFilter === "All Floors" || f.label === floorFilter
  )

  const navigateWeek = (direction: number) => {
    setStartDate((prev) => addDays(prev, direction * 7))
  }

  const goToToday = () => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    setStartDate(d)
  }

  const dateRangeLabel = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${addDays(startDate, daysCount - 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Room Status</h1>
              <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                Live Grid
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {daysCount}-night view, starting today · tap a cell to open room details or assign guests
            </p>
          </div>

          {/* Top Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Date Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateWeek(-1)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Today · {dateRangeLabel}
                </button>
                <button
                  onClick={() => navigateWeek(1)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </div>

              {/* Floor Filter */}
              <div className="relative">
                <select
                  value={floorFilter}
                  onChange={(e) => setFloorFilter(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                  <option value="All Floors">All Floors ({floors.reduce((acc, f) => acc + f.rooms.length, 0)} Rooms)</option>
                  {floors.map((f) => (
                    <option key={f.label} value={f.label}>
                      {f.label} ({f.rooms.length} Rooms)
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {(["day", "7days", "14days", "month"] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      viewMode === mode
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {mode === "day" ? "Day" : mode === "7days" ? "7 Days" : mode === "14days" ? "14 Days" : "Month"}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-xs font-medium text-gray-600">Occupied / Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="text-xs font-medium text-gray-600">Turn / Departure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-xs font-medium text-gray-600">Maintenance / Blocked</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                {/* Header */}
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                      Room & Type
                    </th>
                    {dates.map((date, idx) => {
                      const isToday = getDateKey(date) === getDateKey(today)
                      const isTomorrow = getDateKey(date) === getDateKey(tomorrow)
                      const label = formatDateLabel(date, isToday, isTomorrow)
                      return (
                        <th
                          key={idx}
                          className={`text-center px-3 py-3 text-xs font-semibold uppercase tracking-wider ${
                            isToday ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          <div>{label}</div>
                          <div className={`text-[10px] font-normal normal-case mt-0.5 ${isToday ? "text-blue-500" : "text-gray-400"}`}>
                            {formatDayHeader(date)}
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>

                <tbody>
                  {filteredFloors.map((floor) => (
                    <Fragment key={floor.label}>
                      {/* Floor Header */}
                      <tr>
                        <td colSpan={dates.length + 1} className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                              {floor.label}
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">
                              — {floor.rooms.length} rooms
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Room Rows */}
                      {floor.rooms.map((room) => (
                        <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2">
                            <div className="text-sm font-bold text-gray-900">{room.room_name}</div>
                            <div className="text-[10px] text-gray-400">{room.room_type_id ? room.room_type_id.split('-')[0] : ''}</div>
                          </td>
                          {dates.map((date, idx) => {
                            const key = getDateKey(date)
                            const dayStatus = roomStatuses[room.room_name]?.[key]
                            const status = dayStatus?.status || "available"
                            const style = STATUS_STYLES[status] || STATUS_STYLES.available
                            return (
                              <td key={idx} className="px-1.5 py-1.5">
                                <div
                                  className={`rounded-lg px-2 py-2 text-center text-[11px] font-medium border ${style.bg} ${style.text} ${style.border} min-h-[48px] flex flex-col items-center justify-center cursor-pointer hover:shadow-sm transition-shadow`}
                                >
                                  {dayStatus?.guest_name ? (
                                    <>
                                      <span className="font-semibold truncate max-w-full">
                                        {dayStatus.is_vip && <span className="text-amber-500">★ </span>}
                                        {dayStatus.guest_name}
                                      </span>
                                      {dayStatus.booking_type && (
                                        <span className="text-[9px] opacity-70 mt-0.5">{dayStatus.booking_type}</span>
                                      )}
                                    </>
                                  ) : dayStatus?.notes ? (
                                    <>
                                      <span className="font-semibold truncate max-w-full text-[10px]">{dayStatus.notes}</span>
                                      {status === "blocked" && (
                                        <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded mt-0.5 font-bold">BLOCKED</span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="font-semibold capitalize">{status === "turn" ? "Turn" : status}</span>
                                  )}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
