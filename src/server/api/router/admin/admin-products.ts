import products from "@/server/database/schema/products";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { asc, eq, sql } from "drizzle-orm";
import { orders } from "@/server/database/schema";
import { z } from "zod";
import { randomUUID } from "crypto";

export const adminProductsRouter = createTRPCRouter({
  getAllProductsData: publicProcedure.query(async ({ ctx }) => {
    const productsData = await ctx.db
      .select({
        name: products.name,
        id: products.id,
        isAvailableforPurchase: products.isAvailableforPurchase,
        priceInCents: products.priceInCents,
        ordersCount: sql<number>`count(distinct ${orders.id})`,
      })
      .from(products)
      .innerJoin(orders, eq(orders.productId, products.id))
      .orderBy(asc(products.name));
    return productsData;
  }),
  createProduct: publicProcedure
    .input(
      z.object({
        isAvailableforPurchase: z.boolean(),
        name: z.string().min(1),
        priceInCents: z.number(),
        description: z.string(),
        filePath: z.string(),
        imagePath: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const uuid = randomUUID();
      const {
        isAvailableforPurchase,
        imagePath,
        filePath,
        description,
        priceInCents,
        name,
      } = input;

      await ctx.db.insert(products).values({
        isAvailableforPurchase,
        name,
        priceInCents,
        filePath,
        imagePath,
        description,
        id: uuid,
      });
    }),
  updateProduct: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        priceInCents: z.number(),
        description: z.string().min(1),
        filePath: z.string().min(1),
        imagePath: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { imagePath, filePath, id, description, priceInCents, name } =
        input;

      await ctx.db
        .update(products)
        .set({
          name,
          imagePath,
          filePath,
          description,
          priceInCents,
          updatedAt: sql`(strftime('%s', 'now'))`,
        })
        .where(eq(products.id, id));
    }),
  updateProductAvailability: publicProcedure
    .input(
      z.object({ isAvailableforPurchase: z.boolean(), id: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(products)
        .set({
          isAvailableforPurchase: input.isAvailableforPurchase,
          updatedAt: sql`(strftime('%s','now'))`,
        })
        .where(eq(products.id, input.id));
    }),
  deleteProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(products)
        .where(eq(products.id, input.id))
        .returning()
        .get();
    }),
});
