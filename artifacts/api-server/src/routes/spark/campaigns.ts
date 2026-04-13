import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { campaignsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";

const CreateCampaignSchema = z.object({
  name: z.string().min(1).max(200),
  productTitle: z.string().optional(),
  channels: z.array(z.string()).optional(),
  content: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    caption: z.string().optional(),
    price: z.string().optional(),
    ctaLink: z.string().optional(),
  }).optional(),
  scheduledAt: z.string().datetime().optional(),
});

const UpdateCampaignSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  status: z.enum(["draft", "active", "published", "paused"]).optional(),
  productTitle: z.string().optional(),
  channels: z.array(z.string()).optional(),
  content: z.record(z.unknown()).optional(),
  scheduledAt: z.string().datetime().optional(),
  metrics: z.record(z.unknown()).optional(),
});

export const campaignsHandlers = {
  async list(req: Request, res: Response) {
    try {
      const status = req.query.status as string | undefined;
      let query = db.select().from(campaignsTable).$dynamic();

      if (status) {
        query = query.where(eq(campaignsTable.status, status));
      }

      const campaigns = await query.orderBy(desc(campaignsTable.createdAt)).limit(100);
      return res.json(campaigns);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      return res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  },

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    try {
      const [campaign] = await db.select().from(campaignsTable).where(eq(campaignsTable.id, id));
      if (!campaign) return res.status(404).json({ error: "Campaign not found" });
      return res.json(campaign);
    } catch (err) {
      console.error("Error fetching campaign:", err);
      return res.status(500).json({ error: "Failed to fetch campaign" });
    }
  },

  async create(req: Request, res: Response) {
    const parsed = CreateCampaignSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    }

    try {
      const [campaign] = await db.insert(campaignsTable).values({
        name: parsed.data.name,
        productTitle: parsed.data.productTitle,
        channels: parsed.data.channels ?? [],
        content: parsed.data.content ?? {},
        scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
        status: "draft",
        updatedAt: new Date(),
      }).returning();

      return res.status(201).json(campaign);
    } catch (err) {
      console.error("Error creating campaign:", err);
      return res.status(500).json({ error: "Failed to create campaign" });
    }
  },

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const parsed = UpdateCampaignSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    }

    try {
      const updates: Record<string, unknown> = { updatedAt: new Date() };
      if (parsed.data.name !== undefined) updates.name = parsed.data.name;
      if (parsed.data.status !== undefined) updates.status = parsed.data.status;
      if (parsed.data.productTitle !== undefined) updates.productTitle = parsed.data.productTitle;
      if (parsed.data.channels !== undefined) updates.channels = parsed.data.channels;
      if (parsed.data.content !== undefined) updates.content = parsed.data.content;
      if (parsed.data.scheduledAt !== undefined) updates.scheduledAt = new Date(parsed.data.scheduledAt);
      if (parsed.data.metrics !== undefined) updates.metrics = parsed.data.metrics;

      if (parsed.data.status === "published") updates.publishedAt = new Date();

      const [campaign] = await db.update(campaignsTable)
        .set(updates)
        .where(eq(campaignsTable.id, id))
        .returning();

      if (!campaign) return res.status(404).json({ error: "Campaign not found" });
      return res.json(campaign);
    } catch (err) {
      console.error("Error updating campaign:", err);
      return res.status(500).json({ error: "Failed to update campaign" });
    }
  },

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    try {
      const result = await db.delete(campaignsTable).where(eq(campaignsTable.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: "Campaign not found" });
      return res.json({ success: true });
    } catch (err) {
      console.error("Error deleting campaign:", err);
      return res.status(500).json({ error: "Failed to delete campaign" });
    }
  }
};
