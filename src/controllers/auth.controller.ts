import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await authService.login(req.body.email, req.body.password));
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.createUser(req.body);
    res.status(201).json({ message: "User created", ...result });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await authService.getUsers());
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.deleteUser(Number(req.params.id), req.user!.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};
