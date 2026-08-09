import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Users, Bed, Bath, Maximize, Calendar, Shield } from "lucide-react";
import { Hotel, RoomType } from "../../../data/hotels";

interface RoomDetailModalProps {
  room: RoomType;
  hotel: Hotel;
  roomGuestCounts: Record<string, number>;
  onClose: () => void;
  onReserve: (roomId: string) => void;
}

export function RoomDetailModal({ room, hotel, onClose, onReserve }: RoomDetailModalProps) {
  const [roomImgIndex, setRoomImgIndex] = useState(0);
  const images = useMemo(() => {
    const roomPhotos = [room.image, ...(room.gallery ?? [])].filter(Boolean);
    const combined = roomPhotos.length > 0 ? roomPhotos : (hotel.images ?? []);
    return combined.filter((src, i, arr) => arr.indexOf(src) === i);
  }, [room.image, room.gallery, hotel.images]);
  const safeIndex = images.length > 0 ? Math.min(roomImgIndex, images.length - 1) : 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="overflow-y-auto flex-1">
          <div className="relative">
            <div className="relative h-[300px] md:h-[400px] bg-muted">
              {images.length > 0 ? (
                <img
                  src={images[safeIndex]}
                  alt={`${room.name} photo ${safeIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No photos</div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setRoomImgIndex(v => v === 0 ? images.length - 1 : v - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setRoomImgIndex(v => v === images.length - 1 ? 0 : v + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setRoomImgIndex(i)}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{ backgroundColor: i === safeIndex ? '#fff' : 'rgba(255,255,255,0.5)' }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
            >
              ✕
            </button>
            {room.availableRooms > 0 ? (
              <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Available
              </span>
            ) : (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Sold out
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 p-3 bg-white border-b border-border overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setRoomImgIndex(i)}
                  className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === safeIndex ? "border-brand-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt={`${room.name} photo ${i + 1}`} className="w-20 h-14 object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{room.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{hotel.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">${room.price}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-border">
              <div className="flex items-center gap-2">
                <Bed size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Room Type</p>
                  <p className="text-sm font-medium text-foreground">{room.roomTypeName || 'Standard'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bed size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Bed Type</p>
                  <p className="text-sm font-medium text-foreground">{room.bedType || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Max Adults</p>
                  <p className="text-sm font-medium text-foreground">{room.maxAdults}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Max Children</p>
                  <p className="text-sm font-medium text-foreground">{room.maxChildren ?? 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Maximize size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Floor</p>
                  <p className="text-sm font-medium text-foreground">{room.floorNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Max Guests</p>
                  <p className="text-sm font-medium text-foreground">{room.maxGuests}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Cancellation</p>
                  <p className="text-sm font-medium text-foreground">{room.cancellationPolicy || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                  <p className="text-sm font-medium text-foreground">{room.availableRooms > 0 ? 'Available' : 'Sold out'}</p>
                </div>
              </div>
            </div>

            {room.cancellationTitle && (
              <div className="py-4 border-b border-border">
                <div className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                  <Calendar size={18} className="text-green-600 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-green-800">{room.cancellationTitle}</p>
                      {room.cancellationPolicy && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-600 text-white font-semibold uppercase">{room.cancellationPolicy}</span>
                      )}
                    </div>
                    <p className="text-xs text-green-700 mt-1">{room.cancellationDescription || room.cancellationPolicy}</p>
                  </div>
                </div>
              </div>
            )}

            {room.systemAmenities && room.systemAmenities.length > 0 && (
              <div className="py-4 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">System Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {room.systemAmenities.map((a, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-foreground rounded-full px-3 py-1.5">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {room.customAmenities && room.customAmenities.length > 0 && (
              <div className="py-4 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">Room Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {room.customAmenities.map((a, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-foreground rounded-full px-3 py-1.5">
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {room.roomFacilities && room.roomFacilities.length > 0 && (
              <div className="py-4 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">Room Facilities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {room.roomFacilities.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {room.bathroomAmenities && room.bathroomAmenities.length > 0 && (
              <div className="py-4 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">Private Bathroom</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {room.bathroomAmenities.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bath size={14} className="text-green-600 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {room.smokingPolicy && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-base">🚭</span>
                  <span>{room.smokingPolicy}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 border-t border-border flex items-center justify-between rounded-b-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
            >
              ✕
            </button>
            <p className="text-xl font-bold text-foreground">${room.price}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
          </div>
          <button
            onClick={() => onReserve(room.id)}
            disabled={room.availableRooms <= 0}
            className="px-6 py-2.5 bg-brand-accent text-white rounded-xl text-sm font-semibold transition-all hover:bg-brand-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {room.availableRooms > 0 ? 'Reserve' : 'Sold out'}
          </button>
        </div>
      </div>
    </div>
  );
}
