import { CheckCircle2, MapPin, Star, Wifi, Plane, UtensilsCrossed, Phone, Mail } from 'lucide-react'

interface ConfirmationBannerProps {
  confirmationCode: string
  propertyName: string
  propertyCity: string
  propertyCountry: string
  propertyImage?: string
  rating?: number
  reviews?: number
  amenities?: string[]
  phone?: string
  email?: string
}

export function ConfirmationBanner({
  confirmationCode,
  propertyName,
  propertyCity,
  propertyCountry,
  propertyImage,
  rating,
  reviews,
  amenities,
  phone,
  email,
}: ConfirmationBannerProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-green-50 to-white p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          <CheckCircle2 size={16} /> Booking confirmed
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your stay is confirmed
        </h1>
        <p className="mt-2 text-sm text-gray-600">Everything is ready for your trip. Keep this confirmation handy.</p>

        <div className="mt-5 flex justify-center">
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-sm text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">Confirmation code</p>
            <p className="mt-1 text-xl font-bold text-gray-900 tracking-[0.18em]">{confirmationCode}</p>
          </div>
        </div>
      </div>

      {propertyImage && (
        <img src={propertyImage} alt={propertyName} className="w-full h-56 object-cover" />
      )}
      <div className="p-5">
        {rating ? (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className={i < Math.floor(rating) ? "fill-[#febb02] stroke-[#febb02]" : "fill-gray-200 stroke-gray-200"} />
            ))}
            <span className="text-sm font-semibold text-gray-900 ml-1">{rating.toFixed(1)}</span>
            {reviews != null && reviews > 0 && (
              <span className="text-sm text-gray-500">· {reviews} reviews</span>
            )}
          </div>
        ) : null}
        <div className="flex items-center gap-2 text-gray-900">
          <MapPin size={16} />
          <span className="text-sm font-bold">{propertyName}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{propertyCity}, {propertyCountry}</p>

        {(phone || email) && (
          <div className="mt-3 flex flex-wrap gap-3">
            {phone && (
              <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900">
                <Phone size={12} /> {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900">
                <Mail size={12} /> {email}
              </a>
            )}
          </div>
        )}

        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {amenities.slice(0, 4).map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
                {a.toLowerCase().includes('wifi') && <Wifi size={11} />}
                {a.toLowerCase().includes('airport') && <Plane size={11} />}
                {a.toLowerCase().includes('restaurant') && <UtensilsCrossed size={11} />}
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
