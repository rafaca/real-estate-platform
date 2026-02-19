"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type ListingType = "sale" | "rent";

export function HeroSection() {
  const router = useRouter();
  const [listingType, setListingType] = useState<ListingType>("sale");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("type", listingType);
    if (searchQuery) {
      params.set("q", searchQuery);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative bg-primary-950 text-white overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-primary-950/75" />

      <div className="container relative mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          {/* Tagline */}
          <p className="tagline text-accent-400 mb-8">
            Luxury European Real Estate
          </p>

          {/* Headline - LV style: large, light weight */}
          <h1 className="hero-headline text-white mb-6">
            Discover
            <span className="block text-accent-300 mt-1">Exceptional Properties</span>
          </h1>

          <p className="text-[13px] text-accent-100/70 leading-relaxed max-w-md mb-12 tracking-wide">
            Curated luxury residences across Europe's most prestigious addresses.
            From Parisian apartments to Mediterranean estates.
          </p>

          {/* Search Form */}
          <div>
            {/* Listing Type Tabs */}
            <div className="mb-6 inline-flex gap-1">
              <button
                onClick={() => setListingType("sale")}
                className={cn(
                  "px-6 py-2 text-[10px] font-medium tracking-[0.15em] uppercase transition-all",
                  listingType === "sale"
                    ? "bg-white text-primary-900"
                    : "text-white/70 hover:text-white border border-white/20"
                )}
              >
                Purchase
              </button>
              <button
                onClick={() => setListingType("rent")}
                className={cn(
                  "px-6 py-2 text-[10px] font-medium tracking-[0.15em] uppercase transition-all",
                  listingType === "rent"
                    ? "bg-white text-primary-900"
                    : "text-white/70 hover:text-white border border-white/20"
                )}
              >
                Lease
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-400" />
                  <input
                    type="text"
                    placeholder="City, region, or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white py-4 pl-11 pr-4 text-primary-900 placeholder:text-primary-400 focus:outline-none text-[13px] tracking-wide"
                  />
                </div>
                <button
                  type="submit"
                  className="h-[52px] px-8 bg-primary-900 text-white hover:bg-primary-800 transition-colors flex items-center justify-center gap-2 btn-text"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </form>

            {/* Featured Locations */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <span className="label-text text-accent-400/50">Featured</span>
              {["Paris", "Monaco", "Milan", "Barcelona", "Vienna"].map(
                (city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSearchQuery(city);
                      router.push(`/search?type=${listingType}&q=${city}`);
                    }}
                    className="text-[11px] tracking-[0.1em] text-white/60 hover:text-white transition-colors uppercase"
                  >
                    {city}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Stats - positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
          <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-3xl">
              {[
                { label: "Properties", value: "2,500+" },
                { label: "Countries", value: "12" },
                { label: "Clients", value: "1,800+" },
                { label: "Years", value: "25+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-light text-white tracking-wide">{stat.value}</div>
                  <div className="label-text text-accent-400/50 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
