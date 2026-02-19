import Link from "next/link";
import Image from "next/image";

const cities = [
  {
    name: "Berlin",
    country: "Germany",
    listingsCount: 12500,
    imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800",
    slug: "berlin",
  },
  {
    name: "Munich",
    country: "Germany",
    listingsCount: 8200,
    imageUrl: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800",
    slug: "munich",
  },
  {
    name: "Barcelona",
    country: "Spain",
    listingsCount: 15800,
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
    slug: "barcelona",
  },
  {
    name: "Milan",
    country: "Italy",
    listingsCount: 9400,
    imageUrl: "https://images.unsplash.com/photo-1520440229-6469a149ac59?w=800",
    slug: "milan",
  },
  {
    name: "Paris",
    country: "France",
    listingsCount: 22000,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    slug: "paris",
  },
  {
    name: "Madrid",
    country: "Spain",
    listingsCount: 11200,
    imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
    slug: "madrid",
  },
];

export function PopularCities() {
  return (
    <section className="bg-gray-100 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Explore Popular Cities
          </h2>
          <p className="mt-2 text-gray-600">
            Browse properties in Europe&apos;s most sought-after locations
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/search?city=${city.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[16/10]"
            >
              {/* Image */}
              <Image
                src={city.imageUrl}
                alt={city.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">{city.name}</h3>
                <p className="text-white/80">{city.country}</p>
                <p className="mt-2 text-sm text-white/70">
                  {city.listingsCount.toLocaleString()} properties
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
