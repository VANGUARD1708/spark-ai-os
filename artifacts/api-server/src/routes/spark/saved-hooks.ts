import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { savedHooksTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const SaveHooksBodySchema = z.object({
  productTitle: z.string().min(1),
  hookType: z.string().optional(),
  data: z.record(z.unknown()),
});

export const savedHooksHandlers = {
  async list(req: Request, res: Response) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

      const hooks = await db.select().from(savedHooksTable)
        .orderBy(desc(savedHooksTable.createdAt))
        .limit(limit);

      return res.json(hooks);
    } catch (err) {
      console.error("Error fetching saved hooks:", err);
      return res.status(500).json({ error: "Failed to fetch saved hooks" });
    }
  },

  async create(req: Request, res: Response) {
    const parsed = SaveHooksBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    }

    try {
      const [hook] = await db.insert(savedHooksTable).values(parsed.data).returning();
      return res.status(201).json(hook);
    } catch (err) {
      console.error("Error saving hooks:", err);
      return res.status(500).json({ error: "Failed to save hooks" });
    }
  },

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    try {
      const result = await db.delete(savedHooksTable).where(eq(savedHooksTable.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: "Hook set not found" });
      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting hook set:", err);
      return res.status(500).json({ error: "Failed to delete hook set" });
    }
  }
};
