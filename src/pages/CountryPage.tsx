import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Calendar, Utensils, Clock, ChevronRight } from "lucide-react";
import { getCountry } from "../data/worldCountries";
import { hotels } from "../data/hotels";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { HotelCard } from "../components/HotelCard";

export default function CountryPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const country = getCountry(code?.toUpperCase() || "");
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const countryHotels = hotels.filter((h) =>
    h.country?.toLowerCase() === country?.name.toLowerCase() ||
    h.location?.toLowerCase().includes(country?.name.toLowerCase() || "")
  );
  const displayHotels = countryHotels.length > 0 ? countryHotels : hotels.slice(0, 4);

  const selectedCity = activeCity
    ? country?.cities.find((c) => c.name === activeCity)
    : null;

  if (!country) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <p className="text-4xl">🌍</p>
        <p className="text-lg font-semibold">Country not found</p>
        <Link to="/" className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <div
        className="relative h-[480px] flex flex-col justify-end overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%), url('${selectedCity?.image || country.heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.5s ease",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 pb-10 w-full">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">{country.flag}</span>
                <div>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", lineHeight: 1.1 }}>
                    {selectedCity ? selectedCity.name : country.name}
                  </h1>
                  {selectedCity && <p className="text-white/80 text-sm mt-1">{country.name} · {country.flag}</p>}
                </div>
              </div>
              <p className="text-white/85 max-w-xl text-sm leading-relaxed">
                {selectedCity ? selectedCity.description : country.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                <Clock size={12} /> Best time: {country.bestTime}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                {country.currency} · {country.symbol}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="font-semibold text-foreground mb-4" style={{ fontSize: "1.125rem" }}>
            Popular cities & places in {country.name}
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCity(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all"
              style={{
                backgroundColor: !activeCity ? "var(--foreground)" : "white",
                color: !activeCity ? "white" : "var(--foreground)",
                borderColor: !activeCity ? "var(--foreground)" : "var(--border)",
              }}
            >
              <MapPin size={13} /> All of {country.name}
            </button>
            {country.cities.map((city) => (
              <button
                key={city.name}
                onClick={() => setActiveCity(city.name === activeCity ? null : city.name)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all hover:shadow-md"
                style={{
                  backgroundColor: activeCity === city.name ? "var(--primary)" : "white",
                  color: activeCity === city.name ? "white" : "var(--foreground)",
                  borderColor: activeCity === city.name ? "var(--primary)" : "var(--border)",
                }}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {selectedCity && (
          <div className="bg-white rounded-2xl border border-border p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.375rem", color: "var(--foreground)", marginBottom: "0.75rem" }}>
                About {selectedCity.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{selectedCity.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedCity.bestFor.map((b) => (
                  <span key={b} className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">{b}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Top Attractions</p>
              <ul className="flex flex-col gap-2">
                {selectedCity.attractions.map((attr, i) => (
                  <li key={attr} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    {attr}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!selectedCity && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: MapPin, label: "Capital", value: country.capital },
              { icon: Star, label: "Top Attraction", value: country.topAttractions[0] },
              { icon: Utensils, label: "Must Try", value: country.cuisine[0] },
              { icon: Calendar, label: "Best Time", value: country.bestTime },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className="text-primary" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                </div>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        )}

        {!selectedCity && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star size={16} className="text-primary" /> Top Attractions
              </h3>
              <ul className="flex flex-col gap-3">
                {country.topAttractions.map((a, i) => (
                  <li key={a} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Utensils size={16} className="text-primary" /> Local Cuisine
              </h3>
              <div className="flex flex-wrap gap-2">
                {country.cuisine.map((dish) => (
                  <span key={dish} className="text-sm px-3 py-2 rounded-xl bg-muted text-foreground font-medium">{dish}</span>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">Explore Cities</h4>
                <div className="flex flex-col gap-2">
                  {country.cities.slice(0, 4).map((city) => (
                    <button key={city.name} onClick={() => setActiveCity(city.name)}
                      className="flex items-center justify-between text-sm text-foreground hover:text-primary hover:bg-muted px-3 py-2 rounded-xl transition-colors">
                      <span className="flex items-center gap-2"><MapPin size={13} className="text-muted-foreground" />{city.name}</span>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.5rem", color: "var(--foreground)" }}>
              {selectedCity ? `Stays in ${selectedCity.name}` : `Stays in ${country.name}`}
            </h2>
            <Link to="/" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayHotels.map((h) => <HotelCard key={h.id} {...h} />)}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
