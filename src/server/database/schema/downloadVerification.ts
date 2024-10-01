import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import products from "./products";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

const downloadVerifications = sqliteTable("download_verifications", {
  id: text("id")
    .primaryKey()
    .default(sql`(uuid())`),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

export const downloadVerificationsRelations = relations(
  downloadVerifications,
  ({ one }) => ({
    product: one(products, {
      fields: [downloadVerifications.productId],
      references: [products.id],
    }),
  }),
);

export const insertDownloadVerificationsSchema = createInsertSchema(
  downloadVerifications,
);
export type InsertDownloadVerificationsTypes = z.infer<
  typeof insertDownloadVerificationsSchema
>;

export const selectDownloadVerificationSchema = createSelectSchema(
  downloadVerifications,
);
export type SelectDownloadVerificationTypes = z.infer<
  typeof selectDownloadVerificationSchema
>;
export default downloadVerifications;
