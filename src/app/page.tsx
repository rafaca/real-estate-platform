import { HeroSection } from "@/components/home/hero-section";
import { FeaturedListings } from "@/components/home/featured-listings";
import { HowItWorks } from "@/components/home/how-it-works";
import { PopularCities } from "@/components/home/popular-cities";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedListings />
      <PopularCities />
      <HowItWorks />
      <CTASection />
    </>
  );
}
