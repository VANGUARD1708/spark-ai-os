import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GenerateBundleBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { generationStatsTable } from "@workspace/db";

export async function generateBundleHandler(req: Request, res: Response) {
  const parsed = GenerateBundleBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
  }

  const { productTitle, productDescription, targetAudience, angle = "transformation" } = parsed.data;

  const anglePrompts: Record<string, string> = {
    pain: "Focus on the pain and frustration the customer currently experiences. Lead with what they're suffering from.",
    desire: "Focus on the dream outcome and desire. Lead with what their life looks like after.",
    transformation: "Focus on the before/after transformation. Show exactly how their life changes."
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are Spark's Offer Engine — a world-class direct response copywriter who creates irresistible offer bundles. You build high-converting offers that make people feel foolish for NOT buying.

You always respond with valid JSON only. No markdown, no explanation.`
        },
        {
          role: "user",
          content: `Create a complete irresistible offer bundle for:
Product: ${productTitle}
Description: ${productDescription}
Target Audience: ${targetAudience}
Angle: ${anglePrompts[angle] || anglePrompts.transformation}

Build a premium offer with:
- offerName: The full offer/program name
- headline: The main selling headline (under 15 words, punchy)
- subheadline: Supporting headline with more detail
- coreProduct: What the main product delivers
- bonuses: Array of 3-4 digital bonuses with name, type, description, and perceived value
- price: The selling price (e.g. "$47")
- strikethroughPrice: The "original" price to cross out (3-5x the selling price)
- guarantee: Your money-back guarantee statement
- callToAction: The button/CTA text
- bullets: Array of 6 persuasive bullet points about what they get

Respond ONLY with this JSON:
{
  "offerName": "...",
  "headline": "...",
  "subheadline": "...",
  "coreProduct": "...",
  "bonuses": [
    {
      "name": "...",
      "type": "PDF Guide / Video Course / Checklist / Template",
      "description": "...",
      "value": "$47 value"
    }
  ],
  "price": "$47",
  "strikethroughPrice": "$197",
  "guarantee": "...",
  "callToAction": "...",
  "bullets": ["...", "...", "...", "...", "...", "..."]
}`
        }
      ]
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let bundle;
    try {
      bundle = JSON.parse(content);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    await db.insert(generationStatsTable).values({ type: "bundle", niche: productTitle });

    return res.json(bundle);
  } catch (err) {
    console.error("Error generating bundle:", err);
    return res.status(500).json({ error: "Failed to generate bundle" });
  }
}
