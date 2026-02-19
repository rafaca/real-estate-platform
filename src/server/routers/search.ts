import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import { Prisma } from "@prisma/client";

const searchFiltersSchema = z.object({
  query: z.string().optional(),
  listingType: z.enum(["SALE", "RENT"]).optional(),
  propertyTypes: z.array(z.string()).optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  bedroomsMin: z.number().optional(),
  bedroomsMax: z.number().optional(),
  bathroomsMin: z.number().optional(),
  sqmMin: z.number().optional(),
  sqmMax: z.number().optional(),
  yearBuiltMin: z.number().optional(),
  yearBuiltMax: z.number().optional(),
  features: z.array(z.string()).optional(),
  city: z.string().optional(),
  neighborhoodId: z.string().uuid().optional(),
  // Geo search
  bounds: z
    .object({
      north: z.number(),
      south: z.number(),
      east: z.number(),
      west: z.number(),
    })
    .optional(),
  // Sorting
  sortBy: z
    .enum(["price_asc", "price_desc", "newest", "sqm_asc", "sqm_desc"])
    .default("newest"),
  // Pagination
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const searchRouter = router({
  /**
   * Main search endpoint
   */
  listings: publicProcedure
    .input(searchFiltersSchema)
    .query(async ({ ctx, input }) => {
      const {
        query,
        listingType,
        propertyTypes,
        priceMin,
        priceMax,
        bedroomsMin,
        bedroomsMax,
        bathroomsMin,
        sqmMin,
        sqmMax,
        yearBuiltMin,
        yearBuiltMax,
        features,
        city,
        neighborhoodId,
        bounds,
        sortBy,
        page,
        limit,
      } = input;

      // Build WHERE clause
      const where: Prisma.ListingWhereInput = {
        status: "ACTIVE",
      };

      if (listingType) {
        where.listingType = listingType;
      }

      if (propertyTypes?.length) {
        where.propertyType = { in: propertyTypes as any };
      }

      if (priceMin !== undefined || priceMax !== undefined) {
        where.price = {};
        if (priceMin !== undefined) where.price.gte = priceMin;
        if (priceMax !== undefined) where.price.lte = priceMax;
      }

      if (bedroomsMin !== undefined || bedroomsMax !== undefined) {
        where.bedrooms = {};
        if (bedroomsMin !== undefined) where.bedrooms.gte = bedroomsMin;
        if (bedroomsMax !== undefined) where.bedrooms.lte = bedroomsMax;
      }

      if (bathroomsMin !== undefined) {
        where.bathrooms = { gte: bathroomsMin };
      }

      if (sqmMin !== undefined || sqmMax !== undefined) {
        where.sqm = {};
        if (sqmMin !== undefined) where.sqm.gte = sqmMin;
        if (sqmMax !== undefined) where.sqm.lte = sqmMax;
      }

      if (yearBuiltMin !== undefined || yearBuiltMax !== undefined) {
        where.yearBuilt = {};
        if (yearBuiltMin !== undefined) where.yearBuilt.gte = yearBuiltMin;
        if (yearBuiltMax !== undefined) where.yearBuilt.lte = yearBuiltMax;
      }

      if (city) {
        where.city = { contains: city, mode: "insensitive" };
      }

      if (neighborhoodId) {
        where.neighborhoodId = neighborhoodId;
      }

      if (features?.length) {
        where.features = {
          some: {
            feature: {
              slug: { in: features },
            },
          },
        };
      }

      // Full-text search on title and description
      if (query) {
        where.OR = [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { addressLine1: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
        ];
      }

      // Geo bounds (for map search)
      if (bounds) {
        where.latitude = { gte: bounds.south, lte: bounds.north };
        where.longitude = { gte: bounds.west, lte: bounds.east };
      }

      // Build ORDER BY
      let orderBy: Prisma.ListingOrderByWithRelationInput;
      switch (sortBy) {
        case "price_asc":
          orderBy = { price: "asc" };
          break;
        case "price_desc":
          orderBy = { price: "desc" };
          break;
        case "sqm_asc":
          orderBy = { sqm: "asc" };
          break;
        case "sqm_desc":
          orderBy = { sqm: "desc" };
          break;
        case "newest":
        default:
          orderBy = { listedAt: "desc" };
      }

      // Execute queries in parallel
      const [listings, totalCount, aggregations] = await Promise.all([
        ctx.prisma.listing.findMany({
          where,
          include: {
            media: {
              where: { isPrimary: true },
              take: 1,
            },
          },
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.prisma.listing.count({ where }),
        // Get price aggregations for filters
        ctx.prisma.listing.aggregate({
          where: { status: "ACTIVE" },
          _min: { price: true },
          _max: { price: true },
          _avg: { price: true },
        }),
      ]);

      return {
        listings,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: page * limit < totalCount,
        },
        aggregations: {
          priceMin: aggregations._min.price,
          priceMax: aggregations._max.price,
          priceAvg: aggregations._avg.price,
        },
      };
    }),

  /**
   * Autocomplete for search suggestions
   */
  autocomplete: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(100),
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, limit } = input;

      // Search cities
      const cities = await ctx.prisma.listing.findMany({
        where: {
          status: "ACTIVE",
          city: { contains: query, mode: "insensitive" },
        },
        select: { city: true, state: true },
        distinct: ["city"],
        take: limit,
      });

      // Search neighborhoods
      const neighborhoods = await ctx.prisma.neighborhood.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
        },
        select: { id: true, name: true, city: true },
        take: limit,
      });

      return {
        cities: cities.map((c) => ({
          type: "city" as const,
          label: `${c.city}, ${c.state}`,
          value: c.city,
        })),
        neighborhoods: neighborhoods.map((n) => ({
          type: "neighborhood" as const,
          label: `${n.name}, ${n.city}`,
          value: n.id,
        })),
      };
    }),

  /**
   * Get available features for filtering
   */
  getFeatures: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.feature.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
  }),
});
