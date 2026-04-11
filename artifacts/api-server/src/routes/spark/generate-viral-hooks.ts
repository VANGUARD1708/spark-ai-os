import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GenerateViralHooksBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { generationStatsTable } from "@workspace/db";

export async function generateViralHooksHandler(req: Request, res: Response) {
  const parsed = GenerateViralHooksBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
  }

  const { productTitle, description = "", hookType = "all", count = 5 } = parsed.data;

  const hookInstructions =
    hookType === "all"
      ? `Generate ${count} hooks of each type: curiosity, pain, story, and short (total ${count * 4} hooks)`
      : `Generate ${count} "${hookType}" type hooks`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are Spark — a viral content engine. You specialize in writing scroll-stopping opening hooks for TikTok, Instagram Reels, and short-form video. Every hook must grab attention in the first 2 seconds. You always respond with valid JSON only. No markdown, no explanation.`
        },
        {
          role: "user",
          content: `Generate viral hooks for: "${productTitle}"${description ? ` — ${description}` : ""}

${hookInstructions}

Hook types:
- curiosity: Makes the viewer HAVE to keep watching ("You won't believe...", "Nobody told me this about...")
- pain: Calls out a specific frustration or struggle the audience feels deeply
- story: Opens with a compelling narrative or personal moment
- short: Under 8 words, punchy and direct

Each hook MUST:
- Start mid-action or with a bold claim
- Be written exactly as it would be spoken on camera
- Be specific (not generic)
- Create pattern interruption

Respond ONLY with this JSON:
{
  "hooks": [
    {
      "text": "The hook line exactly as spoken",
      "type": "curiosity",
      "angle": "The psychological principle this uses"
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
      const match = content.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : { hooks: [] };
    }

    try {
      await db.insert(generationStatsTable).values({
        type: "viral-hooks",
        niche: productTitle
      });
    } catch {}

    return res.json({
      hooks: result.hooks || [],
      productTitle
    });
  } catch (error) {
    console.error("Error generating viral hooks:", error);
    return res.status(500).json({ error: "Failed to generate viral hooks" });
  }
}
