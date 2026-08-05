import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Plus, Minus, Building2, Compass, Check } from "lucide-react";
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowLocationSuggestions(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDatePicker(false);
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) setShowGuestPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = Array.from(
    new Set(hotels.map(h => `${h.city}, ${h.country}`))
  ).filter(s => location.length === 0 || s.toLowerCase().includes(location.toLowerCase())).slice(0, 6);

  const totalGuests = guests.adults + guests.children;
  const guestLabel = totalGuests === 0 ? "Add guests" : `${totalGuests} guest${totalGuests > 1 ? "s" : ""}${guests.infants > 0 ? `, ${guests.infants} infant${guests.infants > 1 ? "s" : ""}` : ""}`;

  const dateLabel = (d: string) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const hasDates = checkIn || checkOut;
  const hasLocation = location.length > 0;
  const hasGuests = totalGuests > 1 || guests.infants > 0;

  const pillLabel = () => {
    const parts = [];
    if (location) parts.push(location.split(",")[0]);
    else parts.push("Anywhere");
    if (checkIn && checkOut) parts.push(`${dateLabel(checkIn)} - ${dateLabel(checkOut)}`);
    else if (checkIn) parts.push(dateLabel(checkIn) ?? "Any week");
    else parts.push("Any week");
    if (totalGuests > 0) parts.push(guestLabel);
    else parts.push("Add guests");
    return parts;
  };

  const [p1, p2, p3] = pillLabel();

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
    navigate(`/?${params}`);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center gap-3 md:gap-5 w-full">
      {/* Stays / Experiences toggle */}
      <div className="relative flex items-center gap-1 rounded-full p-1.5 md:p-1" style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)" }}>
        {(["stays", "experiences"] as const).map((tab) => {
          const Icon = tab === "stays" ? Building2 : Compass;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center gap-1.5 md:gap-2 px-4 md:px-7 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-full transition-all duration-300 capitalize ${
                isActive
                  ? "shadow-lg scale-100"
                  : "text-white/80 hover:text-white hover:scale-105"
              }`}
              style={{
                backgroundColor: isActive ? "white" : "transparent",
                boxShadow: isActive ? "0 4px 20px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)" : "none",
                transform: isActive ? "scale(1)" : "scale(0.95)",
              }}
            >
              <Icon
                size={14}
                style={{
                  width: "clamp(14px, 2vw, 16px)",
                  height: "clamp(14px, 2vw, 16px)",
                  color: isActive ? "var(--primary)" : "rgba(255,255,255,0.7)",
                  transition: "color 0.3s",
                }}
              />
              <span className="capitalize">{tab}</span>
              {isActive && (
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: "var(--primary)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Pill search */}
      <div className="group/search relative flex items-center bg-white rounded-full md:rounded-full shadow-2xl border border-border overflow-visible w-full max-w-full md:max-w-2xl transition-all duration-500 hover:shadow-3xl hover:border-gray-300">
        {/* Glow effect ring */}
        <div className="absolute -inset-0.5 rounded-full opacity-0 group-hover/search:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(135deg, var(--primary), rgba(46,134,171,0.3))", filter: "blur(4px)", zIndex: -1 }} />

        {/* Where */}
        <div ref={locationRef} className="relative flex-1 min-w-0">
          <button
            className={`pill-btn w-full flex flex-col items-center md:items-start justify-center px-0.5 sm:px-2 md:px-6 py-1.5 md:py-4 text-[9px] sm:text-[11px] md:text-sm font-medium rounded-l-full transition-all duration-200 min-h-[36px] md:min-h-0 ${
              showLocationSuggestions ? "bg-accent/60 shadow-inner" : "hover:bg-accent/40 hover:scale-[1.02]"
            }`}
            style={{ color: "var(--foreground)" }}
            onClick={() => { setShowLocationSuggestions(v => !v); setShowDatePicker(false); setShowGuestPicker(false); }}
          >
            <span className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: hasLocation ? "var(--primary)" : "var(--foreground)" }}>
              <span className="icon-wrapper inline-flex"><MapPin size={12} className="icon-bounce" /></span>
              Where
              {hasLocation && <Check size={10} style={{ color: "var(--primary)" }} />}
            </span>
            <span className="flex md:hidden flex-col items-center gap-0.5 leading-tight">
              <span className="icon-wrapper inline-flex"><MapPin size={14} className="icon-bounce" style={{ color: hasLocation ? "var(--primary)" : "var(--muted-foreground)" }} /></span>
              <span className="truncate max-w-[60px]">{p1}</span>
            </span>
            <span className="hidden md:block truncate w-full font-semibold transition-all duration-300" style={{ color: hasLocation ? "var(--foreground)" : "var(--muted-foreground)" }}>{p1}</span>
          </button>
          {showLocationSuggestions && (
            <div className="fixed md:absolute top-1/2 md:top-full left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 mt-0 md:mt-2 w-[85vw] md:w-72 bg-white rounded-xl shadow-2xl border border-border z-[60] p-2 md:p-4 animate-scale-in">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 md:mb-3" style={{ color: "var(--muted-foreground)" }}>Where to?</p>
              <div className="flex items-center gap-1.5 md:gap-2 border border-border rounded-lg px-2 md:px-3 py-1.5 md:py-2 focus-within:border-primary transition-all duration-200 focus-within:shadow-md" style={{ backgroundColor: "var(--accent)" }}>
                <MapPin size={12} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={location}
                  onChange={e => { setLocation(e.target.value); }}
                  className="w-full text-[11px] md:text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground"
                  style={{ color: "var(--foreground)" }}
                  autoFocus
                />
              </div>
              {suggestions.length > 0 && (
                <div className="mt-1.5 md:mt-2 max-h-40 md:max-h-48 overflow-y-auto">
                  {location === "" && (
                    <div className="px-1 pt-1.5 md:pt-2 pb-1 text-[10px] md:text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                      Popular destinations
                    </div>
                  )}
                  {suggestions.map(s => (
                    <button
                      key={s}
                      className="group/suggestion w-full flex items-center gap-2 md:gap-3 px-2 py-2 md:py-2.5 text-[11px] md:text-sm hover:bg-accent rounded-lg transition-all duration-200 text-left active:scale-[0.98] hover:translate-x-0.5"
                      style={{ color: "var(--foreground)" }}
                      onClick={() => { setLocation(s); setShowLocationSuggestions(false); }}
                    >
                      <span className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all duration-200 group-hover/suggestion:scale-110 group-hover/suggestion:shadow-md" style={{ backgroundColor: "var(--accent)" }}>
                        <MapPin size={11} style={{ color: "var(--primary)" }} />
                      </span>
                      <span className="transition-all duration-200 group-hover/suggestion:font-semibold">{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-px bg-border self-stretch my-1.5 md:my-4 group-hover/search:bg-gray-300 group-hover/search:scale-y-110 transition-all duration-300" />

        {/* Dates */}
        <div ref={dateRef} className="relative flex-1 min-w-0">
          <button
            className={`pill-btn w-full flex flex-col items-center md:items-start justify-center px-0.5 sm:px-2 md:px-6 py-1.5 md:py-4 text-[9px]  sm:text-[11px] md:text-sm font-medium transition-all duration-200 min-h-[36px] md:min-h-0 ${
              showDatePicker ? "bg-accent/60 shadow-inner" : "hover:bg-accent/40 hover:scale-[1.02]"
            }`}
            style={{ color: "var(--foreground)" }}
            onClick={() => { setShowDatePicker(v => !v); setShowLocationSuggestions(false); setShowGuestPicker(false); }}
          >
            <span className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: hasDates ? "var(--primary)" : "var(--foreground)" }}>
              <span className="icon-wrapper inline-flex icon-bounce"><CalendarIcon /></span>
              Check in
              {hasDates && <Check size={10} style={{ color: "var(--primary)" }} />}
            </span>
            <span className="truncate hidden md:block w-full font-semibold transition-all duration-300" style={{ color: hasDates ? "var(--foreground)" : "var(--muted-foreground)" }}>{p2}</span>
            <span className="flex md:hidden flex-col items-center gap-0.5 leading-tight">
              <span className="icon-wrapper inline-flex icon-bounce"><CalendarIcon /></span>
              <span className="truncate max-w-[60px]">{p2}</span>
            </span>
          </button>
          {showDatePicker && (
            <div className="fixed md:absolute top-1/2 md:top-full left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 mt-0 md:mt-2 w-[85vw] md:w-auto md:min-w-[280px] bg-white rounded-xl shadow-2xl border border-border z-[60] p-3 md:p-5 animate-scale-in">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 md:mb-3" style={{ color: "var(--muted-foreground)" }}>Select dates</p>
              <div className="flex flex-col gap-2 md:gap-3">
                <div>
                  <label className="text-[11px] md:text-xs font-semibold mb-0.5 md:mb-1 block" style={{ color: "var(--foreground)" }}>Check in</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value > checkOut) setCheckOut(""); }}
                    className="w-full border border-border rounded-lg px-2.5 md:px-3 py-2 md:py-2.5 text-[11px] md:text-sm outline-none transition-all duration-200 focus:border-primary focus:shadow-md"
                    style={{ color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] md:text-xs font-semibold mb-0.5 md:mb-1 block" style={{ color: "var(--foreground)" }}>Check out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full border border-border rounded-lg px-2.5 md:px-3 py-2 md:py-2.5 text-[11px] md:text-sm outline-none transition-all duration-200 focus:border-primary focus:shadow-md"
                    style={{ color: "var(--foreground)" }}
                  />
                </div>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="mt-0.5 md:mt-1 w-full py-2 md:py-2.5 rounded-lg text-[11px] md:text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.97] relative overflow-hidden"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  <span className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all duration-300" />
                  <span className="relative z-10">Apply</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px bg-border self-stretch my-1.5 md:my-4 group-hover/search:bg-gray-300 group-hover/search:scale-y-110 transition-all duration-300" />

        {/* Guests */}
        <div ref={guestRef} className="relative flex-1 min-w-0">
          <button
            className={`pill-btn w-full flex flex-col items-center md:items-start justify-center px-0.5 sm:px-2 md:px-6 py-1.5 md:py-4 text-[9px]  sm:text-[11px] md:text-sm font-medium transition-all duration-200 min-h-[36px] md:min-h-0 ${
              showGuestPicker ? "bg-accent/60 shadow-inner" : "hover:bg-accent/40 hover:scale-[1.02]"
            }`}
            style={{ color: "var(--foreground)" }}
            onClick={() => { setShowGuestPicker(v => !v); setShowLocationSuggestions(false); setShowDatePicker(false); }}
          >
            <span className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: hasGuests ? "var(--primary)" : "var(--foreground)" }}>
              <span className="icon-wrapper inline-flex icon-bounce"><UsersIcon /></span>
              Guests
              {hasGuests && <Check size={10} style={{ color: "var(--primary)" }} />}
            </span>
            <span className="truncate hidden md:block w-full font-semibold transition-all duration-300" style={{ color: hasGuests ? "var(--foreground)" : "var(--muted-foreground)" }}>{p3}</span>
            <span className="flex md:hidden flex-col items-center gap-0.5 leading-tight">
              <span className="icon-wrapper inline-flex icon-bounce"><UsersIcon /></span>
              <span className="truncate max-w-[60px]">{p3}</span>
            </span>
          </button>
          {showGuestPicker && (
            <div className="fixed md:absolute top-1/2 md:top-full left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 mt-0 md:mt-2 w-[85vw] md:w-72 bg-white rounded-xl shadow-2xl border border-border z-[60] p-3 md:p-5 animate-scale-in">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Guests</p>
                <span className="text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--accent)", color: "var(--primary)" }}>
                  {totalGuests + guests.infants} total
                </span>
              </div>
              {([
                { key: "adults" as keyof GuestCount, label: "Adults", sub: "Ages 13 or above" },
                { key: "children" as keyof GuestCount, label: "Children", sub: "Ages 2–12" },
                { key: "infants" as keyof GuestCount, label: "Infants", sub: "Under 2" },
              ]).map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between py-2 md:py-3 border-b border-border last:border-0 group/item">
                  <div>
                    <p className="text-[11px] md:text-sm font-semibold" style={{ color: "var(--foreground)" }}>{label}</p>
                    <p className="text-[10px] md:text-xs" style={{ color: "var(--muted-foreground)" }}>{sub}</p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <button
                      onClick={() => adjust(key, -1)}
                      disabled={guests[key] <= (key === "adults" ? 1 : 0)}
                      className="w-7 h-7 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:border-primary hover:bg-primary/10 active:scale-[0.85] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-border hover:shadow-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <Minus size={10} className="transition-transform duration-200 group-hover/item:scale-110" />
                    </button>
                    <span className="w-5 md:w-5 text-center text-[11px] md:text-sm font-bold tabular-nums transition-all duration-200" style={{ color: "var(--foreground)" }}>{guests[key]}</span>
                    <button
                      onClick={() => adjust(key, 1)}
                      className="w-7 h-7 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:border-primary hover:bg-primary/10 active:scale-[0.85] hover:shadow-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <Plus size={10} className="transition-transform duration-200 group-hover/item:scale-110" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowGuestPicker(false)}
                className="mt-2 md:mt-3 w-full py-2 md:py-2.5 rounded-lg text-[11px] md:text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.97] relative overflow-hidden"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <span className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all duration-300" />
                <span className="relative z-10">Apply</span>
              </button>
            </div>
          )}
        </div>

        {/* Search button */}
        <div className="relative flex items-center pr-0.5 md:pr-2 pl-0.5 md:pl-2">
          {/* Glow behind search button */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover/search:opacity-100 transition-all duration-500 scale-125 group-hover/search:scale-150 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(46,134,171,0.35) 0%, transparent 70%)" }} />
          <button
            onClick={handleSearch}
            className="rounded-full p-1.5 md:p-3 flex items-center justify-center text-white transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-110 active:scale-95 relative overflow-hidden"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <span className="absolute inset-0 rounded-full bg-white/0 hover:bg-white/15 transition-all duration-300" />
            <Search size={13} className="relative z-10 md:w-[16px] md:h-[16px] group-active/search:rotate-12 transition-transform duration-300" />
          </button>
          <span className="absolute -top-1 -right-0.5 w-2.5 h-2.5 rounded-full animate-ping group-hover/search:animate-ping group-hover/search:w-3 group-hover/search:h-3 transition-all duration-300" style={{ backgroundColor: "var(--primary)", opacity: 0.4 }} />
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: translateX(-50%) translateY(-50%) scale(0.92); }
          to { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1); }
        }
        @media (min-width: 768px) {
          @keyframes scale-in {
            from { opacity: 0; transform: translateY(-8px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        }
        .animate-slide-down { animation: slide-down 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }

        .pill-btn { position: relative; overflow: hidden; }
        .pill-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s;
          background: linear-gradient(135deg, rgba(46,134,171,0.08), transparent);
        }
        .pill-btn:hover::after { opacity: 1; }
        .pill-btn:active { transform: scale(0.97) !important; }

        .icon-wrapper { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .pill-btn:hover .icon-wrapper { transform: scale(1.2) rotate(-5deg); }
        .pill-btn:active .icon-wrapper { transform: scale(0.9); }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(46,134,171,0.3); }
          50% { box-shadow: 0 0 20px rgba(46,134,171,0.6); }
        }
        .search-btn-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
