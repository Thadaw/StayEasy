import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Check, Globe } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
];

export function LanguagePicker() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = languages.find((l) => l.code === i18n.language) || languages[0];

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
    ? languages.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.nativeName.toLowerCase().includes(query.toLowerCase())
      )
    : languages;

  function chooseLanguage(lang: Language) {
    i18n.changeLanguage(lang.code);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-colors hover:bg-accent"
        style={{ border: "1px solid var(--border)", backgroundColor: "white" }}
      >
        <Globe size={15} style={{ color: "var(--foreground)" }} />
        <span
          className="hidden md:inline text-sm font-medium max-w-[80px] truncate"
          style={{ color: "var(--foreground)" }}
        >
          {selected.name}
        </span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--muted-foreground)" }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50 w-[240px]"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="px-3 pt-3 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
            <p
              className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              <Globe size={11} /> {t("selectLanguage")}
            </p>
            <div
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg mt-2"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <input
                autoFocus
                type="text"
                placeholder={t("searchLanguages")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent text-xs outline-none w-full"
                style={{ color: "var(--foreground)" }}
              />
            </div>
          </div>

          {!query && (
            <div
              className="px-3 py-2 flex items-center gap-2 border-b"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--accent)" }}
            >
              <span className="text-lg leading-none">{selected.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: "var(--primary)" }}>
                  {selected.name}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  {selected.nativeName}
                </p>
              </div>
              <Check size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
            </div>
          )}

          <ul
            className="overflow-y-auto py-1"
            style={{ maxHeight: "240px", scrollbarWidth: "thin" }}
          >
            {filtered.length === 0 ? (
              <li
                className="px-3 py-6 text-center text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("noLanguagesFound")}
              </li>
            ) : (
              filtered.map((lang) => {
                const isSelected = selected.code === lang.code;
                return (
                  <li key={lang.code}>
                    <button
                      onClick={() => chooseLanguage(lang)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left"
                      style={{
                        backgroundColor: isSelected ? "var(--accent)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span className="text-lg leading-none shrink-0">{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: "var(--foreground)" }}
                        >
                          {lang.name}
                        </p>
                        <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                          {lang.nativeName}
                        </p>
                      </div>
                      {isSelected && <Check size={12} style={{ color: "var(--primary)" }} />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          <div
            className="border-t px-3 py-2 flex items-center gap-1.5"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}
          >
            <Globe size={11} style={{ color: "var(--muted-foreground)" }} />
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {t("languagesAvailable", { count: languages.length })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
