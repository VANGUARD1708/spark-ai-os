import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GenerateBrandBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { generationStatsTable } from "@workspace/db";

export async function generateBrandHandler(req: Request, res: Response) {
  const parsed = GenerateBrandBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
  }

  const { niche, productConcept, targetAudience = "", tonePreference = "bold" } = parsed.data;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are Spark — a brand strategy AI. You create memorable, market-ready brand identities for digital commerce entrepreneurs. You think like a brand strategist from a top creative agency. You always respond with valid JSON only. No markdown, no explanation.`
        },
        {
          role: "user",
          content: `Create a complete brand identity for:
- Niche: "${niche}"
- Product/Service: "${productConcept}"
- Target Audience: "${targetAudience || "general consumer"}"
- Tone: "${tonePreference}"

Requirements:
- Brand name must be 1-2 words, memorable, easy to pronounce, and domain-friendly
- Slogan: 5-7 words, punchy and benefit-driven
- Tagline: A longer brand promise sentence (10-15 words)
- Tone description: How the brand speaks and presents itself
- Brand voice: 3-4 specific adjectives with brief explanations
- Target persona: A vivid 2-sentence description of the ideal customer
- Colors: 3 colors — primary, secondary, and accent — with hex codes and usage notes
- Naming rationale: 2 sentences explaining why this name works

Respond ONLY with this JSON:
{
  "brandName": "...",
  "slogan": "...",
  "tagline": "...",
  "toneDescription": "...",
  "brandVoice": "...",
  "targetPersona": "...",
  "colors": [
    { "name": "Primary", "hex": "#XXXXXX", "usage": "Main backgrounds, CTAs, logo" },
    { "name": "Secondary", "hex": "#XXXXXX", "usage": "..." },
    { "name": "Accent", "hex": "#XXXXXX", "usage": "..." }
  ],
  "namingRationale": "..."
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
      result = match ? JSON.parse(match[0]) : {};
    }

    try {
      await db.insert(generationStatsTable).values({
        type: "brand",
        niche
      });
    } catch {}

    return res.json(result);
  } catch (error) {
    console.error("Error generating brand:", error);
    return res.status(500).json({ error: "Failed to generate brand identity" });
  }
}
