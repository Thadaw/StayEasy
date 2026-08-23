import { Star } from "lucide-react";
import { Hotel } from "../../../data/hotels";

interface RoomGridProps {
  hotel: Hotel;
  roomQuantities: Record<string, number>;
  onSelectRoom: (roomId: string) => void;
}

export function RoomGrid({ hotel, roomQuantities, onSelectRoom }: RoomGridProps) {
  return (
    <section className="p-6 mb-10">
      <h2 className="font-semibold text-foreground mb-6" style={{ fontSize: "1.125rem" }}>
        Available rooms
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {hotel.roomTypes.map((rt) => {
          const qty = roomQuantities[rt.id] || 0;
          const roomType = rt.id === "std" ? "Standard" : rt.id === "dlx" ? "Deluxe" : "Suite";
          return (
            <div key={rt.id} className="group bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <div className="relative h-[130px] md:h-[150px] overflow-hidden">
                <img
                  src={rt.image}
                  alt={rt.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {rt.availableRooms > 0 ? (
                  <span className="absolute top-2 left-2 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-green-600 text-white shadow-md backdrop-blur-sm">
                    {rt.availableRooms} available
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-red-600 text-white shadow-md backdrop-blur-sm">
                    Sold out
                  </span>
                )}
                <span className="absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-foreground shadow-md">
                  {roomType}
                </span>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs md:text-sm font-bold text-foreground leading-tight truncate">{rt.name}</p>
                <p className="text-[9px] md:text-[10px] text-muted-foreground">Floor {rt.floorNumber} · {rt.areaSqFt} sq ft</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-[9px] md:text-[10px] font-semibold text-foreground">{hotel.rating}</span>
                  <span className="text-[9px] text-muted-foreground">({hotel.reviews})</span>
                </div>
                <p className="text-[9px] md:text-[10px] text-muted-foreground mt-1">
                  Up to {rt.maxGuests} guests ({rt.maxAdults} adults{rt.maxChildren ? `, ${rt.maxChildren} children` : ''})
                </p>
                {rt.cancellationTitle && (
                  <p className="text-[9px] md:text-[10px] text-green-600 mt-1">{rt.cancellationTitle}</p>
                )}
                {rt.customAmenities && rt.customAmenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {rt.customAmenities.map((a, i) => (
                      <span key={i} className="text-[8px] text-muted-foreground bg-gray-100 rounded-full px-1.5 py-0.5">{a.name}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-end justify-between mt-2 pt-2 border-t border-border">
                  <p className="text-xs md:text-sm font-bold" style={{ color: "var(--brand-dark)" }}>
                    ${rt.price}<span className="text-[9px] font-normal text-muted-foreground"> /night</span>
                  </p>
                  <button
                    onClick={() => onSelectRoom(rt.id)}
                    disabled={rt.availableRooms <= 0}
                    className="text-[9px] md:text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all text-white disabled:opacity-40 disabled:cursor-not-allowed bg-[#1A3C5E] hover:bg-[#163552] disabled:hover:bg-[#1A3C5E]"
                  >
                    {qty > 0 ? 'Selected' : 'Reserve'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
