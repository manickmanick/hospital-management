import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error";

type Role = "ADMIN" | "DOCTOR" | "LAB";

type TokenPayload = {
  sub: string;
  email: string;
  role: Role;
  doctorId: number | null;
};

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) {
    return next(new AppError(401, "Authentication required"));
  }

  try {
    if (!process.env.JWT_SECRET) {
      return next(new AppError(500, "JWT_SECRET is not configured"));
    }
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as TokenPayload;

    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      role: payload.role,
      doctorId: payload.doctorId,
    };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
};

export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, "You do not have permission"));
    }
    next();
  };
