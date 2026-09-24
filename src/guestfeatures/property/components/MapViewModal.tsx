import { useEffect } from "react";
import { X, MapPin, Navigation } from "lucide-react";
import { Hotel } from "../../../data/hotels";
import { buildMapEmbedUrl, buildMapDirectionsUrl } from "../../../shared/utils/map";

interface MapViewModalProps {
  hotel: Hotel;
  onClose: () => void;
}

export function MapViewModal({ hotel, onClose }: MapViewModalProps) {
  const mapUrl = buildMapEmbedUrl({
    lat: hotel.lat,
    lng: hotel.lng,
    address: hotel.location,
  });
  const directionsUrl = buildMapDirectionsUrl({
    lat: hotel.lat,
    lng: hotel.lng,
    address: hotel.location,
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Map view"
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={18} className="text-[#1A3C5E] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="font-semibold text-foreground text-base">{hotel.name}</h2>
              <p className="text-sm text-muted-foreground truncate">
                {hotel.location}, {hotel.city}, {hotel.country}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close map"
            className="ml-4 inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 text-gray-600 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-[300px]">
          {mapUrl ? (
            <iframe
              title={`Map of ${hotel.name}`}
              src={mapUrl}
              className="w-full h-full min-h-[300px] lg:min-h-[480px]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="w-full h-full min-h-[300px] bg-muted flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {hotel.location ? `${hotel.location}, ${hotel.city}, ${hotel.country}` : "Location unavailable"}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end px-5 py-4 border-t border-gray-200 gap-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1A3C5E] text-[#1A3C5E] text-sm font-medium hover:bg-[#1A3C5E] hover:text-white transition-colors"
          >
            <Navigation size={15} aria-hidden="true" />
            Get directions
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1A3C5E] text-white text-sm font-medium hover:bg-[#163552] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}