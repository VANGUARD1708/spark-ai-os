import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { savedScriptsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const SaveScriptBodySchema = z.object({
  productTitle: z.string().min(1),
  style: z.string().optional(),
  data: z.record(z.unknown()),
});

export const savedScriptsHandlers = {
  async list(req: Request, res: Response) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;

      const scripts = await db.select().from(savedScriptsTable)
        .orderBy(desc(savedScriptsTable.createdAt))
        .limit(limit)
        .offset(offset);

      return res.json(scripts);
    } catch (err) {
      console.error("Error fetching saved scripts:", err);
      return res.status(500).json({ error: "Failed to fetch saved scripts" });
    }
  },

  async create(req: Request, res: Response) {
    const parsed = SaveScriptBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    }

    try {
      const [script] = await db.insert(savedScriptsTable).values(parsed.data).returning();
      return res.status(201).json(script);
    } catch (err) {
      console.error("Error saving script:", err);
      return res.status(500).json({ error: "Failed to save script" });
    }
  },

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    try {
      const result = await db.delete(savedScriptsTable).where(eq(savedScriptsTable.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: "Script not found" });
      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting script:", err);
      return res.status(500).json({ error: "Failed to delete script" });
    }
  }
};
