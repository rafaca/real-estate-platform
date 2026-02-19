import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ListingDetail } from "@/components/listing/listing-detail";
import { ListingGallery } from "@/components/listing/listing-gallery";
import { ListingMap } from "@/components/listing/listing-map";
import { ListingContact } from "@/components/listing/listing-contact";
import { ListingSimilar } from "@/components/listing/listing-similar";

// Mock data - will be replaced with API call
const getMockListing = (id: string) => {
  const listings: Record<string, any> = {
    "1": {
      id: "1",
      title: "Modern Apartment in Mitte",
      headline: "Stunning 2-bedroom apartment in the heart of Berlin",
      description: `Beautiful modern apartment with high ceilings, hardwood floors, and a spacious balcony overlooking the city. Recently renovated with a new kitchen and bathroom. Perfect for professionals or small families.

The apartment features:
• Open-plan living and dining area with large windows
• Fully equipped modern kitchen with high-end appliances
• Two spacious bedrooms with built-in wardrobes
• Modern bathroom with walk-in shower
• Private balcony with city views
• Hardwood floors throughout
• High ceilings (3.2m)

Located in the heart of Mitte, you'll be within walking distance of excellent restaurants, cafes, and cultural attractions. The U-Bahn station is just 2 minutes away.`,
      price: 450000,
      currency: "EUR",
      listingType: "SALE",
      propertyType: "APARTMENT",
      bedrooms: 2,
      bathrooms: 1,
      sqm: 75,
      yearBuilt: 1920,
      addressLine1: "Torstraße 123",
      city: "Berlin",
      state: "Berlin",
      postalCode: "10119",
      country: "DE",
      neighborhood: "Mitte",
      latitude: 52.5302,
      longitude: 13.4008,
      energyClass: "C",
      hoaFee: 250,
      listedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      viewCount: 342,
      saveCount: 28,
      images: [
        { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200", caption: "Living Room" },
        { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200", caption: "Kitchen" },
        { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200", caption: "Bedroom" },
        { url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200", caption: "Bathroom" },
        { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200", caption: "Balcony View" },
      ],
      features: [
        "Hardwood Floors",
        "High Ceilings",
        "Modern Kitchen",
        "Balcony",
        "Central Heating",
        "Elevator",
      ],
      agent: {
        id: "agent-1",
        name: "Maria Schmidt",
        phone: "+49 30 1234567",
        email: "maria.schmidt@realestate.de",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        agency: "Berlin Premier Realty",
      },
      priceHistory: [
        { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), price: 475000 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), price: 450000 },
      ],
    },
  };

  return listings[id] || null;
};

// Required for static export - generate pages for all known listings
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const listing = getMockListing(id);

  if (!listing) {
    return { title: "Listing Not Found" };
  }

  return {
    title: listing.title,
    description: listing.headline,
    openGraph: {
      title: listing.title,
      description: listing.headline,
      images: [listing.images[0]?.url],
    },
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const listing = getMockListing(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Gallery */}
      <ListingGallery images={listing.images} title={listing.title} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Suspense fallback={<DetailSkeleton />}>
              <ListingDetail listing={listing} />
            </Suspense>

            {/* Map */}
            <div className="mt-8">
              <ListingMap listing={listing} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ListingContact listing={listing} agent={listing.agent} />
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        <div className="mt-16">
          <Suspense fallback={<SimilarSkeleton />}>
            <ListingSimilar
              currentListingId={listing.id}
              city={listing.city}
              propertyType={listing.propertyType}
              priceRange={{
                min: listing.price * 0.8,
                max: listing.price * 1.2,
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-2/3 bg-gray-200 rounded" />
      <div className="h-6 w-1/3 bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="h-4 w-3/4 bg-gray-100 rounded" />
    </div>
  );
}

function SimilarSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
          <div className="h-40 bg-gray-200 rounded-lg" />
          <div className="h-5 w-24 bg-gray-200 rounded mt-4" />
          <div className="h-4 w-32 bg-gray-100 rounded mt-2" />
        </div>
      ))}
    </div>
  );
}
