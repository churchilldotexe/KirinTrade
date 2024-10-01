import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { headers } from "next/headers";
import { cache } from "react";

const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");
  return createTRPCContext({ header: heads });
});

//export const serverClient = appRouter.createCaller({
//  links: [
//    httpBatchLink({
//      url: "http://localhost:3000/api/trpc",
//    }),
//  ],
//});

export const serverClient = createCaller(createContext);
