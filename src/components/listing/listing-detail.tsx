"use client";

import { Heart, Share2, Bed, Bath, Maximize, Calendar, Eye, TrendingDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice, formatSqm, formatRelativeTime } from "@/lib/utils";

interface ListingDetailProps {
  listing: {
    id: string;
    title: string;
    headline: string;
    description: string;
    price: number;
    currency: string;
    listingType: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    sqm: number;
    yearBuilt: number;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    neighborhood: string;
    energyClass: string;
    hoaFee: number;
    listedAt: Date;
    viewCount: number;
    saveCount: number;
    features: string[];
    priceHistory: { date: Date; price: number }[];
  };
}

export function ListingDetail({ listing }: ListingDetailProps) {
  const pricePerSqm = listing.sqm ? listing.price / listing.sqm : 0;
  const priceReduced =
    listing.priceHistory.length > 1 &&
    listing.priceHistory[listing.priceHistory.length - 1].price <
      listing.priceHistory[0].price;
  const priceReduction = priceReduced
    ? listing.priceHistory[0].price - listing.price
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        {/* Price */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900 price">
                {formatPrice(listing.price, listing.currency)}
              </span>
              {priceReduced && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-sm font-medium text-green-700">
                  <TrendingDown className="h-4 w-4" />
                  Reduced €{priceReduction.toLocaleString()}
                </span>
              )}
            </div>
            <div className="mt-1 text-gray-500">
              {formatPrice(pricePerSqm, listing.currency)}/m²
              {listing.hoaFee && (
                <span className="ml-3">
                  + €{listing.hoaFee}/mo HOA
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Title & Location */}
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">
          {listing.title}
        </h1>
        <p className="mt-1 text-gray-600">
          {listing.addressLine1}, {listing.neighborhood}, {listing.city} {listing.postalCode}
        </p>

        {/* Stats Row */}
        <div className="mt-4 flex items-center gap-6 text-gray-600">
          <span className="flex items-center gap-1.5">
            <Bed className="h-5 w-5" />
            {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} bedrooms`}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-5 w-5" />
            {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-5 w-5" />
            {formatSqm(listing.sqm)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-5 w-5" />
            Built {listing.yearBuilt}
          </span>
        </div>

        {/* Meta Info */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Listed {formatRelativeTime(listing.listedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {listing.viewCount} views
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {listing.saveCount} saves
          </span>
        </div>
      </div>

      {/* Description */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
        <div className="prose prose-gray max-w-none">
          {listing.description.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-600 whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </Card>

      {/* Features */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {listing.features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-gray-600"
            >
              <svg
                className="h-5 w-5 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </div>
          ))}
        </div>
      </Card>

      {/* Property Details */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Property Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <DetailRow label="Property Type" value={listing.propertyType} />
          <DetailRow label="Listing Type" value={listing.listingType === "SALE" ? "For Sale" : "For Rent"} />
          <DetailRow label="Bedrooms" value={listing.bedrooms === 0 ? "Studio" : listing.bedrooms.toString()} />
          <DetailRow label="Bathrooms" value={listing.bathrooms.toString()} />
          <DetailRow label="Size" value={formatSqm(listing.sqm)} />
          <DetailRow label="Price per m²" value={formatPrice(pricePerSqm, listing.currency)} />
          <DetailRow label="Year Built" value={listing.yearBuilt.toString()} />
          <DetailRow label="Energy Class" value={listing.energyClass || "N/A"} />
          {listing.hoaFee && (
            <DetailRow label="HOA Fee" value={`€${listing.hoaFee}/month`} />
          )}
        </div>
      </Card>

      {/* Price History */}
      {listing.priceHistory.length > 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Price History
          </h2>
          <div className="space-y-3">
            {listing.priceHistory.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-600">
                  {entry.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(entry.price, listing.currency)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
