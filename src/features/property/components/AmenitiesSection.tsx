import { useState } from "react";
import { Wifi, Car, Utensils, Waves, Mountain, Dumbbell } from "lucide-react";
import { Hotel } from "../../../data/hotels";
import { buildMapEmbedUrl } from "../../../shared/utils/map";

const amenityIcons: Record<string, typeof Wifi> = {
  "Free WiFi": Wifi,
  "Parking": Car,
  "Kitchen": Utensils,
  "Beach access": Waves,
  "Mountain view": Mountain,
  "Gym access": Dumbbell,
};

interface AmenitiesSectionProps {
  hotel: Hotel;
}

export function AmenitiesSection({ hotel }: AmenitiesSectionProps) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const visibleAmenities = showAllAmenities ? hotel.amenities : hotel.amenities.slice(0, 8);
  const mapUrl = buildMapEmbedUrl({
    lat: hotel.lat,
    lng: hotel.lng,
    address: `${hotel.location}, ${hotel.city}, ${hotel.country}`,
  });

  return (
    <div className="md:grid md:grid-cols-2 md:gap-8 pb-6 border-b border-border mb-6">
      <div className="space-y-6">
        <p className="text-foreground leading-relaxed text-sm">{hotel.description}</p>
        <div>
          <h2 className="font-semibold text-foreground mb-4" style={{ fontSize: "1.125rem" }}>What this place offers</h2>
          <div className="grid grid-cols-2 gap-3">
            {visibleAmenities.map((a) => {
              const Icon = amenityIcons[a];
              return (
                <div key={a} className="flex items-center gap-3 text-sm text-foreground py-1">
                  {Icon ? <Icon size={18} className="text-muted-foreground shrink-0" /> : <div className="w-4 h-4 rounded-full bg-muted shrink-0" />}
                  {a}
                </div>
              );
            })}
          </div>
          {hotel.amenities.length > 8 && (
            <button onClick={() => setShowAllAmenities((v) => !v)} className="mt-4 px-5 py-2.5 border border-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors">
              {showAllAmenities ? "Show less" : `Show all ${hotel.amenities.length} amenities`}
            </button>
          )}
        </div>
      </div>
      <div>
        <h2 className="font-semibold text-foreground mb-4" style={{ fontSize: "1.125rem" }}>Location</h2>
        <p className="text-sm text-muted-foreground mb-3">{hotel.location}, {hotel.city}, {hotel.country}</p>
        <div className="rounded-xl overflow-hidden border border-border h-[200px]">
          {mapUrl ? (
            <iframe
              title="Property location"
              src={mapUrl}
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Map unavailable for this property</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
