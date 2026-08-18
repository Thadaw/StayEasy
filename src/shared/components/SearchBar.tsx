import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Users, ChevronDown, Clock, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { popularSearchDestinations } from "../../data/searchDestinations";
import { formatDateRange, formatDateShort, buildGuestLabel } from "../utils/format";
import { getDefaultDates } from "../utils/date";
import { CounterControl } from "./CounterControl";

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

const RECENT_SEARCHES_KEY = "recentSearches";

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(where: string) {
  if (!where.trim()) return;
  const searches = getRecentSearches().filter(s => s !== where);
  searches.unshift(where);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, 5)));
}

export function SearchBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const { today } = getDefaultDates();

  const propertyTypesParam = urlParams.get("propertyTypes");
  const [where, setWhere] = useState(() => {
    if (urlParams.get("where")) return urlParams.get("where")!;
    if (propertyTypesParam) return propertyTypesParam;
    return localStorage.getItem("nearbyLocation") || "";
  });
  const [checkIn, setCheckIn] = useState(() => urlParams.get("checkin") || "");
  const [checkOut, setCheckOut] = useState(() => urlParams.get("checkout") || "");
  const [guests, setGuests] = useState<GuestCount>(() => {
    const total = parseInt(urlParams.get("guests") || "0");
    if (total > 0) return { adults: total, children: 0, infants: 1 };
    return { adults: 2, children: 0, infants: 1 };
  });
  const [showWhere, setShowWhere] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches);

  const whereRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (whereRef.current && !whereRef.current.contains(e.target as Node)) setShowWhere(false);
      if (datesRef.current && !datesRef.current.contains(e.target as Node)) setShowDates(false);
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) setShowGuests(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalGuests = guests.adults + guests.children;
  const guestLabel = buildGuestLabel(guests.adults, guests.children, guests.infants);

  const adjustGuest = (key: keyof GuestCount, delta: number) => {
    setGuests((prev) => ({
      ...prev,
      [key]: Math.max(key === "adults" ? 1 : 0, prev[key] + delta),
    }));
  };

  const handleSearch = () => {
    if (checkIn && checkOut && checkIn >= checkOut) return;
    const params = new URLSearchParams();
    const rawWhere = where || localStorage.getItem("nearbyLocation") || "";
    const searchWhere = rawWhere.replace(/\s*\([\d.]+,\s*[\d.]+\)/, "").trim();
    if (searchWhere) {
      params.set("where", searchWhere);
      saveRecentSearch(searchWhere);
      setRecentSearches(getRecentSearches());
    }
    if (propertyTypesParam) {
      params.set("propertyTypes", propertyTypesParam);
    }
    if (checkIn) params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);
    if (totalGuests > 0) params.set("guests", String(totalGuests));
    navigate(`/search?${params}`);
  };

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter(s => s !== search);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const dateDisplay = formatDateRange(checkIn, checkOut);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-brand-primary-extra-light mb-3 md:mb-4 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-0 md:items-center">
        <div ref={whereRef} className="relative min-w-0 md:flex-1">
          <button
            onClick={() => { setShowWhere((v) => !v); setShowDates(false); setShowGuests(false); }}
            className="w-full px-3 sm:px-4 py-2.5 md:py-2.5 flex items-center gap-2 md:gap-1.5 border border-brand-primary-extra-light md:border-r md:border-brand-primary-extra-light text-left transition-colors hover:bg-brand-primary-extra-light rounded-xl md:rounded-l-2xl md:rounded-tr-none"
          >
            <MapPin size={13} className="text-brand-accent shrink-0" />
            <div className="min-w-0">
              <div className={`text-xs md:text-sm font-medium truncate ${where || localStorage.getItem("nearbyLocation") ? "text-gray-800" : "text-gray-400"}`}>{(where || localStorage.getItem("nearbyLocation") || "").replace(/\s*\([\d.]+,\s*[\d.]+\)/, "").trim() || t("searchPlaceholder")}</div>
              <div className="text-[7px] md:text-[8px] font-semibold text-gray-400 uppercase tracking-wide">{t("whereTo")}</div>
            </div>
            <ChevronDown size={13} className={`ml-auto shrink-0 text-gray-400 transition-transform hidden sm:block ${showWhere ? "rotate-180" : ""}`} />
          </button>
          {showWhere && (
            <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-[320px] bg-white rounded-xl shadow-modal border border-brand-primary-extra-light z-50 p-3 animate-in">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">{t("whereTo")}</p>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-brand-accent transition-colors mb-2">
                <MapPin size={13} className="text-brand-accent shrink-0" />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") setShowWhere(false); }}
                  className="w-full text-sm bg-transparent border-none outline-none placeholder:text-gray-400"
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {recentSearches.length > 0 && (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 px-1 mt-2">Recent searches</p>
                    {recentSearches.map((search) => (
                      <div key={search} className="flex items-center group">
                        <button
                          onClick={() => { setWhere(search); setShowWhere(false); }}
                          className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-gray-700 hover:bg-brand-primary-extra-light rounded-lg transition-colors text-left"
                        >
                          <Clock size={13} className="text-gray-400 shrink-0" />
                          {search}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeRecentSearch(search); }}
                          className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </>
                )}
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 px-1 mt-2">{t("popularDestinations")}</p>
                {popularSearchDestinations
                  .filter((d) => where === "" || d.toLowerCase().includes(where.toLowerCase()))
                  .map((d) => (
                    <button
                      key={d}
                      onClick={() => { setWhere(d); setShowWhere(false); }}
                      className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-gray-700 hover:bg-brand-primary-extra-light rounded-lg transition-colors text-left"
                    >
                      <MapPin size={13} className="text-brand-accent shrink-0" />
                      {d}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div ref={datesRef} className="relative min-w-0 md:flex-1">
          <button
            onClick={() => { setShowDates((v) => !v); setShowWhere(false); setShowGuests(false); }}
            className="w-full px-3 sm:px-4 py-2.5 md:py-2.5 flex items-center gap-2 md:gap-1.5 border border-brand-primary-extra-light md:border-r md:border-brand-primary-extra-light text-left transition-colors hover:bg-brand-primary-extra-light rounded-xl md:rounded-none"
          >
            <Calendar size={13} className="text-brand-accent shrink-0" />
            <div className="min-w-0">
              <div className={`text-xs md:text-sm font-medium truncate ${checkIn ? "text-gray-800" : "text-gray-400"}`}>{checkIn && checkOut ? `${formatDateShort(checkIn)} – ${formatDateShort(checkOut)}` : dateDisplay}</div>
              <div className="text-[7px] md:text-[8px] font-semibold text-gray-400 uppercase tracking-wide">{t("checkIn")} – {t("checkOut")}</div>
            </div>
            <ChevronDown size={13} className={`ml-auto shrink-0 text-gray-400 transition-transform hidden sm:block ${showDates ? "rotate-180" : ""}`} />
          </button>
          {showDates && (
            <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-[420px] bg-white rounded-xl shadow-modal border border-brand-primary-extra-light z-50 p-4 animate-in">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">{t("selectDates")}</p>
              <div className="flex flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("checkIn")}</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value > checkOut) setCheckOut(""); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{t("checkOut")}</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split("T")[0] : today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
              </div>
              {checkIn && checkOut && checkIn >= checkOut && (
                <p className="text-[10px] text-red-500 mt-1">Check-out must be after check-in</p>
              )}
              <button
                onClick={() => setShowDates(false)}
                className="w-full py-2 rounded-lg text-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors mt-3"
              >
                {t("done")}
              </button>
            </div>
          )}
        </div>

        <div ref={guestsRef} className="relative min-w-0 md:flex-1">
          <button
            onClick={() => { setShowGuests((v) => !v); setShowWhere(false); setShowDates(false); }}
            className="w-full px-3 sm:px-4 py-2.5 md:py-2.5 flex items-center gap-2 md:gap-1.5 border border-brand-primary-extra-light md:border-r md:border-brand-primary-extra-light text-left transition-colors hover:bg-brand-primary-extra-light rounded-xl md:rounded-none"
          >
            <Users size={13} className="text-brand-accent shrink-0" />
            <div className="min-w-0">
              <div className="text-[7px] md:text-[8px] font-semibold text-gray-400 uppercase tracking-wide">{t("guests")}</div>
              <div className={`text-xs md:text-sm font-medium truncate ${totalGuests > 0 ? "text-gray-800" : "text-gray-400"}`}>{guestLabel}</div>
            </div>
            <ChevronDown size={13} className={`ml-auto shrink-0 text-gray-400 transition-transform hidden sm:block ${showGuests ? "rotate-180" : ""}`} />
          </button>
          {showGuests && (
            <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-[320px] bg-white rounded-xl shadow-modal border border-brand-primary-extra-light z-50 p-4 animate-in">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">{t("guests")}</p>
              {([
                { key: "adults" as keyof GuestCount, label: t("adults"), sub: t("ages13") },
                { key: "children" as keyof GuestCount, label: t("children"), sub: t("ages2to12") },
                { key: "infants" as keyof GuestCount, label: t("room"), sub: t("numberOfRooms") },
              ]).map(({ key, label, sub }) => (
                <CounterControl
                  key={key}
                  label={label}
                  sublabel={sub}
                  value={guests[key]}
                  min={key === "adults" ? 1 : 0}
                  onDecrease={() => adjustGuest(key, -1)}
                  onIncrease={() => adjustGuest(key, 1)}
                />
              ))}
              <button
                onClick={() => setShowGuests(false)}
                className="mt-3 w-full py-2 rounded-lg text-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors"
              >
                {t("done")}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="col-span-2 md:col-span-1 row-span-2 w-full h-full min-h-[42px] md:min-h-[48px] rounded-xl bg-brand-accent flex items-center justify-center gap-2 text-white hover:bg-brand-accent-hover transition-all duration-200 hover:shadow-lg hover:shadow-brand-accent/30 active:scale-95 mt-2 md:mt-0 md:shrink-0"
        >
          <Search size={15} />
          <span className="hidden md:inline text-sm font-semibold">Search</span>
        </button>
      </div>
    </div>
  );
}
