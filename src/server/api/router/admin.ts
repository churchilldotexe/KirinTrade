import { createTRPCRouter, publicProcedure } from "../trpc";
import orders from "@/server/database/schema/orders";
import { eq, sql } from "drizzle-orm";
import { products, users } from "@/server/database/schema";

export const adminRouter = createTRPCRouter({
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
        userCount: sql<number>`sum(distinct ${users.id})`,
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

//const getProductData = async () => {
//  const [activeCount, inactiveCount] = await Promise.all([
//    db.product.count({ where: { isAvailableforPurchase: true } }),
//    db.product.count({ where: { isAvailableforPurchase: false } }),
//  ]);
//  return {
//    activeCount,
//    inactiveCount,
//  };
//};

//const getSaleData = async () => {
//  const data = await db.order.aggregate({
//    _sum: { pricePaidInCents: true },
//    _count: true,
//  });
//
//  return {
//    amount: (data._sum?.pricePaidInCents ?? 0) / 100,
//    numberOfSales: data._count,
//  };
//};
//
//
//const getUserData = async () => {
//  const [userCount, orderData] = await Promise.all([
//    db.user.count(),
//    db.order.aggregate({
//      _sum: { pricePaidInCents: true },
//    }),
//  ]);
//
//  return {
//    userCount,
//    averageValuePerUser:
//      userCount ?? (orderData._sum.pricePaidInCents ?? 0) / userCount / 100,
//  };
//};
