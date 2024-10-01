import "server-only";
import { createCallerFactory, createTRPCRouter } from "./trpc";
import { productsRouter } from "./router/products";
import { ordersRouter } from "./router/orders";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
