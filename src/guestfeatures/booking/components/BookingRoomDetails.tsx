import { BedDouble } from "lucide-react"
import { DetailField } from "../../../shared/components/DetailField"
import { Card, SectionHeader } from "../../../shared/ui"

interface Room {
  room_id?: string
  room_name: string
  room_type: string
  bed_type: string
  max_adults: number
  max_children: number
  base_rate: number
  photo?: string
  photos?: { cover?: string }
}

interface BookingRoomDetailsProps {
  rooms: Room[]
  currency: string
}

export function BookingRoomDetails({ rooms, currency }: BookingRoomDetailsProps) {
  if (rooms.length === 0) return null

  return (
    <Card>
      <SectionHeader icon={<BedDouble size={16} />} title="Room Details" />
      <div className="space-y-4">
        {rooms.map((room, idx) => {
          const roomPhoto = room.photo || room.photos?.cover || ""
          return (
            <div key={room.room_id || idx} className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                <div className="w-full sm:w-32 h-40 sm:h-24 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {roomPhoto ? (
                    <img src={roomPhoto} alt={room.room_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BedDouble size={28} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 flex-1 min-w-0">
                  <DetailField label="Room Name" value={room.room_name} />
                  <DetailField label="Room Type" value={room.room_type} />
                  <DetailField label="Bed Type" value={room.bed_type} />
                  <DetailField label="Max Adults" value={room.max_adults} />
                  <DetailField label="Max Children" value={room.max_children} />
                  <DetailField label="Base Rate" value={`${currency} ${room.base_rate.toFixed(2)} / night`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
