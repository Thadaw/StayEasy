import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { propertyTypes } from "../../../data/propertyTypes";

export function PropertyTypesSection() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showPrev, setShowPrev] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 240;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(() => {
      if (scrollRef.current) setShowPrev(scrollRef.current.scrollLeft > 10);
    }, 350);
  };

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 font-display text-brand-heading">
        Browse by property type
      </h2>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide"
        >
          {propertyTypes.map((property, index) => {
            const Icon = property.icon;
            return (
              <div key={index} className="shrink-0 w-[260px] sm:w-[300px] group cursor-pointer" onClick={() => { window.scrollTo(0, 0); navigate(`/search?propertyTypes=${property.type}`); }}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                  <img
                    src={property.imageUrl}
                    alt={property.type}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center mb-2">
                      <Icon size={18} className="text-gray-800" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-white drop-shadow">{property.type}</h3>
                    <p className="text-[11px] md:text-xs text-white/80 drop-shadow mt-0.5">{property.subtitle}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {showPrev && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
        )}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      </div>
    </section>
  );
}
