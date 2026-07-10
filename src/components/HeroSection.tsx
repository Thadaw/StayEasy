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
    <section className="relative min-h-[340px] md:min-h-[420px] flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
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
      </div>

      {/* Hero Content */}
      <div className="relative z-[45] w-full max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-3 md:gap-5 py-6 md:py-12">
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
              fontWeight: 1000,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
            }}
          >
            Find Your Perfect Stay
            <br />
          </h1>

          <p
            className="max-w-xs sm:max-w-md md:max-w-lg"
            style={{
              fontSize: "clamp(0.875rem, 2.5vw, 1.0625rem)",
              color: "rgba(235,245,251,0.88)",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6,
            }}
          >
           Discover Hotels, Villas & Unique Accommadations Around The World.
          </p>
        </div>

        {/* Search */}
        <div id="hero-search" className="w-full max-w-3xl">
          <SearchBar />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-6">
          {[
            "50,000+ Properties",
            "195+ Countries",
            "4.9★ Avg Rating",
          ].map((stat) => (
            <div key={stat} className="flex items-center gap-1.5 md:gap-2">
              <div
                className="w-1 h-1.5 md:w-1.5 md:h-1.5 rounded-full"
                style={{ backgroundColor: "#2E86AB" }}
              />
              <span
                className="text-[0.75rem] md:text-[0.8125rem]"
                style={{
                  color: "rgba(235,245,251,0.8)",
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