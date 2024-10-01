import "server-only";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { orders, users } from "@/server/database/schema";
import { and, eq } from "drizzle-orm";

export const ordersRouter = createTRPCRouter({
  getMyOrder: publicProcedure
    .input(
      z.object({ email: z.string().email(), productId: z.string().min(1) }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({ id: orders.id })
        .from(orders)
        .innerJoin(users, eq(orders.userId, users.id))
        .where(
          and(
            eq(users.email, input.email),
            eq(orders.productId, input.productId),
          ),
        );
    }),
});
