import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";

import Bg1 from "../assets/Bg1.png";
import Bg2 from "../assets/Bg2.png";
import Bg3 from "../assets/Bg3.png";

export function HeroSection() {
  const backgrounds = [Bg1, Bg2, Bg3];

  const [current, setCurrent] = useState(0);
  const [blackFade, setBlackFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade to black
      setBlackFade(true);

      // Change image while the screen is black
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % backgrounds.length);
      }, 1000);

      // Fade back to the new image
      setTimeout(() => {
        setBlackFade(false);
      }, 2000);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[540px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.70)), url(${backgrounds[current]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scale(1.05)",
          transition: "transform 10s ease-out",
        }}
      />

      {/* Black Fade Transition */}
      <div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{
          opacity: blackFade ? 1 : 0,
          transition: "opacity 1000ms ease-in-out",
          zIndex: 2,
        }}
      />

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          zIndex: 3,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 flex flex-col items-center text-center gap-8 py-20">
        <div className="flex flex-col items-center gap-4">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{
              backgroundColor: "rgba(46,134,171,0.3)",
              color: "#EBF5FB",
              border: "1px solid rgba(46,134,171,0.5)",
            }}
          >
            ✦ Discover your perfect stay
          </span>

          <h1
            style={{
              fontFamily: "'Sora', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
            }}
          >
            Find & Book
            <br />
            <span style={{ color: "#EBF5FB" }}>
              Extraordinary Hotels
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.0625rem",
              color: "rgba(235,245,251,0.88)",
              fontFamily: "'Inter', sans-serif",
              maxWidth: "500px",
              lineHeight: 1.6,
            }}
          >
            Hotels, villas & unique stays handpicked across 195+ countries —
            from Kathmandu to the Maldives.
          </p>
        </div>

        {/* Search */}
        <div id="hero-search" className="w-full max-w-3xl">
          <SearchBar />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            "50,000+ Properties",
            "195+ Countries",
            "4.9★ Avg Rating",
          ].map((stat) => (
            <div key={stat} className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#2E86AB" }}
              />
              <span
                style={{
                  color: "rgba(235,245,251,0.8)",
                  fontSize: "0.8125rem",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {stat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}