import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ─────────────────────────────────────────────
// IDEAS
// ─────────────────────────────────────────────
export const savedIdeasTable = pgTable("saved_ideas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  niche: text("niche").notNull(),
  demandScore: integer("demand_score"),
  competitionScore: integer("competition_score"),
  profitPotential: text("profit_potential"),
  saturationLevel: text("saturation_level"),
  targetAudience: text("target_audience"),
  problemSolved: text("problem_solved"),
  whyItSells: text("why_it_sells"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedIdeaSchema = createInsertSchema(savedIdeasTable).omit({ id: true, createdAt: true });
export type InsertSavedIdea = z.infer<typeof insertSavedIdeaSchema>;
export type SavedIdea = typeof savedIdeasTable.$inferSelect;

// ─────────────────────────────────────────────
// BUNDLES
// ─────────────────────────────────────────────
export const savedBundlesTable = pgTable("saved_bundles", {
  id: serial("id").primaryKey(),
  productTitle: text("product_title").notNull(),
  targetAudience: text("target_audience"),
  angle: text("angle"),
  offerName: text("offer_name").notNull(),
  headline: text("headline").notNull(),
  price: text("price"),
  strikethroughPrice: text("strikethrough_price"),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedBundleSchema = createInsertSchema(savedBundlesTable).omit({ id: true, createdAt: true });
export type InsertSavedBundle = z.infer<typeof insertSavedBundleSchema>;
export type SavedBundle = typeof savedBundlesTable.$inferSelect;

// ─────────────────────────────────────────────
// SCRIPTS
// ─────────────────────────────────────────────
export const savedScriptsTable = pgTable("saved_scripts", {
  id: serial("id").primaryKey(),
  productTitle: text("product_title").notNull(),
  style: text("style"),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedScriptSchema = createInsertSchema(savedScriptsTable).omit({ id: true, createdAt: true });
export type InsertSavedScript = z.infer<typeof insertSavedScriptSchema>;
export type SavedScript = typeof savedScriptsTable.$inferSelect;

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
export const savedHooksTable = pgTable("saved_hooks", {
  id: serial("id").primaryKey(),
  productTitle: text("product_title").notNull(),
  hookType: text("hook_type"),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedHookSchema = createInsertSchema(savedHooksTable).omit({ id: true, createdAt: true });
export type InsertSavedHook = z.infer<typeof insertSavedHookSchema>;
export type SavedHook = typeof savedHooksTable.$inferSelect;

// ─────────────────────────────────────────────
// BRANDS
// ─────────────────────────────────────────────
export const savedBrandsTable = pgTable("saved_brands", {
  id: serial("id").primaryKey(),
  niche: text("niche").notNull(),
  brandName: text("brand_name").notNull(),
  slogan: text("slogan"),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedBrandSchema = createInsertSchema(savedBrandsTable).omit({ id: true, createdAt: true });
export type InsertSavedBrand = z.infer<typeof insertSavedBrandSchema>;
export type SavedBrand = typeof savedBrandsTable.$inferSelect;

// ─────────────────────────────────────────────
// CAMPAIGNS (Phase 3)
// ─────────────────────────────────────────────
export const campaignsTable = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("draft"),
  productTitle: text("product_title"),
  channels: jsonb("channels"),
  content: jsonb("content"),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  metrics: jsonb("metrics"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCampaignSchema = createInsertSchema(campaignsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaignsTable.$inferSelect;

// ─────────────────────────────────────────────
// GENERATION STATS
// ─────────────────────────────────────────────
export const generationStatsTable = pgTable("generation_stats", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  niche: text("niche"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGenerationStatSchema = createInsertSchema(generationStatsTable).omit({ id: true, createdAt: true });
export type InsertGenerationStat = z.infer<typeof insertGenerationStatSchema>;
export type GenerationStat = typeof generationStatsTable.$inferSelect;
