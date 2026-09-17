import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const interpretations = sqliteTable("interpretations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  cardId: integer("card_id").notNull(),
  answer: text("answer").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
