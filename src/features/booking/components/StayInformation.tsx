import { CalendarDays } from "lucide-react"
import { DetailField } from "../../../shared/components/DetailField"
import { formatDateFull } from "../../../shared/utils/format"
import { Card, SectionHeader } from "../../../shared/ui"

interface StayInformationProps {
  checkIn: string
  checkOut: string
  nights: number
  adults: number
  children: number
  roomNames: string
}

export function StayInformation({ checkIn, checkOut, nights, adults, children, roomNames }: StayInformationProps) {
  return (
    <Card>
      <SectionHeader icon={<CalendarDays size={16} />} title="Stay Information" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <DetailField label="Check-in" value={checkIn ? formatDateFull(checkIn) : "N/A"} />
          <p className="text-xs text-gray-400">2:00 PM</p>
        </div>
        <div>
          <DetailField label="Check-out" value={checkOut ? formatDateFull(checkOut) : "N/A"} />
          <p className="text-xs text-gray-400">12:00 PM</p>
        </div>
        <DetailField label="Duration" value={`${nights} Night${nights > 1 ? "s" : ""}`} />
        <DetailField label="Guests" value={`${adults} adult${adults !== 1 ? "s" : ""} + ${children} child${children === 1 ? "" : "ren"}`} />
        <DetailField label="Room" value={roomNames} />
        <DetailField label="Meals" value="Breakfast Included" />
      </div>
    </Card>
  )
}
