import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { savedIdeasTable, generationStatsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

export async function statsHandler(_req: Request, res: Response) {
  try {
    const [totalIdeasResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(savedIdeasTable);

    const bundleStats = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(generationStatsTable)
      .where(eq(generationStatsTable.type, "bundle"));

    const scriptStats = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(generationStatsTable)
      .where(eq(generationStatsTable.type, "script"));

    const topNichesResult = await db
      .select({
        niche: generationStatsTable.niche,
        count: sql<number>`count(*)::int`
      })
      .from(generationStatsTable)
      .where(sql`${generationStatsTable.niche} is not null`)
      .groupBy(generationStatsTable.niche)
      .orderBy(sql`count(*) desc`)
      .limit(5);

    return res.json({
      totalIdeas: totalIdeasResult?.count ?? 0,
      totalBundlesGenerated: bundleStats[0]?.count ?? 0,
      totalScriptsGenerated: scriptStats[0]?.count ?? 0,
      topNiches: topNichesResult.map(r => ({ niche: r.niche!, count: r.count }))
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
}
