import "server-only";
import { createCallerFactory, createTRPCRouter } from "./trpc";
import { productsRouter } from "./router/orders";

export const appRouter = createTRPCRouter({
  products: productsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
