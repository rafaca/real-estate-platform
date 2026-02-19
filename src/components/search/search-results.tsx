"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, Bed, Bath, Maximize, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatPrice, formatSqm, formatRelativeTime } from "@/lib/utils";
import { useSearchStore } from "@/lib/stores/search-store";

// Placeholder data - will be replaced with API data
const mockListings = [
  {
    id: "1",
    title: "Modern Apartment in Mitte",
    price: 450000,
    currency: "EUR",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 75,
    city: "Berlin",
    neighborhood: "Mitte",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    listedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    pricePerSqm: 6000,
    latitude: 52.5302,
    longitude: 13.4008,
  },
  {
    id: "2",
    title: "Charming House with Garden",
    price: 680000,
    currency: "EUR",
    bedrooms: 4,
    bathrooms: 2,
    sqm: 160,
    city: "Munich",
    neighborhood: "Schwabing",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    listedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    pricePerSqm: 4250,
    latitude: 48.1623,
    longitude: 11.5869,
  },
  {
    id: "3",
    title: "Beachfront Apartment",
    price: 520000,
    currency: "EUR",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 110,
    city: "Barcelona",
    neighborhood: "Barceloneta",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    listedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    pricePerSqm: 4727,
    latitude: 41.3784,
    longitude: 2.1925,
  },
  {
    id: "4",
    title: "Historic Townhouse",
    price: 890000,
    currency: "EUR",
    bedrooms: 5,
    bathrooms: 3,
    sqm: 220,
    city: "Milan",
    neighborhood: "Brera",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    listedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    pricePerSqm: 4045,
    latitude: 45.4729,
    longitude: 9.1870,
  },
  {
    id: "5",
    title: "Penthouse with Rooftop Terrace",
    price: 1250000,
    currency: "EUR",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 150,
    city: "Paris",
    neighborhood: "Le Marais",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    listedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    pricePerSqm: 8333,
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    id: "6",
    title: "Cozy Studio in City Center",
    price: 185000,
    currency: "EUR",
    bedrooms: 0,
    bathrooms: 1,
    sqm: 35,
    city: "Berlin",
    neighborhood: "Kreuzberg",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    listedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    pricePerSqm: 5286,
    latitude: 52.4990,
    longitude: 13.4180,
  },
];

export function SearchResults() {
  const searchParams = useSearchParams();
  const { hoveredListingId, setHoveredListingId } = useSearchStore();

  // TODO: Replace with actual API call using tRPC
  // const { data, isLoading } = trpc.search.listings.useQuery({ ... });

  const listings = mockListings;
  const totalCount = listings.length;

  // Get sort from URL
  const sortBy = searchParams.get("sort") || "newest";

  return (
    <div className="p-4">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {totalCount} Properties Found
          </h1>
          <p className="text-sm text-gray-500">
            in your selected area
          </p>
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("sort", e.target.value);
            window.location.href = `/search?${params.toString()}`;
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="sqm_desc">Size: Large to Small</option>
        </select>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isHovered={hoveredListingId === listing.id}
            onHover={() => setHoveredListingId(listing.id)}
            onLeave={() => setHoveredListingId(null)}
          />
        ))}
      </div>

      {/* Load More */}
      {listings.length > 0 && (
        <div className="mt-8 text-center">
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Load more results
          </button>
        </div>
      )}

      {/* Empty State */}
      {listings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your filters or expanding your search area
          </p>
        </div>
      )}
    </div>
  );
}

interface ListingCardProps {
  listing: (typeof mockListings)[0];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function ListingCard({ listing, isHovered, onHover, onLeave }: ListingCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all duration-200 ${
        isHovered ? "ring-2 ring-primary-500 shadow-lg" : ""
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-72 h-48 sm:h-auto flex-shrink-0">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 288px"
          />

          {/* New Badge */}
          {listing.listedAt > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
            <span className="absolute top-3 left-3 rounded-full bg-green-500 px-2.5 py-1 text-xs font-medium text-white">
              New
            </span>
          )}

          {/* Favorite Button */}
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            aria-label="Add to favorites"
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              {/* Price */}
              <div className="text-xl font-bold text-gray-900 price">
                {formatPrice(listing.price, listing.currency)}
              </div>
              <div className="text-sm text-gray-500">
                {formatPrice(listing.pricePerSqm, listing.currency)}/m²
              </div>
            </div>

            {/* Listed Date */}
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {formatRelativeTime(listing.listedAt)}
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-2 font-medium text-gray-900">
            <Link
              href={`/listings/${listing.id}`}
              className="hover:text-primary-600"
            >
              {listing.title}
            </Link>
          </h3>

          {/* Location */}
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <MapPin className="mr-1 h-4 w-4" />
            {listing.neighborhood}, {listing.city}
          </div>

          {/* Features */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} beds`}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {listing.bathrooms} bath{listing.bathrooms !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              {formatSqm(listing.sqm)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
