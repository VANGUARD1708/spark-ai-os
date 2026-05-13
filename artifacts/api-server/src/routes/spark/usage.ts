import type { Request, Response } from "express";
import { db, generationStatsTable } from "@workspace/db";
import { sql, gte } from "drizzle-orm";

const FREE_LIMIT = 50;

export async function usageHandler(req: Request, res: Response) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [totalResult, byTypeResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(generationStatsTable).where(gte(generationStatsTable.createdAt, since)),
      db.select({ type: generationStatsTable.type, count: sql<number>`count(*)::int` })
        .from(generationStatsTable)
        .where(gte(generationStatsTable.createdAt, since))
        .groupBy(generationStatsTable.type)
        .orderBy(sql`count(*) desc`),
    ]);

    const total = totalResult[0]?.count ?? 0;
    const remaining = Math.max(0, FREE_LIMIT - total);

    return res.json({
      totalGenerations: total,
      freeLimit: FREE_LIMIT,
      remaining,
      percentUsed: Math.min(100, Math.round((total / FREE_LIMIT) * 100)),
      plan: "free",
      generationsByType: byTypeResult,
      resetDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + (30 - (d.getDate() % 30)));
        return d.toISOString().split("T")[0];
      })(),
    });
  } catch (err) {
    console.error("Error fetching usage:", err);
    return res.status(500).json({ error: "Failed to fetch usage" });
  }
}
