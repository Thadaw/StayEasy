import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Users, Plus, Minus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { hotels } from "../data/hotels";

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

export function SearchBar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"stays" | "experiences">("stays");
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<GuestCount>({ adults: 1, children: 0, infants: 0 });

  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowLocationSuggestions(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDatePicker(false);
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) setShowGuestPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Unique cities/countries from hotel data
  const suggestions = Array.from(
    new Set(hotels.map(h => `${h.city}, ${h.country}`))
  ).filter(s => location.length === 0 || s.toLowerCase().includes(location.toLowerCase())).slice(0, 6);

  const totalGuests = guests.adults + guests.children;
  const guestLabel = totalGuests === 0 ? "Add guests" : `${totalGuests} guest${totalGuests > 1 ? "s" : ""}${guests.infants > 0 ? `, ${guests.infants} infant${guests.infants > 1 ? "s" : ""}` : ""}`;

  const dateLabel = (d: string) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const adjust = (key: keyof GuestCount, delta: number) => {
    setGuests(prev => {
      const next = { ...prev, [key]: Math.max(key === "adults" ? 1 : 0, prev[key] + delta) };
      return next;
    });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("where", location);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (totalGuests > 0) params.set("guests", String(totalGuests));
    // For now: filter hotels client-side and navigate to landing with filters
    // When you have a search page/route, change this to navigate(`/search?${params}`)
    navigate(`/?${params}`);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Stays / Experiences toggle */}
      <div className="flex items-center gap-1 rounded-full p-1" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
        {(["stays", "experiences"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-6 py-2 rounded-full text-sm font-semibold transition-all capitalize"
            style={{
              backgroundColor: activeTab === tab ? "white" : "transparent",
              color: activeTab === tab ? "var(--brand-dark)" : "rgba(255,255,255,0.9)",
              boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main search bar */}
      <div className="bg-white rounded-2xl shadow-2xl w-full overflow-visible border border-border relative">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr_1px_1fr_auto] items-stretch">

          {/* WHERE */}
          <div ref={locationRef} className="relative">
            <div
              className="flex items-center gap-3 px-5 py-4 hover:bg-accent/50 transition-colors cursor-pointer rounded-tl-2xl rounded-bl-2xl"
              onClick={() => { setShowLocationSuggestions(true); setShowDatePicker(false); setShowGuestPicker(false); }}
            >
              <MapPin size={17} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <div className="min-w-0 w-full">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-0.5">Where</div>
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setShowLocationSuggestions(true); }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  className="w-full text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground"
                  style={{ color: "var(--foreground)" }}
                />
              </div>
            </div>
            {showLocationSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-border z-50 overflow-hidden">
                {location === "" && (
                  <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                    Popular destinations
                  </div>
                )}
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors text-left"
                    style={{ color: "var(--foreground)" }}
                    onClick={() => { setLocation(s); setShowLocationSuggestions(false); }}
                  >
                    <MapPin size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:block bg-border w-px my-4" />

          {/* CHECK IN / OUT */}
          <div ref={dateRef} className="relative">
            <div
              className="flex items-center gap-3 px-5 py-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => { setShowDatePicker(v => !v); setShowLocationSuggestions(false); setShowGuestPicker(false); }}
            >
              <Calendar size={17} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <div>
                <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-0.5">Check in – Check out</div>
                <div className="text-sm" style={{ color: checkIn ? "var(--foreground)" : "var(--muted-foreground)" }}>
                  {checkIn && checkOut
                    ? `${dateLabel(checkIn)} → ${dateLabel(checkOut)}`
                    : checkIn
                    ? `${dateLabel(checkIn)} → Add checkout`
                    : "Add dates"}
                </div>
              </div>
              <ChevronDown size={13} className={`ml-auto transition-transform ${showDatePicker ? "rotate-180" : ""}`} style={{ color: "var(--muted-foreground)" }} />
            </div>
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-50 p-5 min-w-[300px]">
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>Select dates</p>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--foreground)" }}>Check in</label>
                    <input
                      type="date"
                      value={checkIn}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value > checkOut) setCheckOut(""); }}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                      style={{ color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--foreground)" }}>Check out</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                      style={{ color: "var(--foreground)" }}
                    />
                  </div>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="mt-1 w-full py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block bg-border w-px my-4" />

          {/* GUESTS */}
          <div ref={guestRef} className="relative">
            <div
              className="flex items-center gap-3 px-5 py-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => { setShowGuestPicker(v => !v); setShowLocationSuggestions(false); setShowDatePicker(false); }}
            >
              <Users size={17} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-0.5">Guests</div>
                <div className="text-sm truncate" style={{ color: totalGuests > 1 ? "var(--foreground)" : "var(--muted-foreground)" }}>
                  {guestLabel}
                </div>
              </div>
              <ChevronDown size={13} className={`transition-transform ${showGuestPicker ? "rotate-180" : ""}`} style={{ color: "var(--muted-foreground)" }} />
            </div>
            {showGuestPicker && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-50 p-5 w-72">
                {([
                  { key: "adults", label: "Adults", sub: "Ages 13 or above" },
                  { key: "children", label: "Children", sub: "Ages 2–12" },
                  { key: "infants", label: "Infants", sub: "Under 2" },
                ] as { key: keyof GuestCount; label: string; sub: string }[]).map(({ key, label, sub }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{label}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{sub}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => adjust(key, -1)}
                        disabled={guests[key] <= (key === "adults" ? 1 : 0)}
                        className="w-7 h-7 rounded-full border flex items-center justify-center transition-all hover:border-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold" style={{ color: "var(--foreground)" }}>{guests[key]}</span>
                      <button
                        onClick={() => adjust(key, 1)}
                        className="w-7 h-7 rounded-full border flex items-center justify-center transition-all hover:border-foreground"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowGuestPicker(false)}
                  className="mt-3 w-full py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* SEARCH BUTTON */}
          <div className="flex items-center justify-center p-3">
            <button
              onClick={handleSearch}
              className="rounded-xl px-5 py-3 flex items-center gap-2 font-semibold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Search size={15} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
