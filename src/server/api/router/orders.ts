import "server-only";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { orders, products, users } from "@/server/database/schema";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";

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
  createOrder: publicProcedure
    .input(
      z.object({
        pricePaidInCents: z.number(),
        userId: z.string(),
        productId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const uuid = randomUUID();
      return await ctx.db
        .insert(orders)
        .values({
          id: uuid,
          productId: input.productId,
          userId: input.userId,
          pricePaidInCents: input.pricePaidInCents,
        })
        .onConflictDoUpdate({
          target: orders.id,
          set: { pricePaidInCents: input.pricePaidInCents },
        })
        .returning();
    }),
});
