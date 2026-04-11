import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GenerateTikTokScriptBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { generationStatsTable } from "@workspace/db";

export async function generateTikTokScriptHandler(req: Request, res: Response) {
  const parsed = GenerateTikTokScriptBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
  }

  const { productTitle, productDescription, targetAudience, style = "transformation" } = parsed.data;

  const styleGuides: Record<string, string> = {
    educational: "Teach something surprising. Lead with a counterintuitive fact or little-known secret.",
    storytelling: "Tell a personal story. Start mid-action, create tension, end with the product as the solution.",
    shocking: "Open with a shocking claim or controversial statement that stops the scroll.",
    transformation: "Show before/after. Open with the problem state, end with the transformation."
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are Spark's Distribution Engine — a viral TikTok content strategist who has generated millions of views. You write scripts that hook viewers in the first 3 seconds and convert them into buyers.

You always respond with valid JSON only. No markdown, no explanation.`
        },
        {
          role: "user",
          content: `Write 2 viral TikTok scripts for:
Product: ${productTitle}
Description: ${productDescription}
Target Audience: ${targetAudience}
Style: ${styleGuides[style] || styleGuides.transformation}

For each script:
- hook: The opening line (first 3 seconds, must stop the scroll)
- script: Full script with timestamps like [0:00], [0:03], [0:08], etc. (45-60 seconds total)
- hashtags: Array of 8-10 relevant hashtags (no # symbol)
- caption: The TikTok caption (2-3 sentences + call to action)
- estimatedViralScore: 0-100 (your confidence this will perform well)

Respond ONLY with this JSON:
{
  "scripts": [
    {
      "hook": "...",
      "script": "[0:00] ...\n[0:03] ...\n[0:10] ...",
      "hashtags": ["...", "..."],
      "caption": "...",
      "estimatedViralScore": 85
    }
  ]
}`
        }
      ]
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    await db.insert(generationStatsTable).values({ type: "script", niche: productTitle });

    return res.json({ scripts: result.scripts ?? [], productTitle });
  } catch (err) {
    console.error("Error generating TikTok script:", err);
    return res.status(500).json({ error: "Failed to generate TikTok script" });
  }
}
