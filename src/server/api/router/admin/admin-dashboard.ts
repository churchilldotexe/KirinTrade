import orders from "@/server/database/schema/orders";
import { eq, sql } from "drizzle-orm";
import { products, users } from "@/server/database/schema";
import { createTRPCRouter, publicProcedure } from "../../trpc";

export const dashboardRouter = createTRPCRouter({
  getSaleData: publicProcedure.query(async ({ ctx }) => {
    const salesData = await ctx.db
      .select({
        numberOfSales: sql<number>`count(distinct ${orders.id})`,
        amount: sql<number>`sum(${orders.pricePaidInCents}) / 100`,
      })
      .from(orders)
      .get();

    return salesData;
  }),
  getUserData: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .select({
        userCount: sql<number>`count(distinct ${users.id})`,
        orderData: sql<number>`sum(${orders.pricePaidInCents})`,
      })
      .from(users)
      .leftJoin(orders, sql`TRUE`)
      .get();

    return {
      userCount: data?.userCount,
      averageValuePerUser: (data?.orderData ?? 0) / data?.userCount! / 100,
    };
  }),
  getProductData: publicProcedure.query(async ({ ctx }) => {
    const activeData = await ctx.db
      .select({ activeCount: sql<number>`count(${products.id})` })
      .from(products)
      .where(eq(products.isAvailableforPurchase, true))
      .groupBy(products.id)
      .get();

    const inActiveData = await ctx.db
      .select({ inActiveCount: sql<number>`count(${products.id})` })
      .from(products)
      .where(eq(products.isAvailableforPurchase, false))
      .groupBy(products.id)
      .get();
    return {
      activeCount: activeData?.activeCount,
      inactiveCount: inActiveData?.inActiveCount,
    };
  }),
});
