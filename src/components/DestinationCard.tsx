interface DestinationCardProps {
  city: string;
  country: string;
  imageUrl: string;
  properties: number;
}

export function DestinationCard({ city, country, imageUrl, properties }: DestinationCardProps) {
  return (
    <div className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] bg-muted">
      <img
        src={imageUrl}
        alt={`${city}, ${country}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white font-bold" style={{ fontSize: "1.125rem" }}>{city}</p>
        <p className="text-white/80 text-sm">{country}</p>
        <p className="text-white/60 text-xs mt-1">{properties.toLocaleString()} properties</p>
      </div>
    </div>
  );
}
