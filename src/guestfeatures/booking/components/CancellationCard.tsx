import { AlertTriangle } from "lucide-react"
import { formatDateShort } from "../../../shared/utils/format"
import { Card, Button } from "../../../shared/ui"

interface Room {
  room_id?: string
  cancellation_title?: string
  cancellation_description?: string
}

interface CancellationCardProps {
  rooms: Room[]
  checkIn: string
  canCancel: boolean
  onCancel: () => void
}

export function CancellationCard({ rooms, checkIn, canCancel, onCancel }: CancellationCardProps) {
  const hasCustomPolicy = rooms.some((r) => r.cancellation_title || r.cancellation_description)

  return (
    <>
      <Card>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Cancellation Policy</h3>
        {hasCustomPolicy ? (
          <div className="space-y-4">
            {rooms.map((room, idx) =>
              room.cancellation_title || room.cancellation_description ? (
                <div key={room.room_id || idx}>
                  {room.cancellation_title && (
                    <p className="text-sm font-bold text-gray-900 mb-1">{room.cancellation_title}</p>
                  )}
                  {room.cancellation_description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{room.cancellation_description}</p>
                  )}
                </div>
              ) : null
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span className="text-sm text-gray-600">
                Free cancellation before {checkIn ? formatDateShort(checkIn) : "N/A"} (2:00 PM).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span className="text-sm text-gray-600">After that, cancellation charges may apply.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span className="text-sm text-gray-600">No-shows are non-refundable.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span className="text-sm text-gray-600">For more details, contact property.</span>
            </li>
          </ul>
        )}
      </Card>

      {canCancel && (
        <Card className="border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-red-500" />
            <h3 className="text-sm font-bold text-red-700">Cancel Booking</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            You can cancel this booking before {checkIn ? formatDateShort(checkIn) : "N/A"} (2:00 PM).
          </p>
          <Button variant="danger-outline" onClick={onCancel} className="w-full">
            Cancel Booking
          </Button>
        </Card>
      )}
    </>
  )
}
