import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { savedBrandsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const SaveBrandBodySchema = z.object({
  niche: z.string().min(1),
  brandName: z.string().min(1),
  slogan: z.string().optional(),
  data: z.record(z.unknown()),
});

export const savedBrandsHandlers = {
  async list(req: Request, res: Response) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

      const brands = await db.select().from(savedBrandsTable)
        .orderBy(desc(savedBrandsTable.createdAt))
        .limit(limit);

      return res.json(brands);
    } catch (err) {
      console.error("Error fetching saved brands:", err);
      return res.status(500).json({ error: "Failed to fetch saved brands" });
    }
  },

  async create(req: Request, res: Response) {
    const parsed = SaveBrandBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    }

    try {
      const [brand] = await db.insert(savedBrandsTable).values(parsed.data).returning();
      return res.status(201).json(brand);
    } catch (err) {
      console.error("Error saving brand:", err);
      return res.status(500).json({ error: "Failed to save brand" });
    }
  },

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    try {
      const result = await db.delete(savedBrandsTable).where(eq(savedBrandsTable.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: "Brand not found" });
      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting brand:", err);
      return res.status(500).json({ error: "Failed to delete brand" });
    }
  }
};
