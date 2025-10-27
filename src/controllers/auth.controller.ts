import { Request, Response } from "express";
import { loginSchema } from "../schema/auth.schema";
import { authService } from "../services/auth.service";
import NotFoundError from "../errors/not-found.error";
import UnauthorizedError from "../errors/unauthorized.error";

export const login = async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);

  const { accessToken, refreshToken, user } = await authService.loginUser(
    validatedData
  );

  res.status(200).json({
    success: true,
    message: "Successfully logged in",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    },
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const user = await authService.getCurrentUser(userId);

  res.status(200).json({
    success: true,
    message: "Successfully get user",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader?.split(" ")[1];

  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token is required");
  }

  const { newAccessToken } = await authService.refreshToken(refreshToken);

  res.status(200).json({
    success: true,
    message: "Successfully create a new access token",
    data: {
      accessToken: newAccessToken,
    },
  });
};
