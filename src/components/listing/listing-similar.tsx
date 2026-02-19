"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Bed, Bath, Maximize, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface SimilarListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  propertyType: string;
  city: string;
  image: string;
}

interface ListingSimilarProps {
  currentListingId: string;
  propertyType: string;
  city: string;
  priceRange: {
    min: number;
    max: number;
  };
}

// Mock similar listings (would come from API)
const mockSimilarListings: SimilarListing[] = [
  {
    id: "sim-1",
    title: "Elegant Apartment with Balcony",
    price: 425000,
    currency: "EUR",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 72,
    propertyType: "APARTMENT",
    city: "Berlin",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  },
  {
    id: "sim-2",
    title: "Renovated City Center Flat",
    price: 489000,
    currency: "EUR",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 95,
    propertyType: "APARTMENT",
    city: "Berlin",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  },
  {
    id: "sim-3",
    title: "Modern Loft in Prenzlauer Berg",
    price: 520000,
    currency: "EUR",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 88,
    propertyType: "APARTMENT",
    city: "Berlin",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
  },
  {
    id: "sim-4",
    title: "Spacious Family Apartment",
    price: 475000,
    currency: "EUR",
    bedrooms: 4,
    bathrooms: 2,
    sqm: 120,
    propertyType: "APARTMENT",
    city: "Berlin",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  },
  {
    id: "sim-5",
    title: "Charming Altbau Apartment",
    price: 399000,
    currency: "EUR",
    bedrooms: 2,
    bathrooms: 1,
    sqm: 68,
    propertyType: "APARTMENT",
    city: "Berlin",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
  },
  {
    id: "sim-6",
    title: "Penthouse with Terrace",
    price: 680000,
    currency: "EUR",
    bedrooms: 3,
    bathrooms: 2,
    sqm: 145,
    propertyType: "APARTMENT",
    city: "Berlin",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  },
];

export function ListingSimilar({
  currentListingId,
  propertyType,
  city,
  priceRange,
}: ListingSimilarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter out current listing and get similar ones
  const similarListings = mockSimilarListings.filter(
    (listing) => listing.id !== currentListingId
  );

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 320; // Card width + gap
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const newScroll = direction === "left"
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  };

  if (similarListings.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar Properties</h2>
          <p className="text-gray-500 mt-1">
            More {propertyType.toLowerCase()}s in {city} you might like
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("left")}
            className="p-2"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("right")}
            className="p-2"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {similarListings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            className="flex-shrink-0 w-[300px] snap-start"
          >
            <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle favorite toggle
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                </button>
                {/* Property Type Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded-full">
                    {listing.propertyType === "APARTMENT" ? "Apartment" :
                     listing.propertyType === "HOUSE" ? "House" :
                     listing.propertyType === "PENTHOUSE" ? "Penthouse" :
                     listing.propertyType}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Price */}
                <div className="text-lg font-bold text-primary-600">
                  {formatPrice(listing.price, listing.currency)}
                </div>

                {/* Title */}
                <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                  {listing.title}
                </h3>

                {/* Location */}
                <p className="text-sm text-gray-500 mt-1">{listing.city}</p>

                {/* Features */}
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{listing.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{listing.sqm} m²</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {/* View All Card */}
        <Link
          href={`/search?city=${city}&propertyType=${propertyType}&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`}
          className="flex-shrink-0 w-[300px] snap-start"
        >
          <Card className="h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors min-h-[350px]">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <ChevronRight className="h-8 w-8 text-primary-600" />
              </div>
              <p className="font-semibold text-gray-900">View All Similar</p>
              <p className="text-sm text-gray-500 mt-1">
                See more properties like this
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="flex justify-center gap-1 mt-4 md:hidden">
        {similarListings.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300"
          />
        ))}
      </div>
    </section>
  );
}
