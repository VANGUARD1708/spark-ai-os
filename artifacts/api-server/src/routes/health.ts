import { Router } from "express";

const router = Router();

router.get("/", async (_req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "SPARK API",
    timestamp: new Date().toISOString(),
  });
});

export default router;