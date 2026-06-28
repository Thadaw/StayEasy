import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, LogOut, LayoutDashboard, User, Settings, MapPin, Calendar, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CountryCurrencyPicker } from "./CountryCurrencyPicker";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";

const dashboardPaths: Record<string, string> = {
  superadmin:   "/dashboard/superadmin",
  admin:        "/dashboard/admin",
  manager:      "/dashboard/manager",
  receptionist: "/dashboard/receptionist",
  guest:        "/dashboard/guest",
};

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchWhere, setSearchWhere] = useState("");
  const [searchCheckIn, setSearchCheckIn] = useState("");
  const [searchCheckOut, setSearchCheckOut] = useState("");
  const [searchGuests, setSearchGuests] = useState(1);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const firstName = user && (user.firstName || user.first_name);
  const lastName = user && (user.lastName || user.last_name);
  const displayName = firstName || user?.email?.split("@")[0] || "";
  const userEmail = user?.email || "";
  const userRole = user?.role || "guest";

  const handleNavbarSearch = () => {
    const params = new URLSearchParams();
    if (searchWhere) params.set("where", searchWhere);
    if (searchCheckIn) params.set("checkIn", searchCheckIn);
    if (searchCheckOut) params.set("checkOut", searchCheckOut);
    if (searchGuests > 0) params.set("guests", String(searchGuests));
    setSearchOpen(false);
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
      setSearchOpen(true);
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
    if (searchGuests > 1) parts.push(`${searchGuests} guests`);
    else parts.push("Add guests");
    return parts;
  };

  const [p1, p2, p3] = pillLabel();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between gap-4">

        <Link to="/" className="shrink-0"><Logo size={34} /></Link>

        {/* Navbar search pill */}
        <div ref={searchRef} className="relative hidden md:block flex-1 max-w-sm mx-4">
          <div
            className="flex items-center border rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white divide-x"
            style={{ borderColor: "var(--border)" }}
            onClick={() => setSearchOpen(v => !v)}
          >
            <button className="px-5 py-2.5 text-sm font-medium rounded-l-full transition-colors hover:bg-accent truncate max-w-[120px]" style={{ color: "var(--foreground)" }}>
              {p1}
            </button>
            <button className="px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent whitespace-nowrap" style={{ color: "var(--foreground)" }}>
              {p2}
            </button>
            <button
              className="flex items-center gap-3 pl-5 pr-2 py-2 rounded-r-full transition-colors hover:bg-accent"
              style={{ color: "var(--foreground)" }}
            >
              <span className="text-sm whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>{p3}</span>
              <span className="p-2 rounded-full" style={{ backgroundColor: "var(--primary)" }}>
                <Search size={13} color="white" />
              </span>
            </button>
          </div>

          {/* Navbar mini search dropdown */}
          {searchOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] bg-white rounded-2xl shadow-2xl border border-border z-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--muted-foreground)" }}>Quick Search</p>
              <div className="flex flex-col gap-3">
                {/* Where */}
                <div className="flex items-center gap-3 border border-border rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                  <MapPin size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--muted-foreground)" }}>Where</p>
                    <input
                      type="text"
                      placeholder="Search destinations"
                      value={searchWhere}
                      onChange={e => setSearchWhere(e.target.value)}
                      className="w-full text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground"
                      style={{ color: "var(--foreground)" }}
                      autoFocus
                    />
                  </div>
                </div>
                {/* Dates */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                    <Calendar size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--muted-foreground)" }}>Check in</p>
                      <input
                        type="date"
                        value={searchCheckIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={e => { setSearchCheckIn(e.target.value); if (searchCheckOut && e.target.value > searchCheckOut) setSearchCheckOut(""); }}
                        className="w-full text-xs bg-transparent border-none outline-none"
                        style={{ color: "var(--foreground)" }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
                    <Calendar size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--muted-foreground)" }}>Check out</p>
                      <input
                        type="date"
                        value={searchCheckOut}
                        min={searchCheckIn || new Date().toISOString().split("T")[0]}
                        onChange={e => setSearchCheckOut(e.target.value)}
                        className="w-full text-xs bg-transparent border-none outline-none"
                        style={{ color: "var(--foreground)" }}
                      />
                    </div>
                  </div>
                </div>
                {/* Guests */}
                <div className="flex items-center gap-3 border border-border rounded-xl px-4 py-3">
                  <Users size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--muted-foreground)" }}>Guests</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSearchGuests(g => Math.max(1, g - 1))}
                        className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs hover:border-foreground transition-colors disabled:opacity-30"
                        disabled={searchGuests <= 1}
                      >−</button>
                      <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{searchGuests} guest{searchGuests > 1 ? "s" : ""}</span>
                      <button
                        onClick={() => setSearchGuests(g => g + 1)}
                        className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs hover:border-foreground transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNavbarSearch}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  <Search size={15} />
                  Search
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <CountryCurrencyPicker />

          <Link
            to="/host"
            className="hidden md:block px-4 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent whitespace-nowrap"
            style={{ color: "var(--foreground)" }}
          >
            Become a Host
          </Link>

          {/* Mobile search icon */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-accent transition-colors"
            onClick={scrollToHeroSearch}
          >
            <Search size={18} style={{ color: "var(--foreground)" }} />
          </button>

          <div ref={menuRef} className="relative ml-1">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 border rounded-full px-3 py-2 hover:shadow-md transition-shadow bg-white"
              style={{ borderColor: "var(--border)" }}
            >
              {user ? (
                <>
                  <img src={user.avatar || ""} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
                  <span className="hidden sm:flex items-center gap-1.5 text-sm font-semibold max-w-[120px] truncate" style={{ color: "var(--brand-dark)" }}>
                    {user.countryFlag && <span className="text-base leading-none">{user.countryFlag}</span>}
                    {displayName}
                  </span>
                  <ChevronDown size={13} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} style={{ color: "var(--muted-foreground)" }} />
                </>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--muted)" }}>
                    <User size={15} style={{ color: "var(--muted-foreground)" }} />
                  </div>
                  <span className="hidden sm:block text-sm font-medium" style={{ color: "var(--foreground)" }}>Account</span>
                  <ChevronDown size={13} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} style={{ color: "var(--muted-foreground)" }} />
                </>
              )}
            </button>

            {menuOpen && (
              <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border overflow-hidden z-50" style={{ borderColor: "var(--border)" }}>
                {user ? (
                  <>
                    <div className="px-4 py-4 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--accent)" }}>
                      <div className="flex items-center gap-3">
                        <img src={user.avatar || ""} alt={displayName} className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: "var(--primary)" }} />
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
                      <span className="inline-block mt-2.5 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize text-white" style={{ backgroundColor: "var(--primary)" }}>
                        {userRole}
                      </span>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { navigate(dashboardPaths[userRole] || "/dashboard/guest"); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>
                        <LayoutDashboard size={15} style={{ color: "var(--primary)" }} />Dashboard
                      </button>
                      <button onClick={() => { navigate("/dashboard/guest"); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>
                        <Settings size={15} style={{ color: "var(--muted-foreground)" }} />Profile & Bookings
                      </button>
                      <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} />
                      <button onClick={() => { logout(); navigate("/"); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>
                        <LogOut size={15} style={{ color: "var(--muted-foreground)" }} />Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-1">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="flex px-4 py-3 text-sm font-bold transition-colors hover:bg-accent" style={{ color: "var(--brand-dark)" }}>Login</Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>Sign Up</Link>
                    <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} />
                    <Link to="/host" onClick={() => setMenuOpen(false)} className="flex px-4 py-2.5 text-sm transition-colors hover:bg-accent" style={{ color: "var(--foreground)" }}>Become a Host</Link>
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
