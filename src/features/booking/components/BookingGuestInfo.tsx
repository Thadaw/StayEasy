import { Users } from "lucide-react"
import { DetailField } from "../../../shared/components/DetailField"
import { Card, SectionHeader } from "../../../shared/ui"

interface BookingGuestInfoProps {
  guestName: string
  guestEmail?: string
  guestPhone?: string
  guestNationality?: string
}

export function BookingGuestInfo({
  guestName,
  guestEmail,
  guestPhone,
  guestNationality,
}: BookingGuestInfoProps) {
  return (
    <Card>
      <SectionHeader icon={<Users size={16} />} title="Guest Details" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField label="Name" value={guestName} />
        <DetailField label="Email" value={guestEmail || "N/A"} />
        <DetailField label="Phone" value={guestPhone || "N/A"} />
        <DetailField label="Nationality" value={guestNationality || "N/A"} />
      </div>
    </Card>
  )
}
