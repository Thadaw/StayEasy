import { useState, useRef, useEffect } from "react";
import { Minus, Plus, Calendar, Users, Search, ChevronDown } from "lucide-react";
import { Hotel } from "../../../data/hotels";
import { formatDateShort } from "../../../shared/utils/format";
import { getDefaultDates } from "../../../shared/utils/date";
import { CounterControl } from "../../../shared/components/CounterControl";

interface GuestCount {
  adults: number;
  children: number;
  rooms: number;
}

interface RoomSelectionPanelProps {
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  onCheckInChange: (v: string) => void;
  onCheckOutChange: (v: string) => void;
  guests: GuestCount;
  onGuestsChange: (g: GuestCount) => void;
  onSearch: () => void;
  roomQuantities: Record<string, number>;
  roomGuestCounts: Record<string, number>;
  selectedRoomId: string | null;
  nights: number;
  onQtyChange: (roomId: string, delta: number) => void;
  onOpenDetail: (roomId: string) => void;
  onReserve: () => void;
  currency?: string;
  capacityError?: string;
  user?: { fullName?: string } | null;
}

export function RoomSelectionPanel({
  hotel,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  guests,
  onGuestsChange,
  onSearch,
  roomQuantities,
  selectedRoomId,
  nights,
  onQtyChange,
  onOpenDetail,
  onReserve,
  currency = '$',
  capacityError = '',
  user = null,
}: RoomSelectionPanelProps) {
  const { today } = getDefaultDates();
  const hasSelection = Object.values(roomQuantities).some(q => q > 0);

  const [showDates, setShowDates] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (datesRef.current && !datesRef.current.contains(e.target as Node)) setShowDates(false);
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) setShowGuests(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalGuests = guests.adults + guests.children;
  const guestLabel = totalGuests > 0
    ? `${totalGuests} guest${totalGuests !== 1 ? "s" : ""} · ${guests.rooms} room${guests.rooms !== 1 ? "s" : ""}`
    : "Add guests";

  const adjustGuest = (key: keyof GuestCount, delta: number) => {
    onGuestsChange({
      ...guests,
      [key]: Math.max(key === "adults" ? 1 : key === "rooms" ? 1 : 0, guests[key] + delta),
    });
  };

  return (
    <div id="room-selection" className="p-6 bg-white mb-10">
      <h2 className="font-semibold text-foreground mb-6" style={{ fontSize: "1.125rem" }}>Choose your room</h2>

      <div className="bg-white rounded-2xl shadow-card border border-brand-primary-extra-light p-1.5 md:p-1 mb-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-0 md:items-center">
          <div ref={datesRef} className="relative min-w-0">
            <button
              onClick={() => { setShowDates(v => !v); setShowGuests(false); }}
              className="w-full px-4 sm:px-5 py-2.5 md:py-2 flex items-center gap-2 md:gap-1.5 border border-brand-primary-extra-light md:border-r md:border-brand-primary-extra-light text-left transition-colors hover:bg-brand-primary-extra-light rounded-xl md:rounded-l-2xl md:rounded-none"
            >
              <Calendar size={13} className="text-brand-accent shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Check-in – Check-out</div>
                <div className={`text-xs font-medium truncate ${checkIn ? "text-gray-800" : "text-gray-400"}`}>
                  {checkIn && checkOut ? `${formatDateShort(checkIn)} – ${formatDateShort(checkOut)}` : "Select dates"}
                </div>
              </div>
              <ChevronDown size={13} className={`ml-auto shrink-0 text-gray-400 transition-transform ${showDates ? "rotate-180" : ""}`} />
            </button>
          {showDates && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-modal border border-brand-primary-extra-light z-50 p-4 animate-in">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Select dates</p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => { onCheckInChange(e.target.value); if (checkOut && e.target.value > checkOut) onCheckOutChange(""); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split("T")[0] : today}
                    onChange={(e) => onCheckOutChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-accent transition-colors"
                  />
                  {checkIn && checkOut && checkIn >= checkOut && (
                    <p className="text-[10px] text-red-500 mt-1">Check-out must be after check-in</p>
                  )}
                </div>
                <button
                  onClick={() => setShowDates(false)}
                  className="w-full py-2 rounded-lg text-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        <div ref={guestsRef} className="relative min-w-0">
          <button
            onClick={() => { setShowGuests(v => !v); setShowDates(false); }}
            className="w-full px-4 sm:px-5 py-2.5 md:py-2 flex items-center gap-2 md:gap-1.5 border border-brand-primary-extra-light md:border-r md:border-brand-primary-extra-light text-left transition-colors hover:bg-brand-primary-extra-light rounded-xl md:rounded-none"
          >
            <Users size={13} className="text-brand-accent shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Guests & Rooms</div>
              <div className={`text-xs font-medium truncate ${totalGuests > 0 ? "text-gray-800" : "text-gray-400"}`}>{guestLabel}</div>
            </div>
            <ChevronDown size={13} className={`ml-auto shrink-0 text-gray-400 transition-transform ${showGuests ? "rotate-180" : ""}`} />
          </button>
          {showGuests && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-modal border border-brand-primary-extra-light z-50 p-4 animate-in">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Guests & Rooms</p>
              {([
                { key: "adults" as const, label: "Adults", sub: "Ages 13+", min: 1 },
                { key: "children" as const, label: "Children", sub: "Ages 2–12", min: 0 },
                { key: "rooms" as const, label: "Rooms", sub: "Number of rooms", min: 1 },
              ]).map(({ key, label, sub, min }) => (
                <CounterControl
                  key={key}
                  label={label}
                  sublabel={sub}
                  value={guests[key]}
                  min={min}
                  onDecrease={() => adjustGuest(key, -1)}
                  onIncrease={() => adjustGuest(key, 1)}
                />
              ))}
              <button
                onClick={() => setShowGuests(false)}
                className="mt-3 w-full py-2 rounded-lg text-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onSearch}
          className="w-full h-9 rounded-xl bg-brand-accent flex items-center justify-center gap-2 text-white hover:bg-brand-accent-hover transition-all duration-200 hover:shadow-lg hover:shadow-brand-accent/30 active:scale-95 mt-2 md:mt-0 md:shrink-0"
        >
          <Search size={15} />
          <span className="hidden md:inline text-sm font-semibold">Search</span>
        </button>
        </div>
      </div>

      <div className="md:flex md:gap-8">
        <div className="md:w-2/3">
          <div className="space-y-3">
            {hotel.roomTypes.map((rt) => {
              const qty = roomQuantities[rt.id] || 0;
              const lineTotal = qty * rt.price * nights;
              return (
                <div key={rt.id} id={`room-${rt.id}`} className={`flex flex-col md:flex-row items-stretch gap-4 p-4 rounded-xl border border-brand-primary-extra-light transition-all scroll-mt-32 ${selectedRoomId === rt.id ? 'bg-brand-primary-extra-light ring-2 ring-brand-primary-extra-light' : 'hover:bg-gray-50'}`}>
                  <div className="flex gap-3 flex-1 min-w-0">
                    <img src={rt.image} alt={rt.name} className="w-full md:w-36 h-48 md:h-36 rounded-lg object-cover shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{rt.name}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${rt.availableRooms > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {rt.availableRooms > 0 ? 'Available' : 'Sold out'}
                        </span>
                      </div>
                      {(rt.roomTypeName || rt.bedType) && (
                        <p className="text-xs text-muted-foreground mt-0.5">{rt.roomTypeName}{rt.roomTypeName && rt.bedType ? ' · ' : ''}{rt.bedType}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">Floor {rt.floorNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Up to {rt.maxGuests} guests ({rt.maxAdults} adults{rt.maxChildren ? `, ${rt.maxChildren} children` : ''})</p>
                      {rt.cancellationTitle && (
                        <p className="text-xs text-green-600 mt-1">{rt.cancellationTitle}</p>
                      )}
                      {rt.cancellationPolicy && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">{rt.cancellationPolicy}</p>
                      )}
                      {rt.customAmenities && rt.customAmenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {rt.customAmenities.map((a, i) => (
                            <span key={i} className="text-[11px] text-muted-foreground bg-gray-100 rounded-full px-2 py-0.5">{a.name}</span>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => onOpenDetail(rt.id)}
                        className="mt-1.5 text-xs font-medium text-primary underline-offset-2 hover:underline"
                      >
                        View detail
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between gap-3 md:gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{currency}{rt.price}<span className="text-[10px] font-normal text-muted-foreground">/night</span></p>
                    </div>
                    {rt.availableRooms > 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="text-right min-w-[70px]">
                          <p className="text-sm font-bold text-foreground">{currency}{lineTotal.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">{nights} night{nights > 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2.5 py-1.5">
                            <button
                              onClick={() => onQtyChange(rt.id, -1)}
                              disabled={qty <= 0}
                              className="w-7 h-7 rounded-full border border-border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary transition-all"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold tabular-nums text-foreground">{qty}</span>
                            <button
                              onClick={() => onQtyChange(rt.id, 1)}
                              disabled={qty >= rt.availableRooms}
                              className="w-7 h-7 rounded-full border border-border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary transition-all"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <span className="text-[10px] text-muted-foreground">rooms</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-red-500 text-right">No rooms available</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="md:w-1/3 self-start md:sticky md:top-32 md:mt-30">
          <div className="md:pt-0">
            <div className="mb-4 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Check-in</span>
                <span className="text-foreground">{checkIn ? new Date(checkIn).toLocaleDateString() : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out</span>
                <span className="text-foreground">{checkOut ? new Date(checkOut).toLocaleDateString() : '—'}</span>
              </div>
            </div>
            {hasSelection ? (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Your selection</h3>
                <div className="space-y-2">
                  {Object.entries(roomQuantities).map(([roomId, qty]) => {
                    if (qty <= 0) return null;
                    const room = hotel.roomTypes.find(r => r.id === roomId);
                    if (!room) return null;
                    const totalGuests = guests.adults + guests.children;
                    const roomTotal = qty * room.price * nights;
                    return (
                      <div key={roomId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{room.name} × {qty} ({totalGuests} guest{totalGuests > 1 ? 's' : ''})</span>
                        <span className="text-foreground">{currency}{roomTotal.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground mt-4 pt-4 border-t border-border">
                  <span>Total</span>
                  <span>{currency}{Object.entries(roomQuantities)
                    .filter(([, q]) => q > 0)
                    .reduce((sum, [roomId, qty]) => {
                      const room = hotel.roomTypes.find(r => r.id === roomId);
                      if (!room) return sum;
                      return sum + qty * room.price * nights;
                    }, 0).toLocaleString()}</span>
                </div>
                {capacityError && (
                  <p className="text-xs text-red-500 mt-3">{capacityError}</p>
                )}
                {user && (!checkIn || !checkOut || !hasSelection) && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
                    {!checkIn && !checkOut && 'Please select check-in and check-out dates. '}
                    {checkIn && !checkOut && 'Please select a check-out date. '}
                    {!checkIn && checkOut && 'Please select a check-in date. '}
                    {checkIn && checkOut && !hasSelection && 'Please select a room to continue. '}
                  </p>
                )}
                <button
                  onClick={onReserve}
                  disabled={!hasSelection || !!capacityError || (user && (!checkIn || !checkOut))}
                  className="w-full mt-4 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed bg-[#1A3C5E] hover:bg-[#163552] disabled:hover:bg-[#1A3C5E]"
                >
                  Reserve
                </button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Select a room to see your booking summary and reserve.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
