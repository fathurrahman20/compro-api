import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
} from "../controllers/news.controller";

const newsRoutes = Router();
newsRoutes.get("/news", getAllNews);
newsRoutes.get("/news/:id", getNewsById);
newsRoutes.post("/news", authenticate, createNews);
newsRoutes.patch("/news/:id", authenticate, updateNews);
newsRoutes.delete("/news/:id", authenticate, deleteNews);

export default newsRoutes;
