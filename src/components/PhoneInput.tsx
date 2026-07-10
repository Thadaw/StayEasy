import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { worldCountries } from "../data/worldCountries";
import { getPhoneCode } from "../data/phoneCodes";

interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  dialCode: string;                           // e.g. "+977"
  onDialCodeChange: (code: string, countryCode: string, flag: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  dialCode,
  onDialCodeChange,
  placeholder = "000 000 0000",
  required,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Selected country for showing the flag
  const selectedCountry = worldCountries.find(c => getPhoneCode(c.code) === dialCode) ?? worldCountries[0];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = query.trim()
    ? worldCountries.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        getPhoneCode(c.code).includes(query)
      )
    : worldCountries;

  function selectCountry(code: string, flag: string) {
    const dc = getPhoneCode(code);
    onDialCodeChange(dc, code, flag);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="flex rounded-xl border overflow-hidden transition-all focus-within:ring-2" style={{ borderColor: "var(--border)", "--tw-ring-color": "var(--primary)" } as React.CSSProperties}>
      {/* ── Dial-code selector ── */}
      <div ref={ref} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 pl-3 pr-2 py-3 h-full border-r transition-colors hover:bg-accent"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--input-background)" }}
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>
            {dialCode || "+1"}
          </span>
          <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "var(--muted-foreground)" }} />
        </button>

        {open && (
          <div
            className="absolute top-full left-0 z-50 bg-white rounded-xl shadow-2xl border overflow-hidden"
            style={{ width: "260px", borderColor: "var(--border)", marginTop: "4px" }}
          >
            {/* Search */}
            <div className="p-2 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
                <Search size={13} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search country or code…"
                  className="bg-transparent text-sm outline-none w-full"
                  style={{ color: "var(--foreground)" }}
                />
              </div>
            </div>

            {/* Country list */}
            <ul className="overflow-y-auto" style={{ maxHeight: "240px", scrollbarWidth: "thin" }}>
              {filtered.map(c => {
                const code = getPhoneCode(c.code);
                if (!code) return null;
                const isActive = code === dialCode && c.code === selectedCountry.code;
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => selectCountry(c.code, c.flag)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                      style={{ backgroundColor: isActive ? "var(--accent)" : "transparent" }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--accent)"; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <span className="text-xl leading-none shrink-0">{c.flag}</span>
                      <span className="flex-1 text-sm truncate" style={{ color: "var(--foreground)" }}>{c.name}</span>
                      <span className="text-sm font-semibold shrink-0" style={{ color: "var(--primary)" }}>{code}</span>
                    </button>
                  </li>
                );
              })}
              {filtered.filter(c => getPhoneCode(c.code)).length === 0 && (
                <li className="px-4 py-6 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>No results</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* ── Number input ── */}
      <input
        type="tel"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete="tel-national"
        className="flex-1 px-4 py-3 text-sm outline-none"
        style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)" }}
      />
    </div>
  );
}
