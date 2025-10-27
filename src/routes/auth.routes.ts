import { Router } from "express";
import {
  getCurrentUser,
  login,
  refreshToken,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const authRoutes = Router();
authRoutes.post("/auth/login", login);
authRoutes.get("/auth/me", authenticate, getCurrentUser);
authRoutes.post("/auth/refresh", refreshToken);

export default authRoutes;
