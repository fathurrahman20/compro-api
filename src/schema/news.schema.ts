import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  content: z.string().min(20, "Content must be at least 20 characters long"),
  published: z.boolean(),
});
export type CreateNewsData = z.infer<typeof createNewsSchema>;

export const updateNewsSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .optional(),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters long")
    .optional(),
  published: z.boolean().optional(),
});
export type UpdateNewsData = z.infer<typeof updateNewsSchema>;
