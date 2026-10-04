import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { useNearbyProperties } from "../../search/hooks/useNearbyProperties";
import { PropertyCard } from "./PropertyCard";
import { PropertySection } from "./PropertySection";

export function NearbySection() {
  const [dismissed, setDismissed] = useState(false);
  const denied = localStorage.getItem("locationDenied") === "true";
  const { data: properties = [], isLoading: loading } = useNearbyProperties(10);

  if (denied && !dismissed) {
    return (
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="bg-brand-accent-light border border-brand-accent/20 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
            <MapPin size={20} className="text-brand-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-brand-heading mb-1">Enable location to discover nearby stays</h3>
            <p className="text-xs text-brand-text-secondary mb-3">Allow location access to see properties close to you.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem("locationDenied");
                  localStorage.removeItem("nearbyLocation");
                  window.location.reload();
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors cursor-pointer"
              >
                Allow location
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-brand-card-border text-brand-text-secondary hover:bg-brand-secondary-surface transition-colors cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-brand-placeholder hover:text-brand-text-secondary transition-colors cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </section>
    );
  }

  if (denied || (!loading && properties.length === 0)) return null;

  return (
    <PropertySection
      title="Stays nearby"
      loading={loading}
      isEmpty={!loading && properties.length === 0}
      emptyMessage="No nearby properties found. Try allowing location access."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-8">
        {properties.map((property) => (
          <PropertyCard key={property.property_id} property={property} showDistance />
        ))}
      </div>
    </PropertySection>
  );
}
