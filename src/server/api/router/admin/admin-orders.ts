import { orders, products, users } from "@/server/database/schema";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const adminOrdersRouter = createTRPCRouter({
  getOrderOverview: publicProcedure.query(async ({ ctx }) => {
    const orderOverview = await ctx.db
      .select({
        id: orders.id,
        pricePaidInCents: orders.pricePaidInCents,
        productName: products.name,
        email: users.email,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .innerJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    return orderOverview;
  }),
  deleteOrder: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db
        .delete(orders)
        .where(eq(orders.id, input.id))
        .returning();
      return order;
    }),
});
