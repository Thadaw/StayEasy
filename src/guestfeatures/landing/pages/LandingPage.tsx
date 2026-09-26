import { Navbar } from "../../../shared/components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { Footer } from "../../../shared/components/Footer";
import { PropertyTypesSection } from "../components/PropertyTypesSection";
import { NearbySection, NearbyLocationBanner } from "../components/NearbySection";
import { CitySection } from "../components/CitySection";
import { PopularDestinations } from "../components/PopularDestinations";
import { TrustBadgesSection } from "../components/TrustBadgesSection";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-jakarta">
      <Navbar />
      <HeroSection />
      <PropertyTypesSection />
      <NearbyLocationBanner />
      <NearbySection />
      <CitySection city="kathmandu" />
      <CitySection city="pokhara" />
      <PopularDestinations />
      <TrustBadgesSection />
      <Footer />

    </div>
  );
}
