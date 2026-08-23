import { trustBadges } from "../../../data/trustBadges";

export function TrustBadgesSection() {
  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-10 md:py-14 border-t border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {trustBadges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand-accent-light flex items-center justify-center mb-3">
                <Icon size={22} className="text-brand-accent" />
              </div>
              <h3 className="text-sm font-semibold mb-1 text-brand-heading">{badge.title}</h3>
              <p className="text-xs text-brand-text-secondary">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
