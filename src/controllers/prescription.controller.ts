import { NextFunction, Request, Response } from "express";
import { createPrescription as savePrescription } from "../services/prescription.service";

export const createPrescription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res
      .status(201)
      .json(await savePrescription(req.body, req.user!.doctorId));
  } catch (error) {
    next(error);
  }
};
