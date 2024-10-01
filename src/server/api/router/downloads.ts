import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { downloadVerifications } from "@/server/database/schema";
import { randomUUID } from "crypto";

export const downloadsRouter = createTRPCRouter({
  createDownloadVerfication: publicProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const uuid = randomUUID();
      const oneDayInMs = new Date(Date.now() + 1000 * 60 * 60 * 24);
      await ctx.db
        .insert(downloadVerifications)
        .values({
          id: uuid,
          productId: input.productId,
          expiresAt: oneDayInMs,
        });
    }),
});
