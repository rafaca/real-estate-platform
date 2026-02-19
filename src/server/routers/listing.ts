import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

export const listingRouter = router({
  /**
   * Get a single listing by ID
   */
  getById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const listing = await ctx.prisma.listing.findUnique({
        where: { id: input },
        include: {
          media: {
            orderBy: { sortOrder: "asc" },
          },
          features: {
            include: {
              feature: true,
            },
          },
          agent: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
          neighborhood: true,
          priceHistory: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Listing not found",
        });
      }

      // Increment view count (async, don't wait)
      ctx.prisma.listing
        .update({
          where: { id: input },
          data: { viewCount: { increment: 1 } },
        })
        .catch(() => {});

      return listing;
    }),

  /**
   * Get featured listings for homepage
   */
  getFeatured: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(20).default(8),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 8;

      return ctx.prisma.listing.findMany({
        where: {
          status: "ACTIVE",
        },
        include: {
          media: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
        take: limit,
      });
    }),

  /**
   * Get recent listings
   */
  getRecent: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(20),
          cursor: z.string().uuid().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const cursor = input?.cursor;

      const listings = await ctx.prisma.listing.findMany({
        where: {
          status: "ACTIVE",
        },
        include: {
          media: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { listedAt: "desc" },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: string | undefined;
      if (listings.length > limit) {
        const nextItem = listings.pop();
        nextCursor = nextItem?.id;
      }

      return {
        listings,
        nextCursor,
      };
    }),

  /**
   * Toggle favorite status
   */
  toggleFavorite: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.favorite.findUnique({
        where: {
          userId_listingId: {
            userId: ctx.userId,
            listingId: input,
          },
        },
      });

      if (existing) {
        await ctx.prisma.favorite.delete({
          where: { id: existing.id },
        });
        return { favorited: false };
      }

      await ctx.prisma.favorite.create({
        data: {
          userId: ctx.userId,
          listingId: input,
        },
      });

      return { favorited: true };
    }),

  /**
   * Check if listing is favorited by current user
   */
  isFavorited: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const favorite = await ctx.prisma.favorite.findUnique({
        where: {
          userId_listingId: {
            userId: ctx.userId,
            listingId: input,
          },
        },
      });

      return { favorited: !!favorite };
    }),
});
