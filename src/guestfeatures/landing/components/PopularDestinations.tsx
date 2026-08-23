import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { popularDestinations } from "../../../data/popularDestinations";
import { DestinationCard } from "../../../shared/components/DestinationCard";

export function PopularDestinations() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showPrev, setShowPrev] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(() => {
      if (scrollRef.current) setShowPrev(scrollRef.current.scrollLeft > 10);
    }, 350);
  };

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold font-display text-brand-heading">
          Popular destinations
        </h2>
      </div>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide"
        >
          {popularDestinations.map((dest, index) => (
            <div key={index} className="shrink-0 w-[160px] sm:w-[200px]" onClick={() => { window.scrollTo(0, 0); navigate(`/country/${dest.countryCode}`); }}>
              <DestinationCard
                city={dest.city}
                country={dest.country}
                imageUrl={dest.image}
                properties={dest.properties}
              />
            </div>
          ))}
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
