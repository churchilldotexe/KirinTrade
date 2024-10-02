import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { downloadVerifications, products } from "@/server/database/schema";
import { randomUUID } from "crypto";
import { and, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const downloadsRouter = createTRPCRouter({
  createDownloadVerfication: publicProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const uuid = randomUUID();
      const oneDayInMs = new Date(Date.now() + 1000 * 60 * 60 * 24);
      const [createDownloadVerfication] = await ctx.db
        .insert(downloadVerifications)
        .values({
          id: uuid,
          productId: input.productId,
          expiresAt: oneDayInMs,
        })
        .returning({ verificationId: downloadVerifications.id });

      if (!createDownloadVerfication) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to create your download verification",
        });
      }
      return createDownloadVerfication?.verificationId;
    }),
  getMyVerification: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [verificationData] = await ctx.db
        .select({ filePath: products.filePath, name: products.name })
        .from(downloadVerifications)
        .innerJoin(products, eq(downloadVerifications.productId, products.id))
        .where(
          and(
            eq(downloadVerifications.id, input.id),
            sql`${downloadVerifications.expiresAt} < CURRENT_TIMESTAMP`,
          ),
        )
        .groupBy(products.id)
        .limit(1);
      return verificationData;
    }),
});
