import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { savedBundlesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const SaveBundleBodySchema = z.object({
  productTitle: z.string().min(1),
  targetAudience: z.string().optional(),
  angle: z.string().optional(),
  offerName: z.string().min(1),
  headline: z.string().min(1),
  price: z.string().optional(),
  strikethroughPrice: z.string().optional(),
  data: z.record(z.unknown()),
});

export const savedBundlesHandlers = {
  async list(req: Request, res: Response) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;

      const bundles = await db.select().from(savedBundlesTable)
        .orderBy(desc(savedBundlesTable.createdAt))
        .limit(limit)
        .offset(offset);

      return res.json(bundles);
    } catch (err) {
      console.error("Error fetching saved bundles:", err);
      return res.status(500).json({ error: "Failed to fetch saved bundles" });
    }
  },

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    try {
      const [bundle] = await db.select().from(savedBundlesTable).where(eq(savedBundlesTable.id, id));
      if (!bundle) return res.status(404).json({ error: "Bundle not found" });
      return res.json(bundle);
    } catch (err) {
      console.error("Error fetching bundle:", err);
      return res.status(500).json({ error: "Failed to fetch bundle" });
    }
  },

  async create(req: Request, res: Response) {
    const parsed = SaveBundleBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    }

    try {
      const [bundle] = await db.insert(savedBundlesTable).values(parsed.data).returning();
      return res.status(201).json(bundle);
    } catch (err) {
      console.error("Error saving bundle:", err);
      return res.status(500).json({ error: "Failed to save bundle" });
    }
  },

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    try {
      const result = await db.delete(savedBundlesTable).where(eq(savedBundlesTable.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: "Bundle not found" });
      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting bundle:", err);
      return res.status(500).json({ error: "Failed to delete bundle" });
    }
  }
};
