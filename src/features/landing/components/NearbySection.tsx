import { useNearbyProperties } from "../../search/hooks/useNearbyProperties";
import { PropertyCard } from "./PropertyCard";
import { PropertySection } from "./PropertySection";

export function NearbySection() {
  const { properties, loading } = useNearbyProperties(10);

  return (
    <PropertySection
      title="Stays nearby"
      linkTo="/search?where=Nearby"
      loading={loading}
      isEmpty={!loading && properties.length === 0}
      emptyMessage="No nearby properties found. Try allowing location access."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {properties.map((property) => (
          <PropertyCard key={property.property_id} property={property} showDistance />
        ))}
      </div>
    </PropertySection>
  );
}
