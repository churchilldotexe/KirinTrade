import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import orders from "./orders";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

const products = sqliteTable("products", {
  id: text("id")
    .primaryKey()
    .default(sql`(uuid())`),
  name: text("name").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  filePath: text("file_path").notNull(),
  imagePath: text("image_path").notNull(),
  description: text("description").notNull(),
  isAvailableforPurchase: integer("is_available_for_purchase", {
    mode: "boolean",
  })
    .notNull()
    .default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const productsRelations = relations(products, ({ many }) => ({
  order: many(orders, { relationName: "order" }),
}));

export const insertProductsSchema = createInsertSchema(products);
export type InsertProductsTypes = z.infer<typeof insertProductsSchema>;

export const selectProductsSchema = createSelectSchema(products);
export type SelectProductsTypes = z.infer<typeof selectProductsSchema>;

export default products;
