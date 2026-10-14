import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { Footer } from "@/components/layout/Footer";
import { PropertyTypesSection } from "@/components/home/PropertyTypesSection";
import { NearbySection, NearbyLocationBanner } from "@/components/home/NearbySection";
import { CitySection } from "@/components/home/CitySection";
import { PopularDestinations } from "@/components/home/PopularDestinations";
import { TrustBadgesSection } from "@/components/home/TrustBadgesSection";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-jakarta">
      <Navbar />
      <HeroSection />
      <PropertyTypesSection />
      <NearbyLocationBanner />
      <NearbySection />
      <CitySection city="Kathmandu" />
      <CitySection city="Pokhara" />
      <PopularDestinations />
      <TrustBadgesSection />
      <Footer />

    </div>
  );
}
