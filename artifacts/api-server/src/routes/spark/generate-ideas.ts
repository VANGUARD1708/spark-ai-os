import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GenerateIdeasBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { generationStatsTable } from "@workspace/db";

export async function generateIdeasHandler(req: Request, res: Response) {
  const parsed = GenerateIdeasBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
  }

  const { niche, count = 5 } = parsed.data;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are Spark — an AI commerce engine that generates highly profitable digital product ideas. You specialize in identifying trending, high-demand niches and generating specific, actionable product ideas that can be sold online.

You always respond with valid JSON only. No markdown, no explanation.`
        },
        {
          role: "user",
          content: `Generate ${count} specific digital product ideas for the "${niche}" niche.

For each idea, provide:
- title: Catchy product name (not generic)
- description: 1-2 sentence compelling description of the product
- demandScore: 0-100 (how much people want this right now)
- competitionScore: 0-100 (how saturated the market is, LOWER is better)
- profitPotential: e.g. "$47-$197/sale", "$997+ with upsells"
- saturationLevel: "low", "medium", or "high"
- targetAudience: Specific person who buys this
- problemSolved: The core pain this eliminates

Respond ONLY with this JSON:
{
  "ideas": [
    {
      "title": "...",
      "description": "...",
      "demandScore": 85,
      "competitionScore": 30,
      "profitPotential": "$47-$97",
      "saturationLevel": "low",
      "targetAudience": "...",
      "problemSolved": "..."
    }
  ]
}`
        }
      ]
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let parsed_ideas;
    try {
      parsed_ideas = JSON.parse(content);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    await db.insert(generationStatsTable).values({ type: "idea", niche });

    return res.json({ ideas: parsed_ideas.ideas ?? [], niche });
  } catch (err) {
    console.error("Error generating ideas:", err);
    return res.status(500).json({ error: "Failed to generate ideas" });
  }
}
