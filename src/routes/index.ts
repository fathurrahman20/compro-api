import { Router } from "express";
import authRoutes from "./auth.routes";
import newsRoutes from "./news.routes";

const router = Router();

router.use(authRoutes);
router.use(newsRoutes);

export default router;
