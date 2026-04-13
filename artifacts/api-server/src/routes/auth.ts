import type { Request, Response, NextFunction } from "express";
import { Router } from "express";

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  plan: "free" | "pro";
  isGuest: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const userId = req.headers["x-user-id"] as string | undefined;
  const userPlan = req.headers["x-user-plan"] as string | undefined;

  if (userId) {
    req.user = {
      id: userId,
      plan: userPlan === "pro" ? "pro" : "free",
      isGuest: false,
    };
  } else {
    req.user = {
      id: "guest",
      plan: "free",
      isGuest: true,
    };
  }

  next();
}

const authRouter = Router();

authRouter.get("/auth/me", (req: Request, res: Response) => {
  return res.json(req.user ?? { id: "guest", plan: "free", isGuest: true });
});

export default authRouter;
