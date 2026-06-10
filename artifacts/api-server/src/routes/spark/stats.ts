import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { savedIdeasTable, generationStatsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

export async function statsHandler(_req: Request, res: Response) {
  try {
    const [totalIdeasResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(savedIdeasTable);

    const totalGenerationsResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(generationStatsTable);

    const bundleStats = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(generationStatsTable)
      .where(eq(generationStatsTable.type, "bundle"));

    const scriptStats = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(generationStatsTable)
      .where(eq(generationStatsTable.type, "script"));

    const hooksStats = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(generationStatsTable)
      .where(eq(generationStatsTable.type, "hooks"));

    const ideasStats = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(generationStatsTable)
      .where(eq(generationStatsTable.type, "ideas"));

    const brandStats = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(generationStatsTable)
      .where(eq(generationStatsTable.type, "brand"));

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

    const topTypeResult = await db
      .select({
        type: generationStatsTable.type,
        count: sql<number>`count(*)::int`
      })
      .from(generationStatsTable)
      .groupBy(generationStatsTable.type)
      .orderBy(sql`count(*) desc`)
      .limit(1);

    const totalGenerations = totalGenerationsResult[0]?.count ?? 0;
    const topNiche = topNichesResult[0]?.niche ?? "general";
    const topType = topTypeResult[0]?.type ?? "ideas";

    return res.json({
      totalGenerations,
      totalIdeas: totalIdeasResult?.count ?? 0,
      totalBundlesGenerated: bundleStats[0]?.count ?? 0,
      totalScriptsGenerated: scriptStats[0]?.count ?? 0,
      totalHooksGenerated: hooksStats[0]?.count ?? 0,
      totalIdeasGenerated: ideasStats[0]?.count ?? 0,
      totalBrandsGenerated: brandStats[0]?.count ?? 0,
      topNiches: topNichesResult.map(r => ({ niche: r.niche!, count: r.count })),
      topNiche,
      topType,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
}
