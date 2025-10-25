import { Request, Response } from "express";
import { loginSchema } from "../schema/auth.schema";
import { authService } from "../services/auth.service";
import NotFoundError from "../errors/not-found.error";

export const login = async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);

  const { accessToken, refreshToken, user } = await authService.loginUser(
    validatedData
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Successfully logged in",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
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
  const refreshToken = req.cookies.refreshToken;
  const { newAccessToken } = await authService.refreshToken(refreshToken);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Successfully create a new access token",
  });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Successfully logout",
  });
};
