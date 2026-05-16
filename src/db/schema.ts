import { pgTable, serial, varchar, text, integer, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";

// Better Auth creates its own user, session, account, verification tables.
// These app tables reference Better Auth's user.id via foreign keys.

export const qrGenerations = pgTable("qr_generations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }),
  style: varchar("style", { length: 50 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  url: text("url").notNull(),
  params: jsonb("params"),
  prompt: text("prompt"),
  imageUrl: text("image_url"),
  svgData: text("svg_data"),
  format: varchar("format", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  userIdIdx: index("qr_gen_user_idx").on(t.userId),
  dateIdx: index("qr_gen_date_idx").on(t.createdAt),
}));

export const userCredits = pgTable("user_credits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  simpleCredits: integer("simple_credits").default(0).notNull(),
  aiCredits: integer("ai_credits").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  amount: integer("amount").notNull(),
  reason: varchar("reason", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  userIdIdx: index("credit_tx_user_idx").on(t.userId),
}));

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  reference: varchar("reference", { length: 100 }).notNull().unique(),
  packType: varchar("pack_type", { length: 50 }).notNull(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("GHS").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  simpleCredits: integer("simple_credits").default(0),
  aiCredits: integer("ai_credits").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
}, (t) => ({
  refIdx: index("payments_ref_idx").on(t.reference),
  userIdIdx: index("payments_user_idx").on(t.userId),
}));
