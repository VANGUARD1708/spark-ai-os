import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { getCache, setCache } from "../../lib/cache";

export async function generateWinningProductsHandler(req: Request, res: Response) {
  const category = (req.query.category as string) || "All";
  const cacheKey = `winning:${category}`;

  const cached = getCache<{ products: unknown[]; generatedAt: string }>(cacheKey);
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
          content: `You are SPARK — an AI commerce engine. You analyze winning digital products. Respond with ONLY valid JSON. No markdown.`,
        },
        {
          role: "user",
          content: `Generate 6 winning digital products${category !== "All" ? ` in "${category}"` : " across top categories"}.

For each: name, type (Digital|Info Product|Subscription|Service|Physical), demand (0-100), saturation (Low|Medium|High), margin (e.g. "92%"), price (e.g. "$37-$97"), platform, why (1 sentence), tags (2-3).

RESPOND ONLY JSON:
{"products":[{"name":"...","type":"Digital","demand":92,"saturation":"Low","margin":"95%","price":"$47-$127","platform":"TikTok","why":"...","tags":["tag1","tag2"]}]}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let data;
    try {
      data = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : { products: [] };
    }

    const result = { products: data.products ?? [], generatedAt: new Date().toISOString() };
    setCache(cacheKey, result, 5 * 60 * 1000); // 5 min cache
    return res.json(result);
  } catch (error) {
    console.error("Error generating winning products:", error);
    return res.status(500).json({ error: "Failed to generate winning products" });
  }
}
