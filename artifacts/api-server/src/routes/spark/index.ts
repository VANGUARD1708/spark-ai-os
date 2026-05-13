import { Router } from "express";
import { generateIdeasHandler } from "./generate-ideas";
import { generateBundleHandler } from "./generate-bundle";
import { generateTikTokScriptHandler } from "./generate-tiktok-script";
import { generateViralHooksHandler } from "./generate-viral-hooks";
import { generateBrandHandler } from "./generate-brand";
import { generateWinningProductsHandler } from "./generate-winning-products";
import { generateTrendingHandler } from "./generate-trending";
import { savedIdeasHandlers } from "./saved-ideas";
import { savedBundlesHandlers } from "./saved-bundles";
import { savedScriptsHandlers } from "./saved-scripts";
import { savedHooksHandlers } from "./saved-hooks";
import { savedBrandsHandlers } from "./saved-brands";
import { assetsHandler } from "./assets";
import { analyticsHandler } from "./analytics";
import { campaignsHandlers } from "./campaigns";
import { statsHandler } from "./stats";
import { commandHandler } from "./command";
import { recommendationsHandler } from "./recommendations";
import { getUserProfileHandler, upsertUserProfileHandler } from "./user-profile";
import { usageHandler } from "./usage";
import { critiqueIdeaHandler } from "./critique-idea";

const sparkRouter = Router();

// ─── Generation ──────────────────────────────────────────────
sparkRouter.post("/spark/generate-ideas", generateIdeasHandler);
sparkRouter.post("/spark/generate-bundle", generateBundleHandler);
sparkRouter.post("/spark/generate-tiktok-script", generateTikTokScriptHandler);
sparkRouter.post("/spark/generate-viral-hooks", generateViralHooksHandler);
sparkRouter.post("/spark/generate-brand", generateBrandHandler);

// ─── AI Discovery (live data) ─────────────────────────────────
sparkRouter.get("/spark/winning-products", generateWinningProductsHandler);
sparkRouter.get("/spark/trending", generateTrendingHandler);

// ─── AI Intelligence ──────────────────────────────────────────
sparkRouter.get("/spark/recommendations", recommendationsHandler);
sparkRouter.post("/spark/critique", critiqueIdeaHandler);

// ─── Business Memory ──────────────────────────────────────────
sparkRouter.get("/spark/user-profile", getUserProfileHandler);
sparkRouter.put("/spark/user-profile", upsertUserProfileHandler);

// ─── Usage ───────────────────────────────────────────────────
sparkRouter.get("/spark/usage", usageHandler);

// ─── Ideas ───────────────────────────────────────────────────
sparkRouter.get("/spark/saved-ideas", savedIdeasHandlers.list);
sparkRouter.get("/spark/saved-ideas/:id", savedIdeasHandlers.getById);
sparkRouter.post("/spark/saved-ideas", savedIdeasHandlers.create);
sparkRouter.delete("/spark/saved-ideas/:id", savedIdeasHandlers.delete);

// ─── Bundles ─────────────────────────────────────────────────
sparkRouter.get("/spark/saved-bundles", savedBundlesHandlers.list);
sparkRouter.get("/spark/saved-bundles/:id", savedBundlesHandlers.getById);
sparkRouter.post("/spark/saved-bundles", savedBundlesHandlers.create);
sparkRouter.delete("/spark/saved-bundles/:id", savedBundlesHandlers.delete);

// ─── Scripts ─────────────────────────────────────────────────
sparkRouter.get("/spark/saved-scripts", savedScriptsHandlers.list);
sparkRouter.post("/spark/saved-scripts", savedScriptsHandlers.create);
sparkRouter.delete("/spark/saved-scripts/:id", savedScriptsHandlers.delete);

// ─── Hooks ───────────────────────────────────────────────────
sparkRouter.get("/spark/saved-hooks", savedHooksHandlers.list);
sparkRouter.post("/spark/saved-hooks", savedHooksHandlers.create);
sparkRouter.delete("/spark/saved-hooks/:id", savedHooksHandlers.delete);

// ─── Brands ──────────────────────────────────────────────────
sparkRouter.get("/spark/saved-brands", savedBrandsHandlers.list);
sparkRouter.post("/spark/saved-brands", savedBrandsHandlers.create);
sparkRouter.delete("/spark/saved-brands/:id", savedBrandsHandlers.delete);

// ─── Assets unified ──────────────────────────────────────────
sparkRouter.get("/spark/assets", assetsHandler);

// ─── Analytics ───────────────────────────────────────────────
sparkRouter.get("/spark/stats", statsHandler);
sparkRouter.get("/spark/analytics", analyticsHandler);

// ─── Command Center ───────────────────────────────────────────
sparkRouter.post("/spark/command", commandHandler);

// ─── Campaigns ───────────────────────────────────────────────
sparkRouter.get("/spark/campaigns", campaignsHandlers.list);
sparkRouter.get("/spark/campaigns/:id", campaignsHandlers.getById);
sparkRouter.post("/spark/campaigns", campaignsHandlers.create);
sparkRouter.put("/spark/campaigns/:id", campaignsHandlers.update);
sparkRouter.delete("/spark/campaigns/:id", campaignsHandlers.delete);

export default sparkRouter;
