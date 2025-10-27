import { prisma } from "../application/database";
import NotFoundError from "../errors/not-found.error";
import { CreateNewsData, UpdateNewsData } from "../schema/news.schema";

export const newsServices = {
  async getAllNews(page: number, limit: number, q: string) {
    const offset = (page - 1) * limit;

    const news = await prisma.news.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
      take: limit,
      skip: offset,
      include: { author: { select: { id: true, name: true, email: true } } },
      omit: { authorId: true },
    });

    const totalPages = Math.ceil(
      (await prisma.news.count({
        where: { title: { contains: q, mode: "insensitive" } },
      })) / limit
    );

    const totalNews = await prisma.news.count({
      where: { title: { contains: q, mode: "insensitive" } },
    });

    // remove password from author
    news.forEach((newsItem) => {
      if (newsItem.author) {
        // @ts-ignore
        delete newsItem.author.password;
      }
    });

    const response = {
      news,
      totalNews,
      totalPages,
      currentPage: page,
    };

    return response;
  },

  async getNewsById(identity: string) {
    const news = await prisma.news.findFirst({
      where: {
        OR: [{ id: identity }, { slug: identity }],
      },
      include: { author: { select: { id: true, name: true, email: true } } },
      omit: { authorId: true },
    });

    if (!news) {
      throw new NotFoundError("News article not found");
    }

    return news;
  },

  async createNews(data: CreateNewsData, authorId: string) {
    const news = await prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published,
        slug: generateSlug(data.title),
        authorId,
      },
    });

    return news;
  },

  async updateNews(id: string, data: UpdateNewsData) {
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      throw new NotFoundError("News article not found");
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        published: data.published,
      },
    });

    return updatedNews;
  },

  async deleteNews(id: string) {
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      throw new NotFoundError("News article not found");
    }

    await prisma.news.delete({
      where: { id },
    });
  },
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
