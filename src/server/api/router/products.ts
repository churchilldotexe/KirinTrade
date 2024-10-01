import "server-only";
import { asc, desc, eq, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import products from "@/server/database/schema/products";
import { orders } from "@/server/database/schema";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
  getNewestProducts: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(products)
      .where(eq(products.isAvailableforPurchase, true))
      .orderBy(desc(products.createdAt))
      .limit(6);
  }),
  getPopularProducts: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: products.id,
        name: products.name,
        priceInCents: products.priceInCents,
        filePath: products.filePath,
        imagePath: products.imagePath,
        description: products.description,
        isAvailableforPurchase: products.isAvailableforPurchase,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(orders, eq(products.id, orders.productId))
      .where(eq(products.isAvailableforPurchase, true))
      .groupBy(products.id)
      .orderBy(desc(sql<number>`cast(count(${orders.id}) as int )`))
      .limit(6);
  }),
  getAllProducts: publicProcedure
    .input(z.object({ sortby: z.enum(["popular", "newest", "name"]) }))
    .query(async ({ ctx, input }) => {
      const SORT_METHOD = {
        popular: desc(sql<number>`cast(count(${orders.id}) as int )`),
        newest: desc(products.createdAt),
        name: asc(products.name),
      };

      return ctx.db
        .select({
          id: products.id,
          name: products.name,
          priceInCents: products.priceInCents,
          filePath: products.filePath,
          imagePath: products.imagePath,
          description: products.description,
          isAvailableforPurchase: products.isAvailableforPurchase,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
        })
        .from(products)
        .leftJoin(orders, eq(products.id, orders.productId))
        .where(eq(products.isAvailableforPurchase, true))
        .groupBy(products.id)
        .orderBy(SORT_METHOD[input.sortby]);
    }),
  getMyProduct: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findFirst({
        where: (products, { eq }) => eq(products.id, input),
      });
    }),
});
