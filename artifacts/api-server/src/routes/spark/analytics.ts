import type { Request, Response } from "express";
import { db } from "@workspace/db";
import {
  generationStatsTable,
  savedIdeasTable,
  savedBundlesTable,
  savedScriptsTable,
  savedHooksTable,
  savedBrandsTable,
} from "@workspace/db";
import { sql, gte } from "drizzle-orm";

export async function analyticsHandler(req: Request, res: Response) {
  try {
    const days = Math.min(parseInt(req.query.days as string) || 30, 365);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [
      totalResult,
      byTypeResult,
      byDayResult,
      topNichesResult,
      ideasCount,
      bundlesCount,
      scriptsCount,
      hooksCount,
      brandsCount,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` })
        .from(generationStatsTable)
        .where(gte(generationStatsTable.createdAt, since)),

      db.select({
        type: generationStatsTable.type,
        count: sql<number>`count(*)::int`,
      })
        .from(generationStatsTable)
        .where(gte(generationStatsTable.createdAt, since))
        .groupBy(generationStatsTable.type)
        .orderBy(sql`count(*) desc`),

      db.select({
        date: sql<string>`date(${generationStatsTable.createdAt})::text`,
        count: sql<number>`count(*)::int`,
      })
        .from(generationStatsTable)
        .where(gte(generationStatsTable.createdAt, since))
        .groupBy(sql`date(${generationStatsTable.createdAt})`)
        .orderBy(sql`date(${generationStatsTable.createdAt})`),

      db.select({
        niche: generationStatsTable.niche,
        count: sql<number>`count(*)::int`,
      })
        .from(generationStatsTable)
        .where(sql`${generationStatsTable.niche} is not null and ${generationStatsTable.createdAt} >= ${since}`)
        .groupBy(generationStatsTable.niche)
        .orderBy(sql`count(*) desc`)
        .limit(10),

      db.select({ count: sql<number>`count(*)::int` }).from(savedIdeasTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedBundlesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedScriptsTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedHooksTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedBrandsTable),
    ]);

    const total = totalResult[0]?.count ?? 0;

    const generationsByType = byTypeResult.map(r => ({
      type: r.type,
      count: r.count,
      percentage: total > 0 ? Math.round((r.count / total) * 100) : 0,
    }));

    return res.json({
      period: `${days}d`,
      totalGenerations: total,
      generationsByType,
      generationsByDay: byDayResult,
      topNiches: topNichesResult.map(r => ({ niche: r.niche!, count: r.count })),
      savedAssets: {
        ideas: ideasCount[0]?.count ?? 0,
        bundles: bundlesCount[0]?.count ?? 0,
        scripts: scriptsCount[0]?.count ?? 0,
        hooks: hooksCount[0]?.count ?? 0,
        brands: brandsCount[0]?.count ?? 0,
      },
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
