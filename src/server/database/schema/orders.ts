import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import users from "./users";
import products from "./products";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

const orders = sqliteTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .default(sql`(uuid())`),
    pricePaidInCents: integer("price_paid_in_cents").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
  },
  (table) => {
    return {
      ordersUserIdIdx: index("orders_userId_Idx").on(table.userId),
      ordersProductIdIdx: index("orders_productId_Idx").on(table.productId),
    };
  },
);

export const ordersRelation = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
}));

export const insertOrdersSchema = createInsertSchema(orders);
export type InsertOrdersTypes = z.infer<typeof insertOrdersSchema>;

export const selectOrdersSchema = createSelectSchema(orders);
export type selectOrdersTypes = z.infer<typeof selectOrdersSchema>;

export default orders;
