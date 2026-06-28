import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { worldCountries } from "../data/worldCountries";

type Country = typeof worldCountries[0];

interface CountryCurrencyPickerProps {
  onSelect?: (country: Country) => void;
}

const defaultCountry =
  worldCountries.find(c => c.code === "NP") ?? worldCountries[0];

export function CountryCurrencyPicker({ onSelect }: CountryCurrencyPickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Country>(defaultCountry);
  const [query, setQuery] = useState("");
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery(""); setExpandedCode(null); }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = query.trim()
    ? worldCountries.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.currency.toLowerCase().includes(query.toLowerCase()) ||
        c.currencyName.toLowerCase().includes(query.toLowerCase()) ||
        c.cities.some(city => city.name.toLowerCase().includes(query.toLowerCase()))
      )
    : worldCountries;

  function chooseCountry(c: Country) {
    setSelected(c);
    setOpen(false);
    setQuery("");
    setExpandedCode(null);
    onSelect?.(c);
    navigate(`/country/${c.code}`);
  }

  function chooseCity(c: Country, cityName: string) {
    setSelected(c);
    setOpen(false);
    setQuery("");
    setExpandedCode(null);
    navigate(`/country/${c.code}?city=${encodeURIComponent(cityName)}`);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-full transition-colors hover:bg-accent"
        style={{ border: "1px solid var(--border)", backgroundColor: "white" }}
      >
        <span className="text-xl leading-none" title={selected.name}>{selected.flag}</span>
        <span className="hidden xl:inline text-sm font-medium max-w-[100px] truncate" style={{ color: "var(--foreground)" }}>
          {selected.name}
        </span>
        <span className="hidden lg:inline xl:hidden text-sm font-medium" style={{ color: "var(--foreground)" }}>
          {selected.code}
        </span>
        <span className="text-xs hidden lg:inline" style={{ color: "var(--muted-foreground)" }}>
          {selected.symbol}
        </span>
        <ChevronDown size={13} className={`transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} style={{ color: "var(--muted-foreground)" }} />
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 right-0 md:left-auto md:right-0 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50 max-w-[260px] md:max-w-[420px]"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="px-3 pt-3 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              🌍 Country, Currency & Places
            </p>
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg mt-2" style={{ backgroundColor: "var(--muted)" }}>
              <Search size={12} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="bg-transparent text-xs outline-none w-full"
                style={{ color: "var(--foreground)" }}
              />
            </div>
            <p className="text-[10px] mt-1.5" style={{ color: "var(--muted-foreground)" }}>
              {worldCountries.length} countries · 📍 places
            </p>
          </div>

          {!query && (
            <div className="px-3 py-2 flex items-center gap-2 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--accent)" }}>
              <span className="text-xl leading-none">{selected.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: "var(--primary)" }}>{selected.name}</p>
                <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  {selected.currencyName} · {selected.symbol} {selected.currency}
                </p>
              </div>
              <Check size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
            </div>
          )}

          <ul className="overflow-y-auto py-1" style={{ maxHeight: "280px", scrollbarWidth: "thin" }}>
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs" style={{ color: "var(--muted-foreground)" }}>No results found</li>
            ) : (
              filtered.map(c => {
                const isSelected = selected.code === c.code;
                const isExpanded = expandedCode === c.code;
                const matchingCities = query ? c.cities.filter(city => city.name.toLowerCase().includes(query.toLowerCase())) : [];

                return (
                  <li key={c.code} className="border-b last:border-b-0" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                    <div
                      className="flex items-center gap-2 px-3 py-2 transition-colors cursor-pointer group"
                      style={{ backgroundColor: isSelected ? "var(--accent)" : "transparent" }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "var(--accent)"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                      onClick={() => chooseCountry(c)}
                    >
                      <span className="text-xl leading-none shrink-0">{c.flag}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>{c.name}</p>
                        <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                          {c.currency} · {c.symbol} · {c.continent}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {isSelected && <Check size={11} style={{ color: "var(--primary)" }} />}
                        <button
                          onClick={e => { e.stopPropagation(); setExpandedCode(isExpanded ? null : c.code); }}
                          className="p-1 rounded-md transition-colors hover:bg-white"
                          title="Show popular places"
                        >
                          <MapPin size={11} style={{ color: isExpanded ? "var(--primary)" : "var(--muted-foreground)" }} />
                        </button>
                      </div>
                    </div>

                    {(isExpanded || matchingCities.length > 0) && (
                      <div className="px-3 pb-2 pt-1" style={{ backgroundColor: "rgba(235,245,251,0.5)" }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                          <MapPin size={9} /> Popular places in {c.name}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {(matchingCities.length > 0 ? matchingCities : c.cities).map(city => {
                            const matched = query && city.name.toLowerCase().includes(query.toLowerCase());
                            return (
                              <button
                                key={city.name}
                                onClick={e => { e.stopPropagation(); chooseCity(c, city.name); }}
                                className="text-[10px] px-2 py-1 rounded-full border transition-all hover:shadow-sm"
                                style={{
                                  borderColor: matched ? "var(--primary)" : "var(--border)",
                                  color: matched ? "var(--primary)" : "var(--foreground)",
                                  backgroundColor: matched ? "var(--accent)" : "white",
                                  fontWeight: matched ? 600 : 400,
                                }}
                              >
                                {city.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })
            )}
          </ul>

          <div className="border-t px-3 py-2 flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
            <div className="flex items-center gap-1.5">
              <span className="text-base">{selected.flag}</span>
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                Prices in <span className="font-semibold" style={{ color: "var(--foreground)" }}>{selected.symbol} {selected.currency}</span>
              </p>
            </div>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{worldCountries.length} countries</p>
          </div>
        </div>
      )}
    </div>
  );
}