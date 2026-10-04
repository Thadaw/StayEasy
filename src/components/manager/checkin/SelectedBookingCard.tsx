interface SelectedBookingCardProps {
  bookingId: string
  guest: string
  room: string
  stay: string
  guests: string
  status: string
  statusBg: string
  statusText: string
}

export default function SelectedBookingCard({
  bookingId,
  guest,
  room,
  stay,
  guests,
  status,
  statusBg,
  statusText,
}: SelectedBookingCardProps) {
  const fields: { label: string; value: React.ReactNode }[] = [
    { label: 'Guest', value: guest },
    { label: 'Room', value: room },
    { label: 'Stay', value: stay },
    { label: 'Guests', value: guests },
    {
      label: 'Status',
      value: (
        <span
          className="inline-block rounded-md px-2.5 py-1 text-[12px] font-semibold"
          style={{ background: statusBg, color: statusText }}
        >
          {status}
        </span>
      ),
    },
  ]

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="m-0 mb-4 text-[15px] font-bold text-gray-900">Selected Booking · {bookingId}</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        {fields.map((f) => (
          <div key={f.label} className="min-w-0">
            <div className="mb-1 text-[11px] text-gray-500">{f.label}</div>
            <div className="break-words text-[13px] font-semibold text-gray-900">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
