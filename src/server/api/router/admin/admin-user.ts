import users from "@/server/database/schema/users";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { orders } from "@/server/database/schema";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const adminUsersRouter = createTRPCRouter({
  getPaidUser: publicProcedure.query(async ({ ctx, input }) => {
    const userInfo = await ctx.db
      .select({
        id: users.id,
        email: users.email,
        orders:
          sql<string>`json_group_array(json_object('pricePaidInCents', ${orders.pricePaidInCents}))`.as(
            "orders",
          ),
      })
      .from(users)
      .innerJoin(orders, eq(users.id, orders.userId))
      .groupBy(users.id, users.email)
      .orderBy(desc(users.createdAt));
    return userInfo;
  }),
  deleteUser: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db
        .delete(users)
        .where(eq(users.id, input.id))
        .returning();
      return user;
    }),
});
