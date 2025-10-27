import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsByIdentity,
  updateNews,
} from "../controllers/news.controller";

const newsRoutes = Router();
newsRoutes.get("/news", getAllNews);
newsRoutes.get("/news/:identity", getNewsByIdentity);
newsRoutes.post("/news", authenticate, createNews);
newsRoutes.patch("/news/:id", authenticate, updateNews);
newsRoutes.delete("/news/:id", authenticate, deleteNews);

export default newsRoutes;
