import { Router } from "express";
import { generateIdeasHandler } from "./generate-ideas";

const sparkRouter = Router();

// Working route only
sparkRouter.post("/spark/generate-ideas", generateIdeasHandler);

export default sparkRouter;