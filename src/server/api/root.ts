import "server-only";
import { createCallerFactory, createTRPCRouter } from "./trpc";
import { productsRouter } from "./router/products";
import { ordersRouter } from "./router/orders";
import { downloadsRouter } from "./router/downloads";
import { usersRouter } from "./router/users";
import { dashboardRouter } from "./router/admin/admin-dashboard";
import { adminProductsRouter } from "./router/admin/admin-products";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  orders: ordersRouter,
  downloads: downloadsRouter,
  users: usersRouter,
  admin: { dashboard: dashboardRouter, products: adminProductsRouter },
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
