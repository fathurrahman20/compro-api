import { NextFunction, Request, Response } from "express";
import ForbiddenError from "../errors/forbidden.error";
import UnauthorizedError from "../errors/unauthorized.error";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    throw new UnauthorizedError("Token tidak ditemukan. Silakan login.");
  }

  const decoded = verifyAccessToken(accessToken);
  if (!decoded || typeof decoded === "string") {
    throw new UnauthorizedError("Token tidak valid. Silakan login kembali.");
  }

  req.user = {
    id: decoded.id,
    username: decoded.username,
    email: decoded.email,
    role: decoded.role,
  };
  next();
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    throw new ForbiddenError("Akses ditolak. Hanya untuk admin.");
  }
  next();
};

export const authorizeCashier = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "kasir") {
    throw new ForbiddenError("Akses ditolak. Hanya untuk kasir.");
  }
  next();
};
