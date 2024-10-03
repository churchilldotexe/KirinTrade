import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import orders from "./orders";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

// create new column for file-filekey and image-imagekey
// and column for file extension (no need for product)

const products = sqliteTable(
  "products",
  {
    id: text("id")
      .primaryKey()
      .default(sql`(uuid())`),
    name: text("name").notNull(),
    priceInCents: integer("price_in_cents").notNull(),
    filePath: text("file_path").notNull(),
    fileKey: text("file_key"),
    fileSize: int("file_size"),
    fileExtension: text("file_extension"),
    imagePath: text("image_path").notNull(),
    imageKey: text("image_key"),
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
  },
  (table) => {
    {
      return {
        isAvailableforPurchaseIdx: index("is_available_for_purchase_idx").on(
          table.isAvailableforPurchase,
        ),
      };
    }
  },
);

export const productsRelations = relations(products, ({ many }) => ({
  order: many(orders, { relationName: "order" }),
}));

export const insertProductsSchema = createInsertSchema(products);
export type InsertProductsTypes = z.infer<typeof insertProductsSchema>;

export const selectProductsSchema = createSelectSchema(products);
export type SelectProductsTypes = z.infer<typeof selectProductsSchema>;

export default products;
