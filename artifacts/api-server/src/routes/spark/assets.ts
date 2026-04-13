import type { Request, Response } from "express";
import { db } from "@workspace/db";
import {
  savedIdeasTable,
  savedBundlesTable,
  savedScriptsTable,
  savedHooksTable,
  savedBrandsTable,
} from "@workspace/db";
import { sql, desc } from "drizzle-orm";

export async function assetsHandler(_req: Request, res: Response) {
  try {
    const [
      ideasResult,
      bundlesResult,
      scriptsResult,
      hooksResult,
      brandsResult,
      recentIdeas,
      recentBundles,
      recentScripts,
      recentHooks,
      recentBrands,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(savedIdeasTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedBundlesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedScriptsTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedHooksTable),
      db.select({ count: sql<number>`count(*)::int` }).from(savedBrandsTable),
      db.select({
        id: savedIdeasTable.id,
        title: savedIdeasTable.title,
        niche: savedIdeasTable.niche,
        createdAt: savedIdeasTable.createdAt,
      }).from(savedIdeasTable).orderBy(desc(savedIdeasTable.createdAt)).limit(5),
      db.select({
        id: savedBundlesTable.id,
        productTitle: savedBundlesTable.productTitle,
        offerName: savedBundlesTable.offerName,
        headline: savedBundlesTable.headline,
        createdAt: savedBundlesTable.createdAt,
      }).from(savedBundlesTable).orderBy(desc(savedBundlesTable.createdAt)).limit(5),
      db.select({
        id: savedScriptsTable.id,
        productTitle: savedScriptsTable.productTitle,
        style: savedScriptsTable.style,
        createdAt: savedScriptsTable.createdAt,
      }).from(savedScriptsTable).orderBy(desc(savedScriptsTable.createdAt)).limit(5),
      db.select({
        id: savedHooksTable.id,
        productTitle: savedHooksTable.productTitle,
        hookType: savedHooksTable.hookType,
        createdAt: savedHooksTable.createdAt,
      }).from(savedHooksTable).orderBy(desc(savedHooksTable.createdAt)).limit(5),
      db.select({
        id: savedBrandsTable.id,
        brandName: savedBrandsTable.brandName,
        niche: savedBrandsTable.niche,
        slogan: savedBrandsTable.slogan,
        createdAt: savedBrandsTable.createdAt,
      }).from(savedBrandsTable).orderBy(desc(savedBrandsTable.createdAt)).limit(5),
    ]);

    const ideas = ideasResult[0]?.count ?? 0;
    const bundles = bundlesResult[0]?.count ?? 0;
    const scripts = scriptsResult[0]?.count ?? 0;
    const hooks = hooksResult[0]?.count ?? 0;
    const brands = brandsResult[0]?.count ?? 0;

    return res.json({
      ideas: { count: ideas, recent: recentIdeas },
      bundles: { count: bundles, recent: recentBundles },
      scripts: { count: scripts, recent: recentScripts },
      hooks: { count: hooks, recent: recentHooks },
      brands: { count: brands, recent: recentBrands },
      totalAssets: ideas + bundles + scripts + hooks + brands,
    });
  } catch (err) {
    console.error("Error fetching assets:", err);
    return res.status(500).json({ error: "Failed to fetch assets" });
  }
}
