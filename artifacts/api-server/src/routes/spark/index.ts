import { Router } from "express";
import { generateIdeasHandler } from "./generate-ideas";
import { generateBundleHandler } from "./generate-bundle";
import { generateTikTokScriptHandler } from "./generate-tiktok-script";
import { generateViralHooksHandler } from "./generate-viral-hooks";
import { generateBrandHandler } from "./generate-brand";
import { savedIdeasHandlers } from "./saved-ideas";
import { statsHandler } from "./stats";

const sparkRouter = Router();

sparkRouter.post("/spark/generate-ideas", generateIdeasHandler);
sparkRouter.post("/spark/generate-bundle", generateBundleHandler);
sparkRouter.post("/spark/generate-tiktok-script", generateTikTokScriptHandler);
sparkRouter.post("/spark/generate-viral-hooks", generateViralHooksHandler);
sparkRouter.post("/spark/generate-brand", generateBrandHandler);
sparkRouter.get("/spark/saved-ideas", savedIdeasHandlers.list);
sparkRouter.post("/spark/saved-ideas", savedIdeasHandlers.create);
sparkRouter.delete("/spark/saved-ideas/:id", savedIdeasHandlers.delete);
sparkRouter.get("/spark/stats", statsHandler);

export default sparkRouter;
