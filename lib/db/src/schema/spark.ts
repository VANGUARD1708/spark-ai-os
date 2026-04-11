import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const generationStatsTable = pgTable("generation_stats", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  niche: text("niche"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedIdeaSchema = createInsertSchema(savedIdeasTable).omit({ id: true, createdAt: true });
export type InsertSavedIdea = z.infer<typeof insertSavedIdeaSchema>;
export type SavedIdea = typeof savedIdeasTable.$inferSelect;

export const insertGenerationStatSchema = createInsertSchema(generationStatsTable).omit({ id: true, createdAt: true });
export type InsertGenerationStat = z.infer<typeof insertGenerationStatSchema>;
export type GenerationStat = typeof generationStatsTable.$inferSelect;
