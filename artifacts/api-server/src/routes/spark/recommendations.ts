import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db, generationStatsTable, savedIdeasTable, savedBundlesTable, savedScriptsTable, savedHooksTable } from "@workspace/db";
import { sql, gte } from "drizzle-orm";

export async function recommendationsHandler(req: Request, res: Response) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [totalResult, byTypeResult, topNichesResult, ideasCount, bundlesCount, scriptsCount, hooksCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(generationStatsTable).where(gte(generationStatsTable.createdAt, since)),
      db.select({ type: generationStatsTable.type, count: sql<number>`count(*)::int` }).from(generationStatsTable).where(gte(generationStatsTable.createdAt, since)).groupBy(generationStatsTable.type).orderBy(sql`count(*) desc`),
      db.select({ niche: generationStatsTable.niche, count: sql<number>`count(*)::int` }).from(generationStatsTable).where(sql`${generationStatsTable.niche} is not null and ${generationStatsTable.createdAt} >= ${since}`).groupBy(generationStatsTable.niche).orderBy(sql`count(*) desc`).limit(5),
      db.select({ count: sql<number>`count(*)::int` }).from(savedIdeasTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedBundlesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedScriptsTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedHooksTable),
    ]);

    const totalGenerations = totalResult[0]?.count ?? 0;
    const savedIdeas = ideasCount[0]?.count ?? 0;
    const savedBundles = bundlesCount[0]?.count ?? 0;
    const savedScripts = scriptsCount[0]?.count ?? 0;
    const savedHooks = hooksCount[0]?.count ?? 0;
    const topNiche = topNichesResult[0]?.niche ?? "general";
    const topTypes = byTypeResult.map(t => t.type).join(", ");

    const userContext = `User stats (last 30 days):
- Total AI generations: ${totalGenerations}
- Saved ideas: ${savedIdeas}, bundles: ${savedBundles}, scripts: ${savedScripts}, hooks: ${savedHooks}
- Top niche: ${topNiche}
- Most used tools: ${topTypes || "none yet"}
- Has launched content: ${savedScripts > 0 ? "yes" : "no"}
- Has built offers: ${savedBundles > 0 ? "yes" : "no"}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 3000,
      messages: [
        {
          role: "system",
          content: `You are SPARK — an AI business strategist. Based on user activity data, you generate highly specific, personalized action recommendations. You are direct, opinionated, and data-driven. You challenge weak strategies and push users toward their best opportunities. Respond with valid JSON only.`,
        },
        {
          role: "user",
          content: `${userContext}

Generate 6 personalized growth recommendations based on this user's actual activity.

Each recommendation must be:
- Specific to their activity data (not generic advice)
- Actionable with a clear next step
- Prioritized correctly based on their stage

For each recommendation:
- priority: "High" | "Medium" | "Low"
- category: "Content" | "Offer" | "Analytics" | "Brand" | "Launch" | "Growth"
- title: short action title (under 10 words)
- body: 2 sentences of specific reasoning based on their data
- action: button CTA text
- href: one of /ideas /bundle /scripts /viral-hooks /brand-builder /campaigns /schedule /analytics /assets /command

Also generate:
- insight: a single strong SPARK opinion sentence about their biggest opportunity
- metrics: array of 4 objects with { label, current, target, status: "good"|"neutral"|"low" }

Respond ONLY with:
{
  "insight": "...",
  "recommendations": [
    {
      "priority": "High",
      "category": "Content",
      "title": "...",
      "body": "...",
      "action": "...",
      "href": "/scripts"
    }
  ],
  "metrics": [
    { "label": "Weekly Content Volume", "current": "0", "target": "5+ posts", "status": "low" }
  ]
}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let data;
    try {
      data = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : { recommendations: [], metrics: [], insight: "" };
    }

    return res.json({
      insight: data.insight ?? "",
      recommendations: data.recommendations ?? [],
      metrics: data.metrics ?? [],
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return res.status(500).json({ error: "Failed to generate recommendations" });
  }
}
