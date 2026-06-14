import { Router } from "express";
import { generateIdeasHandler } from "./generate-ideas";
import { generateBrandHandler } from "./generate-brand";
import { generateBundleHandler } from "./generate-bundle";
import { generateTikTokScriptHandler } from "./generate-tiktok-script";
import { generateViralHooksHandler } from "./generate-viral-hooks";
import { generateTrendingHandler } from "./generate-trending";
import { generateWinningProductsHandler } from "./generate-winning-products";
import { recommendationsHandler } from "./recommendations";
import {
  getUserProfileHandler,
  upsertUserProfileHandler,
} from "./user-profile";
import { usageHandler } from "./usage";
import { statsHandler } from "./stats";
import { critiqueIdeaHandler } from "./critique-idea";
import { commandHandler } from "./command";
import { analyticsHandler } from "./analytics";
import { assetsHandler } from "./assets";
import { campaignsHandlers } from "./campaigns";
import { savedIdeasHandlers } from "./saved-ideas";
import { savedBrandsHandlers } from "./saved-brands";
import { savedBundlesHandlers } from "./saved-bundles";
import { savedHooksHandlers } from "./saved-hooks";
import { savedScriptsHandlers } from "./saved-scripts";

// NEW: Stripe checkout import
import { createCheckoutSessionHandler } from "./create-checkout-session";

const sparkRouter = Router();

// AI generation routes
sparkRouter.post("/spark/generate-ideas", generateIdeasHandler);
sparkRouter.post("/spark/generate-brand", generateBrandHandler);
sparkRouter.post("/spark/generate-bundle", generateBundleHandler);
sparkRouter.post(
  "/spark/generate-tiktok-script",
  generateTikTokScriptHandler,
);
sparkRouter.post(
  "/spark/generate-viral-hooks",
  generateViralHooksHandler,
);
sparkRouter.post("/spark/generate-trending", generateTrendingHandler);
sparkRouter.post(
  "/spark/generate-winning-products",
  generateWinningProductsHandler,
);
sparkRouter.post("/spark/recommendations", recommendationsHandler);
sparkRouter.post("/spark/command", commandHandler);
sparkRouter.post("/spark/critique-idea", critiqueIdeaHandler);

// GET aliases
sparkRouter.get("/spark/generate-trending", generateTrendingHandler);
sparkRouter.get(
  "/spark/generate-winning-products",
  generateWinningProductsHandler,
);
sparkRouter.get("/spark/recommendations", recommendationsHandler);
sparkRouter.get("/spark/trending", generateTrendingHandler);
sparkRouter.get(
  "/spark/winning-products",
  generateWinningProductsHandler,
);

// Data routes
sparkRouter.get("/spark/user-profile", getUserProfileHandler);
sparkRouter.put("/spark/user-profile", upsertUserProfileHandler);
sparkRouter.get("/spark/usage", usageHandler);
sparkRouter.get("/spark/stats", statsHandler);
sparkRouter.get("/spark/analytics", analyticsHandler);
sparkRouter.get("/spark/assets", assetsHandler);

// Saved ideas
sparkRouter.get("/spark/saved-ideas", savedIdeasHandlers.list);
sparkRouter.post("/spark/saved-ideas", savedIdeasHandlers.create);
sparkRouter.get(
  "/spark/saved-ideas/:id",
  savedIdeasHandlers.getById,
);
sparkRouter.delete(
  "/spark/saved-ideas/:id",
  savedIdeasHandlers.delete,
);

// Saved brands
sparkRouter.get("/spark/saved-brands", savedBrandsHandlers.list);
sparkRouter.post("/spark/saved-brands", savedBrandsHandlers.create);
sparkRouter.delete(
  "/spark/saved-brands/:id",
  savedBrandsHandlers.delete,
);

// Saved bundles
sparkRouter.get("/spark/saved-bundles", savedBundlesHandlers.list);
sparkRouter.post("/spark/saved-bundles", savedBundlesHandlers.create);
sparkRouter.get(
  "/spark/saved-bundles/:id",
  savedBundlesHandlers.getById,
);
sparkRouter.delete(
  "/spark/saved-bundles/:id",
  savedBundlesHandlers.delete,
);

// Saved hooks
sparkRouter.get("/spark/saved-hooks", savedHooksHandlers.list);
sparkRouter.post("/spark/saved-hooks", savedHooksHandlers.create);
sparkRouter.delete(
  "/spark/saved-hooks/:id",
  savedHooksHandlers.delete,
);

// Saved scripts
sparkRouter.get("/spark/saved-scripts", savedScriptsHandlers.list);
sparkRouter.post("/spark/saved-scripts", savedScriptsHandlers.create);
sparkRouter.delete(
  "/spark/saved-scripts/:id",
  savedScriptsHandlers.delete,
);

// Campaigns
sparkRouter.get("/spark/campaigns", campaignsHandlers.list);
sparkRouter.post("/spark/campaigns", campaignsHandlers.create);
sparkRouter.get(
  "/spark/campaigns/:id",
  campaignsHandlers.getById,
);
sparkRouter.put(
  "/spark/campaigns/:id",
  campaignsHandlers.update,
);
sparkRouter.delete(
  "/spark/campaigns/:id",
  campaignsHandlers.delete,
);

// STRIPE CHECKOUT
sparkRouter.post(
  "/spark/create-checkout-session",
  createCheckoutSessionHandler,
);

export default sparkRouter;