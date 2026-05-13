import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

export async function generateTrendingHandler(req: Request, res: Response) {
  const category = (req.query.category as string) || "All";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are SPARK — an AI commerce engine with deep knowledge of 2025 market trends. You identify emerging niches and trending topics across social media, search, and commerce. Respond with valid JSON only.`,
        },
        {
          role: "user",
          content: `Generate 9 trending niche opportunities${category !== "All" ? ` in the "${category}" category` : " across categories like Health, Finance, Creator Economy, Fashion, Tech, Food, Mindset"}.

For each trend:
- title: specific trending topic (not generic)
- category: one of Health / Finance / Creator Economy / Fashion / Tech / Food / Mindset
- status: "hot" | "rising" | "peak" | "emerging"
- growth: e.g. "+312%" search growth
- volume: e.g. "2.1M searches/mo" (estimated)
- difficulty: "Low" | "Medium" | "High"
- description: 1-2 sentences explaining why it's trending and how to monetize it
- tags: array of 2-3 tags

Focus on 2025 trends. Include AI, longevity/biohacking, creator tools, financial independence, aesthetic niches.

Respond ONLY with:
{
  "trends": [
    {
      "title": "...",
      "category": "Health",
      "status": "hot",
      "growth": "+312%",
      "volume": "2.1M searches/mo",
      "difficulty": "Low",
      "description": "...",
      "tags": ["tag1", "tag2"]
    }
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
      data = match ? JSON.parse(match[0]) : { trends: [] };
    }

    return res.json({ trends: data.trends ?? [], generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Error generating trends:", error);
    return res.status(500).json({ error: "Failed to generate trends" });
  }
}
