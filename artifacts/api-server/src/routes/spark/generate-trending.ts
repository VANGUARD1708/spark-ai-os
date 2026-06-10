import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { getCache, setCache } from "../../lib/cache";

export async function generateTrendingHandler(req: Request, res: Response) {
  const category = (req.query.category as string) || "All";
  const cacheKey = `trending:${category}`;

  const cached = getCache<{ trends: unknown[]; generatedAt: string }>(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 2048,
      messages: [
        {
          role: "system",
          content: `You are SPARK — an AI commerce engine. You identify trending niches. Respond with ONLY valid JSON. No markdown, no explanation.`,
        },
        {
          role: "user",
          content: `Generate 6 trending niche opportunities${category !== "All" ? ` in "${category}"` : " across Health, Finance, Creator Economy, Fashion, Tech, Food, Mindset"}.

For each: title, category, status (hot|rising|peak|emerging), growth (e.g. "+312%"), volume (e.g. "2.1M searches/mo"), difficulty (Low|Medium|High), description (1 sentence), tags (2-3).

RESPOND ONLY JSON:
{"trends":[{"title":"...","category":"Health","status":"hot","growth":"+312%","volume":"2.1M searches/mo","difficulty":"Low","description":"...","tags":["tag1","tag2"]}]}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let data;
    try {
      data = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : { trends: [] };
    }

    const result = { trends: data.trends ?? [], generatedAt: new Date().toISOString() };
    setCache(cacheKey, result, 5 * 60 * 1000); // 5 min cache
    return res.json(result);
  } catch (error) {
    console.error("Error generating trends:", error);
    return res.status(500).json({ error: "Failed to generate trends" });
  }
}
