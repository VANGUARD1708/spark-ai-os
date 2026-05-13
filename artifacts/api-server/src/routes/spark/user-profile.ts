import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { userProfilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const DEFAULT_USER_ID = "default";

function getUserId(req: Request): string {
  return (req as any).auth?.userId ?? DEFAULT_USER_ID;
}

export async function getUserProfileHandler(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const [profile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, userId)).limit(1);
    return res.json(profile ?? null);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
}

export async function upsertUserProfileHandler(req: Request, res: Response) {
  try {
    const userId = getUserId(req);
    const { businessName, niche, audience, brandVoice, topProduct, goals } = req.body;

    const existing = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, userId)).limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProfilesTable)
        .set({ businessName, niche, audience, brandVoice, topProduct, goals, updatedAt: new Date() })
        .where(eq(userProfilesTable.userId, userId))
        .returning();
      return res.json(updated);
    } else {
      const [created] = await db
        .insert(userProfilesTable)
        .values({ userId, businessName, niche, audience, brandVoice, topProduct, goals })
        .returning();
      return res.json(created);
    }
  } catch (err) {
    console.error("Error upserting user profile:", err);
    return res.status(500).json({ error: "Failed to save profile" });
  }
}
