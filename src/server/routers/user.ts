import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";

export const userRouter = router({
  /**
   * Get current user profile
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        phone: true,
        locale: true,
        notificationPreferences: true,
        createdAt: true,
      },
    });
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
        phone: z.string().max(20).optional(),
        locale: z.string().max(10).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: input,
      });
    }),

  /**
   * Update notification preferences
   */
  updateNotificationPreferences: protectedProcedure
    .input(
      z.object({
        email: z
          .object({
            newListings: z.boolean(),
            priceDrops: z.boolean(),
            digest: z.enum(["instant", "daily", "weekly", "never"]),
          })
          .optional(),
        push: z
          .object({
            newListings: z.boolean(),
            priceDrops: z.boolean(),
            bids: z.boolean(),
          })
          .optional(),
        sms: z
          .object({
            bids: z.boolean(),
            urgent: z.boolean(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          notificationPreferences: input,
        },
      });
    }),

  /**
   * Get user's saved searches
   */
  getSavedSearches: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.savedSearch.findMany({
      where: {
        userId: ctx.userId,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  /**
   * Save a search
   */
  saveSearch: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        criteria: z.record(z.unknown()),
        notificationsEnabled: z.boolean().default(true),
        notificationFrequency: z
          .enum(["INSTANT", "HOURLY", "DAILY", "WEEKLY"])
          .default("INSTANT"),
        notificationChannels: z
          .array(z.enum(["EMAIL", "PUSH", "SMS"]))
          .default(["EMAIL", "PUSH"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.savedSearch.create({
        data: {
          userId: ctx.userId,
          name: input.name,
          criteria: input.criteria as object,
          notificationsEnabled: input.notificationsEnabled,
          notificationFrequency: input.notificationFrequency,
          notificationChannels: input.notificationChannels,
        },
      });
    }),

  /**
   * Delete a saved search
   */
  deleteSavedSearch: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.savedSearch.deleteMany({
        where: {
          id: input,
          userId: ctx.userId,
        },
      });
      return { success: true };
    }),

  /**
   * Get user's favorites
   */
  getFavorites: protectedProcedure
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(50).default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;

      const [favorites, totalCount] = await Promise.all([
        ctx.prisma.favorite.findMany({
          where: { userId: ctx.userId },
          include: {
            listing: {
              include: {
                media: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.prisma.favorite.count({
          where: { userId: ctx.userId },
        }),
      ]);

      return {
        favorites,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }),
});
