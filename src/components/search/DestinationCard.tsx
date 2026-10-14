interface DestinationCardProps {
  city: string
  country: string
  imageUrl: string
  properties: number
}

export function DestinationCard({
  city,
  country,
  imageUrl,
  properties,
}: DestinationCardProps) {
  const propertyText =
    properties === 1
      ? "1 property"
      : `${properties.toLocaleString()} properties`

  return (
    <div className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-muted">
      <img
        src={imageUrl}
        alt={`${city}, ${country}`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-lg font-bold text-white">{city}</h3>

        <p className="text-sm text-white/80">{country}</p>

        <p className="mt-1 text-xs text-white/60">
          {propertyText}
        </p>
      </div>
    </div>
  )
}
