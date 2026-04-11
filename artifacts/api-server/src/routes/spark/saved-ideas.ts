import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { savedIdeasTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SaveIdeaBody, DeleteSavedIdeaParams } from "@workspace/api-zod";

export const savedIdeasHandlers = {
  async list(_req: Request, res: Response) {
    try {
      const ideas = await db.select().from(savedIdeasTable).orderBy(savedIdeasTable.createdAt);
      return res.json(ideas);
    } catch (err) {
      console.error("Error fetching saved ideas:", err);
      return res.status(500).json({ error: "Failed to fetch saved ideas" });
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
      await db.delete(savedIdeasTable).where(eq(savedIdeasTable.id, parsed.data.id));
      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting idea:", err);
      return res.status(500).json({ error: "Failed to delete idea" });
    }
  }
};
