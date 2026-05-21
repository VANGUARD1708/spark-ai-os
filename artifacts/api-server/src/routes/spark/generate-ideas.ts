import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GenerateIdeasBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { generationStatsTable } from "@workspace/db";

type IdeasResponse = {
  ideas?: unknown[];
};

export async function generateIdeasHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  const parsed = GenerateIdeasBody.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request",
      details: parsed.error.issues,
    });
  }

  const {
    niche,
    audience = "",
    painPoint = "",
    trendMode = false,
    count = 3,
  } = parsed.data;

  const contextLines = [
    audience ? `Target audience: ${audience}` : "",
    painPoint ? `Key pain point to address: ${painPoint}` : "",
    trendMode
      ? "Focus on what's currently trending and gaining momentum right now."
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content:
            `You are Spark — an AI commerce engine that generates highly profitable digital product ideas. ` +
            `You specialize in identifying trending, high-demand niches and generating specific, actionable product ideas that can be sold online. ` +
            `You always respond with valid JSON only. No markdown, no explanation.`,
        },
        {
          role: "user",
          content:
            `Generate ${count} specific digital product ideas for the "${niche}" niche.\n` +
            `${contextLines ? `\nAdditional context:\n${contextLines}\n` : ""}` +
            `
For each idea, provide:
- title
- description
- demandScore
- competitionScore
- profitPotential
- saturationLevel
- targetAudience
- problemSolved
- whyItSells

Respond ONLY with valid JSON.`,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content ?? "{}";

    let parsedIdeas: IdeasResponse = { ideas: [] };

    try {
      parsedIdeas = JSON.parse(content) as IdeasResponse;
    } catch {
      const match = content.match(/\{[\s\S]*\}/);

      if (match?.[0]) {
        parsedIdeas = JSON.parse(match[0]) as IdeasResponse;
      }
    }

    try {
      await db.insert(generationStatsTable).values({
        type: "ideas",
        niche,
      });
    } catch (dbError) {
      console.error("Stats insert failed:", dbError);
    }

    return res.json({
      ideas: parsedIdeas.ideas ?? [],
      niche,
    });
  } catch (error) {
    console.error("Error generating ideas:", error);

    return res.status(500).json({
      error: "Failed to generate ideas",
    });
  }
}