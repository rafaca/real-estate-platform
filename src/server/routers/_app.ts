import { router } from "@/server/trpc";
import { listingRouter } from "./listing";
import { searchRouter } from "./search";
import { userRouter } from "./user";

export const appRouter = router({
  listing: listingRouter,
  search: searchRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
