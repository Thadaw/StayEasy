import { MapPin, Phone, Mail, Copy } from "lucide-react"
import { formatDateShort } from "../../../shared/utils/format"
import toast from "react-hot-toast"
import { Card, Badge } from "../../../shared/ui"

interface BookingHeaderProps {
  propertyName: string
  propertyLocation: string
  coverImage: string
  statusLabel: string
  statusColor: string
  refNumber: string
  createdAt: string
  paymentStatus: string | null
  currency: string
  totalAmount: number
  propertyDetails: { phone: string; email: string; lat: string | number | null; lng: string | number | null }
  onViewOnMap: () => void
}

export function BookingHeader({
  propertyName,
  propertyLocation,
  coverImage,
  statusLabel,
  statusColor,
  refNumber,
  createdAt,
  paymentStatus,
  currency,
  totalAmount,
  propertyDetails,
  onViewOnMap,
}: BookingHeaderProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 p-5">
        <img
          src={coverImage}
          alt={propertyName}
          className="w-full sm:w-40 h-32 rounded-xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-gray-900">{propertyName}</h2>
            <Badge className={`${statusColor} shrink-0`} size="sm">
              {statusLabel}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
            <MapPin size={13} /> {propertyLocation}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <a href={`tel:${propertyDetails.phone}`} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-accent transition-colors">
              <Phone size={12} /> {propertyDetails.phone || "N/A"}
            </a>
            <a href={`mailto:${propertyDetails.email}`} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-accent transition-colors">
              <Mail size={12} /> {propertyDetails.email || "N/A"}
            </a>
            <button onClick={onViewOnMap} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-accent hover:underline cursor-pointer">
              <MapPin size={12} /> View on Map
            </button>
          </div>
        </div>
        <div className="sm:border-l sm:border-gray-200 sm:pl-4 sm:text-right shrink-0 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Booking ID</p>
          <p className="text-sm font-bold text-gray-900 flex items-center gap-1 sm:justify-end">
            BK-{refNumber.slice(0, 8).toUpperCase()}
            <Copy
              size={12}
              className="text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => { navigator.clipboard.writeText(refNumber); toast.success("Booking ID copied!") }}
            />
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2">Booked On</p>
          <p className="text-sm font-semibold text-gray-900">{formatDateShort(createdAt)}, {new Date(createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2">Payment Status</p>
          <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1 sm:justify-end">
            {paymentStatus === "paid" ? "Paid" : paymentStatus || "Pending"}{" "}
            <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">✓</span>
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2">Total Paid</p>
          <p className="text-lg font-bold text-gray-900">{currency} {totalAmount.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  )
}
