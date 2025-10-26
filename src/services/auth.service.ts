import { prisma } from "../application/database";
import UnauthorizedError from "../errors/unauthorized.error";
import { LoginUserData } from "../schema/auth.schema";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import NotFoundError from "../errors/not-found.error";
import ForbiddenError from "../errors/forbidden.error";

export const authService = {
  async loginUser(userData: LoginUserData) {
    const { email, password } = userData;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError("Email atau password salah");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Email atau password salah");
    }

    const accessToken = generateAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },

  async refreshToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || typeof decoded === "string") {
      throw new ForbiddenError("Refresh token tidak valid.");
    }

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    });

    return {
      newAccessToken,
    };
  },
};
