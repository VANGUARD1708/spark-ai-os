import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

export async function generateWinningProductsHandler(req: Request, res: Response) {
  const category = (req.query.category as string) || "All";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are SPARK — an AI commerce engine. You analyze what digital products are winning right now based on market signals, social virality, and monetization potential. Respond with valid JSON only.`,
        },
        {
          role: "user",
          content: `Generate 8 winning digital product opportunities${category !== "All" ? ` in the "${category}" category` : " across top categories"}.

For each product provide:
- name: specific product name (not generic)
- type: "Digital" | "Info Product" | "Subscription" | "Service" | "Physical"
- demand: 0-100 demand score
- saturation: "Low" | "Medium" | "High"
- margin: e.g. "92%"
- price: e.g. "$37-$97"
- platform: best selling platform(s)
- why: 1-2 sentences explaining why it's winning right now
- tags: array of 2-3 short tags

Focus on what's working NOW in 2025. Include AI tools, health/wellness, creator economy, productivity.

Respond ONLY with:
{
  "products": [
    {
      "name": "...",
      "type": "...",
      "demand": 92,
      "saturation": "Low",
      "margin": "95%",
      "price": "$47-$127",
      "platform": "TikTok / Instagram",
      "why": "...",
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
      data = match ? JSON.parse(match[0]) : { products: [] };
    }

    return res.json({ products: data.products ?? [], generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Error generating winning products:", error);
    return res.status(500).json({ error: "Failed to generate winning products" });
  }
}
