import { PrismaClient, PropertyType, ListingType, ListingStatus, FeatureCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create features
  const featureData = [
    { category: FeatureCategory.INTERIOR, name: "Hardwood Floors", slug: "hardwood-floors", icon: "floor" },
    { category: FeatureCategory.INTERIOR, name: "Fireplace", slug: "fireplace", icon: "fire" },
    { category: FeatureCategory.INTERIOR, name: "High Ceilings", slug: "high-ceilings", icon: "ceiling" },
    { category: FeatureCategory.INTERIOR, name: "Open Floor Plan", slug: "open-floor-plan", icon: "layout" },
    { category: FeatureCategory.KITCHEN, name: "Modern Kitchen", slug: "modern-kitchen", icon: "kitchen" },
    { category: FeatureCategory.KITCHEN, name: "Kitchen Island", slug: "kitchen-island", icon: "island" },
    { category: FeatureCategory.EXTERIOR, name: "Garden", slug: "garden", icon: "garden" },
    { category: FeatureCategory.EXTERIOR, name: "Terrace", slug: "terrace", icon: "terrace" },
    { category: FeatureCategory.EXTERIOR, name: "Pool", slug: "pool", icon: "pool" },
    { category: FeatureCategory.PARKING, name: "Garage", slug: "garage", icon: "garage" },
    { category: FeatureCategory.PARKING, name: "Parking Space", slug: "parking-space", icon: "parking" },
    { category: FeatureCategory.HEATING_COOLING, name: "Central Heating", slug: "central-heating", icon: "heating" },
    { category: FeatureCategory.HEATING_COOLING, name: "Air Conditioning", slug: "air-conditioning", icon: "ac" },
    { category: FeatureCategory.GREEN, name: "Solar Panels", slug: "solar-panels", icon: "sun" },
    { category: FeatureCategory.GREEN, name: "Energy Efficient", slug: "energy-efficient", icon: "leaf" },
    { category: FeatureCategory.SECURITY, name: "Security System", slug: "security-system", icon: "shield" },
    { category: FeatureCategory.VIEW, name: "City View", slug: "city-view", icon: "city" },
    { category: FeatureCategory.VIEW, name: "Mountain View", slug: "mountain-view", icon: "mountain" },
  ];

  for (const feature of featureData) {
    await prisma.feature.upsert({
      where: { slug: feature.slug },
      update: {},
      create: feature,
    });
  }

  console.log(`Created ${featureData.length} features`);

  // Create neighborhoods
  const neighborhoods = [
    { name: "Mitte", slug: "berlin-mitte", city: "Berlin", state: "Berlin", country: "DE" },
    { name: "Prenzlauer Berg", slug: "berlin-prenzlauer-berg", city: "Berlin", state: "Berlin", country: "DE" },
    { name: "Kreuzberg", slug: "berlin-kreuzberg", city: "Berlin", state: "Berlin", country: "DE" },
    { name: "Schwabing", slug: "munich-schwabing", city: "Munich", state: "Bavaria", country: "DE" },
    { name: "Maxvorstadt", slug: "munich-maxvorstadt", city: "Munich", state: "Bavaria", country: "DE" },
    { name: "Barceloneta", slug: "barcelona-barceloneta", city: "Barcelona", state: "Catalonia", country: "ES" },
    { name: "Eixample", slug: "barcelona-eixample", city: "Barcelona", state: "Catalonia", country: "ES" },
    { name: "Brera", slug: "milan-brera", city: "Milan", state: "Lombardy", country: "IT" },
    { name: "Navigli", slug: "milan-navigli", city: "Milan", state: "Lombardy", country: "IT" },
    { name: "Le Marais", slug: "paris-le-marais", city: "Paris", state: "Île-de-France", country: "FR" },
  ];

  for (const neighborhood of neighborhoods) {
    await prisma.neighborhood.upsert({
      where: { slug: neighborhood.slug },
      update: {},
      create: neighborhood,
    });
  }

  console.log(`Created ${neighborhoods.length} neighborhoods`);

  // Get neighborhood IDs for listings
  const mitteNeighborhood = await prisma.neighborhood.findUnique({ where: { slug: "berlin-mitte" } });
  const schwabingNeighborhood = await prisma.neighborhood.findUnique({ where: { slug: "munich-schwabing" } });
  const barcelonetaNeighborhood = await prisma.neighborhood.findUnique({ where: { slug: "barcelona-barceloneta" } });

  // Create sample listings
  const listings = [
    {
      title: "Modern Apartment in Mitte",
      headline: "Stunning 2-bedroom apartment in the heart of Berlin",
      description: "Beautiful modern apartment with high ceilings, hardwood floors, and a spacious balcony overlooking the city. Recently renovated with a new kitchen and bathroom. Perfect for professionals or small families.",
      listingType: ListingType.SALE,
      status: ListingStatus.ACTIVE,
      propertyType: PropertyType.APARTMENT,
      price: 450000,
      currency: "EUR",
      bedrooms: 2,
      bathrooms: 1,
      sqm: 75,
      yearBuilt: 1920,
      addressLine1: "Torstraße 123",
      city: "Berlin",
      state: "Berlin",
      postalCode: "10119",
      country: "DE",
      latitude: 52.5302,
      longitude: 13.4008,
      neighborhoodId: mitteNeighborhood?.id,
      energyClass: "C",
      listedAt: new Date(),
    },
    {
      title: "Charming Family House with Garden",
      headline: "Spacious 4-bedroom house in quiet Schwabing neighborhood",
      description: "Wonderful family home with a large garden, garage, and modern amenities. Features include a renovated kitchen, three bathrooms, and a cozy fireplace in the living room. Close to parks and excellent schools.",
      listingType: ListingType.SALE,
      status: ListingStatus.ACTIVE,
      propertyType: PropertyType.HOUSE,
      price: 980000,
      currency: "EUR",
      bedrooms: 4,
      bathrooms: 3,
      sqm: 180,
      lotSqm: 450,
      yearBuilt: 1985,
      addressLine1: "Leopoldstraße 45",
      city: "Munich",
      state: "Bavaria",
      postalCode: "80802",
      country: "DE",
      latitude: 48.1623,
      longitude: 11.5869,
      neighborhoodId: schwabingNeighborhood?.id,
      energyClass: "B",
      listedAt: new Date(),
    },
    {
      title: "Beachfront Apartment with Sea Views",
      headline: "Luxurious 3-bedroom apartment steps from the beach",
      description: "Exceptional seafront property with panoramic Mediterranean views. Open-plan living area, modern kitchen, and a large terrace perfect for entertaining. Building has pool and 24-hour concierge service.",
      listingType: ListingType.SALE,
      status: ListingStatus.ACTIVE,
      propertyType: PropertyType.APARTMENT,
      price: 720000,
      currency: "EUR",
      bedrooms: 3,
      bathrooms: 2,
      sqm: 120,
      yearBuilt: 2018,
      addressLine1: "Passeig Marítim 88",
      city: "Barcelona",
      state: "Catalonia",
      postalCode: "08003",
      country: "ES",
      latitude: 41.3784,
      longitude: 2.1925,
      neighborhoodId: barcelonetaNeighborhood?.id,
      energyClass: "A",
      listedAt: new Date(),
    },
    {
      title: "Cozy Studio in City Center",
      headline: "Perfect starter apartment or investment property",
      description: "Compact but well-designed studio apartment in a prime location. Recently updated with modern finishes. Building has elevator and bike storage. Ideal for young professionals or as a rental investment.",
      listingType: ListingType.RENT,
      status: ListingStatus.ACTIVE,
      propertyType: PropertyType.APARTMENT,
      price: 1200,
      currency: "EUR",
      bedrooms: 0,
      bathrooms: 1,
      sqm: 35,
      yearBuilt: 2010,
      addressLine1: "Rosenthaler Straße 40",
      city: "Berlin",
      state: "Berlin",
      postalCode: "10178",
      country: "DE",
      latitude: 52.5265,
      longitude: 13.4020,
      neighborhoodId: mitteNeighborhood?.id,
      energyClass: "B",
      listedAt: new Date(),
    },
  ];

  for (const listingData of listings) {
    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        pricePerSqm: listingData.sqm ? listingData.price / listingData.sqm : null,
      },
    });

    // Add sample images
    await prisma.listingMedia.createMany({
      data: [
        {
          listingId: listing.id,
          type: "IMAGE",
          url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=1200`,
          thumbnailUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400`,
          isPrimary: true,
          sortOrder: 0,
        },
        {
          listingId: listing.id,
          type: "IMAGE",
          url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=1200`,
          isPrimary: false,
          sortOrder: 1,
        },
      ],
    });

    console.log(`Created listing: ${listing.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
