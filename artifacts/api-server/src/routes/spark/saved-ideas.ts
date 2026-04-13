import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { savedIdeasTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { SaveIdeaBody, DeleteSavedIdeaParams } from "@workspace/api-zod";

export const savedIdeasHandlers = {
  async list(req: Request, res: Response) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;
      const niche = req.query.niche as string | undefined;

      let query = db.select().from(savedIdeasTable).$dynamic();

      if (niche) {
        query = query.where(sql`lower(${savedIdeasTable.niche}) = lower(${niche})`);
      }

      const ideas = await query
        .orderBy(desc(savedIdeasTable.createdAt))
        .limit(limit)
        .offset(offset);

      return res.json(ideas);
    } catch (err) {
      console.error("Error fetching saved ideas:", err);
      return res.status(500).json({ error: "Failed to fetch saved ideas" });
    }
  },

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    try {
      const [idea] = await db.select().from(savedIdeasTable).where(eq(savedIdeasTable.id, id));
      if (!idea) return res.status(404).json({ error: "Idea not found" });
      return res.json(idea);
    } catch (err) {
      console.error("Error fetching idea:", err);
      return res.status(500).json({ error: "Failed to fetch idea" });
    }
  },

  async create(req: Request, res: Response) {
    const parsed = SaveIdeaBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    }

    try {
      const [idea] = await db.insert(savedIdeasTable).values(parsed.data).returning();
      return res.status(201).json(idea);
    } catch (err) {
      console.error("Error saving idea:", err);
      return res.status(500).json({ error: "Failed to save idea" });
    }
  },

  async delete(req: Request, res: Response) {
    const parsed = DeleteSavedIdeaParams.safeParse({ id: parseInt(req.params.id) });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    try {
      const result = await db.delete(savedIdeasTable).where(eq(savedIdeasTable.id, parsed.data.id)).returning();
      if (result.length === 0) return res.status(404).json({ error: "Idea not found" });
      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting idea:", err);
      return res.status(500).json({ error: "Failed to delete idea" });
    }
  }
};
