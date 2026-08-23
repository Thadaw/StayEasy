import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { testimonials } from "../../../data/testimonials";

export function TestimonialSection() {
  const [current, setCurrent] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setItemsPerPage(3);
      else if (window.innerWidth >= 768) setItemsPerPage(2);
      else setItemsPerPage(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-10 md:py-14 bg-gray-50">
      <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-10 text-center font-display text-brand-heading">
        What travelers say
      </h2>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * (100 / itemsPerPage)}%)` }}
        >
          {testimonials.map((t) => (
            <div key={t.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 md:px-3">
              <div className="bg-white rounded-2xl p-6 shadow-sm relative h-full">
                <Quote size={32} className="text-brand-accent opacity-20 absolute top-4 left-4" />
                <p className="text-sm leading-relaxed mb-6 relative z-10 pt-6 text-brand-text-secondary">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center text-white text-sm font-bold">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-heading">{t.name}</p>
                    <p className="text-xs text-brand-text-secondary">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-8">
        {Array.from({ length: Math.ceil(testimonials.length / itemsPerPage) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${current === i ? "bg-brand-accent w-6" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </section>
  );
}
