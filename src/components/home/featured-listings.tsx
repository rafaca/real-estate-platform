import Link from "next/link";
import Image from "next/image";
import { Heart, Bed, Bath, Maximize, MapPin, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatPrice, formatSqm } from "@/lib/utils";

// Placeholder data - will be replaced with real data from API
const featuredListings = [
  {
    id: "1",
    title: "Elegant Penthouse with Panoramic Views",
    price: 2850000,
    currency: "EUR",
    bedrooms: 4,
    bathrooms: 3,
    sqm: 280,
    city: "Paris",
    neighborhood: "16th Arrondissement",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    isNew: true,
    type: "Penthouse",
  },
  {
    id: "2",
    title: "Mediterranean Villa with Private Pool",
    price: 4200000,
    currency: "EUR",
    bedrooms: 6,
    bathrooms: 5,
    sqm: 450,
    city: "Monaco",
    neighborhood: "Monte Carlo",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    isNew: false,
    type: "Villa",
  },
  {
    id: "3",
    title: "Historic Palazzo Apartment",
    price: 1890000,
    currency: "EUR",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 185,
    city: "Milan",
    neighborhood: "Brera",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    isNew: true,
    type: "Apartment",
  },
  {
    id: "4",
    title: "Waterfront Estate with Private Dock",
    price: 5750000,
    currency: "EUR",
    bedrooms: 7,
    bathrooms: 6,
    sqm: 620,
    city: "Barcelona",
    neighborhood: "Sitges",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    isNew: false,
    type: "Estate",
  },
];

export function FeaturedListings() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16">
          <div>
            <p className="tagline text-accent-600 mb-4">
              Curated Selection
            </p>
            <h2 className="section-title text-primary-900">
              Featured Properties
            </h2>
            <p className="mt-4 text-[13px] text-primary-600/70 max-w-md leading-relaxed">
              Exceptional residences handpicked by our specialists from Europe's most prestigious addresses.
            </p>
          </div>
          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-2 text-[11px] text-primary-700 hover:text-primary-900 tracking-[0.1em] uppercase mt-6 sm:mt-0 group"
          >
            View Collection
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-[11px] text-primary-700 hover:text-primary-900 tracking-[0.1em] uppercase"
          >
            View Collection
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface ListingCardProps {
  listing: (typeof featuredListings)[0];
}

function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="listing-card overflow-hidden group bg-white border-accent-200/50">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="label-text px-3 py-1.5 bg-primary-900/90 text-white">
            {listing.type}
          </span>
          {listing.isNew && (
            <span className="label-text px-3 py-1.5 bg-secondary-700 text-white">
              New
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4 text-primary-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center text-[10px] text-primary-500 uppercase tracking-[0.15em]">
          <MapPin className="mr-1.5 h-3 w-3" />
          {listing.neighborhood}, {listing.city}
        </div>

        {/* Title */}
        <h3 className="mt-3 text-[14px] font-normal text-primary-900 leading-snug tracking-wide">
          <Link href={`/listings/${listing.id}`} className="hover:text-secondary-700 transition-colors">
            {listing.title}
          </Link>
        </h3>

        {/* Features */}
        <div className="mt-4 flex items-center gap-5 text-[11px] text-primary-600 tracking-wide">
          <span className="flex items-center gap-1.5">
            <Bed className="h-3 w-3" />
            {listing.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-3 w-3" />
            {listing.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-3 w-3" />
            {formatSqm(listing.sqm)}
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 pt-4 border-t border-accent-200/50">
          <div className="price text-primary-900">
            {formatPrice(listing.price, listing.currency)}
          </div>
        </div>
      </div>
    </Card>
  );
}
