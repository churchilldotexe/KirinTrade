import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { orders, products, users } from "@/server/database/schema";
import { desc, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getUserOrder: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const userOrders = await ctx.db
        .select({
          userId: users.id,
          email: users.email,
          pricePaidInCents: orders.pricePaidInCents,
          orderId: orders.id,
          createdAt: orders.createdAt,
          productId: products.id,
          productName: products.name,
          imagePath: products.imagePath,
          description: products.description,
        })
        .from(users)
        .where(eq(users.email, input.email))
        .leftJoin(orders, eq(users.id, orders.userId))
        .leftJoin(products, eq(orders.productId, products.id))
        .orderBy(desc(orders.createdAt));

      return userOrders;
    }),
  getUserIdByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        columns: { id: true },
        where: (users, { eq }) => eq(users.email, input.email),
      });
      return user;
    }),
  createUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const uuid = randomUUID();

      const [user] = await ctx.db
        .insert(users)
        .values({ id: uuid, email: input.email })
        .onConflictDoNothing({ target: users.email })
        .returning({ userId: users.id });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to create your download verification",
        });
      }
      return user;
    }),
});
