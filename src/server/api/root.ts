import "server-only";
import { createCallerFactory, createTRPCRouter } from "./trpc";
import { productsRouter } from "./router/products";
import { ordersRouter } from "./router/orders";
import { downloadsRouter } from "./router/downloads";
import { usersRouter } from "./router/users";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  orders: ordersRouter,
  downloads: downloadsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
