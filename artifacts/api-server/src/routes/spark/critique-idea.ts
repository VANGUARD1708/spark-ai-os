import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { z } from "zod";

const CritiqueBody = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  niche: z.string().optional(),
  demandScore: z.number().optional(),
  competitionScore: z.number().optional(),
});

export async function critiqueIdeaHandler(req: Request, res: Response) {
  const parsed = CritiqueBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const { title, description, niche, demandScore, competitionScore } = parsed.data;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `You are SPARK — a brutally honest AI business advisor. You give direct, opinionated feedback on product ideas. You don't sugarcoat. If an idea is weak, you say so and explain how to fix it. If it's strong, you tell them exactly why and how to maximize it. You think like a VC and creator combined. Respond with valid JSON only.`,
        },
        {
          role: "user",
          content: `Critique this digital product idea:

Title: ${title}
${description ? `Description: ${description}` : ""}
${niche ? `Niche: ${niche}` : ""}
${demandScore != null ? `Demand score: ${demandScore}/100` : ""}
${competitionScore != null ? `Competition score: ${competitionScore}/100` : ""}

Provide:
- verdict: "strong" | "promising" | "weak" | "overcrowded"
- verdictLabel: one punchy phrase (e.g. "Solid opportunity", "Too crowded", "Hidden gem", "Needs repositioning")
- overallRating: 1-10
- sparkTake: 2-3 sentences of SPARK's honest opinion. Be direct. Challenge weak points. Praise strong points.
- strengths: array of 2-3 specific strengths
- risks: array of 2-3 honest risks or weaknesses
- improvements: array of 2-3 specific ways to make the idea stronger
- bestAngle: the single strongest positioning angle for this idea

Respond ONLY with:
{
  "verdict": "strong",
  "verdictLabel": "Hidden gem",
  "overallRating": 8,
  "sparkTake": "...",
  "strengths": ["...", "..."],
  "risks": ["...", "..."],
  "improvements": ["...", "..."],
  "bestAngle": "..."
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
      data = match ? JSON.parse(match[0]) : {};
    }

    return res.json(data);
  } catch (error) {
    console.error("Error critiquing idea:", error);
    return res.status(500).json({ error: "Failed to critique idea" });
  }
}
