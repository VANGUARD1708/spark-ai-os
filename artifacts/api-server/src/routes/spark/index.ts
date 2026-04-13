import { Router } from "express";
import { generateIdeasHandler } from "./generate-ideas";
import { generateBundleHandler } from "./generate-bundle";
import { generateTikTokScriptHandler } from "./generate-tiktok-script";
import { generateViralHooksHandler } from "./generate-viral-hooks";
import { generateBrandHandler } from "./generate-brand";
import { savedIdeasHandlers } from "./saved-ideas";
import { savedBundlesHandlers } from "./saved-bundles";
import { savedScriptsHandlers } from "./saved-scripts";
import { savedHooksHandlers } from "./saved-hooks";
import { savedBrandsHandlers } from "./saved-brands";
import { assetsHandler } from "./assets";
import { analyticsHandler } from "./analytics";
import { campaignsHandlers } from "./campaigns";
import { statsHandler } from "./stats";

const sparkRouter = Router();

// ─── Generation ──────────────────────────────────────────────
sparkRouter.post("/spark/generate-ideas", generateIdeasHandler);
sparkRouter.post("/spark/generate-bundle", generateBundleHandler);
sparkRouter.post("/spark/generate-tiktok-script", generateTikTokScriptHandler);
sparkRouter.post("/spark/generate-viral-hooks", generateViralHooksHandler);
sparkRouter.post("/spark/generate-brand", generateBrandHandler);

// ─── Ideas (Phase 1) ─────────────────────────────────────────
sparkRouter.get("/spark/saved-ideas", savedIdeasHandlers.list);
sparkRouter.get("/spark/saved-ideas/:id", savedIdeasHandlers.getById);
sparkRouter.post("/spark/saved-ideas", savedIdeasHandlers.create);
sparkRouter.delete("/spark/saved-ideas/:id", savedIdeasHandlers.delete);

// ─── Bundles (Phase 1) ───────────────────────────────────────
sparkRouter.get("/spark/saved-bundles", savedBundlesHandlers.list);
sparkRouter.get("/spark/saved-bundles/:id", savedBundlesHandlers.getById);
sparkRouter.post("/spark/saved-bundles", savedBundlesHandlers.create);
sparkRouter.delete("/spark/saved-bundles/:id", savedBundlesHandlers.delete);

// ─── Scripts (Phase 1) ───────────────────────────────────────
sparkRouter.get("/spark/saved-scripts", savedScriptsHandlers.list);
sparkRouter.post("/spark/saved-scripts", savedScriptsHandlers.create);
sparkRouter.delete("/spark/saved-scripts/:id", savedScriptsHandlers.delete);

// ─── Hooks (Phase 2) ─────────────────────────────────────────
sparkRouter.get("/spark/saved-hooks", savedHooksHandlers.list);
sparkRouter.post("/spark/saved-hooks", savedHooksHandlers.create);
sparkRouter.delete("/spark/saved-hooks/:id", savedHooksHandlers.delete);

// ─── Brands (Phase 2) ────────────────────────────────────────
sparkRouter.get("/spark/saved-brands", savedBrandsHandlers.list);
sparkRouter.post("/spark/saved-brands", savedBrandsHandlers.create);
sparkRouter.delete("/spark/saved-brands/:id", savedBrandsHandlers.delete);

// ─── Assets unified (Phase 2) ────────────────────────────────
sparkRouter.get("/spark/assets", assetsHandler);

// ─── Analytics (Phase 2) ─────────────────────────────────────
sparkRouter.get("/spark/stats", statsHandler);
sparkRouter.get("/spark/analytics", analyticsHandler);

// ─── Campaigns (Phase 3) ─────────────────────────────────────
sparkRouter.get("/spark/campaigns", campaignsHandlers.list);
sparkRouter.get("/spark/campaigns/:id", campaignsHandlers.getById);
sparkRouter.post("/spark/campaigns", campaignsHandlers.create);
sparkRouter.put("/spark/campaigns/:id", campaignsHandlers.update);
sparkRouter.delete("/spark/campaigns/:id", campaignsHandlers.delete);

export default sparkRouter;
