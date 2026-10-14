import { useSearchProperties } from "@/services/queries/propertyQueries";
import { PropertyCard } from "@/components/home/PropertyCard";
import { PropertySection } from "@/components/home/PropertySection";

interface CitySectionProps {
  city: string;
}

export function CitySection({ city }: CitySectionProps) {
  const { data: properties = [], isLoading: loading } = useSearchProperties(city, 10);

  return (
    <PropertySection
      title={`Stays in ${city}`}
      linkTo={`/search?where=${city}`}
      loading={loading}
      isEmpty={!loading && properties.length === 0}
      emptyMessage={`No properties found in ${city}.`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-8">
        {properties.map((property) => (
          <PropertyCard key={property.property_id} property={property} />
        ))}
      </div>
    </PropertySection>
  );
}
