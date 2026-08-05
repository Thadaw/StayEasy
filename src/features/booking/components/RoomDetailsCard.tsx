import { BedDouble, Users, Info } from 'lucide-react'

interface RoomLine {
  room: {
    id: string
    name: string
    price: number
    maxGuests: number
    bedType?: string
    roomTypeName?: string
    cancellationTitle?: string
    cancellationPolicy?: string
  }
  qty: number
  gc: number
  ep: number
  lineTotal: number
  cancellationTitle?: string
  cancellationPolicy?: string
}

interface RoomDetailsCardProps {
  roomLines: RoomLine[]
  nights: number
  currency: string
}

export function RoomDetailsCard({ roomLines, nights, currency }: RoomDetailsCardProps) {
  if (roomLines.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-bold text-gray-900 mb-4">Room details</h2>
      <div className="space-y-4">
        {roomLines.map((rl, i) => (
          <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">{rl.room.name}</p>
                <p className="text-xs text-gray-500">{rl.room.roomTypeName || rl.room.bedType || ''}</p>
              </div>
              <p className="text-sm font-bold text-gray-900">{currency}{(rl.room.price * nights).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <BedDouble size={12} /> {rl.room.bedType || 'Standard'}
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} /> {rl.gc} guest{rl.gc !== 1 ? 's' : ''}
              </span>
              <span>
                {nights} night{nights !== 1 ? 's' : ''} × {rl.qty}
              </span>
            </div>
            {(rl.cancellationTitle || rl.cancellationPolicy) && (
              <div className="mt-2 flex items-start gap-1.5">
                <Info size={12} className="text-[#008009] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#008009]">
                  {rl.cancellationTitle || 'Free cancellation'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
