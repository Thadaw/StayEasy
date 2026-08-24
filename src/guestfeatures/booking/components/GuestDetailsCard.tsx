interface GuestDetailsCardProps {
  guestName?: string
  guestEmail?: string
  guestPhone?: string
}

export function GuestDetailsCard({ guestName, guestEmail, guestPhone }: GuestDetailsCardProps) {
  if (!guestName && !guestEmail) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-bold text-gray-900 mb-3">Guest details</h2>
      <div className="space-y-2 text-sm">
        {guestName && (
          <div className="flex gap-2">
            <span className="text-gray-500">Name:</span>
            <span className="text-gray-900 font-medium">{guestName}</span>
          </div>
        )}
        {guestEmail && (
          <div className="flex gap-2">
            <span className="text-gray-500">Email:</span>
            <span className="text-gray-900">{guestEmail}</span>
          </div>
        )}
        {guestPhone && (
          <div className="flex gap-2">
            <span className="text-gray-500">Phone:</span>
            <span className="text-gray-900">{guestPhone}</span>
          </div>
        )}
      </div>
    </div>
  )
}
