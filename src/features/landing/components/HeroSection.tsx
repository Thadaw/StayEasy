import { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SearchBar } from "../../../shared/components/SearchBar";
import { heroHotels } from "../../../data/heroHotels";
import { vibes } from "../../../data/vibes";
import { getDefaultDates } from "../../../shared/utils/date";
import api from "../../../services/axios";
import { HeroCard } from "../../../shared/components/HeroCard";

interface NearbyProperty {
  property_id: string;
  name: string;
  city: string;
  country: string;
  cover_photo: string;
  lowest_rate: number;
  currency: string;
  distance_km?: number;
}

const vibeKeyMap: Record<string, string> = {
  All: "vibeAll",
  Beach: "vibeBeach",
  Mountains: "vibeMountains",
  City: "vibeCity",
  Countryside: "vibeCountryside",
  Design: "vibeDesign",
  Trending: "vibeTrending",
};

export function HeroSection() {
  const { t } = useTranslation();
  const [activeVibe, setActiveVibe] = useState("All");
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [nearbyProperties, setNearbyProperties] = useState<NearbyProperty[]>([]);

  useEffect(() => {
    const loadNearbyProperties = async () => {
      try {
        let lat: number | null = null;
        let lon: number | null = null;

        const stored = localStorage.getItem("nearbyLocation");
        const match = stored?.match(/([\d.-]+),\s*([\d.-]+)/);
        if (match) {
          lat = parseFloat(match[1]);
          lon = parseFloat(match[2]);
        } else {
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
            });
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
          } catch {
            // geolocation not available
          }
        }

        if (lat == null || lon == null) return;

        const { today, tomorrow } = getDefaultDates();
        const { data } = await api.get("/search/nearby", {
          params: { lat, lon, limit: 10, check_in: today, check_out: tomorrow, adults: 2, children: 0, rooms: 1 },
        });
        const results: NearbyProperty[] = data?.data || [];
        const sorted = results
          .filter((p) => p.lowest_rate != null)
          .sort((a, b) => a.lowest_rate - b.lowest_rate)
          .slice(0, 3);
        if (sorted.length > 0) setNearbyProperties(sorted);
    } catch {
      // Geolocation or API failure — nearby section stays hidden.
    }
  };
  loadNearbyProperties();
  }, []);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("locationPopupSeen");
    if (!hasSeenPopup) {
      setShowLocationPopup(true);
    }
  }, []);

  const handleAllowLocation = async () => {
    if (navigator.geolocation) {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const status = await navigator.permissions.query({ name: "geolocation" });
          if (status.state === "granted") {
            localStorage.setItem("locationPopupSeen", "true");
            setShowLocationPopup(false);
            window.location.reload();
            return;
          }
        } catch {
          // fall through to getCurrentPosition
        }
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          localStorage.setItem("nearbyLocation", `Nearby (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
          localStorage.setItem("locationPopupSeen", "true");
          setShowLocationPopup(false);
          window.location.reload();
        },
        () => {
          localStorage.setItem("nearbyLocation", "Nearby");
          localStorage.setItem("locationPopupSeen", "true");
          setShowLocationPopup(false);
        },
        { timeout: 15000 }
      );
    } else {
      localStorage.setItem("nearbyLocation", "Nearby");
      localStorage.setItem("locationPopupSeen", "true");
      setShowLocationPopup(false);
    }
  };

  const handleSkipLocation = () => {
    localStorage.setItem("locationPopupSeen", "true");
    setShowLocationPopup(false);
  };

  const heroCardData = nearbyProperties.length >= 3
    ? nearbyProperties.slice(0, 3).map((p) => ({
        id: p.property_id,
        name: p.name,
        city: p.city || "",
        country: p.country || "",
        price: Math.round(p.lowest_rate),
        currency: p.currency || "$",
        image: p.cover_photo || "",
        distance: p.distance_km,
      }))
    : null;

  return (
    <section className="relative w-full min-h-[240px] md:min-h-[280px] lg:min-h-[320px] overflow-visible bg-brand-background">
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1440 320" fill="none" preserveAspectRatio="xMidYMid slice">
        <path d="M-100 200 Q200 150 400 220 T800 180 T1200 240 T1600 200" stroke="var(--brand-accent)" strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.4" />
        <path d="M-50 280 Q250 230 500 300 T900 260 T1300 320 T1700 280" stroke="var(--brand-accent)" strokeWidth="1" strokeDasharray="4 6" fill="none" opacity="0.3" />
        <path d="M-80 360 Q220 310 480 380 T880 340 T1280 400 T1680 360" stroke="var(--brand-accent)" strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.25" />
        <path d="M-30 440 Q270 390 520 460 T920 420 T1320 480 T1720 440" stroke="var(--brand-accent)" strokeWidth="1" strokeDasharray="4 6" fill="none" opacity="0.2" />
      </svg>

      <div className="hidden md:block absolute top-[18%] right-[32%] w-2.5 h-2.5 rounded-full bg-brand-accent opacity-60" />
      <div className="hidden md:block absolute top-[25%] right-[28%] w-2 h-2 rounded-full bg-brand-accent opacity-40" />
      <div className="hidden md:block absolute top-[15%] right-[38%] w-1.5 h-1.5 rounded-full bg-brand-accent opacity-50" />
      <div className="hidden md:block absolute top-[40%] right-[25%] w-2 h-2 rounded-full bg-brand-accent opacity-35" />
      <div className="hidden md:block absolute bottom-[35%] left-[48%] w-2.5 h-2.5 rounded-full bg-brand-accent opacity-50" />
      <div className="hidden md:block absolute bottom-[25%] right-[22%] w-1.5 h-1.5 rounded-full bg-brand-accent opacity-40" />
      <div className="hidden md:block absolute top-[12%] left-[15%] w-3 h-3 rounded-full bg-brand-accent opacity-30" />
      <div className="hidden md:block absolute top-[55%] left-[10%] w-2 h-2 rounded-full bg-brand-accent opacity-45" />
      <div className="hidden md:block absolute top-[8%] right-[50%] w-1.5 h-1.5 rounded-full bg-brand-accent opacity-55" />
      <div className="hidden md:block absolute top-[45%] right-[42%] w-2.5 h-2.5 rounded-full bg-brand-accent opacity-25" />
      <div className="hidden md:block absolute bottom-[15%] left-[30%] w-2 h-2 rounded-full bg-brand-accent opacity-50" />
      <div className="hidden md:block absolute bottom-[45%] right-[15%] w-3 h-3 rounded-full bg-brand-accent opacity-35" />
      <div className="hidden md:block absolute top-[60%] left-[55%] w-1.5 h-1.5 rounded-full bg-brand-accent opacity-60" />
      <div className="hidden md:block absolute bottom-[20%] left-[65%] w-2 h-2 rounded-full bg-brand-accent opacity-40" />
      <div className="hidden md:block absolute top-[5%] left-[40%] w-2 h-2 rounded-full bg-brand-accent opacity-30" />
      <div className="hidden md:block absolute bottom-[50%] left-[20%] w-1.5 h-1.5 rounded-full bg-brand-accent opacity-55" />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 py-4 sm:py-5 md:py-6 flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-10 min-h-[240px] md:min-h-[280px] lg:min-h-[320px]">
        <div className="flex-1 w-full max-w-2xl pt-2 md:pt-4 lg:pt-0">
          <h1
            className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] tracking-tight mb-4 md:mb-5 font-brand font-extrabold text-brand-heading"
          >
            {t("heroHeading1")}
            <br />
            {t("heroHeading2")}
          </h1>

          <p
            className="text-[0.875rem] md:text-[1.05rem] mb-6 md:mb-8 leading-relaxed text-brand-text-secondary max-w-[400px]"
          >
            {t("heroSubtext1")}
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>{t("heroSubtext2")}
          </p>

          <div className="relative z-30 mr-0 lg:mr-[-150px] xl:mr-[-57px]">
            <SearchBar />
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600 mb-3">{t("exploreByVibe")}</p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
              {vibes.map((vibe) => {
                const Icon = vibe.icon;
                const isActive = activeVibe === vibe.label;
                return (
                  <button
                    key={vibe.label}
                    onClick={() => setActiveVibe(vibe.label)}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-brand-accent text-white border-brand-accent shadow-md shadow-brand-accent/20"
                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-accent hover:text-brand-accent hover:bg-brand-accent-light"
                    }`}
                  >
                    <Icon size={14} />
                    {t(vibeKeyMap[vibe.label] || vibe.label)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5 md:mt-6">
            <span className="text-brand-accent text-base md:text-lg">✦</span>
            <p className="text-xs sm:text-sm text-gray-500">
              {t("trustText")}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex relative w-[380px] h-[340px] xl:w-[480px] xl:h-[430px] shrink-0 items-center justify-center mx-auto">
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 480 430" fill="none">
            <path d="M50 8 Q120 40 180 80 T260 120" stroke="var(--brand-accent)" strokeWidth="1.5" strokeDasharray="8 6" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M260 120 C180 160 120 220 130 300" stroke="var(--brand-accent)" strokeWidth="1.5" strokeDasharray="8 6" fill="none" opacity="0.45" strokeLinecap="round" />
            <path d="M130 300 C160 340 250 350 350 340" stroke="var(--brand-accent)" strokeWidth="1.5" strokeDasharray="8 6" fill="none" opacity="0.45" strokeLinecap="round" />
            <path d="M350 340 C380 300 370 200 260 120" stroke="var(--brand-accent)" strokeWidth="1.5" strokeDasharray="8 6" fill="none" opacity="0.45" strokeLinecap="round" />
            <g transform="translate(50, 20) rotate(180) scale(1.3)" opacity="0.8">
              <path d="M0 0 L20 8 L0 16 L3 8 Z" fill="var(--brand-accent)" />
            </g>
          </svg>

          <div className="absolute left-[200px] top-[100px] xl:left-[260px] xl:top-[120px] -translate-x-1/2 -translate-y-1/2 w-[210px] xl:w-[260px] z-20 rotate-[4deg]">
            <HeroCard
              data={heroCardData ? heroCardData[0] : { id: String(heroHotels[0].id), name: heroHotels[0].location, city: "", country: "", price: heroHotels[0].price, currency: "$", image: heroHotels[0].image }}
              fallbackName={heroHotels[0].location}
              fallbackLocation={heroHotels[0].location}
              fallbackPrice={heroHotels[0].price}
            />
          </div>

          <div className="absolute left-[100px] top-[240px] xl:left-[130px] xl:top-[300px] -translate-x-1/2 -translate-y-1/2 w-[210px] xl:w-[260px] z-10 -rotate-[3deg]">
            <HeroCard
              data={heroCardData ? heroCardData[1] : { id: String(heroHotels[1].id), name: heroHotels[1].location, city: "", country: "", price: heroHotels[1].price, currency: "$", image: heroHotels[1].image }}
              fallbackName={heroHotels[1].location}
              fallbackLocation={heroHotels[1].location}
              fallbackPrice={heroHotels[1].price}
            />
          </div>

          <div className="absolute left-[280px] top-[270px] xl:left-[350px] xl:top-[340px] -translate-x-1/2 -translate-y-1/2 w-[210px] xl:w-[260px] z-15 rotate-[2deg]">
            <HeroCard
              data={heroCardData ? heroCardData[2] : { id: String(heroHotels[2].id), name: heroHotels[2].location, city: "", country: "", price: heroHotels[2].price, currency: "$", image: heroHotels[2].image }}
              fallbackName={heroHotels[2].location}
              fallbackLocation={heroHotels[2].location}
              fallbackPrice={heroHotels[2].price}
            />
          </div>
        </div>
      </div>

      {showLocationPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in">
            <button
              onClick={handleSkipLocation}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X size={16} className="text-gray-600" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-brand-accent-light flex items-center justify-center mb-4">
                <MapPin size={28} className="text-brand-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--brand-heading)" }}>
                Find stays nearby
              </h3>
              <p className="text-sm mb-6" style={{ color: "var(--brand-text-secondary)" }}>
                Allow location access to discover properties close to you automatically.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleSkipLocation}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
                  style={{ color: "var(--brand-heading)" }}
                >
                  Skip
                </button>
                <button
                  onClick={handleAllowLocation}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors"
                >
                  Allow location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes animate-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-in { animation: animate-in 0.15s ease-out; }
      `}</style>
    </section>
  );
}
