import { Heart, MapPin } from "lucide-react";

interface HeroCardData {
  id: string;
  name: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  image: string;
}

interface HeroCardProps {
  data: HeroCardData;
  fallbackName: string;
  fallbackLocation: string;
  fallbackPrice: number;
  className?: string;
}

export function HeroCard({
  data,
  fallbackName,
  fallbackLocation,
  fallbackPrice,
  className = "",
}: HeroCardProps) {
  const name = data.name || fallbackName;
  const location = data.city ? `${data.city}, ${data.country}` : fallbackLocation;
  const price = data.price || fallbackPrice;

  return (
    <div
      className={`bg-white rounded-2xl shadow-modal overflow-hidden hover:scale-[1.03] hover:rotate-0 hover:z-30 transition-all duration-300 cursor-pointer ${className}`}
      onClick={() => { window.location.href = `/hotel/${data.id}`; }}
    >
      <div className="relative h-[120px] xl:h-[150px] overflow-hidden">
        <img src={data.image} alt="" className="w-full h-full object-cover" />
        <button onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
          <Heart size={14} className="text-gray-600" />
        </button>
      </div>
      <div className="px-3 py-2">
        <h3 className="text-[11px] xl:text-[13px] font-bold leading-tight line-clamp-1 text-brand-heading">{name}</h3>
        <p className="text-[9px] xl:text-[10px] flex items-center gap-0.5 mb-1 text-brand-text-secondary">
          <MapPin size={9} /> {location}
        </p>
        <p className="text-xs xl:text-[13px] font-bold leading-tight text-right text-brand-heading">
          <span className="text-[9px] font-medium text-brand-text-secondary">Starting from </span>
          {data.currency} {price}
          <span className="text-[9px] font-normal text-brand-text-secondary"> / night</span>
        </p>
      </div>
    </div>
  );
}
