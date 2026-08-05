import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, LogOut, User, Settings, Bell, Globe, MapPin, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CountryCurrencyPicker } from "./CountryCurrencyPicker";
import { useAuth } from "../context/AuthContext";
import { hotels } from "../data/hotels";
import logo1 from "../assets/logo1.png";

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}


export function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [searchWhere, setSearchWhere] = useState("");
  const [searchCheckIn, setSearchCheckIn] = useState("");
  const [searchCheckOut, setSearchCheckOut] = useState("");
  const [searchGuests, setSearchGuests] = useState<GuestCount>({ adults: 1, children: 0, infants: 0 });
  const [showWhereDropdown, setShowWhereDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const whereRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (whereRef.current && !whereRef.current.contains(e.target as Node)) setShowWhereDropdown(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDateDropdown(false);
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) setShowGuestDropdown(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const suggestions = Array.from(
    new Set(hotels.map(h => `${h.city}, ${h.country}`))
  ).filter(s => searchWhere.length === 0 || s.toLowerCase().includes(searchWhere.toLowerCase())).slice(0, 6);

  const totalGuests = searchGuests.adults + searchGuests.children;
  const guestLabel = totalGuests === 0 ? "Add guests" : `${totalGuests} guest${totalGuests > 1 ? "s" : ""}${searchGuests.infants > 0 ? `, ${searchGuests.infants} infant${searchGuests.infants > 1 ? "s" : ""}` : ""}`;

  const adjustGuests = (key: keyof GuestCount, delta: number) => {
    setSearchGuests(prev => {
      const next = { ...prev, [key]: Math.max(key === "adults" ? 1 : 0, prev[key] + delta) };
      return next;
    });
  };

  const firstName = user && (user.firstName || user.first_name);
  const lastName = user && (user.lastName || user.last_name);
  const displayName = firstName || user?.email?.split("@")[0] || "";
  const initials = ((firstName || '')?.[0] || '') + ((lastName || '')?.[0] || '');
  const displayInitials = initials.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';
  const userEmail = user?.email || "";

  const handleNavbarSearch = () => {
    const params = new URLSearchParams();
    if (searchWhere) params.set("where", searchWhere);
    if (searchCheckIn) params.set("checkIn", searchCheckIn);
    if (searchCheckOut) params.set("checkOut", searchCheckOut);
    if (totalGuests > 0) params.set("guests", String(totalGuests));
    setShowWhereDropdown(false);
    setShowDateDropdown(false);
    setShowGuestDropdown(false);
    navigate(`/?${params}`);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const scrollToHeroSearch = () => {
    const hero = document.getElementById("hero-search");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const input = hero.querySelector("input");
        if (input) input.focus();
      }, 500);
    } else {
      setShowWhereDropdown(true);
    }
  };

  const dateLabel = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : null;

  const pillLabel = () => {
    const parts = [];
    if (searchWhere) parts.push(searchWhere.split(",")[0]);
    else parts.push("Anywhere");
    if (searchCheckIn) parts.push(dateLabel(searchCheckIn) ?? "Any week");
    else parts.push("Any week");
    if (totalGuests > 0) parts.push(guestLabel);
    else parts.push("Add guests");
    return parts;
  };

  const [p1, p2, p3] = pillLabel();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-white/30 backdrop-blur-lg border-b border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between gap-4">

        <Link to="/" className="shrink-0 flex items-center gap-2 group">
          <img src={logo1} alt="StayEasy" className="h-[34px] w-auto transition-transform duration-300 group-hover:scale-105" />
          <span
            style={{
              fontFamily: "'Sora', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: "20px",
              letterSpacing: "-0.5px",
              lineHeight: 1,
              color: "#1A3C5E",
            }}
          >
            Stay<span style={{ color: "#2E86AB" }}>Easy</span>
          </span>
        </Link>

        {/* Navbar search pill — independent dropdowns */}
        <div className="relative hidden md:block flex-1 max-w-sm mx-4">
          <div
            className="flex items-center border rounded-full shadow-sm hover:shadow-md transition-shadow bg-white divide-x"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Where */}
            <div ref={whereRef} className="relative">
              <button
                className="px-5 py-2.5 text-sm font-medium rounded-l-full transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-95 truncate max-w-[120px]"
                style={{ color: "var(--foreground)" }}
                onClick={() => { setShowWhereDropdown(v => !v); setShowDateDropdown(false); setShowGuestDropdown(false); }}
              >
                {p1}
              </button>
              {showWhereDropdown && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-border z-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>Where to?</p>
                  <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 focus-within:border-primary transition-colors">
                    <MapPin size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Search destinations"
                      value={searchWhere}
                      onChange={e => { setSearchWhere(e.target.value); }}
                      className="w-full text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground"
                      style={{ color: "var(--foreground)" }}
                      autoFocus
                    />
                  </div>
                  {suggestions.length > 0 && (
                    <div className="mt-2 max-h-48 overflow-y-auto">
                      {searchWhere === "" && (
                        <div className="px-1 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                          Popular destinations
                        </div>
                      )}
                      {suggestions.map(s => (
                        <button
                          key={s}
                          className="w-full flex items-center gap-3 px-2 py-2 text-sm hover:bg-accent rounded-lg transition-colors text-left"
                          style={{ color: "var(--foreground)" }}
                          onClick={() => { setSearchWhere(s); setShowWhereDropdown(false); }}
                        >
                          <MapPin size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Any week / dates */}
            <div ref={dateRef} className="relative">
              <button
                className="px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                style={{ color: "var(--foreground)" }}
                onClick={() => { setShowDateDropdown(v => !v); setShowWhereDropdown(false); setShowGuestDropdown(false); }}
              >
                {p2}
              </button>
              {showDateDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-50 p-5 min-w-[280px]">
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>Select dates</p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--foreground)" }}>Check in</label>
                      <input
                        type="date"
                        value={searchCheckIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={e => { setSearchCheckIn(e.target.value); if (searchCheckOut && e.target.value > searchCheckOut) setSearchCheckOut(""); }}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                        style={{ color: "var(--foreground)" }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--foreground)" }}>Check out</label>
                      <input
                        type="date"
                        value={searchCheckOut}
                        min={searchCheckIn || new Date().toISOString().split("T")[0]}
                        onChange={e => setSearchCheckOut(e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                        style={{ color: "var(--foreground)" }}
                      />
                    </div>
                    <button
                      onClick={() => setShowDateDropdown(false)}
                      className="mt-1 w-full py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: "var(--primary)" }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Guests */}
            <div ref={guestRef} className="relative">
              <button
                className="px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                style={{ color: "var(--foreground)" }}
                onClick={() => { setShowGuestDropdown(v => !v); setShowWhereDropdown(false); setShowDateDropdown(false); }}
              >
                {p3}
              </button>
              {showGuestDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-border z-50 p-5 w-72">
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>Guests</p>
                  {([
                    { key: "adults" as keyof GuestCount, label: "Adults", sub: "Ages 13 or above" },
                    { key: "children" as keyof GuestCount, label: "Children", sub: "Ages 2–12" },
                    { key: "infants" as keyof GuestCount, label: "Infants", sub: "Under 2" },
                  ]).map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{label}</p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{sub}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => adjustGuests(key, -1)}
                          disabled={searchGuests[key] <= (key === "adults" ? 1 : 0)}
                          className="w-7 h-7 rounded-full border flex items-center justify-center transition-all hover:border-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-4 text-center text-sm font-semibold" style={{ color: "var(--foreground)" }}>{searchGuests[key]}</span>
                        <button
                          onClick={() => adjustGuests(key, 1)}
                          className="w-7 h-7 rounded-full border flex items-center justify-center transition-all hover:border-foreground"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search button */}
            <button
              onClick={handleNavbarSearch}
              className="flex items-center gap-2 px-4 py-2.5 rounded-r-full transition-all duration-200 hover:bg-accent active:scale-95"
              style={{ color: "var(--foreground)" }}
            >
              <span className="p-2 rounded-full" style={{ backgroundColor: "var(--primary)" }}>
                <Search size={13} color="white" />
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <CountryCurrencyPicker />

          {!user && (
            <Link
              to="/host/login"
              className="hidden md:block px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{ color: scrolled ? "var(--foreground)" : "var(--brand-dark)" }}
            >
              Become a Host
            </Link>
          )}

          {/* Mobile search icon */}
          <button
            className="md:hidden p-2 rounded-full transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
            onClick={scrollToHeroSearch}
            style={{ color: scrolled ? "var(--foreground)" : "var(--brand-dark)" }}
          >
            <Search size={18} />
          </button>

          <div ref={menuRef} className="relative ml-1">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 border rounded-full px-3 py-2 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
              style={{
                borderColor: scrolled ? "var(--border)" : "rgba(255,255,255,0.3)",
                backgroundColor: scrolled ? "white" : "rgba(255,255,255,0.15)",
                backdropFilter: scrolled ? "none" : "blur(4px)",
              }}
            >
              {user ? (
                <>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#2E86AB' }}>
                    {displayInitials}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold max-w-[120px] truncate" style={{ color: "var(--brand-dark)" }}>
                    {displayName}
                  </span>
                  <ChevronDown size={13} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} style={{ color: scrolled ? "var(--muted-foreground)" : "rgba(255,255,255,0.7)" }} />
                </>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: scrolled ? "var(--muted)" : "rgba(255,255,255,0.2)" }}>
                    <User size={15} style={{ color: "var(--muted-foreground)" }} />
                  </div>
                  <span className="hidden sm:block text-sm font-medium" style={{ color: "var(--foreground)" }}>Account</span>
                  <ChevronDown size={13} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} style={{ color: scrolled ? "var(--muted-foreground)" : "rgba(255,255,255,0.7)" }} />
                </>
              )}
            </button>

            {menuOpen && (
              <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border overflow-hidden z-50" style={{ borderColor: "var(--border)" }}>
                {user ? (
                  <>
                    <div className="px-4 py-4 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--accent)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white border-2" style={{ backgroundColor: '#2E86AB', borderColor: "var(--primary)" }}>
                          {displayInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate" style={{ color: "var(--brand-dark)", fontSize: "1rem" }}>
                            {displayName}{lastName ? ` ${lastName}` : ""}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>{userEmail}</p>
                          {user.countryFlag && user.country && (
                            <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--primary)" }}>
                              <span>{user.countryFlag}</span><span>{user.country}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { navigate(role === "guest" ? "/profile" : "/host/profile"); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>
                        <User size={15} style={{ color: "var(--primary)" }} />Profile
                      </button>
                      <button onClick={() => { navigate("/notifications"); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>
                        <Bell size={15} style={{ color: "var(--muted-foreground)" }} />Notifications
                      </button>
                      <button onClick={() => { navigate("/account-settings"); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>
                        <Settings size={15} style={{ color: "var(--muted-foreground)" }} />Account Settings
                      </button>
                      <button onClick={() => { navigate("/language-currency"); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>
                        <Globe size={15} style={{ color: "var(--muted-foreground)" }} />Language & Currency
                      </button>
                      <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} />
                      <button onClick={() => { logout(); navigate("/"); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>
                        <LogOut size={15} style={{ color: "var(--muted-foreground)" }} />Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-1">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="flex px-4 py-3 text-sm font-bold transition-colors hover:bg-accent" style={{ color: "var(--brand-dark)" }}>Login</Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>Sign Up</Link>
                    <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} />
                    <Link to="/host/login" onClick={() => setMenuOpen(false)} className="flex px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>Become a Host</Link>
                    <a href="#" className="flex px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>Help Centre</a>
                    <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} />
                    <Link to="/admin-login" onClick={() => setMenuOpen(false)} className="flex px-4 py-2 text-xs transition-colors hover:bg-accent" style={{ color: "var(--muted-foreground)" }}>Admin / Staff access →</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;