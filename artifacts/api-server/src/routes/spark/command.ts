import type { Request, Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { z } from "zod";
import { db, generationStatsTable } from "@workspace/db";

const CommandBody = z.object({
  goal: z.string().min(1).max(1000),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional().default([]),
});

export async function commandHandler(req: Request, res: Response) {
  const parsed = CommandBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request" });

  const { goal, history } = parsed.data;

  const messages: any[] = [
    {
      role: "system",
      content: `You are SPARK — an AI-powered business operating system. You help entrepreneurs build, launch, grow, and scale internet businesses autonomously.

Your response MUST be valid JSON only. No markdown, no explanation, just JSON.

When a user gives you a business goal, you:
1. Research the market opportunity
2. Design a brand identity and positioning
3. Create a content and launch strategy
4. Provide a clear action plan

Respond with this exact JSON structure:
{
  "message": "Brief friendly response (2-3 sentences max)",
  "sections": [
    {
      "type": "research",
      "title": "Market Research",
      "content": "Summary paragraph",
      "items": ["insight 1", "insight 2", "insight 3", "insight 4"]
    },
    {
      "type": "brand",
      "title": "Brand Strategy",
      "content": "Brand positioning summary",
      "items": ["element 1", "element 2", "element 3"]
    },
    {
      "type": "content",
      "title": "Content Playbook",
      "content": "Content strategy summary",
      "items": ["tactic 1", "tactic 2", "tactic 3", "tactic 4"]
    },
    {
      "type": "launch",
      "title": "Launch Plan",
      "content": "Step-by-step launch sequence",
      "items": ["step 1", "step 2", "step 3", "step 4"]
    }
  ],
  "actions": [
    { "label": "Generate Product Ideas", "href": "/ideas", "description": "Find winning products in this niche" },
    { "label": "Build Your Bundle", "href": "/bundle", "description": "Create your core offer" },
    { "label": "Build Brand Identity", "href": "/brand-builder", "description": "Design your brand" },
    { "label": "Write TikTok Scripts", "href": "/scripts", "description": "Create viral content" }
  ]
}`
    },
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: "user", content: goal }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 4096,
      messages,
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : { message: "I encountered an issue. Please try again.", sections: [], actions: [] };
    }

    try {
      await db.insert(generationStatsTable).values({ type: "command", niche: goal.slice(0, 100) });
    } catch {}

    return res.json({
      message: result.message ?? "",
      sections: result.sections ?? [],
      actions: result.actions ?? [],
    });
  } catch (error) {
    console.error("Command error:", error);
    return res.status(500).json({ error: "Failed to process command" });
  }
}
