import { Request, Response } from "express";
import { newsServices } from "../services/news.service";
import { createNewsSchema, updateNewsSchema } from "../schema/news.schema";

export const getAllNews = async (req: Request, res: Response) => {
  const { page, limit, q } = req.query;
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 10;
  const query = (q as string) || "";

  const newsResponse = await newsServices.getAllNews(
    pageNumber,
    limitNumber,
    query
  );

  res.status(200).json({
    success: true,
    message: "Successfully retrieved news articles",
    data: {
      news: newsResponse.news,
      totalNews: newsResponse.totalNews,
      totalPages: newsResponse.totalPages,
      currentPage: newsResponse.currentPage,
    },
  });
};

export const getNewsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const newsResponse = await newsServices.getNewsById(id);

  res.status(200).json({
    success: true,
    message: "Successfully retrieved news article",
    data: newsResponse,
  });
};

export const createNews = async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  const newsData = req.body;

  if (!authorId) {
    throw new Error("Author ID is required to create news article");
  }

  const validatedData = createNewsSchema.parse(newsData);

  const newsResponse = await newsServices.createNews(validatedData, authorId);
  res.status(201).json({
    success: true,
    message: "Successfully created news article",
    data: newsResponse,
  });
};

export const updateNews = async (req: Request, res: Response) => {
  const { id } = req.params;
  const newsData = req.body;

  const validatedData = updateNewsSchema.parse(newsData);

  const newsResponse = await newsServices.updateNews(id, validatedData);

  res.status(200).json({
    success: true,
    message: "Successfully updated news article",
    data: newsResponse,
  });
};

export const deleteNews = async (req: Request, res: Response) => {
  const { id } = req.params;

  const newsResponse = await newsServices.deleteNews(id);

  res.status(200).json({
    success: true,
    message: "Successfully deleted news article",
    data: newsResponse,
  });
};
