import jwt from "jsonwebtoken";

export const generateAccessToken = (user: {
  id: string;
  name: string | null;
  email: string;
}) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (user: {
  id: string;
  name: string | null;
  email: string;
}) => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyAccessToken = (token: string) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};
