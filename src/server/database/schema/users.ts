import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import orders from "./orders";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`(uuid())`),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const usersRelation = relations(users, ({ many }) => ({
  order: many(orders, { relationName: "order" }),
}));

export const insertUsersSchema = createInsertSchema(users);
export type InsertUsersTypes = z.infer<typeof insertUsersSchema>;

export const selectUsersSchema = createSelectSchema(users);
export type selectUsersTypes = z.infer<typeof selectUsersSchema>;

export default users;
