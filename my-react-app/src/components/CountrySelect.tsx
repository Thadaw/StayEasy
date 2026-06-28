import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import { allCountries } from "../data/countries";

interface CountrySelectProps {
  value: string;
  onChange: (countryName: string) => void;
  placeholder?: string;
}

/**
 * Searchable "Country / Region" input.
 * Lists every country (ISO 3166-1, 200+ entries). Typing filters the list
 * live; clicking a result (or pressing Enter on the highlighted row)
 * selects that country into the field.
 */
export function CountrySelect({
  value,
  onChange,
  placeholder = "Search country or region",
}: CountrySelectProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery(value);
      }
    }
    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCountries;
    return allCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase() === q,
    );
  }, [query]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[highlight] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  function selectCountry(name: string) {
    onChange(name);
    setQuery(name);
    setOpen(false);
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter")
        setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlight])
        selectCountry(filtered[highlight].name);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery(value);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full px-4 py-3 pr-9 rounded-xl border border-border bg-input-background text-sm outline-none placeholder:text-muted-foreground"
        />
        <ChevronDown
          size={15}
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--muted-foreground)" }}
        />
      </div>

      {open && (
        <ul
          ref={listRef}
          className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border shadow-xl z-50 overflow-y-auto py-1"
          style={{
            borderColor: "var(--border)",
            maxHeight: "260px",
            scrollbarWidth: "thin",
          }}
        >
          {filtered.length === 0 ? (
            <li
              className="px-4 py-3 text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              No countries found
            </li>
          ) : (
            filtered.map((c, i) => {
              const isHighlighted = i === highlight;
              const isSelected = c.name === value;
              return (
                <li
                  key={c.code}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectCountry(c.name);
                  }}
                  onMouseEnter={() => setHighlight(i)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer"
                  style={{
                    backgroundColor: isHighlighted
                      ? "var(--accent)"
                      : "transparent",
                    color: "var(--foreground)",
                  }}
                >
                  <span className="text-base leading-none shrink-0">
                    {c.flag}
                  </span>
                  <span className="truncate flex-1">
                    {c.name}
                  </span>
                  {isSelected && (
                    <Check
                      size={13}
                      style={{ color: "var(--primary)" }}
                    />
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}